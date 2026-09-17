import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logEvent, loggedFetch } from "./server-logger";

type Spies = {
  log: ReturnType<typeof vi.spyOn>;
  warn: ReturnType<typeof vi.spyOn>;
  error: ReturnType<typeof vi.spyOn>;
};

let spies: Spies;

beforeEach(() => {
  spies = {
    log: vi.spyOn(console, "log").mockImplementation(() => {}),
    warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
    error: vi.spyOn(console, "error").mockImplementation(() => {}),
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

/** Grab the single JSON line emitted by the most recent logEvent call. */
function lastEntry(spy: ReturnType<typeof vi.spyOn>): Record<string, unknown> {
  const call = spy.mock.calls.at(-1);
  expect(call, "expected a console call").toBeTruthy();
  return JSON.parse(call![0] as string);
}

describe("logEvent", () => {
  it("emits a single JSON line with ts/level/kind", () => {
    logEvent("ai", "info", { op: "chat" });
    expect(spies.log).toHaveBeenCalledTimes(1);
    const entry = lastEntry(spies.log);
    expect(entry.kind).toBe("ai");
    expect(entry.level).toBe("info");
    expect(entry.op).toBe("chat");
    expect(typeof entry.ts).toBe("string");
    expect(Number.isNaN(Date.parse(entry.ts as string))).toBe(false);
  });

  it("routes warn and error levels to the matching console method", () => {
    logEvent("ai", "warn");
    expect(spies.warn).toHaveBeenCalledTimes(1);
    logEvent("ai", "error");
    expect(spies.error).toHaveBeenCalledTimes(1);
    expect(spies.log).not.toHaveBeenCalled();
  });

  it("redacts sensitive keys regardless of value", () => {
    logEvent("ai", "info", {
      authorization: "Bearer abc",
      apiKey: "whatever",
      password: "hunter2",
      nested: { token: "xyz", safe: "keep" },
    });
    const entry = lastEntry(spies.log);
    expect(entry.authorization).toBe("[REDACTED]");
    expect(entry.apiKey).toBe("[REDACTED]");
    expect(entry.password).toBe("[REDACTED]");
    const nested = entry.nested as Record<string, unknown>;
    expect(nested.token).toBe("[REDACTED]");
    expect(nested.safe).toBe("keep");
  });

  it("redacts secret-looking substrings inside string values", () => {
    logEvent("ai", "info", {
      note: "call used Bearer abcdefghijklmnop and key ghp_abcdefghijklmnopqrstuvwx",
      detail: "issued eyJhbGciOi.eyJzdWIiOm.SflKxwRJSM for the session",
      contact: "reach me at user@example.com or +8801712345678",
    });
    const entry = lastEntry(spies.log);
    const note = entry.note as string;
    expect(note).toContain("Bearer [REDACTED]");
    expect(note).toContain("[REDACTED_KEY]");
    expect(note).not.toContain("ghp_abcdefghijklmnopqrstuvwx");
    expect(entry.detail).toContain("[REDACTED_JWT]");
    expect(entry.detail).not.toContain("eyJhbGciOi");
    const contact = entry.contact as string;
    expect(contact).toContain("[REDACTED_EMAIL]");
    expect(contact).not.toContain("user@example.com");
  });

  it("strips query strings from url fields", () => {
    logEvent("external-api", "info", {
      url: "https://api.example.com/v1/jobs?access_token=secret&page=2",
    });
    const entry = lastEntry(spies.log);
    expect(entry.url).toBe("https://api.example.com/v1/jobs");
  });
});

describe("loggedFetch", () => {
  const meta = { kind: "external-api", op: "jobs.remotive", provider: "remotive" };

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("logs request + response and returns the original response on success", async () => {
    const res = new Response("ok", { status: 200 });
    const fetchMock = vi.fn().mockResolvedValue(res);
    vi.stubGlobal("fetch", fetchMock);

    const out = await loggedFetch("https://api.example.com/jobs?key=abc", {}, meta);

    expect(out).toBe(res);
    expect(fetchMock).toHaveBeenCalledOnce();
    // both request and response log at info -> console.log; request is first.
    const request = JSON.parse(spies.log.mock.calls[0]![0] as string);
    expect(request.phase).toBe("request");
    // query string dropped from the logged url
    expect(request.url).toBe("https://api.example.com/jobs");
    // success responses log at info -> console.log
    const responseLine = spies.log.mock.calls.at(-1)![0] as string;
    const response = JSON.parse(responseLine);
    expect(response.phase).toBe("response");
    expect(response.status).toBe(200);
    expect(typeof response.ms).toBe("number");
  });

  it("logs a warn for 5xx / 429 responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 503 })));
    await loggedFetch("https://api.example.com/jobs", {}, meta);
    const entry = lastEntry(spies.warn);
    expect(entry.phase).toBe("response");
    expect(entry.status).toBe(503);
  });

  it("logs an error for other non-ok responses (4xx)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 404 })));
    await loggedFetch("https://api.example.com/jobs", {}, meta);
    const entry = lastEntry(spies.error);
    expect(entry.status).toBe(404);
  });

  it("logs and rethrows on network error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("boom")));
    await expect(loggedFetch("https://api.example.com/jobs", {}, meta)).rejects.toThrow("boom");
    const entry = lastEntry(spies.error);
    expect(entry.phase).toBe("network_error");
    expect(entry.error).toBe("boom");
  });
});
