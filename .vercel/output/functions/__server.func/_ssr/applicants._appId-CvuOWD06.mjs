import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { k as Route, a as useServerFn } from "./router-B8OUd1qE.mjs";
import { h as employerGetApplication, f as updateApplicationStage } from "./employer.functions-DBgtNhCp.mjs";
import { l as listMessages, s as sendMessage, c as scheduleInterview, d as listInvitations, i as issueAppointmentLetter, e as listLettersForApp } from "./hiring.functions-BXo_Q1ek.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
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
import "./client-Bnm4-7qk.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./server-XhNC2-Ux.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-BkCqN-4J.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/zod.mjs";
const STAGES = ["applied", "screening", "interview", "offer", "hired", "rejected"];
function Page() {
  const {
    appId
  } = Route.useParams();
  const getFn = useServerFn(employerGetApplication);
  const stageFn = useServerFn(updateApplicationStage);
  const msgsFn = useServerFn(listMessages);
  const sendFn = useServerFn(sendMessage);
  const schedFn = useServerFn(scheduleInterview);
  const invFn = useServerFn(listInvitations);
  const issueFn = useServerFn(issueAppointmentLetter);
  const lettersFn = useServerFn(listLettersForApp);
  const qc = useQueryClient();
  const app = useQuery({
    queryKey: ["emp-app", appId],
    queryFn: () => getFn({
      data: {
        id: appId
      }
    })
  });
  const msgs = useQuery({
    queryKey: ["msgs", appId],
    queryFn: () => msgsFn({
      data: {
        applicationId: appId
      }
    }),
    refetchInterval: 8e3
  });
  const inv = useQuery({
    queryKey: ["inv", appId],
    queryFn: () => invFn({
      data: {
        applicationId: appId
      }
    })
  });
  const letters = useQuery({
    queryKey: ["letters", appId],
    queryFn: () => lettersFn({
      data: {
        applicationId: appId
      }
    })
  });
  const [msg, setMsg] = reactExports.useState("");
  const [schedule, setSchedule] = reactExports.useState({
    scheduledAt: "",
    meetingUrl: "",
    provider: "Zoom",
    notes: ""
  });
  const [offer, setOffer] = reactExports.useState({
    position: "",
    salary: "",
    startDate: "",
    body: ""
  });
  const sendM = useMutation({
    mutationFn: () => sendFn({
      data: {
        applicationId: appId,
        body: msg
      }
    }),
    onSuccess: () => {
      setMsg("");
      qc.invalidateQueries({
        queryKey: ["msgs", appId]
      });
    }
  });
  const stageM = useMutation({
    mutationFn: (s) => stageFn({
      data: {
        id: appId,
        stage: s
      }
    }),
    onSuccess: () => {
      toast.success("Stage updated");
      qc.invalidateQueries({
        queryKey: ["emp-app", appId]
      });
    }
  });
  const schedM = useMutation({
    mutationFn: () => schedFn({
      data: {
        applicationId: appId,
        ...schedule
      }
    }),
    onSuccess: () => {
      toast.success("Interview scheduled");
      setSchedule({
        scheduledAt: "",
        meetingUrl: "",
        provider: "Zoom",
        notes: ""
      });
      qc.invalidateQueries({
        queryKey: ["inv", appId]
      });
      qc.invalidateQueries({
        queryKey: ["emp-app", appId]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const issueM = useMutation({
    mutationFn: () => issueFn({
      data: {
        applicationId: appId,
        ...offer
      }
    }),
    onSuccess: () => {
      toast.success("Appointment letter issued");
      setOffer({
        position: "",
        salary: "",
        startDate: "",
        body: ""
      });
      qc.invalidateQueries({
        queryKey: ["letters", appId]
      });
      qc.invalidateQueries({
        queryKey: ["emp-app", appId]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  if (app.isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Loading…" });
  const a = app.data;
  if (!a) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Applicant not found." });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-5 lg:grid-cols-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-1 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-white p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: a.applicant?.name ?? "Candidate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: a.applicant?.discipline }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Job:" }),
          " ",
          a.job?.job_title
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Applied:" }),
          " ",
          new Date(a.created_at).toLocaleDateString()
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase font-medium text-muted-foreground", children: "Stage" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { defaultValue: a.stage ?? a.status, onChange: (e) => stageM.mutate(e.target.value), className: "mt-1 w-full rounded-md border px-2 py-1 text-sm", children: STAGES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s)) })
        ] }),
        a.cover_note && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 rounded-md bg-muted p-2 text-xs whitespace-pre-wrap", children: a.cover_note })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-white p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Schedule video interview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Paste any external meeting link (Zoom, Meet, Teams)." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "datetime-local", value: schedule.scheduledAt, onChange: (e) => setSchedule({
            ...schedule,
            scheduledAt: e.target.value
          }), className: "w-full rounded-md border px-2 py-1.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "https://zoom.us/j/...", value: schedule.meetingUrl, onChange: (e) => setSchedule({
            ...schedule,
            meetingUrl: e.target.value
          }), className: "w-full rounded-md border px-2 py-1.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Provider (Zoom/Meet/Teams)", value: schedule.provider, onChange: (e) => setSchedule({
            ...schedule,
            provider: e.target.value
          }), className: "w-full rounded-md border px-2 py-1.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { placeholder: "Notes for the candidate", rows: 2, value: schedule.notes, onChange: (e) => setSchedule({
            ...schedule,
            notes: e.target.value
          }), className: "w-full rounded-md border px-2 py-1.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => schedM.mutate(), disabled: !schedule.scheduledAt || !schedule.meetingUrl, className: "w-full rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground disabled:opacity-60", children: "Send invite" })
        ] }),
        (inv.data ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-1 text-xs", children: (inv.data ?? []).map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded border p-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: new Date(i.scheduled_at).toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: i.meeting_url, target: "_blank", rel: "noreferrer", className: "text-primary underline", children: i.provider ?? "Meeting link" })
        ] }, i.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-white p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Issue appointment letter" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Position title", value: offer.position, onChange: (e) => setOffer({
            ...offer,
            position: e.target.value
          }), className: "w-full rounded-md border px-2 py-1.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Salary (e.g. BDT 80,000 / month)", value: offer.salary, onChange: (e) => setOffer({
            ...offer,
            salary: e.target.value
          }), className: "w-full rounded-md border px-2 py-1.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: offer.startDate, onChange: (e) => setOffer({
            ...offer,
            startDate: e.target.value
          }), className: "w-full rounded-md border px-2 py-1.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { placeholder: "Letter body…", rows: 5, value: offer.body, onChange: (e) => setOffer({
            ...offer,
            body: e.target.value
          }), className: "w-full rounded-md border px-2 py-1.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => issueM.mutate(), disabled: !offer.position || !offer.body, className: "w-full rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground disabled:opacity-60", children: "Send appointment letter" })
        ] }),
        (letters.data ?? []).map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 rounded border p-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: l.position }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/appointment/$letterId", params: {
            letterId: l.id
          }, className: "text-primary underline", children: "View letter" }),
          l.accepted_at && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-emerald-600", children: "Accepted" })
        ] }, l.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 rounded-xl border bg-white p-4 flex flex-col", style: {
      minHeight: 500
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Messages" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex-1 space-y-2 overflow-y-auto", children: [
        (msgs.data ?? []).map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.sender_id === a.user_id ? "bg-muted" : "ml-auto bg-primary text-primary-foreground"}`, children: [
          m.body,
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[10px] opacity-70", children: new Date(m.created_at).toLocaleString() })
        ] }, m.id)),
        (msgs.data ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No messages yet." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: msg, onChange: (e) => setMsg(e.target.value), placeholder: "Type a message…", className: "flex-1 rounded-md border px-3 py-2 text-sm", onKeyDown: (e) => e.key === "Enter" && msg && sendM.mutate() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => sendM.mutate(), disabled: !msg, className: "rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60", children: "Send" })
      ] })
    ] })
  ] });
}
export {
  Page as component
};
