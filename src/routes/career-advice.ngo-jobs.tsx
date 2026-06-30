import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ScrollReveal";

export const Route = createFileRoute("/career-advice/ngo-jobs")({
  head: () => ({
    meta: [
      { title: "How to land NGO jobs in Bangladesh | TalentBD" },
      {
        name: "description",
        content:
          "A practical guide to landing NGO jobs in Bangladesh — from BRAC and Grameen to UNDP, Save the Children, and Oxfam. CVs, interviews, networks, and the NGO job circular calendar.",
      },
      { property: "og:title", content: "NGO jobs in Bangladesh — a complete guide" },
      {
        property: "og:description",
        content:
          "How to break into NGO and development-sector roles in Bangladesh — local and international organizations, requirements, and where the real job circulars live.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://talentbd.lovable.app/career-advice/ngo-jobs" },
    ],
    links: [{ rel: "canonical", href: "https://talentbd.lovable.app/career-advice/ngo-jobs" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "How to land NGO jobs in Bangladesh",
          about: "NGO jobs in Bangladesh, NGO job circular, development sector careers",
          author: { "@type": "Organization", name: "TalentBD" },
        }),
      },
    ],
  }),
  component: NgoJobsGuide,
});

function NgoJobsGuide() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:px-6 page-enter">
      <ScrollReveal>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Career advice · NGO jobs
        </p>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight">
          How to land <span className="text-gradient">NGO jobs in Bangladesh</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          NGO and development-sector roles are some of the most competitive — and most rewarding — careers in Bangladesh. This guide walks through what international and local organizations actually look for, where the real NGO job circulars live, and how to tailor your CV for both BRAC-style local NGOs and UN-system roles.
        </p>
      </ScrollReveal>

      <section className="prose prose-neutral mt-8 max-w-none">
        <h2>Who is hiring in the NGO sector</h2>
        <p>
          The Bangladeshi NGO sector breaks roughly into three tiers: large local NGOs (BRAC, Grameen, ASA, Proshika), international NGOs and donors (Save the Children, Oxfam, CARE, World Vision, Plan International), and UN-system organizations (UNDP, UNICEF, UNHCR, WFP, FAO, ILO). Each has its own hiring rhythm, salary band, and CV format.
        </p>

        <h2>Where NGO job circulars are actually posted</h2>
        <ul>
          <li>BRAC, Grameen, and most large local NGOs post on their own careers pages first — set up alerts on each.</li>
          <li>UN roles go through <em>unjobs.org</em>, <em>impactpool.org</em>, and the organization's own careers portal. Always apply on the official portal.</li>
          <li>For the international NGO bracket (Save the Children, Oxfam, CARE, Plan), <em>ReliefWeb</em> is the canonical source — it aggregates almost every legitimate humanitarian opening in the country.</li>
          <li>Local circulars also surface on BD-job aggregators; cross-check against the official site before applying to avoid scams.</li>
        </ul>

        <h2>What recruiters actually screen for</h2>
        <ol>
          <li><strong>A donor-aware CV.</strong> Quantify outcomes: beneficiaries reached, districts covered, budget managed, log-frame indicators delivered. Generic "team player" lines get cut.</li>
          <li><strong>Sectoral fluency.</strong> Name the sub-sector you work in — WASH, MEAL, livelihoods, GBV, child protection, climate resilience, governance — and back it with project examples.</li>
          <li><strong>Local + English writing.</strong> Most international NGOs interview in English but expect Bangla fluency for field roles. UN P-grade roles are English-only.</li>
          <li><strong>Safeguarding and PSEA.</strong> Any role touching beneficiaries asks about safeguarding training — list it explicitly on the CV.</li>
        </ol>

        <h2>CV format that works for NGO applications</h2>
        <p>
          Skip the colorful tech-startup template. NGO and UN screeners expect a clean two-column or single-column CV, 2–3 pages, with a clear "key competencies" block and an explicit list of donor-funded projects you've worked on (DFID/FCDO, USAID, EU, GAC, Sida, JICA). Use TalentBD's <Link to="/cv-builder" className="text-primary underline">CV builder</Link> and pick the standard template — then adapt the summary to each role.
        </p>

        <h2>The interview pattern</h2>
        <p>
          Expect a competency-based panel: STAR-format situational questions (Situation, Task, Action, Result), a technical sectoral question, and a written test for analytical roles. UN roles add a values-based section. Practise with <Link to="/interview-prep" className="text-primary underline">TalentBD's mock interview tool</Link> using the "Behavioral" preset.
        </p>

        <h2>Salary ranges</h2>
        <p>
          Large local NGOs pay BDT 35,000–120,000/month for entry to mid roles, with senior managers at 180,000+. International NGOs at the national-staff level sit higher (90,000–300,000+). UN NSO/NOA roles start around BDT 250,000 equivalent. Cross-check with our <Link to="/salaries" className="text-primary underline">salary insights</Link> before you negotiate.
        </p>

        <h2>Next steps</h2>
        <ul>
          <li>Browse <Link to="/jobs" className="text-primary underline">live jobs on TalentBD</Link> and filter by "NGO" or "non-profit".</li>
          <li>Read the rest of our <Link to="/career-advice" className="text-primary underline">career playbooks</Link>.</li>
          <li>Build a donor-ready CV with the <Link to="/cv-builder" className="text-primary underline">CV builder</Link>.</li>
        </ul>
      </section>
    </article>
  );
}