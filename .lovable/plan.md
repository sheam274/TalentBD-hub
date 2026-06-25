## Goal
Make every hover/lift card on the home page (`src/routes/index.tsx`) a functional link to its related destination — especially the **Disciplines we cover** cards and the bullet items inside them.

## Changes (single file: `src/routes/index.tsx`)

### 1. Disciplines we cover (the 3 big cards)
Replace each `<div className="lift glass …">` with an `<a>` and add data so each card AND each bullet is a real link.

- Card header (Computer Science / Electrical & Electronic / Civil Engineering) → `/learn` discipline section (deep-link with hash so the section scrolls into view): `/learn#cse`, `/learn#eee`, `/learn#civil`.
- Each bullet becomes its own clickable row that opens the matching module page `/learn/{discipline}/{slug}`. Slug mapping (verified against the DB):

```
Computer Science (cse)
  Web Development     → /learn/cse/web-development
  Networking          → /learn/cse/networking
  Data Science        → /learn/cse/data-science
  Mobile Apps         → /learn/cse/mobile-apps
  3D Animation        → /learn/cse/3d-animation
  Digital Marketing   → /learn/cse/digital-marketing

Electrical & Electronic (eee)
  Power Systems       → /learn/eee/power-systems
  VLSI                → /learn/eee/vlsi
  Industrial Automation → /learn/eee/industrial-automation

Civil Engineering (civil)
  Structural          → /learn/civil/structural
  CAD & BIM           → /learn/civil/cad-bim
  Project Management  → /learn/civil/project-management
```

Note: `/learn/*` is auth-gated. Unauthenticated visitors are redirected to `/auth` by the existing managed `_authenticated` layout — expected, no change needed.

### 2. Learn / Certify / Get hired trio (the "Crossover" row)
Each of the three tiles becomes a link:
- **Learn** → `/learn`
- **Certify** → `/assessments`
- **Get hired** → `/jobs`

### 3. Popular job categories (8 emoji cards)
Already link to `/jobs` but the category is dropped. Pass it through so the marketplace pre-filters:
- `IT/Software` → `/jobs?category=IT%2FSoftware`
- `Engineering` → `/jobs?category=Engineering`
- `Banking/Finance` → `/jobs?category=Banking%2FFinance`
- …same pattern for Marketing, Design, Healthcare, Education, Sales.

The jobs page already reads `?category=` on mount (see `src/routes/jobs.index.tsx` lines 54–62), so no jobs-page change is needed.

### 4. Hero + bottom CTA
Already functional (`/auth`, `/jobs`). Leave as is.

## Out of scope
- No design / animation changes — same `lift glass` hover, same layout.
- No new routes, no DB changes, no server-fn changes.
- Remote/Live jobs section already opens external posting in a new tab — unchanged.
