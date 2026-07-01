/**
 * Structured server-side logger for AI + external API calls.
 * Emits single-line JSON so localhost `bun run dev` output stays greppable
 * (e.g. `bun run dev | grep '"kind":"ai"'`) and production logs stay parseable.
 */

type LogLevel = "info" | "warn" | "error";

interface BaseLog {
  ts: string;
  level: LogLevel;
  kind: string;
  [key: string]: unknown;
}

function emit(entry: BaseLog) {
  const line = JSON.stringify(entry);
  if (entry.level === "error") console.error(line);
  else if (entry.level === "warn") console.warn(line);
  else console.log(line);
}

export function logEvent(kind: string, level: LogLevel, fields: Record<string, unknown> = {}) {
  emit({ ts: new Date().toISOString(), level, kind, ...fields });
}

export interface LoggedFetchMeta {
  kind: string; // e.g. "ai" | "external-api"
  op: string; // e.g. "chat.completion" | "jobs.remotive"
  provider?: string;
  model?: string;
  extra?: Record<string, unknown>;
}

/**
 * Wraps fetch() with timing + structured logging. Never leaks headers or bodies.
 * Returns the original Response so callers keep full control of parsing.
 */
export async function loggedFetch(url: string, init: RequestInit, meta: LoggedFetchMeta): Promise<Response> {
  const started = Date.now();
  const base = { op: meta.op, provider: meta.provider, model: meta.model, url: safeUrl(url), ...(meta.extra ?? {}) };
  logEvent(meta.kind, "info", { phase: "request", ...base });
  try {
    const res = await fetch(url, init);
    const ms = Date.now() - started;
    const level: LogLevel = res.ok ? "info" : res.status >= 500 || res.status === 429 ? "warn" : "error";
    logEvent(meta.kind, level, { phase: "response", ...base, status: res.status, ms });
    return res;
  } catch (err) {
    const ms = Date.now() - started;
    logEvent(meta.kind, "error", { phase: "network_error", ...base, ms, error: (err as Error).message });
    throw err;
  }
}

function safeUrl(u: string) {
  try {
    const parsed = new URL(u);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return u;
  }
}