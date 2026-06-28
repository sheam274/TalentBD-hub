import { describe, it, expect } from "vitest";
import { scoreAndSortJobs } from "./external-jobs.scoring";

const NOW = new Date("2026-06-28T00:00:00Z").getTime();

const jobs = [
  { id: "a", title: "Network Engineer", company: "Acme", tags: ["network"], publication_date: "2026-06-25T00:00:00Z" },
  { id: "b", title: "Senior Network Engineer", company: "Globex", tags: ["network", "cisco"], publication_date: "2026-06-20T00:00:00Z" },
  { id: "c", title: "Frontend Developer", company: "Initech", tags: ["react"], publication_date: "2026-06-27T00:00:00Z" },
  { id: "d", title: "Backend Engineer", company: "Umbrella", tags: ["node"], publication_date: "2026-06-10T00:00:00Z" },
  { id: "e", title: "DevOps Engineer", company: "Hooli", tags: ["aws", "network"], publication_date: "2026-06-26T00:00:00Z" },
  { id: "f", title: "Network Architect", company: "Pied Piper", tags: ["network"], publication_date: "2026-06-24T00:00:00Z" },
  { id: "g", title: "Data Scientist", company: "Stark", tags: ["python"], publication_date: "2026-06-28T00:00:00Z" },
  { id: "h", title: "Network Engineer", company: "Wayne", tags: ["network"], publication_date: "2026-06-25T00:00:00Z" }, // ties with a
];

describe("scoreAndSortJobs", () => {
  it("ranks title matches above tag-only matches", () => {
    const sorted = scoreAndSortJobs(jobs, "network", NOW);
    expect(sorted[0].id === "a" || sorted[0].id === "h" || sorted[0].id === "f").toBe(true);
    // DevOps (tag only) must come after title-hit jobs
    const devopsIdx = sorted.findIndex((j) => j.id === "e");
    const titleIdxes = ["a", "b", "f", "h"].map((id) => sorted.findIndex((j) => j.id === id));
    for (const i of titleIdxes) expect(i).toBeLessThan(devopsIdx);
  });

  it("is deterministic: same input yields identical order", () => {
    const a = scoreAndSortJobs(jobs, "network engineering", NOW).map((j) => j.id);
    const b = scoreAndSortJobs([...jobs].reverse(), "network engineering", NOW).map((j) => j.id);
    expect(a).toEqual(b);
  });

  it("pagination is stable: concatenated pages equal the full sorted list", () => {
    const full = scoreAndSortJobs(jobs, "engineer", NOW);
    const pageSize = 3;
    const pages: typeof full = [];
    for (let i = 0; i < full.length; i += pageSize) {
      // Re-sort each time to simulate the server returning a fresh request per page
      const fresh = scoreAndSortJobs(jobs, "engineer", NOW).slice(i, i + pageSize);
      pages.push(...fresh);
    }
    expect(pages.map((j) => j.id)).toEqual(full.map((j) => j.id));
  });

  it("filters out jobs with no keyword hit", () => {
    const sorted = scoreAndSortJobs(jobs, "network", NOW);
    expect(sorted.find((j) => j.id === "g")).toBeUndefined();
    expect(sorted.find((j) => j.id === "c")).toBeUndefined();
  });

  it("returns all jobs when search is empty, ordered by recency", () => {
    const sorted = scoreAndSortJobs(jobs, "", NOW);
    expect(sorted).toHaveLength(jobs.length);
    expect(sorted[0].id).toBe("g"); // most recent
  });
});