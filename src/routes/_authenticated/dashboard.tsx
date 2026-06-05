import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyProfile } from "@/lib/profile.functions";
import { listMyCredentials } from "@/lib/assessments.functions";
import { listJobsPublic, listMyApplications } from "@/lib/jobs.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Learn & Earn" }] }),
  component: Dashboard,
});

function Dashboard() {
  const profileFn = useServerFn(getMyProfile);
  const credsFn = useServerFn(listMyCredentials);
  const jobsFn = useServerFn(listJobsPublic);
  const appsFn = useServerFn(listMyApplications);
  const profile = useQuery({ queryKey: ["me"], queryFn: () => profileFn() });
  const creds = useQuery({ queryKey: ["my-creds"], queryFn: () => credsFn() });
  const jobs = useQuery({ queryKey: ["jobs"], queryFn: () => jobsFn() });
  const apps = useQuery({ queryKey: ["my-apps"], queryFn: () => appsFn() });

  const p = profile.data?.profile;
  const isAdmin = profile.data?.isAdmin;

  return (
    <div className="page-enter">
      <section style={{ background: "var(--color-primary)" }} className="text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
          <div className="glass rounded-2xl p-6">
            <p className="text-sm text-white/80">Welcome back</p>
            <h1 className="mt-1 text-3xl font-bold text-white">{p?.name ?? "Engineer"}</h1>
            <p className="mt-1 text-sm text-white/80">{p?.discipline ? `Discipline: ${p.discipline}` : "Set your discipline in CV Builder"}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <Metric label="Credentials" value={creds.data?.length ?? 0} />
              <Metric label="Skills" value={p?.skills?.length ?? 0} />
              <Metric label="Applications" value={apps.data?.length ?? 0} />
              <Metric label="Live jobs" value={jobs.data?.length ?? 0} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="crossover grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-4">
          <QuickAction to="/learn" label="Start learning" />
          <QuickAction to="/assessments" label="Take assessment" />
          <QuickAction to="/cv-builder" label="Build CV" />
          <QuickAction to="/cv-parser" label="Parse resume" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Recent credentials">
            {creds.data?.length ? (
              <ul className="space-y-2 text-sm">
                {creds.data.slice(0, 5).map((c: any) => (
                  <li key={c.id} className="flex justify-between border-b pb-2 last:border-0">
                    <span>{c.credential_name}</span>
                    <span className="font-semibold">{c.score}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No credentials yet. <Link to="/assessments" className="underline">Take an assessment</Link>.</p>
            )}
          </Card>
          <Card title="My applications">
            {(apps.data?.length ?? 0) > 0 ? (
              <>
                <ul className="space-y-2 text-sm">
                  {apps.data!.slice(0, 5).map((a: any) => (
                    <li key={a.id} className="flex items-center justify-between gap-2 border-b pb-2 last:border-0">
                      <Link to="/jobs/$jobId" params={{ jobId: a.job?.id ?? "" }} className="truncate hover:underline">
                        {a.job?.job_title ?? "Job removed"} <span className="text-muted-foreground">— {a.job?.company}</span>
                      </Link>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${appColor(a.status)}`}>{a.status}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/my-applications" className="mt-3 inline-block text-sm" style={{ color: "var(--color-primary)" }}>Track all →</Link>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No applications yet. <Link to="/jobs" className="underline">Find a job</Link>.</p>
            )}
          </Card>
          <Card title="Latest jobs">
            <ul className="space-y-2 text-sm">
              {(jobs.data ?? []).slice(0, 5).map((j: any) => (
                <li key={j.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <Link to="/jobs/$jobId" params={{ jobId: j.id }} className="truncate hover:underline">{j.job_title} — <span className="text-muted-foreground">{j.company}</span></Link>
                  {j.is_remote ? <span className="rounded bg-muted px-2 py-0.5 text-xs">Remote</span> : null}
                </li>
              ))}
            </ul>
            <Link to="/jobs" className="mt-3 inline-block text-sm" style={{ color: "var(--color-primary)" }}>View all →</Link>
          </Card>
        </div>
        {isAdmin && (
          <div className="mt-6 rounded-xl border bg-white p-4">
            <h3 className="font-semibold">Admin tools</h3>
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              <Link to="/admin/dashboard" className="rounded-md border px-3 py-1.5">Admin dashboard</Link>
              <Link to="/admin/modules" className="rounded-md border px-3 py-1.5">Modules</Link>
              <Link to="/admin/jobs" className="rounded-md border px-3 py-1.5">Jobs</Link>
              <Link to="/admin/users" className="rounded-md border px-3 py-1.5">Users</Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/20 bg-white/10 p-4">
      <div className="text-xs uppercase tracking-wide text-white/80">{label}</div>
      <div className="mt-1 text-2xl font-bold text-white">{value}</div>
    </div>
  );
}
function QuickAction({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to as any} className="lift rounded-xl border p-4 text-center font-medium" style={{ borderColor: "var(--color-border)" }}>
      {label}
    </Link>
  );
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}
function appColor(s: string) {
  if (s === "accepted") return "bg-emerald-100 text-emerald-700";
  if (s === "rejected") return "bg-red-100 text-red-700";
  if (s === "reviewing") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}
