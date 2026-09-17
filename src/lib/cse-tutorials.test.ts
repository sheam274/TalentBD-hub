import { describe, it, expect } from "vitest";
import { CSE_TUTORIALS, CSE_DISCIPLINE_LABEL, isCseDiscipline } from "./cse-tutorials";

describe("isCseDiscipline", () => {
  it("matches the 'cse' alias case-insensitively", () => {
    expect(isCseDiscipline("cse")).toBe(true);
    expect(isCseDiscipline("CSE")).toBe(true);
    expect(isCseDiscipline("Cse")).toBe(true);
  });

  it("matches anything starting with 'computer'", () => {
    expect(isCseDiscipline("computer")).toBe(true);
    expect(isCseDiscipline("Computer Science")).toBe(true);
    expect(isCseDiscipline("COMPUTER ENGINEERING")).toBe(true);
  });

  it("rejects unrelated disciplines", () => {
    expect(isCseDiscipline("business")).toBe(false);
    expect(isCseDiscipline("")).toBe(false);
    expect(isCseDiscipline("science")).toBe(false);
    expect(isCseDiscipline("c")).toBe(false);
  });
});

describe("CSE_DISCIPLINE_LABEL", () => {
  it("is the human-readable label", () => {
    expect(CSE_DISCIPLINE_LABEL).toBe("Computer Science");
  });
});

describe("CSE_TUTORIALS data integrity", () => {
  const topics = Object.keys(CSE_TUTORIALS);

  it("includes the expected topics", () => {
    expect(topics).toEqual(
      expect.arrayContaining([
        "web-development",
        "data-structures",
        "algorithms",
        "databases",
        "networking",
      ]),
    );
  });

  it("every tutorial has an intro, sections and practice questions", () => {
    for (const [topic, tut] of Object.entries(CSE_TUTORIALS)) {
      expect(tut.intro, topic).toBeTruthy();
      expect(tut.sections.length, topic).toBeGreaterThan(0);
      expect(tut.practice.length, topic).toBeGreaterThan(0);
    }
  });

  it("every section has a unique id within its tutorial", () => {
    for (const [topic, tut] of Object.entries(CSE_TUTORIALS)) {
      const ids = tut.sections.map((s) => s.id);
      expect(new Set(ids).size, topic).toBe(ids.length);
    }
  });

  it("every practice answer index points at a real choice", () => {
    for (const [topic, tut] of Object.entries(CSE_TUTORIALS)) {
      for (const [i, q] of tut.practice.entries()) {
        expect(q.choices.length, `${topic}[${i}]`).toBeGreaterThanOrEqual(2);
        expect(q.answer, `${topic}[${i}]`).toBeGreaterThanOrEqual(0);
        expect(q.answer, `${topic}[${i}]`).toBeLessThan(q.choices.length);
      }
    }
  });

  it("code snippets, when present, declare a language and source", () => {
    for (const [topic, tut] of Object.entries(CSE_TUTORIALS)) {
      for (const section of tut.sections) {
        if (section.code) {
          expect(section.code.lang, `${topic}/${section.id}`).toBeTruthy();
          expect(section.code.source, `${topic}/${section.id}`).toBeTruthy();
        }
      }
    }
  });
});
