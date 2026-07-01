import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { applyToJob, listJobsPublic } from "@/lib/jobs.functions";
import { listRemoteJobsExternal } from "@/lib/external-jobs.functions";
import { useAuth } from "@/lib/auth-context";
import { ScrollReveal } from "@/components/ScrollReveal";
import { toast } from "sonner";
import { Briefcase, MapPin, Clock, GraduationCap, Star, Globe, ExternalLink, Radio, Search as SearchIcon } from "lucide-react";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "Jobs in Bangladesh & Remote — TalentBD" },
      { name: "description", content: "Find IT, engineering, banking, and remote jobs on TalentBD — Bangladesh's learn-and-earn platform." },
      { property: "og:title", content: "Jobs — TalentBD" },
      { property: "og:url", content: "/jobs" },
    ],
    links: [{ rel: "canonical", href: "/jobs" }],
  }),
  component: Jobs,
});

const CATEGORIES = [
  "IT/Software", "Engineering", "Banking/Finance", "Marketing", "Sales",
  "Design", "Customer Service", "Healthcare", "Education", "General",
];

// Highlight matched query tokens inside a job title so users can immediately
// see why the result matched. Uses whole-word boundaries to stay in sync
// with the strict filter above and falls back to the raw title when no
// tokens are active.
function HighlightedTitle({ text, tokens }: { text: string; tokens: string[] }) {
  const safe = text ?? "";
  const active = tokens.filter((t) => t && t.length >= 2);
  if (!active.length) return <>{safe}</>;
  const escaped = active
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length);
  const re = new RegExp(`\\b(${escaped.join("|")})`, "gi");
  const parts: Array<{ v: string; hit: boolean }> = [];
  let last = 0;
  for (const m of safe.matchAll(re)) {
    const start = m.index ?? 0;
    if (start > last) parts.push({ v: safe.slice(last, start), hit: false });
    parts.push({ v: m[0], hit: true });
    last = start + m[0].length;
  }
  if (last < safe.length) parts.push({ v: safe.slice(last), hit: false });
  return (
    <>
      {parts.map((p, i) =>
        p.hit ? (
          <mark key={i} className="rounded-sm bg-primary/20 text-foreground px-0.5">
            {p.v}
          </mark>
        ) : (
          <span key={i}>{p.v}</span>
        ),
      )}
    </>
  );
}

// Map our UI categories to Remotive's category slugs so the live feed
// reacts to the same filter chips as local jobs.
const REMOTIVE_CATEGORY: Record<string, string | undefined> = {
  "IT/Software": "software-dev",
  "Engineering": "devops",
  "Banking/Finance": "finance-legal",
  "Marketing": "marketing",
  "Sales": "sales",
  "Design": "design",
  "Customer Service": "customer-support",
  "Healthcare": undefined,
  "Education": undefined,
  "General": undefined,
};

