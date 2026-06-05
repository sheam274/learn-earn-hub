import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { applyToJob, getJobPublic, getMyApplicationForJob } from "@/lib/jobs.functions";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import {
  Briefcase, MapPin, Clock, GraduationCap, Star, ArrowLeft, Building2, DollarSign, CalendarDays, CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/jobs/$jobId")({
  head: ({ params }) => ({
    meta: [
      { title: `Job details — TalentBD` },
      { name: "description", content: "View full job details and apply on TalentBD." },
    ],
    links: [{ rel: "canonical", href: `/jobs/${params.jobId}` }],
  }),
  component: JobDetails,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Couldn't load this job</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <Link to="/jobs" className="mt-4 inline-block underline">Back to jobs</Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Job not found</h1>
      <Link to="/jobs" className="mt-4 inline-block underline">Back to jobs</Link>
    </div>
  ),
});

function statusColor(s: string) {
  if (s === "accepted") return "bg-emerald-100 text-emerald-700";
  if (s === "rejected") return "bg-red-100 text-red-700";
  if (s === "reviewing") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

function JobDetails() {
  const { jobId } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();

  const getJobFn = useServerFn(getJobPublic);
  const getAppFn = useServerFn(getMyApplicationForJob);
  const applyFn = useServerFn(applyToJob);

  const jobQ = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJobFn({ data: { id: jobId } }),
  });
  const appQ = useQuery({
    queryKey: ["my-app", jobId],
    queryFn: () => getAppFn({ data: { jobId } }),
    enabled: !!user,
  });

  const [cover, setCover] = useState("");
  const [open, setOpen] = useState(false);

  const apply = useMutation({
    mutationFn: () => applyFn({ data: { jobId, coverNote: cover } }),
    onSuccess: () => {
      toast.success("Application submitted");
      setOpen(false);
      setCover("");
      qc.invalidateQueries({ queryKey: ["my-app", jobId] });
      qc.invalidateQueries({ queryKey: ["my-apps"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (jobQ.isLoading) return <p className="mx-auto max-w-4xl px-4 py-10 text-sm text-muted-foreground">Loading job…</p>;
  const j = jobQ.data;
  if (!j) return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Job not found</h1>
      <Link to="/jobs" className="mt-4 inline-block underline">Back to jobs</Link>
    </div>
  );

  const deadline = j.application_deadline ? new Date(j.application_deadline) : null;
  const daysLeft = deadline ? Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
  const alreadyApplied = !!appQ.data;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 page-enter">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline">
        <ArrowLeft className="size-4" /> Back to jobs
      </Link>

      <div className="mt-4 glass rounded-2xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold md:text-3xl">{j.job_title}</h1>
              {j.is_featured && <span className="badge-featured inline-flex items-center gap-1"><Star className="size-3" />Hot</span>}
              {j.is_live && <span className="badge-live">Live</span>}
            </div>
            <p className="mt-1 inline-flex items-center gap-1 text-muted-foreground">
              <Building2 className="size-4" /> {j.company}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {alreadyApplied ? (
              <div className="flex flex-col items-end gap-1">
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusColor(appQ.data!.status)}`}>
                  <CheckCircle2 className="size-3" /> Applied · {appQ.data!.status}
                </span>
                <Link to="/my-applications" className="text-xs underline text-muted-foreground">Track in dashboard →</Link>
              </div>
            ) : user ? (
              <button
                onClick={() => setOpen(true)}
                className="rounded-md px-5 py-2 text-sm font-semibold text-white shadow"
                style={{ background: "var(--color-primary)" }}
              >
                Apply for this job
              </button>
            ) : (
              <Link to="/auth" className="rounded-md border px-5 py-2 text-sm font-semibold">Sign in to apply</Link>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {j.location && <span className="inline-flex items-center gap-1"><MapPin className="size-4" />{j.location}</span>}
          {j.is_remote && <span className="rounded bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs">Remote</span>}
          {j.job_type && <span className="inline-flex items-center gap-1"><Briefcase className="size-4" />{j.job_type}</span>}
          {j.experience_level && <span className="inline-flex items-center gap-1"><GraduationCap className="size-4" />{j.experience_level}</span>}
          {j.salary_range && <span className="inline-flex items-center gap-1 font-medium" style={{ color: "var(--color-primary)" }}><DollarSign className="size-4" />{j.salary_range}</span>}
          {deadline && (
            <span className={`inline-flex items-center gap-1 ${daysLeft !== null && daysLeft <= 3 ? "text-destructive font-semibold" : ""}`}>
              <CalendarDays className="size-4" />
              Deadline {deadline.toLocaleDateString()} {daysLeft !== null && (daysLeft > 0 ? `(${daysLeft}d left)` : "(closed)")}
            </span>
          )}
          {j.created_at && <span className="inline-flex items-center gap-1"><Clock className="size-4" />Posted {new Date(j.created_at).toLocaleDateString()}</span>}
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <section className="glass rounded-xl p-6">
            <h2 className="text-lg font-semibold">Job description</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
              {j.description || "The hiring team hasn't added a full description yet. Reach out to learn more about this role."}
            </p>
          </section>

          {(j.requirements?.length ?? 0) > 0 && (
            <section className="glass rounded-xl p-6">
              <h2 className="text-lg font-semibold">Requirements & skills</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {j.requirements.map((r: string) => (
                  <li key={r} className="rounded-full border bg-white/60 px-3 py-1 text-xs">{r}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <div className="glass rounded-xl p-5">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">At a glance</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <Row k="Company" v={j.company} />
              <Row k="Location" v={j.location || (j.is_remote ? "Remote" : "—")} />
              <Row k="Type" v={j.job_type || "—"} />
              <Row k="Experience" v={j.experience_level || "—"} />
              <Row k="Category" v={j.category || "—"} />
              <Row k="Salary" v={j.salary_range || "—"} />
            </dl>
          </div>

          {!alreadyApplied && user && (
            <button
              onClick={() => setOpen(true)}
              className="w-full rounded-md px-4 py-3 text-sm font-semibold text-white shadow"
              style={{ background: "var(--color-primary)" }}
            >
              Apply for this job
            </button>
          )}
          {alreadyApplied && (
            <Link to="/my-applications" className="block w-full rounded-md border px-4 py-3 text-center text-sm font-semibold hover:bg-white/60">
              Track my application
            </Link>
          )}
        </aside>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div className="glass rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold">Apply to {j.job_title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">Add a short cover note (optional).</p>
            <textarea value={cover} onChange={(e) => setCover(e.target.value)} rows={5} className="mt-3 w-full rounded-md border px-3 py-2 text-sm" placeholder="Why you're a great fit…" />
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded-md border px-3 py-1.5 text-sm">Cancel</button>
              <button onClick={() => apply.mutate()} disabled={apply.isPending} className="rounded-md px-3 py-1.5 text-sm font-semibold text-white" style={{ background: "var(--color-primary)" }}>
                {apply.isPending ? "Submitting…" : "Submit application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}
