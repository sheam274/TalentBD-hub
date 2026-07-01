-- Audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor_id UUID,
  table_name TEXT NOT NULL,
  row_pk TEXT,
  operation TEXT NOT NULL CHECK (operation IN ('INSERT','UPDATE','DELETE')),
  old_data JSONB,
  new_data JSONB,
  changed_fields TEXT[]
);

CREATE INDEX IF NOT EXISTS audit_logs_time_idx ON public.audit_logs (occurred_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_table_idx ON public.audit_logs (table_name, occurred_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_actor_idx ON public.audit_logs (actor_id);

GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read audit logs" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Generic audit trigger fn
CREATE OR REPLACE FUNCTION public.write_audit_log()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_pk TEXT;
  v_old JSONB;
  v_new JSONB;
  v_changed TEXT[] := ARRAY[]::TEXT[];
  k TEXT;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_old := to_jsonb(OLD); v_new := NULL;
    v_pk := COALESCE((v_old->>'id'), '');
  ELSIF TG_OP = 'INSERT' THEN
    v_new := to_jsonb(NEW); v_old := NULL;
    v_pk := COALESCE((v_new->>'id'), '');
  ELSE
    v_old := to_jsonb(OLD); v_new := to_jsonb(NEW);
    v_pk := COALESCE((v_new->>'id'), (v_old->>'id'), '');
    FOR k IN SELECT jsonb_object_keys(v_new) LOOP
      IF v_new->k IS DISTINCT FROM v_old->k THEN v_changed := array_append(v_changed, k); END IF;
    END LOOP;
  END IF;

  INSERT INTO public.audit_logs (actor_id, table_name, row_pk, operation, old_data, new_data, changed_fields)
  VALUES (v_actor, TG_TABLE_NAME, v_pk, TG_OP, v_old, v_new, v_changed);

  RETURN COALESCE(NEW, OLD);
END; $$;

-- Attach triggers
DROP TRIGGER IF EXISTS audit_job_marketplace ON public.job_marketplace;
CREATE TRIGGER audit_job_marketplace AFTER INSERT OR UPDATE OR DELETE ON public.job_marketplace
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

DROP TRIGGER IF EXISTS audit_job_applications ON public.job_applications;
CREATE TRIGGER audit_job_applications AFTER INSERT OR UPDATE OR DELETE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

DROP TRIGGER IF EXISTS audit_interview_sessions ON public.interview_sessions;
CREATE TRIGGER audit_interview_sessions AFTER INSERT OR UPDATE OR DELETE ON public.interview_sessions
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

DROP TRIGGER IF EXISTS audit_appointment_letters ON public.appointment_letters;
CREATE TRIGGER audit_appointment_letters AFTER INSERT OR UPDATE OR DELETE ON public.appointment_letters
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();