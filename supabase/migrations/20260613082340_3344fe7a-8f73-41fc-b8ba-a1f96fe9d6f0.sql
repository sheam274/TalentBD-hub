
-- Application stage
DO $$ BEGIN
  CREATE TYPE public.application_stage AS ENUM ('applied','screening','interview','offer','hired','rejected','withdrawn');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.job_applications
  ADD COLUMN IF NOT EXISTS stage public.application_stage NOT NULL DEFAULT 'applied',
  ADD COLUMN IF NOT EXISTS stage_updated_at timestamptz NOT NULL DEFAULT now();

-- Company members
CREATE TABLE IF NOT EXISTS public.company_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'owner',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.company_members TO authenticated;
GRANT ALL ON public.company_members TO service_role;
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_company_member(_user_id uuid, _company_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.company_members WHERE user_id = _user_id AND company_id = _company_id)
$$;

CREATE POLICY cm_select ON public.company_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_company_member(auth.uid(), company_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY cm_admin_write ON public.company_members FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY cm_self_insert ON public.company_members FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Companies: let employers update their own row
DROP POLICY IF EXISTS companies_admin_write ON public.companies;
CREATE POLICY companies_write ON public.companies FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.is_company_member(auth.uid(), id))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.is_company_member(auth.uid(), id));
CREATE POLICY companies_employer_insert ON public.companies FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'employer') OR public.has_role(auth.uid(),'admin'));

-- job_marketplace employer management
DROP POLICY IF EXISTS jm_employer_all ON public.job_marketplace;
CREATE POLICY jm_employer_all ON public.job_marketplace FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR (company_id IS NOT NULL AND public.is_company_member(auth.uid(), company_id)))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR (company_id IS NOT NULL AND public.is_company_member(auth.uid(), company_id)));

-- App-employer helper
CREATE OR REPLACE FUNCTION public.is_app_employer(_user_id uuid, _app_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.job_applications a
    JOIN public.job_marketplace j ON j.id = a.job_id
    JOIN public.company_members m ON m.company_id = j.company_id
    WHERE a.id = _app_id AND m.user_id = _user_id
  )
$$;

CREATE POLICY apps_employer_select ON public.job_applications FOR SELECT TO authenticated
  USING (public.is_app_employer(auth.uid(), id));
CREATE POLICY apps_employer_update ON public.job_applications FOR UPDATE TO authenticated
  USING (public.is_app_employer(auth.uid(), id)) WITH CHECK (public.is_app_employer(auth.uid(), id));

-- Application messages
CREATE TABLE IF NOT EXISTS public.application_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.job_applications(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  read_at timestamptz
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.application_messages TO authenticated;
GRANT ALL ON public.application_messages TO service_role;
ALTER TABLE public.application_messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_am_app ON public.application_messages(application_id, created_at);

CREATE POLICY am_select ON public.application_messages FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(),'admin')
    OR public.is_app_employer(auth.uid(), application_id)
    OR EXISTS (SELECT 1 FROM public.job_applications a WHERE a.id = application_id AND a.user_id = auth.uid())
  );
CREATE POLICY am_insert ON public.application_messages FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND (
      public.is_app_employer(auth.uid(), application_id)
      OR EXISTS (SELECT 1 FROM public.job_applications a WHERE a.id = application_id AND a.user_id = auth.uid())
    )
  );
CREATE POLICY am_admin ON public.application_messages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Interview invitations
CREATE TABLE IF NOT EXISTS public.interview_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.job_applications(id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  meeting_url text NOT NULL,
  provider text,
  notes text,
  status text NOT NULL DEFAULT 'scheduled',
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.interview_invitations TO authenticated;
GRANT ALL ON public.interview_invitations TO service_role;
ALTER TABLE public.interview_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY ii_select ON public.interview_invitations FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(),'admin')
    OR public.is_app_employer(auth.uid(), application_id)
    OR EXISTS (SELECT 1 FROM public.job_applications a WHERE a.id = application_id AND a.user_id = auth.uid())
  );
CREATE POLICY ii_write ON public.interview_invitations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.is_app_employer(auth.uid(), application_id))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.is_app_employer(auth.uid(), application_id));

-- Appointment letters
CREATE TABLE IF NOT EXISTS public.appointment_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.job_applications(id) ON DELETE CASCADE,
  position text NOT NULL,
  salary text,
  start_date date,
  body text NOT NULL,
  issued_by uuid NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointment_letters TO authenticated;
GRANT ALL ON public.appointment_letters TO service_role;
ALTER TABLE public.appointment_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY al_select ON public.appointment_letters FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(),'admin')
    OR public.is_app_employer(auth.uid(), application_id)
    OR EXISTS (SELECT 1 FROM public.job_applications a WHERE a.id = application_id AND a.user_id = auth.uid())
  );
CREATE POLICY al_write ON public.appointment_letters FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.is_app_employer(auth.uid(), application_id))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.is_app_employer(auth.uid(), application_id));
CREATE POLICY al_applicant_accept ON public.appointment_letters FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.job_applications a WHERE a.id = application_id AND a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.job_applications a WHERE a.id = application_id AND a.user_id = auth.uid()));

-- Update signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  acct text := COALESCE(NEW.raw_user_meta_data->>'account_type','student');
  cname text := NEW.raw_user_meta_data->>'company_name';
  cweb  text := NEW.raw_user_meta_data->>'company_website';
  new_company_id uuid;
  slugged text;
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email))
  ON CONFLICT (id) DO NOTHING;

  IF acct = 'employer' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'employer')
    ON CONFLICT (user_id, role) DO NOTHING;
    IF cname IS NOT NULL AND length(trim(cname)) > 0 THEN
      slugged := regexp_replace(lower(cname), '[^a-z0-9]+', '-', 'g');
      INSERT INTO public.companies (name, slug, website)
      VALUES (cname, slugged || '-' || substr(NEW.id::text,1,6), cweb)
      RETURNING id INTO new_company_id;
      INSERT INTO public.company_members (company_id, user_id, role)
      VALUES (new_company_id, NEW.id, 'owner');
    END IF;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
