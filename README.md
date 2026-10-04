# TalentBD Hub

**TalentBD Hub** is a modern, full-stack talent, recruitment, and learning platform designed to bridge job seekers, employers, and administrators in Bangladesh. Built with **React**, **TanStack Router**, **Tailwind CSS**, **Shadcn UI**, and **Supabase**, the platform provides AI-assisted resume building, automated job matching, interview preparation, and computer science learning modules.

---

## 🌟 Key Features

* **Job Portal & Smart Matching:** Search and apply for job listings with match scoring and direct tracking.
* **AI Resume & CV Tools:** AI-powered CV builder and CV parser to optimize applicant profile presentation.
* **Mock Interviews & Prep:** Interactive interview prep modules with session histories and detailed feedback.
* **Employer Management Suite:** Portal for posting jobs, managing applicants, scheduling interviews, and sending offer/rejection letters.
* **Admin Dashboard:** System audit logs, user management, database controls, credential validation, and platform analytics.
* **CSE Learning & Exam Prep:** Interactive learning modules tailored for Computer Science & Engineering students and job seekers.

---

## 🛠️ Tech Stack

* **Frontend:** React, TypeScript, Vite, Tailwind CSS, Shadcn UI, Framer Motion / Lucide Icons
* **Routing & State:** TanStack Router, TanStack Query
* **Backend & Database:** Supabase (PostgreSQL, Auth, Row Level Security)
* **Runtime / Package Manager:** Bun (or Node.js / npm)

---

## 📁 Project Structure

```text
.
├── scripts/              # Database seed scripts and setup utilities
│   ├── db-setup.sh
│   └── seed.sql
├── src/
│   ├── assets/           # Media assets and logos
│   ├── components/       # Shared UI components and Shadcn primitives
│   ├── hooks/            # Custom React hooks
│   ├── integrations/     # External integrations (Supabase client/middleware, Lovable)
│   ├── lib/              # Core business logic, API helpers, and scoring functions
│   ├── routes/           # TanStack file-based routing architecture
│   │   ├── _authenticated/# Protected routes (User, Admin, Employer dashboards)
│   │   └── api/          # Public API hooks and sync endpoints
│   ├── router.tsx        # Router configuration
│   └── server.ts         # Server entrypoint
└── supabase/
    ├── config.toml       # Supabase configuration
    └── migrations/       # Database migrations
