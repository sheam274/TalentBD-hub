
REVOKE EXECUTE ON FUNCTION public.sync_company_from_job() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.slugify_company(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.default_company_logo(text) FROM PUBLIC, anon, authenticated;
