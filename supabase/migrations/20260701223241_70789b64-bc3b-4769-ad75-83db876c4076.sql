
ALTER FUNCTION public.is_super_admin_email(text) SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.is_super_admin_email(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_super_admin_allowlist() FROM PUBLIC, anon, authenticated;
