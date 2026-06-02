import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMyApplications, withdrawApplication } from "@/lib/jobs.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/my-applications")({
  head: () => ({ meta: [{ title: "My Applications — TalentBD" }, { name: "description", content: "Track jobs you've applied to on TalentBD." }] }),
  component: MyApps,
});

function statusColor(s: string) {
  if (s === "accepted") return "bg-emerald-100 text-emerald-700";
  if (s === "rejected") return "bg-red-100 text-red-700";
  if (s === "reviewing") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

function MyApps() {
  const listFn = useServerFn(listMyApplications);
  const withdrawFn = useServerFn(withdrawApplication);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["my-apps"], queryFn: () => listFn() });
  const m = useMutation({
    mutationFn: (id: string) => withdrawFn({ data: { id } }),
    onSuccess: () => { toast.success("Application withdrawn"); qc.invalidateQueries({ queryKey: ["my-apps"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 page-enter">
      <h1 className="text-3xl font-bold">My Applications</h1>
      <p className="mt-1 text-muted-foreground">Jobs you've applied to and where they stand.</p>

      <div className="mt-6 space-y-3">
        {(q.data ?? []).map((a: any) => (
          <div key={a.id} className="glass rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">{a.job?.job_title ?? "Job removed"}</h3>
              <p className="text-sm text-muted-foreground">{a.job?.company} · {a.job?.location ?? (a.job?.is_remote ? "Remote" : "—")}</p>
              <p className="mt-1 text-xs text-muted-foreground">Applied {new Date(a.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(a.status)}`}>{a.status}</span>
              <button onClick={() => m.mutate(a.id)} className="rounded-md border px-3 py-1.5 text-xs hover:bg-white/60">Withdraw</button>
            </div>
          </div>
        ))}
        {(q.data ?? []).length === 0 && <p className="text-sm text-muted-foreground">You haven't applied to any jobs yet. <a href="/jobs" className="underline">Browse jobs</a>.</p>}
      </div>
    </div>
  );
}
