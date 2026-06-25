
-- ============== BASELINE ==============
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT, discipline TEXT, skills TEXT[] NOT NULL DEFAULT '{}',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "user_roles_admin_all" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.learning_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discipline TEXT NOT NULL, section_slug TEXT NOT NULL,
  title TEXT NOT NULL, description TEXT,
  video_url TEXT, documentation_body TEXT,
  resources JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (discipline, section_slug)
);
GRANT SELECT ON public.learning_modules TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_modules TO authenticated;
GRANT ALL ON public.learning_modules TO service_role;
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "modules_public_read" ON public.learning_modules FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "modules_admin_write" ON public.learning_modules FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.skill_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  question TEXT NOT NULL, choices TEXT[] NOT NULL,
  correct_answer TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.skill_quizzes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skill_quizzes TO authenticated;
GRANT ALL ON public.skill_quizzes TO service_role;
ALTER TABLE public.skill_quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quizzes_public_read" ON public.skill_quizzes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "quizzes_admin_write" ON public.skill_quizzes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.user_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credential_name TEXT NOT NULL, score INT NOT NULL,
  module_id UUID REFERENCES public.learning_modules(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_credentials TO authenticated;
GRANT ALL ON public.user_credentials TO service_role;
ALTER TABLE public.user_credentials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "credentials_select_own" ON public.user_credentials FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "credentials_insert_own" ON public.user_credentials FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "credentials_admin_all" ON public.user_credentials FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE, slug text NOT NULL UNIQUE,
  logo_url text, website text, industry text, location text, description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.companies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY companies_public_read ON public.companies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY companies_admin_write ON public.companies FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.job_marketplace (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_title TEXT NOT NULL, company TEXT NOT NULL,
  description TEXT, is_remote BOOLEAN NOT NULL DEFAULT false,
  salary_range TEXT, requirements TEXT[] NOT NULL DEFAULT '{}',
  discipline TEXT, is_live BOOLEAN NOT NULL DEFAULT true,
  category text, location text, experience_level text, job_type text,
  application_deadline date, is_featured boolean NOT NULL DEFAULT false,
  company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.job_marketplace TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_marketplace TO authenticated;
GRANT ALL ON public.job_marketplace TO service_role;
ALTER TABLE public.job_marketplace ENABLE ROW LEVEL SECURITY;
CREATE POLICY "jobs_public_read_live" ON public.job_marketplace FOR SELECT TO anon USING (is_live = true);
CREATE POLICY "jobs_authed_read" ON public.job_marketplace FOR SELECT TO authenticated USING (is_live = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "jobs_admin_write" ON public.job_marketplace FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_jobs_category ON public.job_marketplace (category);
CREATE INDEX idx_jobs_company ON public.job_marketplace (company_id);

CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.job_marketplace(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  cover_note text, status text NOT NULL DEFAULT 'submitted',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_applications TO authenticated;
GRANT ALL ON public.job_applications TO service_role;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY apps_select_own ON public.job_applications FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY apps_insert_own ON public.job_applications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY apps_update_admin ON public.job_applications FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY apps_delete_own ON public.job_applications FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_apps_user ON public.job_applications (user_id);
CREATE INDEX idx_apps_job ON public.job_applications (job_id);

CREATE TABLE public.cv_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  selected_style TEXT NOT NULL DEFAULT 'standard',
  builder_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cv_records TO authenticated;
GRANT ALL ON public.cv_records TO service_role;
ALTER TABLE public.cv_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cv_select_own" ON public.cv_records FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "cv_upsert_own" ON public.cv_records FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cv_update_own" ON public.cv_records FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- ============== INTERVIEW FEATURE ==============
CREATE TABLE public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  discipline TEXT NOT NULL,
  role TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  mode TEXT NOT NULL,
  total_questions INT NOT NULL DEFAULT 0,
  score INT,
  overall_feedback TEXT,
  status TEXT NOT NULL DEFAULT 'in_progress',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.interview_sessions TO authenticated;
GRANT ALL ON public.interview_sessions TO service_role;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "is_select_own" ON public.interview_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "is_insert_own" ON public.interview_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "is_update_own" ON public.interview_sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "is_delete_own" ON public.interview_sessions FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX idx_is_user ON public.interview_sessions (user_id, started_at DESC);

CREATE TABLE public.interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  idx INT NOT NULL,
  prompt TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'open',
  choices JSONB,
  correct_answer TEXT,
  expected_topic TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.interview_questions TO authenticated;
GRANT ALL ON public.interview_questions TO service_role;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "iq_select_own" ON public.interview_questions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.interview_sessions s WHERE s.id = session_id AND s.user_id = auth.uid()));
CREATE POLICY "iq_insert_own" ON public.interview_questions FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.interview_sessions s WHERE s.id = session_id AND s.user_id = auth.uid()));
CREATE INDEX idx_iq_session ON public.interview_questions (session_id, idx);

CREATE TABLE public.interview_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.interview_questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  transcript TEXT,
  media_path TEXT,
  score INT,
  feedback TEXT,
  strengths TEXT,
  weaknesses TEXT,
  evaluated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (question_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.interview_answers TO authenticated;
GRANT ALL ON public.interview_answers TO service_role;
ALTER TABLE public.interview_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ia_select_own" ON public.interview_answers FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.interview_sessions s WHERE s.id = session_id AND s.user_id = auth.uid()));
CREATE POLICY "ia_insert_own" ON public.interview_answers FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.interview_sessions s WHERE s.id = session_id AND s.user_id = auth.uid()));
CREATE POLICY "ia_update_own" ON public.interview_answers FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.interview_sessions s WHERE s.id = session_id AND s.user_id = auth.uid()));
CREATE INDEX idx_ia_session ON public.interview_answers (session_id);
