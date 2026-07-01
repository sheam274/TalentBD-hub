import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useState } from "react";
import { CheckCircle2, MessageSquare, Code2, Building2, Landmark, GraduationCap, Rocket, Globe2, BookOpen, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/interview-prep")({
  head: () => ({
    meta: [
      { title: "Interview preparation — TalentBD" },
      { name: "description", content: "Practice questions, checklists, and behavioral frameworks to ace your next interview in Bangladesh or with a global remote team." },
      { property: "og:title", content: "Interview prep — TalentBD" },
    ],
  }),
  component: InterviewPrep,
});

const TABS = [
  {
    id: "behavioral",
    label: "Behavioral",
    icon: MessageSquare,
    qs: [
      "Tell me about a time you failed and what you learned.",
      "Describe a conflict with a teammate and how you resolved it.",
      "Walk me through your most impactful project.",
      "How do you prioritize when everything is urgent?",
      "Why TalentBD / why this company?",
    ],
  },
  {
    id: "technical",
    label: "Technical (Eng)",
    icon: Code2,
    qs: [
      "Reverse a linked list in O(n) time and O(1) extra space.",
      "Explain how indexes work in a relational database.",
      "What happens when you type a URL into a browser and hit enter?",
      "Design a URL shortener (rate limits, key generation, storage).",
      "Difference between TCP and UDP, and when to use each.",
    ],
  },
  {
    id: "system",
    label: "System Design",
    icon: Building2,
    qs: [
      "Design a job board like bdjobs.com.",
      "Design a CV/ATS parser at scale.",
      "How would you build a chat assistant for 1M users?",
      "Design a salary insights dashboard with real-time updates.",
      "Trade-offs between SQL and NoSQL for a learning platform.",
    ],
  },
  {
    id: "checklist",
    label: "Day-of checklist",
    icon: CheckCircle2,
    qs: [
      "Researched 3 facts about the company and the interviewer.",
      "Tested camera, mic, and internet on the actual link.",
      "Printed CV + portfolio links open in a tab.",
      "Prepared 3 STAR stories covering ownership, conflict, failure.",
      "Have 2 thoughtful questions ready for them.",
    ],
  },
];

type Track = {
  id: "bd-govt-it" | "bcs" | "big-tech" | "remote";
  label: string;
  tagline: string;
  icon: typeof Landmark;
  focus: string[];
  questions: string[];
  resources: { label: string; href: string }[];
  examSlug?: "bb-ad-it" | "govt-bcs" | "big-tech";
};

