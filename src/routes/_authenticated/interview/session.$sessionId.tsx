import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getSession, submitAnswer, finalizeInterview } from "@/lib/interview.functions";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mic, Square, Video, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/interview/session/$sessionId")({
  head: () => ({ meta: [{ title: "Interview session" }] }),
  component: SessionPage,
});

function SessionPage() {
  const { sessionId } = Route.useParams();
  const nav = useNavigate();
  const getFn = useServerFn(getSession);
  const submitFn = useServerFn(submitAnswer);
  const finalizeFn = useServerFn(finalizeInterview);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["interview-session", sessionId],
    queryFn: () => getFn({ data: { sessionId } }),
  });

  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ score: number; feedback: string } | null>(null);
  const [mediaPath, setMediaPath] = useState<string | undefined>();

  const submit = useMutation({
    mutationFn: (input: { questionId: string }) =>
      submitFn({ data: { sessionId, questionId: input.questionId, answer, mediaPath } }),
    onSuccess: (r) => { setFeedback({ score: r.score, feedback: r.feedback }); refetch(); },
  });

  const finalize = useMutation({
    mutationFn: () => finalizeFn({ data: { sessionId } }),
    onSuccess: () => nav({ to: "/interview/result/$sessionId", params: { sessionId } }),
  });

  if (isLoading || !data) return <div className="p-10 text-center"><Loader2 className="mx-auto size-6 animate-spin" /></div>;

  const { session, questions, answers } = data;
  const q = questions[idx];
  const total = questions.length;
  const answered = answers.length;
  const isLast = idx === total - 1;
  const alreadyAnswered = answers.find((a) => a.question_id === q?.id);

  function next() {
    setAnswer(""); setFeedback(null); setMediaPath(undefined);
    if (!isLast) setIdx((i) => i + 1);
  }

  return (
    <div className="page-enter mx-auto max-w-3xl px-4 py-6 sm:py-8 md:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{session.role} · {session.difficulty} · {session.mode}</div>
          <h1 className="text-xl sm:text-2xl font-bold">Question {idx + 1} of {total}</h1>
        </div>
        <div className="text-sm text-muted-foreground shrink-0">{answered}/{total} answered</div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-all" style={{ width: `${((idx + 1) / total) * 100}%` }} />
      </div>

      {!q ? <div className="mt-6 text-muted-foreground">No question.</div> : (
        <div className="mt-6 rounded-2xl border bg-white p-4 sm:p-6 shadow-sm">
          <p className="text-base sm:text-lg font-medium break-words">{q.prompt}</p>
          {q.expected_topic && <p className="mt-1 text-xs text-muted-foreground">Topic: {q.expected_topic}</p>}

          {q.question_type === "mcq" && Array.isArray(q.choices) ? (
            <div className="mt-4 space-y-2">
              {(q.choices as string[]).map((c, i) => {
                const letter = String.fromCharCode(65 + i);
                const selected = answer === letter;
                return (
                  <button key={i} type="button" disabled={!!feedback} onClick={() => setAnswer(letter)} className={`w-full rounded-md border p-3 text-left text-sm ${selected ? "border-primary bg-primary/5" : "bg-white"}`}>
                    <span className="mr-2 font-bold">{letter}.</span> {c}
                  </button>
                );
              })}
            </div>
          ) : session.mode === "voice" || session.mode === "video" ? (
            <MediaRecorderBox
              kind={session.mode === "voice" ? "audio" : "video"}
              sessionId={sessionId}
              questionId={q.id}
              onUploaded={(path) => setMediaPath(path)}
              onTranscript={(t) => setAnswer((a) => (a ? a + "\n" : "") + t)}
            />
          ) : null}

          {(session.mode !== "mcq") && (
            <textarea
              className="mt-4 w-full rounded-md border px-3 py-2 text-sm"
              rows={5}
              placeholder={session.mode === "text" ? "Type your answer…" : "Notes / transcript (optional — edit before submitting)"}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={!!feedback}
            />
          )}

          {feedback ? (
            <div className="mt-4 rounded-md border border-success/30 bg-success-soft p-4">
              <div className="flex items-center gap-2 font-semibold text-success"><CheckCircle2 className="size-4" /> Score: {feedback.score}/10</div>
              <p className="mt-1 text-sm text-success">{feedback.feedback}</p>
            </div>
          ) : alreadyAnswered ? (
            <div className="mt-4 rounded-md border bg-muted/30 p-4 text-sm">Already answered (score {alreadyAnswered.score}/10). You can move on.</div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-3">
            {!feedback && !alreadyAnswered && (
              <button
                disabled={!answer.trim() || submit.isPending}
                onClick={() => submit.mutate({ questionId: q.id })}
                className="inline-flex items-center gap-2 rounded-md px-5 py-2 font-semibold disabled:opacity-60"
                style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}
              >
                {submit.isPending && <Loader2 className="size-4 animate-spin" />}
                {submit.isPending ? "Scoring…" : "Submit answer"}
              </button>
            )}
            {!isLast && (feedback || alreadyAnswered) && (
              <button onClick={next} className="rounded-md border px-5 py-2 font-semibold">Next question →</button>
            )}
            {isLast && (feedback || alreadyAnswered) && (
              <button
                disabled={finalize.isPending}
                onClick={() => finalize.mutate()}
                className="inline-flex items-center gap-2 rounded-md px-5 py-2 font-semibold disabled:opacity-60"
                style={{ background: "var(--color-primary)", color: "white" }}
              >
                {finalize.isPending && <Loader2 className="size-4 animate-spin" />}
                Finish & see results
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MediaRecorderBox({
  kind, sessionId, questionId, onUploaded, onTranscript,
}: {
  kind: "audio" | "video";
  sessionId: string;
  questionId: string;
  onUploaded: (path: string) => void;
  onTranscript: (t: string) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const chunks = useRef<Blob[]>([]);
  const recorder = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => () => { streamRef.current?.getTracks().forEach((t) => t.stop()); }, []);

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia(kind === "video" ? { audio: true, video: true } : { audio: true });
    streamRef.current = stream;
    if (videoRef.current && kind === "video") { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}); }
    const mime = kind === "video" ? "video/webm" : "audio/webm";
    const mr = new MediaRecorder(stream, { mimeType: mime });
    chunks.current = [];
    mr.ondataavailable = (e) => { if (e.data.size) chunks.current.push(e.data); };
    mr.onstop = async () => {
      const blob = new Blob(chunks.current, { type: mime });
      setPreviewUrl(URL.createObjectURL(blob));
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setUploading(true);
      try {
        const ext = kind === "video" ? "webm" : "webm";
        const path = `${sessionId}/${questionId}.${ext}`;
        const { data: u } = await supabase.auth.getUser();
        const fullPath = `${u.user?.id ?? "anon"}/${path}`;
        const { error } = await supabase.storage.from("interview-media").upload(fullPath, blob, { upsert: true, contentType: mime });
        if (!error) onUploaded(fullPath);
      } finally {
        setUploading(false);
      }
    };
    mr.start();
    recorder.current = mr;
    setRecording(true);
  }
  function stop() { recorder.current?.stop(); setRecording(false); }

  return (
    <div className="mt-4 rounded-md border bg-muted/20 p-3">
      {kind === "video" && (
        <div className="mb-3 overflow-hidden rounded-md bg-black">
          <video ref={videoRef} muted playsInline className="aspect-video w-full" />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {!recording ? (
          <button type="button" onClick={start} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            {kind === "video" ? <Video className="size-4" /> : <Mic className="size-4" />} Start recording
          </button>
        ) : (
          <button type="button" onClick={stop} className="inline-flex items-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-white">
            <Square className="size-4" /> Stop
          </button>
        )}
        {uploading && <span className="text-xs text-muted-foreground">Uploading…</span>}
        <button type="button" onClick={() => onTranscript("(media submitted — type a short summary here)")} className="text-xs text-primary hover:underline">Insert placeholder text</button>
      </div>
      {previewUrl && (
        kind === "video"
          ? <video src={previewUrl} controls className="mt-3 w-full rounded-md" />
          : <audio src={previewUrl} controls className="mt-3 w-full" />
      )}
      <p className="mt-2 text-xs text-muted-foreground">Recording is uploaded privately. Add typed notes below — the AI scores those notes.</p>
    </div>
  );
}