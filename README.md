# ⚡ TalentBD Hub

> **Empowering Talent, Elevating Careers.**  
> A next-generation, AI-driven recruitment and career accelerator platform designed to bridge job seekers, employers, and administrators through automated job matching, real-time interview simulations, and computer science learning ecosystems.

---

## 📸 Overview & Key Features

TalentBD Hub transforms the modern hiring journey by combining full-stack architecture with intelligent career tools:

* 🎯 **Automated Job Matching & Tracking:** Real-time job search powered by dynamic match scoring algorithms to give candidate applications instant visibility.
* 🤖 **AI Resume Builder & CV Parser:** Automated document parsing and optimized CV generation tailored for technical and corporate standards.
* 🎙️ **Interactive Mock Interviews:** Simulated interview modules equipped with response evaluation, session history tracking, and actionable feedback.
* 💼 **Enterprise Employer Suite:** Complete recruiter workspace to post jobs, manage candidate pipelines, schedule interviews, and issue automated offer/rejection workflows.
* 🛡️ **Role-Based Admin Control & Audit:** Full system observability, audit logs, credential validation, Row Level Security (RLS), and database metrics.
* 📚 **CSE Learning & Assessment Engine:** Built-in interactive learning tracks and exam preparation modules tailored for Computer Science & Engineering students and software roles.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 (TypeScript), Vite |
| **Routing & State** | TanStack Router (File-based), TanStack Query (React Query) |
| **Styling & Components** | Tailwind CSS, Shadcn UI, Framer Motion, Lucide Icons |
| **Backend & Database** | Supabase (PostgreSQL, Realtime, Auth, Storage) |
| **Security** | Row Level Security (RLS), JWT Authentication |
| **Runtime & Tooling** | Bun / Node.js (v18+) |

---

## 📁 Project Structure

```text
.
├── scripts/              # Database orchestration & seed scripts
│   ├── db-setup.sh       # Automated environment & DB bootstrapper
│   └── seed.sql          # Initial mock data and lookup tables
├── src/
│   ├── assets/           # Media assets, branding, and dynamic graphics
│   ├── components/       # UI primitives and composite features (Shadcn UI)
│   ├── hooks/            # Reusable React hooks for data fetching and state
│   ├── integrations/     # Supabase client configurations and external APIs
│   ├── lib/              # Core business logic, scoring algorithms, and utils
│   ├── routes/           # TanStack file-based routing directory
│   │   ├── _authenticated/# Protected routes (User, Admin, Employer portals)
│   │   └── api/          # Public API hooks and sync endpoints
│   ├── router.tsx        # Central router configuration
│   └── server.ts         # SSR / Edge runtime entrypoint
└── supabase/
    ├── config.toml       # Supabase CLI runtime configurations
    └── migrations/       # Production database versioning & SQL migrations
