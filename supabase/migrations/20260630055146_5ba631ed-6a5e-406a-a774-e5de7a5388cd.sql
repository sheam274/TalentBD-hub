
-- Grant admins full CRUD across every public table via blanket ALL policies
DO $$
DECLARE
  t text;
  pol_name text;
BEGIN
  FOR t IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    pol_name := 'admin_full_access_' || t;
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol_name, t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), ''admin''::app_role)) WITH CHECK (private.has_role(auth.uid(), ''admin''::app_role))',
      pol_name, t
    );
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  END LOOP;
END $$;
