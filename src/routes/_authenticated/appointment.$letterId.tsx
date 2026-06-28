import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getLetter, acceptLetter } from "@/lib/hiring.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/appointment/$letterId")({
  head: () => ({ meta: [{ title: "Appointment letter" }] }),
  component: Page,
});

function Page() {
  const { letterId } = Route.useParams();
  const fn = useServerFn(getLetter);
  const acceptFn = useServerFn(acceptLetter);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["letter", letterId], queryFn: () => fn({ data: { id: letterId } }) });
  const m = useMutation({
    mutationFn: () => acceptFn({ data: { id: letterId } }),
    onSuccess: () => { toast.success("Offer accepted!"); qc.invalidateQueries({ queryKey: ["letter", letterId] }); },
    onError: (e: any) => toast.error(e.message),
  });

  if (q.isLoading) return <p className="p-10 text-center">Loading…</p>;
  const l: any = q.data;
  if (!l) return <p className="p-10 text-center">Letter not found.</p>;

  const canAccept = !l.accepted_at;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 page-enter">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-xl font-bold">Appointment Letter</h1>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="rounded-md border px-3 py-1.5 text-sm">Print / Save PDF</button>
          {canAccept && <button onClick={() => m.mutate()} className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">Accept offer</button>}
        </div>
      </div>

      <article className="mt-5 rounded-xl border bg-white p-8 shadow-sm">
        <header className="border-b pb-4">
          <h2 className="text-2xl font-bold">{l.application?.job?.company ?? "Company"}</h2>
          <p className="text-sm text-muted-foreground">Letter of Appointment</p>
          <p className="mt-2 text-xs text-muted-foreground">Issued {new Date(l.issued_at).toLocaleDateString()}</p>
        </header>
        <section className="mt-4 space-y-2 text-sm">
          <p><strong>To:</strong> {l.application?.applicant?.name ?? "Candidate"}</p>
          <p><strong>Position:</strong> {l.position}</p>
          {l.salary && <p><strong>Compensation:</strong> {l.salary}</p>}
          {l.start_date && <p><strong>Start date:</strong> {new Date(l.start_date).toLocaleDateString()}</p>}
        </section>
        <section className="mt-5 whitespace-pre-wrap text-sm leading-7">{l.body}</section>
        {l.accepted_at && <p className="mt-6 rounded-md badge-success p-3 text-sm">Accepted on {new Date(l.accepted_at).toLocaleString()}</p>}
      </article>
    </div>
  );
}