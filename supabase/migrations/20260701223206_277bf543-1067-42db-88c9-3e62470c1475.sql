
-- Allowlist of super-admin emails
CREATE OR REPLACE FUNCTION public.is_super_admin_email(_email text)
RETURNS boolean LANGUAGE sql IMMUTABLE AS $$
  SELECT lower(coalesce(_email,'')) IN ('sheam.rahman99@gmail.com','sheam.rahman@outlook.com')
$$;

-- Purge admin role from anyone not on the allowlist
DELETE FROM public.user_roles r
USING auth.users u
WHERE r.user_id = u.id
  AND r.role = 'admin'
  AND NOT public.is_super_admin_email(u.email);

-- Ensure allowlisted verified users have admin
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role FROM auth.users u
WHERE public.is_super_admin_email(u.email)
  AND u.email_confirmed_at IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Trigger: on insert/verify, grant admin if allowlisted, else strip any admin role
CREATE OR REPLACE FUNCTION public.enforce_super_admin_allowlist()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_super_admin_email(NEW.email) AND NEW.email_confirmed_at IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    DELETE FROM public.user_roles WHERE user_id = NEW.id AND role = 'admin';
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_admin_allowlist_ins ON auth.users;
CREATE TRIGGER on_auth_user_admin_allowlist_ins
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.enforce_super_admin_allowlist();

DROP TRIGGER IF EXISTS on_auth_user_admin_allowlist_upd ON auth.users;
CREATE TRIGGER on_auth_user_admin_allowlist_upd
AFTER UPDATE OF email, email_confirmed_at ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.enforce_super_admin_allowlist();
