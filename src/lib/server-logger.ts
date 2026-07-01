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
  const line = JSON.stringify(redact(entry));
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
    // Drop query string — access_token, api_key, etc. commonly ride there.
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return u;
  }
}

// ---------- Redaction ----------

const SENSITIVE_KEY = /^(authorization|cookie|set-cookie|api[-_]?key|apikey|x-api-key|access[-_]?token|refresh[-_]?token|id[-_]?token|token|secret|password|passwd|pwd|client[-_]?secret|session|jwt|bearer|email|phone|ssn|credit[-_]?card|card[-_]?number|cvv|cvc)$/i;

const PATTERNS: Array<[RegExp, string]> = [
  // Bearer / auth headers embedded in strings
  [/Bearer\s+[A-Za-z0-9._~+/=-]{10,}/gi, "Bearer [REDACTED]"],
  // JWT (three base64url segments)
  [/\beyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\b/g, "[REDACTED_JWT]"],
  // Common API key prefixes (Supabase sb_*, OpenAI sk-*, Google AIza*, Stripe, GitHub, Slack)
  [/\b(sk|pk|rk|sb|sbp|xoxb|xoxp|ghp|gho|ghs|ghr)_[A-Za-z0-9_-]{16,}\b/g, "[REDACTED_KEY]"],
  [/\bAIza[0-9A-Za-z_-]{20,}\b/g, "[REDACTED_KEY]"],
  // Email addresses
  [/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[REDACTED_EMAIL]"],
  // E.164-ish phone numbers
  [/\+?\d{1,3}[-. ]?\(?\d{2,4}\)?[-. ]?\d{3,4}[-. ]?\d{3,4}\b/g, "[REDACTED_PHONE]"],
  // 13-19 digit card-like sequences
  [/\b(?:\d[ -]?){13,19}\b/g, "[REDACTED_CARD]"],
];

function redactString(s: string): string {
  let out = s;
  for (const [re, sub] of PATTERNS) out = out.replace(re, sub);
  return out;
}

function redact(value: unknown, depth = 0): unknown {
  if (value == null || depth > 6) return value;
  if (typeof value === "string") return redactString(value);
  if (typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1));
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (SENSITIVE_KEY.test(k)) {
      out[k] = "[REDACTED]";
    } else if (k.toLowerCase() === "url" && typeof v === "string") {
      out[k] = safeUrl(v);
    } else {
      out[k] = redact(v, depth + 1);
    }
  }
  return out;
}