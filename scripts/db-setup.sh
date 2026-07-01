#!/usr/bin/env bash
# Re-apply all Lovable migrations against an external Supabase project.
#
# Usage:
#   export DATABASE_URL="postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres"
#   ./scripts/db-setup.sh              # run migrations only
#   ./scripts/db-setup.sh --with-seed  # also run scripts/seed.sql
#
# Requires: psql (brew install libpq / apt install postgresql-client)

set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: DATABASE_URL is not set." >&2
  echo 'Example: export DATABASE_URL="postgresql://postgres:PASS@db.xxx.supabase.co:5432/postgres"' >&2
  exit 1
fi

MIGRATIONS_DIR="$(cd "$(dirname "$0")/.." && pwd)/supabase/migrations"
SEED_FILE="$(cd "$(dirname "$0")/.." && pwd)/scripts/seed.sql"

echo "==> Ensuring migrations ledger exists"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
CREATE TABLE IF NOT EXISTS public._lovable_migrations (
  filename text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);
SQL

echo "==> Applying migrations from $MIGRATIONS_DIR"
shopt -s nullglob
for file in "$MIGRATIONS_DIR"/*.sql; do
  name="$(basename "$file")"
  already=$(psql "$DATABASE_URL" -tAc "SELECT 1 FROM public._lovable_migrations WHERE filename='$name'")
  if [[ "$already" == "1" ]]; then
    echo "  - skip  $name"
    continue
  fi
  echo "  - apply $name"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 --single-transaction -f "$file"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c \
    "INSERT INTO public._lovable_migrations(filename) VALUES ('$name')"
done

if [[ "${1:-}" == "--with-seed" ]]; then
  if [[ -f "$SEED_FILE" ]]; then
    echo "==> Seeding baseline data ($SEED_FILE)"
    psql "$DATABASE_URL" -v ON_ERROR_STOP=1 --single-transaction -f "$SEED_FILE"
  else
    echo "WARN: $SEED_FILE not found; skipping seed." >&2
  fi
fi

echo "==> Ensuring storage bucket 'interview-media' exists (private)"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
INSERT INTO storage.buckets (id, name, public)
VALUES ('interview-media', 'interview-media', false)
ON CONFLICT (id) DO NOTHING;
SQL

echo "==> Done."