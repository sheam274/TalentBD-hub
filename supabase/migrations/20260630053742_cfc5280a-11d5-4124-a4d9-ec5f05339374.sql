
DROP POLICY IF EXISTS quizzes_public_read ON public.skill_quizzes;
REVOKE SELECT ON public.skill_quizzes FROM anon, authenticated;

CREATE POLICY quizzes_admin_read ON public.skill_quizzes
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

GRANT SELECT ON public.skill_quizzes TO authenticated;

DROP POLICY IF EXISTS credentials_insert_own ON public.user_credentials;
