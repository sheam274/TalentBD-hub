
-- 1) Move security-definer helpers to a private schema (not exposed via PostgREST)
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

ALTER FUNCTION public.has_role(uuid, public.app_role) SET SCHEMA private;
ALTER FUNCTION public.is_company_member(uuid, uuid) SET SCHEMA private;
ALTER FUNCTION public.is_app_employer(uuid, uuid) SET SCHEMA private;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_company_member(uuid, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_app_employer(uuid, uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_company_member(uuid, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_app_employer(uuid, uuid) TO authenticated, service_role;

-- 2) company_members: remove self-insert escalation
DROP POLICY IF EXISTS cm_self_insert ON public.company_members;

-- 3) storage.objects: add UPDATE policy for interview-media bucket
DROP POLICY IF EXISTS interview_media_update_own ON storage.objects;
CREATE POLICY interview_media_update_own ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'interview-media' AND (auth.uid())::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'interview-media' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- 4) skill_quizzes: hide correct_answer column from anon/authenticated
REVOKE SELECT ON public.skill_quizzes FROM anon, authenticated;
GRANT SELECT (id, module_id, question, choices, created_at) ON public.skill_quizzes TO anon, authenticated;
-- service_role keeps full access
GRANT ALL ON public.skill_quizzes TO service_role;