const TRACKS: Track[] = [
  {
    id: "bd-govt-it",
    label: "BD Govt IT (Bangladesh Bank AD-IT, BCC, NTRCA)",
    tagline: "Written MCQ + viva. Heavy on CS fundamentals, networking, DBMS, and Bangladesh affairs.",
    icon: Landmark,
    focus: [
      "Data structures & algorithms (arrays, trees, sorting complexity)",
      "DBMS: normalization, SQL joins, transactions, ACID",
      "Networking: OSI, TCP/IP, subnetting, HTTP, DNS",
      "Operating systems: processes, scheduling, deadlock, paging",
      "Software engineering: SDLC, testing, agile vs waterfall",
      "Bangladesh ICT policy, Digital Bangladesh, Smart Bangladesh 2041",
      "Bangla + English comprehension, math, general knowledge",
    ],
    questions: [
      "Difference between primary key, unique key, and foreign key with an example.",
      "Explain 3NF and give a table that violates it.",
      "What is subnetting? Given /26, how many hosts per subnet?",
      "Compare process vs thread; when would you prefer multithreading?",
      "Explain the OSI 7-layer model with one protocol per layer.",
      "What is the role of Bangladesh Computer Council (BCC) in national IT?",
      "Write SQL to find the 2nd highest salary from an Employees table.",
    ],
    resources: [
      { label: "Bangladesh Bank job circulars", href: "https://www.bb.org.bd/en/index.php/about/hrd" },
      { label: "BPSC official portal", href: "http://bpsc.gov.bd/" },
      { label: "GeeksforGeeks — DBMS", href: "https://www.geeksforgeeks.org/dbms/" },
      { label: "GeeksforGeeks — Computer Networks", href: "https://www.geeksforgeeks.org/computer-network-tutorials/" },
    ],
    examSlug: "bb-ad-it",
  },
  {
    id: "bcs",
    label: "BCS (General + Technical Cadre)",
    tagline: "Preliminary MCQ (200), Written (900), then Viva (200). Balanced GK + subject depth for technical cadres.",
    icon: GraduationCap,
    focus: [
      "Bangla language & literature, English grammar & composition",
      "Bangladesh affairs: liberation war, constitution, geography",
      "International affairs & current events",
      "Mathematical reasoning + mental ability",
      "General science, ICT & computing basics",
      "For BCS (Tech/Computer): DS, algorithms, OS, DBMS, networking",
      "Viva: personality, ethics, motivation to serve",
    ],
    questions: [
      "What are the salient features of the 1972 constitution of Bangladesh?",
      "Explain the difference between GDP and GNI with a Bangladesh example.",
      "Translate a Bangla proverb to English preserving the meaning.",
      "For BCS Computer: explain B-tree vs B+ tree and where B+ trees are used.",
      "For BCS Telecom: compare 4G LTE vs 5G NR in latency and spectrum use.",
      "Why do you want to join the civil service instead of a private tech job?",
    ],
    resources: [
      { label: "BPSC official notices", href: "http://bpsc.gov.bd/" },
      { label: "MP3 BCS Digest (overview)", href: "https://www.google.com/search?q=MP3+BCS+preliminary+digest" },
      { label: "Constitution of Bangladesh (full text)", href: "http://bdlaws.minlaw.gov.bd/act-367.html" },
      { label: "Bangladesh Bureau of Statistics", href: "http://www.bbs.gov.bd/" },
    ],
    examSlug: "govt-bcs",
  },
  {
    id: "big-tech",
    label: "Big Tech IT (FAANG, Microsoft, Stripe, Uber…)",
    tagline: "Rigorous DSA + system design + behavioral (STAR). 4–6 rounds, ~45 min each.",
    icon: Rocket,
    focus: [
      "DSA: arrays, hashmaps, two pointers, sliding window",
      "Trees, graphs, BFS/DFS, Dijkstra, union-find",
      "Dynamic programming (1D/2D, knapsack, LIS, edit distance)",
      "System design: load balancers, caching, sharding, CAP, CDN",
      "Concurrency, consistency, message queues (Kafka)",
      "Behavioral (STAR): ownership, ambiguity, conflict, failure",
      "Company deep-dive: values, recent launches, tech blog posts",
    ],
    questions: [
      "Given an array of integers, return indices of the two numbers that add up to target (LeetCode #1).",
      "Design a URL shortener. Estimate QPS, storage, key generation.",
      "Design Twitter's home timeline for 300M users (fan-out on write vs read).",
      "Design a distributed rate limiter (token bucket vs sliding window).",
      "Tell me about a time you disagreed with your manager and how it resolved.",
      "Walk me through the trade-offs of SQL vs NoSQL for this feature.",
    ],
    resources: [
      { label: "NeetCode 150 (curated DSA)", href: "https://neetcode.io/practice" },
      { label: "System Design Primer (GitHub)", href: "https://github.com/donnemartin/system-design-primer" },
      { label: "Grokking the System Design Interview", href: "https://www.designgurus.io/course/grokking-the-system-design-interview" },
      { label: "Amazon Leadership Principles", href: "https://www.amazon.jobs/en/principles" },
    ],
    examSlug: "big-tech",
  },
  {
    id: "remote",
    label: "Remote IT jobs (Toptal, Turing, Arc, EU/US startups)",
    tagline: "Async-first culture. Expect timed code screen, live pair, and a written work-sample.",
    icon: Globe2,
    focus: [
      "Strong written English + clear async communication",
      "One production-grade stack (React/Node, Python/Django, Go, etc.)",
      "Git hygiene: small PRs, clean commit history, code review etiquette",
      "Testing: unit, integration, e2e (Jest, Playwright, PyTest)",
      "REST + basic GraphQL; auth (JWT/OAuth), pagination, idempotency",
      "Cloud basics: AWS/GCP, Docker, CI/CD, environment secrets",
      "Timezone overlap plan, invoicing, contracts (W-8BEN / freelancer.gov.bd)",
    ],
    questions: [
      "Take-home: build a small paginated dashboard with tests in <4 hours.",
      "Live pair: extend an existing React component to support keyboard nav.",
      "How do you handle a 6-hour timezone gap with your team?",
      "Walk me through your Git workflow on a feature that took 2 weeks.",
      "Describe an incident you owned end-to-end in production.",
      "How do you keep yourself unblocked when you can't ping teammates?",
    ],
    resources: [
      { label: "Toptal screening process", href: "https://www.toptal.com/talent/apply" },
      { label: "Turing developer tests", href: "https://www.turing.com/developers" },
      { label: "Arc remote job board", href: "https://arc.dev/" },
      { label: "RemoteOK (live listings)", href: "https://remoteok.com/" },
      { label: "GitLab remote handbook", href: "https://handbook.gitlab.com/handbook/company/culture/all-remote/" },
    ],
  },
];

