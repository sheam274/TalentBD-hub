import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, X, Send, Loader2, Paperclip } from "lucide-react";
import { talentChat } from "@/lib/chat.functions";
import { BrandMark } from "@/components/Brand";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Msg = { role: "user" | "assistant"; content: string; model?: string; fellBack?: boolean };

const SUGGESTIONS = [
  "Suggest a 4-week CSE learning plan",
  "What skills do EEE jobs in Dhaka need?",
  "Improve my CV summary for fresher",
  "Best remote jobs for civil engineers",
];

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm your TalentBD career coach. Ask me about learning tracks, jobs, or your CV." },
  ]);
  const [input, setInput] = useState("");
  const chatFn = useServerFn(talentChat);
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<{ name: string; size: number; type: string }[]>([]);
  const [lastModel, setLastModel] = useState<string | null>(null);
  const [lastFellBack, setLastFellBack] = useState(false);
  const [geminiMode, setGeminiMode] = useState<boolean>(() => {
    try {
      if (typeof window === "undefined") return false;
      return window.localStorage?.getItem("talentbd.chatMode") === "gemini";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage?.setItem("talentbd.chatMode", geminiMode ? "gemini" : "coach");
    } catch {
      /* storage unavailable (Safari private mode, quota, disabled) — ignore */
    }
  }, [geminiMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== "talentbd.chatMode" || e.storageArea !== window.localStorage) return;
      setGeminiMode(e.newValue === "gemini");
    };
    try {
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    } catch {
      return;
    }
  }, []);

  const send = useMutation({
    mutationFn: (next: Msg[]) =>
      chatFn({ data: { messages: next, mode: geminiMode ? "gemini" : "coach" } }),
    onSuccess: (res) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply, model: (res as any).model, fellBack: (res as any).fellBack },
      ]);
      if ((res as any).model) setLastModel((res as any).model);
      setLastFellBack(!!(res as any).fellBack);
    },
    onError: (e: any) => {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${e.message}` }]);
    },
  });

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function submit(text?: string) {
    const content = (text ?? input).trim();
    if ((!content && attachments.length === 0) || send.isPending) return;
    const attachNote =
      attachments.length > 0
        ? `\n\n📎 Attached: ${attachments.map((a) => `${a.name} (${Math.round(a.size / 1024)} KB)`).join(", ")}`
        : "";
    const finalContent = (content || "Please review the attached file(s).") + attachNote;
    const next: Msg[] = [...messages, { role: "user", content: finalContent }];
    setMessages(next);
    setInput("");
    setAttachments([]);
    send.mutate(next.filter((m) => m.role !== "assistant" || messages.indexOf(m) !== 0).slice(-20));
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI assistant"
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full text-white shadow-xl transition-transform hover:scale-105"
        style={{
          background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
          boxShadow: "0 12px 32px -8px color-mix(in oklab, var(--color-primary) 60%, transparent)",
        }}
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-white" />
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border shadow-2xl"
          style={{ height: "min(560px, 75vh)", background: "white" }}
        >
          <div
            className="flex items-center gap-2 px-4 py-3 text-white"
            style={{ background: "linear-gradient(135deg, var(--color-primary), oklch(0.45 0.18 250))" }}
          >
            <BrandMark size={22} className="rounded-md bg-white/10 p-0.5" />
            <div className="flex-1">
              <div className="text-sm font-bold">TalentBD AI Coach</div>
              <div className="text-[11px] opacity-80">
                {lastModel ? (
                  <>
                    Powered by <span className="font-semibold">{lastModel}</span>
                    {lastFellBack && <span className="ml-1 rounded bg-warning px-1 text-[10px] font-semibold text-warning-foreground">fallback</span>}
                  </>
                ) : (
                  <>Powered by Google Gemini</>
                )}
              </div>
            </div>
            <div
              role="group"
              aria-label="Assistant mode"
              className="flex items-center gap-0.5 rounded-full bg-white/15 p-0.5 text-[10px] font-semibold backdrop-blur transition hover:bg-white/25"
            >
              <button
                type="button"
                onClick={() => setGeminiMode(false)}
                title="Career coach with TalentBD context"
                className={`rounded-full px-2 py-1 transition ${
                  !geminiMode ? "bg-white text-ink shadow" : "text-white/80 hover:text-white"
                }`}
              >
                Coach
              </button>
              <button
                type="button"
                onClick={() => setGeminiMode(true)}
                title="Pure Gemini mode (minimal system prompt)"
                className={`rounded-full px-2 py-1 transition ${
                  geminiMode ? "bg-white text-ink shadow" : "text-white/80 hover:text-white"
                }`}
              >
                Gemini
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-3" style={{ background: "color-mix(in oklab, var(--color-primary) 4%, white)" }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "whitespace-pre-wrap rounded-br-sm text-white"
                      : "rounded-bl-sm border bg-white"
                  }`}
                  style={m.role === "user" ? { background: "var(--color-primary)" } : {}}
                >
                  {m.role === "user" ? (
                    m.content
                  ) : (
                    <div className="prose prose-sm max-w-none prose-pre:bg-ink prose-pre:text-white prose-code:before:hidden prose-code:after:hidden">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {send.isPending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border bg-white px-3 py-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" /> thinking…
                </div>
              </div>
            )}
            {messages.length <= 1 && (
              <div className="space-y-1.5 pt-2">
                <p className="text-[11px] font-semibold uppercase text-muted-foreground">Try asking</p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="block w-full rounded-md border bg-white px-3 py-1.5 text-left text-xs hover:bg-muted"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="flex flex-col gap-2 border-t bg-white p-2"
          >
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {attachments.map((a, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full border bg-muted px-2 py-0.5 text-[11px]"
                  >
                    <Paperclip className="size-3" />
                    <span className="max-w-[140px] truncate">{a.name}</span>
                    <button
                      type="button"
                      onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label={`Remove ${a.name}`}
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                multiple
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.md,image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  setAttachments((prev) =>
                    [...prev, ...files.map((f) => ({ name: f.name, size: f.size, type: f.type }))].slice(0, 5)
                  );
                  if (fileRef.current) fileRef.current.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="rounded-md border p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Attach file"
                title="Attach file (CV, PDF, image…)"
              >
                <Paperclip className="size-4" />
              </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about careers…"
              className="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
              style={{ "--tw-ring-color": "var(--color-accent)" } as any}
            />
            <button
              type="submit"
              disabled={send.isPending || (!input.trim() && attachments.length === 0)}
              className="rounded-md p-2 text-white disabled:opacity-50"
              style={{ background: "var(--color-primary)" }}
              aria-label="Send"
            >
              <Send className="size-4" />
            </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