function Jobs() {
  const fn = useServerFn(listJobsPublic);
  const remoteFn = useServerFn(listRemoteJobsExternal);
  const applyFn = useServerFn(applyToJob);
  const qc = useQueryClient();
  const { user } = useAuth();
  const q = useQuery({ queryKey: ["jobs"], queryFn: () => fn(), staleTime: 60_000 });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // Search only runs when the user presses Enter or clicks the Search button.
  const [showSuggest, setShowSuggest] = useState(false);
  const [activeSuggest, setActiveSuggest] = useState(-1);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (activeSuggest < 0 || typeof document === "undefined") return;
    const el = document.getElementById(`job-suggest-${activeSuggest}`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeSuggest]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onDown = (e: MouseEvent) => {
      if (!searchBoxRef.current?.contains(e.target as Node)) setShowSuggest(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);
  const [category, setCategory] = useState<string>("");
  const [location, setLocation] = useState("");
  const [exp, setExp] = useState("");
  const [type, setType] = useState("");
  const [remote, setRemote] = useState<"all" | "remote" | "onsite">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [cover, setCover] = useState("");

  // Sync from URL params on mount so deep-links like /jobs?remote=remote work
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const r = p.get("remote");
    if (r === "remote" || r === "onsite" || r === "all") setRemote(r);
    const c = p.get("category"); if (c) setCategory(c);
    const t = p.get("type"); if (t) setType(t);
    const s = p.get("search"); if (s) { setSearch(s); setDebouncedSearch(s); }
    const loc = p.get("location"); if (loc) setLocation(loc);
    const e = p.get("exp"); if (e) setExp(e);
  }, []);

  // Persist filter state to the URL so refresh / back-forward restore it.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (category) p.set("category", category);
    if (location) p.set("location", location);
    if (exp) p.set("exp", exp);
    if (type) p.set("type", type);
    if (remote !== "all") p.set("remote", remote);
    const qs = p.toString();
    const next = `${window.location.pathname}${qs ? "?" + qs : ""}${window.location.hash}`;
    if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(null, "", next);
    }
  }, [search, category, location, exp, type, remote]);

  const remoteCat = category ? REMOTIVE_CATEGORY[category] : undefined;
  const remoteQ = useQuery({
    queryKey: ["remotive-jobs", debouncedSearch, remoteCat ?? ""],
    queryFn: () =>
      remoteFn({
        data: {
          limit: 150,
          ...(debouncedSearch ? { search: debouncedSearch } : {}),
          ...(remoteCat ? { category: remoteCat } : {}),
        },
      }),
    staleTime: 5 * 60_000,
    // Always fetch — Arbeitnow returns both remote and on-site listings
    enabled: true,
  });

  // Infinite scroll for the live remote feed
  const PAGE_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  // Reset to page 1 whenever any filter that affects the live feed changes.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    // Scroll the live feed back to the top so users see fresh page-1 results.
    if (typeof window !== "undefined") {
      document.getElementById("live-remote-feed")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [debouncedSearch, category, remoteCat, remote]);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const apply = useMutation({
    mutationFn: (jobId: string) => applyFn({ data: { jobId, coverNote: cover } }),
    onSuccess: () => { toast.success("Application submitted"); setOpenId(null); setCover(""); qc.invalidateQueries({ queryKey: ["my-apps"] }); },
    onError: (e: any) => toast.error(e.message),
  });


  const all = q.data ?? [];
  // Minimal stemmer (plural + -ing) to avoid over-matching (keeps "engineer" ≠ "engine").
  const stem = (w: string) => w.replace(/(ing|s)$/i, "");
  // Whole-word test on a haystack: matches token as a standalone word, not substring.
  const wordHit = (hay: string, tok: string) => {
    if (!tok) return false;
    const re = new RegExp(`(^|[^a-z0-9])${tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`, "i");
    return re.test(hay);
  };
  // Relevance score: title hits > tags/category > company > description; plus recency & featured boosts.
  const scoreJob = (fields: { title?: string; company?: string; category?: string; tags?: string[]; description?: string; date?: string | null; featured?: boolean }, tokens: string[]) => {
    const title = (fields.title ?? "").toLowerCase();
    const company = (fields.company ?? "").toLowerCase();
    const category = (fields.category ?? "").toLowerCase();
    const tags = (fields.tags ?? []).join(" ").toLowerCase();
    const desc = (fields.description ?? "").toLowerCase();
    let s = 0;
    for (const t of tokens) {
      if (!t) continue;
      if (title.startsWith(t)) s += 14;
      else if (title.includes(` ${t}`) || title.includes(`${t} `)) s += 10;
      else if (title.includes(t)) s += 7;
      if (tags.includes(t)) s += 5;
      if (category.includes(t)) s += 4;
      if (company.includes(t)) s += 3;
      if (desc.includes(t)) s += 1;
    }
    if (fields.featured) s += 8;
    if (fields.date) {
      const days = (Date.now() - new Date(fields.date).getTime()) / 86_400_000;
      if (!Number.isNaN(days) && days >= 0) s += Math.max(0, 10 - Math.min(10, days / 3));
    }
    return s;
  };
  const filtered = useMemo(() => {
    const raw = debouncedSearch.trim().toLowerCase();
    const tokens = raw.split(/[\s,]+/).filter((t) => t.length >= 2).map(stem);
    const loc = location.trim().toLowerCase();
    const matched = all.filter((j: any) => {
      if (tokens.length) {
        // Strict AND-match on TITLE using whole-word boundaries. Multi-word
        // queries ("network engineer") must also appear as a contiguous phrase
        // in the title so "network administrator" is excluded.
        const title = (j.job_title ?? "").toLowerCase();
        const titleStem = title.split(/\s+/).map(stem).join(" ");
        if (tokens.length > 1 && !titleStem.includes(tokens.join(" "))) return false;
        if (!tokens.every((t) => wordHit(titleStem, t))) return false;
      }
      if (category) {
        const jc = (j.category ?? "General").toLowerCase();
        const cl = category.toLowerCase();
        const parts = cl.split(/[\s/&-]+/).filter(Boolean);
        // exact match, contains, or any keyword overlap (e.g. "IT/Software" ↔ "IT")
        if (jc !== cl && !jc.includes(cl) && !cl.includes(jc) && !parts.some((p) => jc.includes(p))) return false;
      }
      if (loc && !(j.location ?? "").toLowerCase().includes(loc)) return false;
      if (exp && j.experience_level !== exp) return false;
      if (type && j.job_type !== type) return false;
      if (remote === "remote" && !j.is_remote) return false;
      if (remote === "onsite" && j.is_remote) return false;
      return true;
    });
    if (!tokens.length) {
      // No query: featured first, then newest.
      return [...matched].sort((a: any, b: any) => {
        if (!!b.is_featured !== !!a.is_featured) return b.is_featured ? 1 : -1;
        return new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime();
      });
    }
    return [...matched]
      .map((j: any) => ({
        j,
        s: scoreJob({
          title: j.job_title, company: j.company, category: j.category,
          tags: [...(j.requirements ?? []), ...(j.tags ?? [])],
          description: j.description, date: j.created_at, featured: !!j.is_featured,
        }, tokens),
      }))
      .sort((a, b) => b.s - a.s)
      .map((x) => x.j);
  }, [all, debouncedSearch, category, location, exp, type, remote]);

  // Tokens used for on-screen match highlighting. We highlight both the raw
  // token and its stem so "engineers" in the query still marks "engineer" in
  // a title, matching the filter behavior above.
  const highlightTokens = useMemo(() => {
    const raw = debouncedSearch.trim().toLowerCase();
    const base = raw.split(/[\s,]+/).filter((t) => t.length >= 2);
    return Array.from(new Set([...base, ...base.map(stem)])).filter((t) => t.length >= 2);
  }, [debouncedSearch]);

  const featured = filtered.filter((j: any) => j.is_featured);
  const rest = filtered.filter((j: any) => !j.is_featured);
  const counts: Record<string, number> = {};
  for (const j of all) counts[j.category ?? "General"] = (counts[j.category ?? "General"] ?? 0) + 1;
  // Include live jobs in category counts so chips reflect what's actually shown.
  const liveAll = remoteQ.data ?? [];
  for (const c of CATEGORIES) {
    const parts = c.toLowerCase().split(/[\s/&-]+/).filter(Boolean);
    const liveCount = liveAll.reduce((n: number, j: any) => {
      const hay = `${j.category ?? ""} ${j.title ?? ""} ${(j.tags ?? []).join(" ")}`.toLowerCase();
      return n + (parts.some((p) => hay.includes(p)) ? 1 : 0);
    }, 0);
    counts[c] = (counts[c] ?? 0) + liveCount;
  }
  const totalAll = all.length + liveAll.length;

  const hasFilters = !!(search || category || location || exp || type || remote !== "all");
  const clearFilters = () => { setSearch(""); setDebouncedSearch(""); setCategory(""); setLocation(""); setExp(""); setType(""); setRemote("all"); };

  const openExternalJob = (url?: string | null) => {
    if (typeof window === "undefined") return;
    if (!url) {
      toast.error("This job does not have a valid apply link yet.");
      return;
    }
    let safeUrl: string;
    try {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Invalid protocol");
      safeUrl = parsed.toString();
    } catch {
      toast.error("This job apply link is invalid.");
      return;
    }
    const nextWindow = window.open(safeUrl, "_blank", "noopener,noreferrer");
    if (nextWindow) {
      nextWindow.opener = null;
      nextWindow.focus();
      return;
    }
    navigator.clipboard?.writeText(safeUrl).then(() => {
      toast.info("Job link copied. Paste it into a new browser tab to apply.");
    }).catch(() => {
      toast.error("Pop-up blocked. Allow pop-ups, then try opening the job again.");
    });
  };

  // Apply the same UI filters to the live (external) feed so category chips,
  // search, location, type, and remote toggle drive live jobs too.
  const liveFiltered = useMemo(() => {
    const raw = debouncedSearch.trim().toLowerCase();
    const tokens = raw.split(/[\s,]+/).filter((t) => t.length >= 2).map(stem);
    const loc = location.trim().toLowerCase();
    const typeL = type.toLowerCase();
    const catL = category.toLowerCase();
    // Infer experience level from a live job's title/description since
    // external feeds don't expose a structured field. Keeps the filter
    // strict — anything ambiguous is treated as Mid-level.
    const inferExp = (j: any): "Entry-level" | "Mid-level" | "Senior" => {
      const hay = `${j.title ?? ""} ${j.description ?? ""}`.toLowerCase();
      if (/\b(senior|sr\.?|lead|principal|staff|head of|architect|manager|director)\b/.test(hay)) return "Senior";
      if (/\b(junior|jr\.?|entry[- ]?level|intern(ship)?|graduate|trainee|apprentice|associate)\b/.test(hay)) return "Entry-level";
      return "Mid-level";
    };
    return (remoteQ.data ?? []).filter((j: any) => {
      if (remote === "remote" && !j.is_remote) return false;
      if (remote === "onsite" && j.is_remote) return false;
      if (loc && !(j.location ?? "").toLowerCase().includes(loc)) return false;
      if (typeL
          && !(j.job_type ?? "").toLowerCase().includes(typeL.replace("-", "_"))
          && !(j.job_type ?? "").toLowerCase().includes(typeL)) return false;
      if (exp && inferExp(j) !== exp) return false;
      if (catL) {
        const catHay = `${j.category ?? ""} ${j.title ?? ""} ${(j.tags ?? []).join(" ")}`.toLowerCase();
        const parts = catL.split(/[\s/&-]+/).filter(Boolean);
        if (!parts.some((p) => catHay.includes(p))) return false;
      }
      if (!tokens.length) return true;
      // Strict whole-word AND-match on the live job title; multi-word queries
      // must appear as a contiguous phrase.
      const title = (j.title ?? "").toLowerCase();
      const titleStem = title.split(/\s+/).map(stem).join(" ");
      if (tokens.length > 1 && !titleStem.includes(tokens.join(" "))) return false;
      return tokens.every((tok) => wordHit(titleStem, tok));
    });
  }, [remoteQ.data, debouncedSearch, category, location, exp, type, remote]);

  // Live jobs to splice into the "Open positions" section so every category
  // shows real openings even when the local DB is empty for that filter.
  const liveForOpenPositions = useMemo(() => {
    // Take up to 6, skipping ones we've already shown in featured (by url).
    const seen = new Set([...featured, ...rest].map((j: any) => j.apply_url ?? j.id));
    return liveFiltered.filter((j: any) => !seen.has(j.url)).slice(0, 6);
  }, [liveFiltered, featured, rest]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-10 md:px-6 page-enter">
      <h1 className="text-2xl sm:text-3xl font-bold">Jobs marketplace</h1>
      <p className="mt-1 text-sm sm:text-base text-muted-foreground">Local Bangladesh roles + global remote engineering jobs.</p>
      {hasFilters && (
        <div className="mt-2 text-xs text-muted-foreground">
          <button onClick={clearFilters} className="underline hover:text-foreground">Clear filters</button>
        </div>
      )}

      {/* Category chips */}
      <ScrollReveal>
        <div className="mt-6 glass rounded-xl p-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Browse by category</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => setCategory("")} className={`rounded-full px-3 py-1.5 text-xs font-medium border ${category === "" ? "bg-primary text-white" : "bg-white/60"}`} style={category === "" ? { background: "var(--color-primary)", color: "white" } : {}}>All ({totalAll})</button>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c === category ? "" : c)} className={`rounded-full px-3 py-1.5 text-xs font-medium border ${category === c ? "text-white" : "bg-white/60"}`} style={category === c ? { background: "var(--color-primary)", color: "white" } : {}}>
                {c} {counts[c] ? `(${counts[c]})` : ""}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Filters */}
      <div className="mt-4 glass rounded-xl p-3 sm:p-4 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
        <div ref={searchBoxRef} className="sm:col-span-2 relative min-w-0">
          {(() => { return null; })()}
          <div className="flex gap-2">
            <input
              ref={searchInputRef}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowSuggest(true); setActiveSuggest(-1); }}
              onFocus={() => setShowSuggest(true)}
              onKeyDown={(e) => {
                const q = search.trim().toLowerCase();
                const suggestions = q.length >= 1
                  ? Array.from(new Set([
                      ...all.map((j: any) => j.job_title as string),
                      ...((remoteQ.data ?? []) as any[]).map((j) => j.title as string),
                    ].filter(Boolean)))
                      .filter((t) => t.toLowerCase().includes(q))
                      .slice(0, 8)
                  : [];
                if (e.key === "ArrowDown" && suggestions.length) {
                  e.preventDefault(); setShowSuggest(true);
                  setActiveSuggest((i) => (i + 1) % suggestions.length);
                } else if (e.key === "ArrowUp" && suggestions.length) {
                  e.preventDefault(); setShowSuggest(true);
                  setActiveSuggest((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  const pick = activeSuggest >= 0 && suggestions[activeSuggest] ? suggestions[activeSuggest] : search.trim();
                  setSearch(pick);
                  setDebouncedSearch(pick);
                  setShowSuggest(false);
                  setActiveSuggest(-1);
                  searchInputRef.current?.focus();
                } else if (e.key === "Escape") {
                  setShowSuggest(false); setActiveSuggest(-1);
                  searchInputRef.current?.focus();
                }
              }}
              placeholder="Search job title, e.g. network engineer"
              aria-label="Search jobs"
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={showSuggest}
              aria-autocomplete="list"
              aria-controls="job-search-suggestions"
              aria-activedescendant={activeSuggest >= 0 ? `job-suggest-${activeSuggest}` : undefined}
              className="flex-1 min-w-0 rounded-md border px-3 py-2 text-sm bg-white/60"
            />
            <button
              type="button"
              onClick={() => { setDebouncedSearch(search.trim()); setShowSuggest(false); }}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold text-white whitespace-nowrap"
              style={{ background: "var(--color-primary)" }}
              aria-label="Run search"
            >
              <SearchIcon className="size-4" /> Search
            </button>
          </div>
          {showSuggest && search.trim().length >= 1 && (() => {
            const q = search.trim().toLowerCase();
            const titles = Array.from(new Set([
              ...all.map((j: any) => j.job_title as string),
              ...((remoteQ.data ?? []) as any[]).map((j) => j.title as string),
            ].filter(Boolean)))
              .filter((t) => t.toLowerCase().includes(q))
              .slice(0, 8);
            if (titles.length === 0) return null;
            return (
              <ul id="job-search-suggestions" role="listbox" aria-label="Job title suggestions" className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto rounded-md border border-white/40 bg-white/70 backdrop-blur-md shadow-lg">
                {titles.map((t, idx) => (
                  <li key={t} id={`job-suggest-${idx}`} role="option" aria-selected={activeSuggest === idx}>
                    <button
                      type="button"
                      tabIndex={-1}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setActiveSuggest(idx)}
                      onClick={() => {
                        setSearch(t); setDebouncedSearch(t);
                        setShowSuggest(false); setActiveSuggest(-1);
                        searchInputRef.current?.focus();
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${activeSuggest === idx ? "bg-white/90" : "hover:bg-white/80"}`}
                    >
                      <SearchIcon className="size-3.5 text-muted-foreground" />
                      <span className="truncate">{t}</span>
                    </button>
                  </li>
                ))}
              </ul>
            );
          })()}
        </div>
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" aria-label="Filter by location" className="min-w-0 rounded-md border px-3 py-2 text-sm bg-white/60" />
        <select value={exp} onChange={(e) => setExp(e.target.value)} aria-label="Filter by experience level" className="min-w-0 rounded-md border px-3 py-2 text-sm bg-white/60">
          <option value="">Any experience</option>
          <option>Entry-level</option><option>Mid-level</option><option>Senior</option>
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by employment type" className="min-w-0 rounded-md border px-3 py-2 text-sm bg-white/60">
          <option value="">Any type</option>
          <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
        </select>
        <select value={remote} onChange={(e) => setRemote(e.target.value as any)} aria-label="Filter by remote or on-site" className="min-w-0 rounded-md border px-3 py-2 text-sm bg-white/60">
          <option value="all">Remote + On-site</option><option value="remote">Remote only</option><option value="onsite">On-site only</option>
        </select>
      </div>

      {featured.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Star className="size-4 text-amber-500" /> Featured / Hot jobs</h2>
          <div className="mt-3 grid gap-4 grid-cols-1 md:grid-cols-2">
            {featured.map((j: any, i: number) => (
              <ScrollReveal key={j.id} delay={(i % 4) * 60}><JobCard j={j} onApply={() => setOpenId(j.id)} onPreview={() => setPreviewId(j.id)} canApply={!!user} highlightTokens={highlightTokens} /></ScrollReveal>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          {featured.length ? "All jobs" : "Open positions"}
          {(category || hasFilters) && liveFiltered.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
              <Radio className="size-3 animate-pulse" /> {liveFiltered.length} live
            </span>
          )}
        </h2>
        <div className="mt-3 grid gap-4 grid-cols-1 md:grid-cols-2">
          {rest.map((j: any, i: number) => (
            <ScrollReveal key={j.id} delay={(i % 4) * 60}><JobCard j={j} onApply={() => setOpenId(j.id)} onPreview={() => setPreviewId(j.id)} canApply={!!user} highlightTokens={highlightTokens} /></ScrollReveal>
          ))}
          {liveForOpenPositions.map((j: any, i: number) => (
            <ScrollReveal key={`live-${j.id}`} delay={(i % 4) * 60}>
              <LiveJobCard j={j} onOpen={openExternalJob} highlightTokens={highlightTokens} />
            </ScrollReveal>
          ))}
          {filtered.length === 0 && liveForOpenPositions.length === 0 && (
            <p className="text-sm text-muted-foreground">No jobs match those filters.</p>
          )}
        </div>
        {liveFiltered.length > liveForOpenPositions.length && (
          <div className="mt-4 text-center">
            <a href="#live-remote-feed" className="text-xs font-semibold underline text-muted-foreground hover:text-foreground">
              See {liveFiltered.length - liveForOpenPositions.length} more live {category || "matching"} jobs ↓
            </a>
        </div>
        )}
      </section>

      {/* Live Remote Jobs — pulled live from Remotive public API */}
      <section id="live-remote-feed" className="mt-12 scroll-mt-24">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Globe className="size-5" style={{ color: "var(--color-primary)" }} />
            Live jobs (remote & on-site)
            <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
              <Radio className="size-3 animate-pulse" /> Live
            </span>
          </h2>
          <span className="text-xs text-muted-foreground">Powered by Remotive · Arbeitnow · RemoteOK</span>
        </div>

        {remoteQ.isLoading && <p className="mt-4 text-sm text-muted-foreground">Fetching live remote jobs…</p>}
        {!remoteQ.isLoading && (remoteQ.data?.length ?? 0) === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">Live feed is taking a break — check back soon.</p>
        )}

        <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {(() => {
            const tokens = debouncedSearch
              .toLowerCase()
              .split(/[\s,]+/)
              .filter((t) => t.length >= 2)
              .map(stem);
            const loc = location.trim().toLowerCase();
            const typeL = type.toLowerCase();
            const catL = category.toLowerCase();
            const list = (remoteQ.data ?? []).filter((j: any) => {
              if (remote === "remote" && !j.is_remote) return false;
              if (remote === "onsite" && j.is_remote) return false;
              if (loc && !(j.location ?? "").toLowerCase().includes(loc)) return false;
              if (typeL && !(j.job_type ?? "").toLowerCase().includes(typeL.replace("-", "_"))
                  && !(j.job_type ?? "").toLowerCase().includes(typeL)) return false;
              if (catL) {
                const catHay = `${j.category ?? ""} ${j.title ?? ""} ${(j.tags ?? []).join(" ")}`.toLowerCase();
                // Match either the full label or its first word (e.g. "IT/Software" -> "it", "software")
                const parts = catL.split(/[\s/&-]+/).filter(Boolean);
                if (!parts.some((p) => catHay.includes(p))) return false;
              }
              if (!tokens.length) return true;
              const hay = `${j.title} ${j.company} ${j.category ?? ""} ${(j.tags ?? []).join(" ")} ${j.location ?? ""} ${j.job_type ?? ""}`.toLowerCase();
              return tokens.some((tok) => hay.includes(tok));
            });
            // Server returns results pre-sorted by relevance + recency, so
            // pagination stays stable as more pages append. Don't re-sort here.
            if (tokens.length && list.length === 0) {
              return <p className="text-sm text-muted-foreground">No live jobs match "{search}".</p>;
            }
            const shown = list.slice(0, visibleCount);
            if (typeof window !== "undefined") {
              (window as any).__liveJobsHasMore = list.length > visibleCount;
              (window as any).__liveJobsTotal = list.length;
            }
            return shown.map((j: any, i: number) => (
            <ScrollReveal key={j.id} delay={(i % 6) * 40}>
              <button
                type="button"
                onClick={() => openExternalJob(j.url)}
                className="lift glass rounded-xl p-4 sm:p-5 h-full w-full min-w-0 flex flex-col text-left overflow-hidden"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {j.company_logo ? (
                    <img src={j.company_logo} alt={j.company} className="size-10 shrink-0 rounded-md object-contain bg-white" />
                  ) : (
                    <div className="size-10 shrink-0 rounded-md grid place-items-center bg-white/70 font-bold text-sm" style={{ color: "var(--color-primary)" }}>
                      {j.company?.[0] ?? "?"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold leading-tight line-clamp-2 break-words"><HighlightedTitle text={j.title} tokens={highlightTokens} /></h3>
                    <p className="text-xs text-muted-foreground truncate">{j.company}</p>
                  </div>
                  <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground min-w-0">
                  {j.category && <span className="truncate max-w-full">{j.category}</span>}
                  {j.job_type && <span className="truncate max-w-full">· {j.job_type}</span>}
                  <span className="inline-flex items-center gap-1 min-w-0 max-w-full"><span className="shrink-0">·</span><span className="truncate">{j.is_remote ? "🌍" : "📍"} {j.location}</span></span>
                  {!j.is_remote && <span className="rounded badge-warning px-1.5 py-0.5 text-[10px] font-semibold">On-site</span>}
                  {j.source && <span className="rounded bg-white/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase">{j.source}</span>}
                </div>
                {j.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1 min-w-0">
                    {j.tags.slice(0, 4).map((t: string) => (
                      <span key={t} className="rounded border bg-white/60 px-2 py-0.5 text-[11px] truncate max-w-full">{t}</span>
                    ))}
                  </div>
                )}
                {j.salary && <p className="mt-3 text-sm font-medium break-words" style={{ color: "var(--color-primary)" }}>{j.salary}</p>}
              </button>
            </ScrollReveal>
            ));
          })()}
        </div>
        <InfiniteSentinel
          ref={sentinelRef}
          onHit={() => setVisibleCount((c) => c + PAGE_SIZE)}
          visibleCount={visibleCount}
          total={(remoteQ.data ?? []).length}
        />
      </section>


      {openId && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setOpenId(null)}>
          <div className="glass rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold">Apply to this job</h3>
            <p className="mt-1 text-xs text-muted-foreground">Add a short cover note (optional).</p>
            <textarea value={cover} onChange={(e) => setCover(e.target.value)} rows={5} className="mt-3 w-full rounded-md border px-3 py-2 text-sm" placeholder="Why you're a great fit…" />
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setOpenId(null)} className="rounded-md border px-3 py-1.5 text-sm">Cancel</button>
              <button onClick={() => apply.mutate(openId)} disabled={apply.isPending} className="rounded-md px-3 py-1.5 text-sm font-semibold text-white" style={{ background: "var(--color-primary)" }}>{apply.isPending ? "Submitting…" : "Submit application"}</button>
            </div>
          </div>
        </div>
      )}

      {previewId && (() => {
        const j: any = all.find((x: any) => x.id === previewId);
        if (!j) return null;
        const deadline = j.application_deadline ? new Date(j.application_deadline) : null;
        const daysLeft = deadline ? Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
        return (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setPreviewId(null)}>
            <div className="glass rounded-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold"><HighlightedTitle text={j.job_title} tokens={highlightTokens} /></h3>
                    {j.is_featured && <span className="badge-featured">Hot</span>}
                    {j.is_live && <span className="badge-live">Live</span>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{j.company}</p>
                </div>
                <button onClick={() => setPreviewId(null)} className="rounded-md border px-2 py-1 text-xs">Close</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {j.location && <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{j.location}</span>}
                {j.is_remote && <span className="rounded badge-success px-2 py-0.5">Remote</span>}
                {j.job_type && <span className="inline-flex items-center gap-1"><Briefcase className="size-3" />{j.job_type}</span>}
                {j.experience_level && <span className="inline-flex items-center gap-1"><GraduationCap className="size-3" />{j.experience_level}</span>}
                {j.category && <span>· {j.category}</span>}
                {daysLeft !== null && <span className={`inline-flex items-center gap-1 ${daysLeft <= 3 ? "text-destructive font-semibold" : ""}`}><Clock className="size-3" />{daysLeft > 0 ? `${daysLeft}d left` : "Closed"}</span>}
              </div>
              {j.salary_range && <p className="mt-3 text-sm font-semibold" style={{ color: "var(--color-primary)" }}>{j.salary_range}</p>}
              {j.description && (
                <section className="mt-4">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Description</h4>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">{j.description}</p>
                </section>
              )}
              {(j.requirements?.length ?? 0) > 0 && (
                <section className="mt-4">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Requirements</h4>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {j.requirements.map((r: string) => (
                      <li key={r} className="rounded-full border bg-white/60 px-3 py-1 text-xs">{r}</li>
                    ))}
                  </ul>
                </section>
              )}
              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <Link to="/jobs/$jobId" params={{ jobId: j.id }} className="rounded-md border px-3 py-1.5 text-sm font-semibold hover:bg-white/60">Open full page</Link>
                {user ? (
                  <button onClick={() => { setPreviewId(null); setOpenId(j.id); }} className="rounded-md px-3 py-1.5 text-sm font-semibold text-white" style={{ background: "var(--color-primary)" }}>Apply</button>
                ) : (
                  <a href="/auth" className="rounded-md px-3 py-1.5 text-sm font-semibold text-white" style={{ background: "var(--color-primary)" }}>Sign in to apply</a>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function JobCard({ j, onApply, onPreview, canApply, highlightTokens = [] }: { j: any; onApply: () => void; onPreview: () => void; canApply: boolean; highlightTokens?: string[] }) {
  const deadline = j.application_deadline ? new Date(j.application_deadline) : null;
  const daysLeft = deadline ? Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
  return (
    <article className="lift glass rounded-xl p-4 sm:p-5 h-full flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Link to="/jobs/$jobId" params={{ jobId: j.id }} className="font-semibold hover:underline break-words line-clamp-2"><HighlightedTitle text={j.job_title} tokens={highlightTokens} /></Link>
          <p className="text-sm text-muted-foreground truncate">{j.company}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {j.is_featured && <span className="badge-featured">Hot</span>}
          {j.is_live && <span className="badge-live">Live</span>}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {j.location && <span className="inline-flex items-center gap-1 min-w-0"><MapPin className="size-3 shrink-0" /><span className="truncate max-w-[12rem]">{j.location}</span></span>}
        {j.is_remote && <span className="rounded badge-success px-2 py-0.5">Remote</span>}
        {j.job_type && <span className="inline-flex items-center gap-1"><Briefcase className="size-3" />{j.job_type}</span>}
        {j.experience_level && <span className="inline-flex items-center gap-1"><GraduationCap className="size-3" />{j.experience_level}</span>}
        {daysLeft !== null && <span className={`inline-flex items-center gap-1 ${daysLeft <= 3 ? "text-destructive font-semibold" : ""}`}><Clock className="size-3" />{daysLeft > 0 ? `${daysLeft}d left` : "Closed"}</span>}
      </div>
      {j.description && <p className="mt-2 text-sm line-clamp-2">{j.description}</p>}
      <div className="mt-3 flex flex-wrap gap-1">
        {(j.requirements ?? []).slice(0, 6).map((r: string) => (
          <span key={r} className="rounded border bg-white/60 px-2 py-0.5 text-xs">{r}</span>
        ))}
      </div>
      <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-2">
        {j.salary_range && <p className="text-sm font-medium min-w-0 break-words" style={{ color: "var(--color-primary)" }}>{j.salary_range}</p>}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Link to="/jobs/$jobId" params={{ jobId: j.id }} className="rounded-md border px-3 py-1.5 text-sm font-semibold hover:bg-white/60 whitespace-nowrap">View details</Link>
          {canApply ? (
            <button onClick={onApply} className="rounded-md px-3 py-1.5 text-sm font-semibold text-white whitespace-nowrap" style={{ background: "var(--color-primary)" }}>Apply</button>
          ) : (
            <a href="/auth" className="rounded-md px-3 py-1.5 text-sm font-semibold text-white whitespace-nowrap" style={{ background: "var(--color-primary)" }}>Sign in</a>
          )}
        </div>
      </div>
    </article>
  );
}

const InfiniteSentinel = forwardRef<HTMLDivElement, { onHit: () => void; visibleCount: number; total: number }>(
  function InfiniteSentinel({ onHit, visibleCount, total }, ref) {
    const localRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
      const el = localRef.current;
      if (!el || visibleCount >= total) return;
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) onHit();
      }, { rootMargin: "300px" });
      io.observe(el);
      return () => io.disconnect();
    }, [onHit, visibleCount, total]);
    if (total === 0) return null;
    const hasMore = visibleCount < total;
    return (
      <div ref={(node) => { localRef.current = node; if (typeof ref === "function") ref(node); else if (ref) (ref as any).current = node; }} className="mt-6 flex justify-center">
        {hasMore ? (
          <button onClick={onHit} className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-white/60">
            Load more ({total - visibleCount} remaining)
          </button>
        ) : (
          <p className="text-xs text-muted-foreground">You've reached the end — {total} live jobs shown.</p>
        )}
      </div>
    );
  },
);

function LiveJobCard({ j, onOpen, highlightTokens = [] }: { j: any; onOpen: (url?: string | null) => void; highlightTokens?: string[] }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(j.url)}
      className="lift glass rounded-xl p-4 sm:p-5 h-full w-full min-w-0 flex flex-col text-left overflow-hidden"
    >
      <div className="flex items-start gap-3 min-w-0">
        {j.company_logo ? (
          <img src={j.company_logo} alt={j.company} className="size-10 shrink-0 rounded-md object-contain bg-white" />
        ) : (
          <div className="size-10 shrink-0 rounded-md grid place-items-center bg-white/70 font-bold text-sm" style={{ color: "var(--color-primary)" }}>
            {j.company?.[0] ?? "?"}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold leading-tight line-clamp-2 break-words"><HighlightedTitle text={j.title} tokens={highlightTokens} /></h3>
          <p className="text-xs text-muted-foreground truncate">{j.company}</p>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
          <Radio className="size-3 animate-pulse" /> Live
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground min-w-0">
        {j.category && <span className="truncate max-w-full">{j.category}</span>}
        {j.job_type && <span className="truncate max-w-full">· {j.job_type}</span>}
        <span className="inline-flex items-center gap-1 min-w-0 max-w-full"><span className="shrink-0">·</span><span className="truncate">{j.is_remote ? "🌍" : "📍"} {j.location}</span></span>
        {!j.is_remote && <span className="rounded badge-warning px-1.5 py-0.5 text-[10px] font-semibold">On-site</span>}
        {j.source && <span className="rounded bg-white/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase">{j.source}</span>}
      </div>
      {j.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1 min-w-0">
          {j.tags.slice(0, 4).map((t: string) => (
            <span key={t} className="rounded border bg-white/60 px-2 py-0.5 text-[11px] truncate max-w-full">{t}</span>
          ))}
        </div>
      )}
      <div className="mt-auto pt-3 flex flex-wrap items-center justify-between gap-2">
        {j.salary && <p className="text-sm font-medium break-words min-w-0" style={{ color: "var(--color-primary)" }}>{j.salary}</p>}
        <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap" style={{ color: "var(--color-primary)" }}>
          View & Apply <ExternalLink className="size-3" />
        </span>
      </div>
    </button>
  );
}