function InterviewPrep() {
  const [tab, setTab] = useState(TABS[0].id);
  const active = TABS.find((t) => t.id === tab)!;
  const [track, setTrack] = useState<Track["id"]>(TRACKS[0].id);
  const activeTrack = TRACKS.find((t) => t.id === track)!;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 page-enter">
      <ScrollReveal>
        <h1 className="text-4xl font-extrabold">Interview <span className="text-gradient">prep</span></h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Bite-sized prompts and checklists, organized for behavioral, technical, and system-design rounds.
        </p>
      </ScrollReveal>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${tab === t.id ? "text-white shadow-md" : "bg-white/60 hover:bg-white"}`}
            style={tab === t.id ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))", borderColor: "transparent" } : {}}
          >
            <t.icon className="size-4" />
            {t.label}
          </button>
        ))}
      </div>

      <ScrollReveal>
        <div className="mt-6 glass rounded-xl p-6">
          <h2 className="text-xl font-bold">{active.label}</h2>
          <ul className="mt-4 space-y-3">
            {active.qs.map((q, i) => (
              <li key={i} className="flex gap-3 rounded-lg bg-white/50 p-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: "var(--color-primary)" }}>{i + 1}</span>
                <p className="text-sm">{q}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/cv-builder" className="rounded-md px-4 py-2 text-sm font-semibold text-white" style={{ background: "var(--color-primary)" }}>Polish your CV</Link>
            <Link to="/jobs" className="rounded-md border bg-white/60 px-4 py-2 text-sm font-semibold">Apply to jobs</Link>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mt-12">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-[var(--color-primary)]" />
            <h2 className="text-2xl font-extrabold">Prep by job track</h2>
          </div>
          <p className="mt-1 max-w-2xl text-muted-foreground">
            Real-world roadmaps for the interviews Bangladeshi CSE grads actually take — from Bangladesh Bank AD-IT to FAANG and remote startups.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {TRACKS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTrack(t.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${track === t.id ? "text-white shadow-md" : "bg-white/60 hover:bg-white"}`}
                style={track === t.id ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))", borderColor: "transparent" } : {}}
              >
                <t.icon className="size-4" />
                {t.label.split(" (")[0]}
              </button>
            ))}
          </div>

          <div className="mt-5 glass rounded-xl p-6">
            <div className="flex items-start gap-3">
              <activeTrack.icon className="mt-1 size-6 shrink-0 text-[var(--color-primary)]" />
              <div>
                <h3 className="text-xl font-bold">{activeTrack.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{activeTrack.tagline}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Focus topics</h4>
                <ul className="mt-2 space-y-2">
                  {activeTrack.focus.map((f, i) => (
                    <li key={i} className="flex gap-2 rounded-lg bg-white/50 p-2 text-sm">
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Practice questions</h4>
                <ol className="mt-2 space-y-2">
                  {activeTrack.questions.map((q, i) => (
                    <li key={i} className="flex gap-2 rounded-lg bg-white/50 p-2 text-sm">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: "var(--color-primary)" }}>{i + 1}</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Study resources</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {activeTrack.resources.map((r) => (
                  <a
                    key={r.href}
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border bg-white/70 px-3 py-1.5 text-xs font-semibold hover:bg-white"
                  >
                    {r.label}
                    <ExternalLink className="size-3" />
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {activeTrack.examSlug && (
                <Link
                  to="/learn/exam-prep"
                  search={{ exam: activeTrack.examSlug }}
                  className="rounded-md px-4 py-2 text-sm font-semibold text-white"
                  style={{ background: "var(--color-primary)" }}
                >
                  Take timed quiz for this track
                </Link>
              )}
              <Link to="/jobs" className="rounded-md border bg-white/60 px-4 py-2 text-sm font-semibold">
                Browse matching jobs
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
