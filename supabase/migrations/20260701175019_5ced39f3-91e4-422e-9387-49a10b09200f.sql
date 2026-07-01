
-- Helper: generate a slug from a company name
CREATE OR REPLACE FUNCTION public.slugify_company(_name text)
RETURNS text
LANGUAGE sql IMMUTABLE
SET search_path = public
AS $$
  SELECT trim(both '-' from regexp_replace(lower(coalesce(_name,'')), '[^a-z0-9]+', '-', 'g'));
$$;

-- Helper: build a branded avatar URL from a name
CREATE OR REPLACE FUNCTION public.default_company_logo(_name text)
RETURNS text
LANGUAGE sql IMMUTABLE
SET search_path = public
AS $$
  SELECT 'https://ui-avatars.com/api/?name=' ||
         replace(coalesce(_name,'Company'), ' ', '+') ||
         '&background=E85D3A&color=fff&size=256&bold=true&format=png';
$$;

-- Sync trigger: on job insert/update, ensure company exists, has a logo, and job.company_id is linked
CREATE OR REPLACE FUNCTION public.sync_company_from_job()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  co_id uuid;
  co_slug text;
BEGIN
  IF NEW.company IS NULL OR length(trim(NEW.company)) = 0 THEN
    RETURN NEW;
  END IF;

  co_slug := public.slugify_company(NEW.company);

  -- Find existing company (by id, name, or slug)
  SELECT id INTO co_id FROM public.companies
   WHERE id = NEW.company_id
      OR name = NEW.company
      OR slug = co_slug
   LIMIT 1;

  IF co_id IS NULL THEN
    INSERT INTO public.companies (name, slug, logo_url, location)
    VALUES (NEW.company, co_slug, public.default_company_logo(NEW.company), NEW.location)
    RETURNING id INTO co_id;
  ELSE
    UPDATE public.companies
       SET logo_url = COALESCE(NULLIF(logo_url,''), public.default_company_logo(name)),
           location = COALESCE(location, NEW.location)
     WHERE id = co_id;
  END IF;

  NEW.company_id := co_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_company_from_job ON public.job_marketplace;
CREATE TRIGGER trg_sync_company_from_job
BEFORE INSERT OR UPDATE OF company, company_id ON public.job_marketplace
FOR EACH ROW EXECUTE FUNCTION public.sync_company_from_job();

-- Backfill: ensure every marketplace company exists + has logo, and every job is linked
INSERT INTO public.companies (name, slug, logo_url)
SELECT DISTINCT jm.company,
       public.slugify_company(jm.company),
       public.default_company_logo(jm.company)
  FROM public.job_marketplace jm
 WHERE jm.company IS NOT NULL
   AND NOT EXISTS (
     SELECT 1 FROM public.companies c
      WHERE c.name = jm.company OR c.slug = public.slugify_company(jm.company)
   )
ON CONFLICT (slug) DO NOTHING;

UPDATE public.companies
   SET logo_url = public.default_company_logo(name)
 WHERE logo_url IS NULL OR logo_url = '';

UPDATE public.job_marketplace jm
   SET company_id = c.id
  FROM public.companies c
 WHERE jm.company_id IS DISTINCT FROM c.id
   AND (c.name = jm.company OR c.slug = public.slugify_company(jm.company));
