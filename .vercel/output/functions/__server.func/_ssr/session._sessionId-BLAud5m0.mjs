import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { i as Route$2, a as useServerFn } from "./router-BajK73Jd.mjs";
import { a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { g as getSession, a as submitAnswer, f as finalizeInterview } from "./interview.functions-tzugvOsH.mjs";
import { s as supabase } from "./client-Bnm4-7qk.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import { d as LoaderCircle, j as CircleCheck, V as Video, I as Mic, N as Square } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./server-By-0JTie.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-C8nPQS-C.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
function SessionPage() {
  const {
    sessionId
  } = Route$2.useParams();
  const nav = useNavigate();
  const getFn = useServerFn(getSession);
  const submitFn = useServerFn(submitAnswer);
  const finalizeFn = useServerFn(finalizeInterview);
  const {
    data,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["interview-session", sessionId],
    queryFn: () => getFn({
      data: {
        sessionId
      }
    })
  });
  const [idx, setIdx] = reactExports.useState(0);
  const [answer, setAnswer] = reactExports.useState("");
  const [feedback, setFeedback] = reactExports.useState(null);
  const [mediaPath, setMediaPath] = reactExports.useState();
  const submit = useMutation({
    mutationFn: (input) => submitFn({
      data: {
        sessionId,
        questionId: input.questionId,
        answer,
        mediaPath
      }
    }),
    onSuccess: (r) => {
      setFeedback({
        score: r.score,
        feedback: r.feedback
      });
      refetch();
    }
  });
  const finalize = useMutation({
    mutationFn: () => finalizeFn({
      data: {
        sessionId
      }
    }),
    onSuccess: () => nav({
      to: "/interview/result/$sessionId",
      params: {
        sessionId
      }
    })
  });
  if (isLoading || !data) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mx-auto size-6 animate-spin" }) });
  const {
    session,
    questions,
    answers
  } = data;
  const q = questions[idx];
  const total = questions.length;
  const answered = answers.length;
  const isLast = idx === total - 1;
  const alreadyAnswered = answers.find((a) => a.question_id === q?.id);
  function next() {
    setAnswer("");
    setFeedback(null);
    setMediaPath(void 0);
    if (!isLast) setIdx((i) => i + 1);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter mx-auto max-w-3xl px-4 py-8 md:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: [
          session.role,
          " · ",
          session.difficulty,
          " · ",
          session.mode
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold", children: [
          "Question ",
          idx + 1,
          " of ",
          total
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
        answered,
        "/",
        total,
        " answered"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary transition-all", style: {
      width: `${(idx + 1) / total * 100}%`
    } }) }),
    !q ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-muted-foreground", children: "No question." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl border bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium", children: q.prompt }),
      q.expected_topic && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
        "Topic: ",
        q.expected_topic
      ] }),
      q.question_type === "mcq" && Array.isArray(q.choices) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-2", children: q.choices.map((c, i) => {
        const letter = String.fromCharCode(65 + i);
        const selected = answer === letter;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", disabled: !!feedback, onClick: () => setAnswer(letter), className: `w-full rounded-md border p-3 text-left text-sm ${selected ? "border-primary bg-primary/5" : "bg-white"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mr-2 font-bold", children: [
            letter,
            "."
          ] }),
          " ",
          c
        ] }, i);
      }) }) : session.mode === "voice" || session.mode === "video" ? /* @__PURE__ */ jsxRuntimeExports.jsx(MediaRecorderBox, { kind: session.mode === "voice" ? "audio" : "video", sessionId, questionId: q.id, onUploaded: (path) => setMediaPath(path), onTranscript: (t) => setAnswer((a) => (a ? a + "\n" : "") + t) }) : null,
      session.mode !== "mcq" && /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "mt-4 w-full rounded-md border px-3 py-2 text-sm", rows: 5, placeholder: session.mode === "text" ? "Type your answer…" : "Notes / transcript (optional — edit before submitting)", value: answer, onChange: (e) => setAnswer(e.target.value), disabled: !!feedback }),
      feedback ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-semibold text-emerald-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }),
          " Score: ",
          feedback.score,
          "/10"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-emerald-900", children: feedback.feedback })
      ] }) : alreadyAnswered ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-md border bg-muted/30 p-4 text-sm", children: [
        "Already answered (score ",
        alreadyAnswered.score,
        "/10). You can move on."
      ] }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex flex-wrap gap-3", children: [
        !feedback && !alreadyAnswered && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: !answer.trim() || submit.isPending, onClick: () => submit.mutate({
          questionId: q.id
        }), className: "inline-flex items-center gap-2 rounded-md px-5 py-2 font-semibold disabled:opacity-60", style: {
          background: "var(--color-accent)",
          color: "var(--color-accent-foreground)"
        }, children: [
          submit.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
          submit.isPending ? "Scoring…" : "Submit answer"
        ] }),
        !isLast && (feedback || alreadyAnswered) && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: next, className: "rounded-md border px-5 py-2 font-semibold", children: "Next question →" }),
        isLast && (feedback || alreadyAnswered) && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: finalize.isPending, onClick: () => finalize.mutate(), className: "inline-flex items-center gap-2 rounded-md px-5 py-2 font-semibold disabled:opacity-60", style: {
          background: "var(--color-primary)",
          color: "white"
        }, children: [
          finalize.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
          "Finish & see results"
        ] })
      ] })
    ] })
  ] });
}
function MediaRecorderBox({
  kind,
  sessionId,
  questionId,
  onUploaded,
  onTranscript
}) {
  const [recording, setRecording] = reactExports.useState(false);
  const [uploading, setUploading] = reactExports.useState(false);
  const [previewUrl, setPreviewUrl] = reactExports.useState(null);
  const chunks = reactExports.useRef([]);
  const recorder = reactExports.useRef(null);
  const streamRef = reactExports.useRef(null);
  const videoRef = reactExports.useRef(null);
  reactExports.useEffect(() => () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);
  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia(kind === "video" ? {
      audio: true,
      video: true
    } : {
      audio: true
    });
    streamRef.current = stream;
    if (videoRef.current && kind === "video") {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {
      });
    }
    const mime = kind === "video" ? "video/webm" : "audio/webm";
    const mr = new MediaRecorder(stream, {
      mimeType: mime
    });
    chunks.current = [];
    mr.ondataavailable = (e) => {
      if (e.data.size) chunks.current.push(e.data);
    };
    mr.onstop = async () => {
      const blob = new Blob(chunks.current, {
        type: mime
      });
      setPreviewUrl(URL.createObjectURL(blob));
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setUploading(true);
      try {
        const ext = kind === "video" ? "webm" : "webm";
        const path = `${sessionId}/${questionId}.${ext}`;
        const {
          data: u
        } = await supabase.auth.getUser();
        const fullPath = `${u.user?.id ?? "anon"}/${path}`;
        const {
          error
        } = await supabase.storage.from("interview-media").upload(fullPath, blob, {
          upsert: true,
          contentType: mime
        });
        if (!error) onUploaded(fullPath);
      } finally {
        setUploading(false);
      }
    };
    mr.start();
    recorder.current = mr;
    setRecording(true);
  }
  function stop() {
    recorder.current?.stop();
    setRecording(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-md border bg-muted/20 p-3", children: [
    kind === "video" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 overflow-hidden rounded-md bg-black", children: /* @__PURE__ */ jsxRuntimeExports.jsx("video", { ref: videoRef, muted: true, playsInline: true, className: "aspect-video w-full" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      !recording ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: start, className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground", children: [
        kind === "video" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "size-4" }),
        " Start recording"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: stop, className: "inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "size-4" }),
        " Stop"
      ] }),
      uploading && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Uploading…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onTranscript("(media submitted — type a short summary here)"), className: "text-xs text-primary hover:underline", children: "Insert placeholder text" })
    ] }),
    previewUrl && (kind === "video" ? /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: previewUrl, controls: true, className: "mt-3 w-full rounded-md" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("audio", { src: previewUrl, controls: true, className: "mt-3 w-full" })),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "Recording is uploaded privately. Add typed notes below — the AI scores those notes." })
  ] });
}
export {
  SessionPage as component
};
