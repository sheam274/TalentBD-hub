CREATE TABLE IF NOT EXISTS public.external_jobs_cache (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id text NOT NULL UNIQUE,
  source text NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  company_logo text,
  category text,
  normalized_category text,
  job_type text,
  location text,
  is_remote boolean NOT NULL DEFAULT false,
  salary text,
  url text,
  tags text[] NOT NULL DEFAULT '{}',
  publication_date timestamptz,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ejc_norm_cat ON public.external_jobs_cache (normalized_category);
CREATE INDEX IF NOT EXISTS idx_ejc_pub ON public.external_jobs_cache (publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_ejc_remote ON public.external_jobs_cache (is_remote);

GRANT SELECT ON public.external_jobs_cache TO anon;
GRANT SELECT ON public.external_jobs_cache TO authenticated;
GRANT ALL ON public.external_jobs_cache TO service_role;

ALTER TABLE public.external_jobs_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "External jobs cache is publicly readable"
  ON public.external_jobs_cache FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION public.touch_external_jobs_cache()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_touch_ejc ON public.external_jobs_cache;
CREATE TRIGGER trg_touch_ejc BEFORE UPDATE ON public.external_jobs_cache
  FOR EACH ROW EXECUTE FUNCTION public.touch_external_jobs_cache();