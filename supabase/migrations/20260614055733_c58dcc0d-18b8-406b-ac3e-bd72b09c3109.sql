GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.is_company_member(uuid, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_app_employer(uuid, uuid) TO authenticated, service_role;