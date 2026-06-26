## Goal
Make the project bug-free and ready to deploy to your Vercel account (`sheams-projects-bf3ed0ec`).

## Scope

### 1. Full static audit + fix obvious bugs
Walk every route/server-fn and fix concrete issues:
- Broken links / missing routes referenced by `index.tsx` hover cards (`/learn/$disc/$slug` targets, `/jobs?category=…` filter handling in `jobs.index.tsx`, `/assessments`, etc.)
- Missing error/notFound boundaries on routes with loaders
- Auth-protected server fns wrongly called from public loaders
- RLS / GRANT gaps surfaced by Supabase linter
- Dead buttons or unwired handlers
- TypeScript / build warnings

### 2. Smoke-test critical flows headlessly
Run Playwright against the live preview for: home → discipline card → jobs filter, learn card → topic page, auth → dashboard, jobs → apply, employer post-job, admin list. Fix any runtime errors that surface (console + network).

### 3. Verify production build
- `bun run build` clean
- Confirm `vercel.json` + `.vercel/output/` config target Vercel's Node 22 runtime correctly (already present)
- Confirm env vars needed on Vercel: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `LOVABLE_API_KEY`

### 4. Deployment guidance (Vercel)
I cannot push to your Vercel account from here. After fixes land, you have two options:

**Option A — Publish via Lovable** (one click, recommended): I publish to `*.lovable.app`, then you connect your custom domain in Project Settings → Domains.

**Option B — Deploy to your Vercel project manually**:
1. Connect the GitHub repo behind this Lovable project to your Vercel project `sheams-projects-bf3ed0ec`
2. Framework preset: **Other** (build is already configured via `vercel.json` → `.vercel/output`)
3. Build command: `bun run build`
4. Output: `.vercel/output` (already emitted)
5. Add the 5 env vars above in Vercel → Settings → Environment Variables
6. Deploy

Lovable doesn't have a tool that pushes directly into your Vercel account, so step 4 is on you — I'll hand you a ready-to-deploy build.

## Out of scope
- New features
- Visual redesign
- Database schema changes beyond fixing RLS/GRANT gaps

## Deliverables
- Clean `tsgo` + `bun run build`
- All home-page hover cards verified functional end-to-end
- A short checklist of Vercel env vars + deploy steps in chat after fixes land
