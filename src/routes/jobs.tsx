import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { applyToJob, listJobsPublic } from "@/lib/jobs.functions";
import { listRemoteJobsExternal } from "@/lib/external-jobs.functions";
import { useAuth } from "@/lib/auth-context";
import { ScrollReveal } from "@/components/ScrollReveal";
import { toast } from "sonner";
import { Briefcase, MapPin, Clock, GraduationCap, Star, Globe, ExternalLink, Radio } from "lucide-react";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Jobs in Bangladesh & Remote — TalentBD" },
      { name: "description", content: "Find IT, engineering, banking, and remote jobs on TalentBD — Bangladesh's learn-and-earn platform." },
      { property: "og:title", content: "Jobs — TalentBD" },
      { property: "og:url", content: "/jobs" },
    ],
    links: [{ rel: "canonical", href: "/jobs" }],
  }),
  component: Jobs,
});

const CATEGORIES = [
  "IT/Software", "Engineering", "Banking/Finance", "Marketing", "Sales",
  "Design", "Customer Service", "Healthcare", "Education", "General",
];

function Jobs() {
  const fn = useServerFn(listJobsPublic);
  const remoteFn = useServerFn(listRemoteJobsExternal);
  const applyFn = useServerFn(applyToJob);
  const qc = useQueryClient();
  const { user } = useAuth();
  const q = useQuery({ queryKey: ["jobs"], queryFn: () => fn(), staleTime: 60_000 });
  const remoteQ = useQuery({
    queryKey: ["remotive-jobs"],
    queryFn: () => remoteFn({ data: { limit: 12 } }),
    staleTime: 5 * 60_000,
  });


  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [location, setLocation] = useState("");
  const [exp, setExp] = useState("");
  const [type, setType] = useState("");
  const [remote, setRemote] = useState<"all" | "remote" | "onsite">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [cover, setCover] = useState("");

  // Sync from URL params on mount so deep-links like /jobs?remote=remote work
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const r = p.get("remote");
    if (r === "remote" || r === "onsite" || r === "all") setRemote(r);
    const c = p.get("category"); if (c) setCategory(c);
    const t = p.get("type"); if (t) setType(t);
    const s = p.get("search"); if (s) setSearch(s);
  }, []);

  const apply = useMutation({
    mutationFn: (jobId: string) => applyFn({ data: { jobId, coverNote: cover } }),
    onSuccess: () => { toast.success("Application submitted"); setOpenId(null); setCover(""); qc.invalidateQueries({ queryKey: ["my-apps"] }); },
    onError: (e: any) => toast.error(e.message),
  });


  const all = q.data ?? [];
  const filtered = useMemo(() => all.filter((j: any) => {
    const t = `${j.job_title} ${j.company} ${(j.requirements ?? []).join(" ")}`.toLowerCase();
    if (search && !t.includes(search.toLowerCase())) return false;
    if (category && j.category !== category) return false;
    if (location && !(j.location ?? "").toLowerCase().includes(location.toLowerCase())) return false;
    if (exp && j.experience_level !== exp) return false;
    if (type && j.job_type !== type) return false;
    if (remote === "remote" && !j.is_remote) return false;
    if (remote === "onsite" && j.is_remote) return false;
    return true;
  }), [all, search, category, location, exp, type, remote]);

  const featured = filtered.filter((j: any) => j.is_featured);
  const rest = filtered.filter((j: any) => !j.is_featured);
  const counts: Record<string, number> = {};
  for (const j of all) counts[j.category ?? "General"] = (counts[j.category ?? "General"] ?? 0) + 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 page-enter">
      <h1 className="text-3xl font-bold">Jobs marketplace</h1>
      <p className="mt-1 text-muted-foreground">Local Bangladesh roles + global remote engineering jobs.</p>

      {/* Category chips */}
      <ScrollReveal>
        <div className="mt-6 glass rounded-xl p-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Browse by category</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => setCategory("")} className={`rounded-full px-3 py-1.5 text-xs font-medium border ${category === "" ? "bg-primary text-white" : "bg-white/60"}`} style={category === "" ? { background: "var(--color-primary)", color: "white" } : {}}>All ({all.length})</button>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c === category ? "" : c)} className={`rounded-full px-3 py-1.5 text-xs font-medium border ${category === c ? "text-white" : "bg-white/60"}`} style={category === c ? { background: "var(--color-primary)", color: "white" } : {}}>
                {c} {counts[c] ? `(${counts[c]})` : ""}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Filters */}
      <div className="mt-4 glass rounded-xl p-4 grid gap-3 md:grid-cols-6">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, company, skill" className="md:col-span-2 rounded-md border px-3 py-2 text-sm bg-white/60" />
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="rounded-md border px-3 py-2 text-sm bg-white/60" />
        <select value={exp} onChange={(e) => setExp(e.target.value)} className="rounded-md border px-3 py-2 text-sm bg-white/60">
          <option value="">Any experience</option>
          <option>Entry-level</option><option>Mid-level</option><option>Senior</option>
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-md border px-3 py-2 text-sm bg-white/60">
          <option value="">Any type</option>
          <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
        </select>
        <select value={remote} onChange={(e) => setRemote(e.target.value as any)} className="rounded-md border px-3 py-2 text-sm bg-white/60">
          <option value="all">All</option><option value="remote">Remote</option><option value="onsite">On-site</option>
        </select>
      </div>

      {featured.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Star className="size-4 text-amber-500" /> Featured / Hot jobs</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {featured.map((j: any, i: number) => (
              <ScrollReveal key={j.id} delay={(i % 4) * 60}><JobCard j={j} onApply={() => setOpenId(j.id)} canApply={!!user} /></ScrollReveal>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold">{featured.length ? "All jobs" : "Open positions"}</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {rest.map((j: any, i: number) => (
            <ScrollReveal key={j.id} delay={(i % 4) * 60}><JobCard j={j} onApply={() => setOpenId(j.id)} canApply={!!user} /></ScrollReveal>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground">No jobs match those filters.</p>}
        </div>
      </section>

      {/* Live Remote Jobs — pulled live from Remotive public API */}
      <section className="mt-12">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Globe className="size-5" style={{ color: "var(--color-primary)" }} />
            Live remote jobs
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              <Radio className="size-3 animate-pulse" /> Live
            </span>
          </h2>
          <span className="text-xs text-muted-foreground">Powered by Remotive · refreshed every 5 minutes</span>
        </div>

        {remoteQ.isLoading && <p className="mt-4 text-sm text-muted-foreground">Fetching live remote jobs…</p>}
        {!remoteQ.isLoading && (remoteQ.data?.length ?? 0) === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">Live feed is taking a break — check back soon.</p>
        )}

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(remoteQ.data ?? []).map((j: any, i: number) => (
            <ScrollReveal key={j.id} delay={(i % 6) * 40}>
              <a href={j.url ?? "#"} target="_blank" rel="noreferrer" className="lift glass rounded-xl p-5 h-full flex flex-col">
                <div className="flex items-start gap-3">
                  {j.company_logo ? (
                    <img src={j.company_logo} alt={j.company} className="size-10 rounded-md object-contain bg-white" />
                  ) : (
                    <div className="size-10 rounded-md grid place-items-center bg-white/70 font-bold text-sm" style={{ color: "var(--color-primary)" }}>
                      {j.company?.[0] ?? "?"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold leading-tight line-clamp-2">{j.title}</h3>
                    <p className="text-xs text-muted-foreground truncate">{j.company}</p>
                  </div>
                  <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
                </div>
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {j.category && <span>{j.category}</span>}
                  {j.job_type && <span>· {j.job_type}</span>}
                  <span>· 🌍 {j.location}</span>
                </div>
                {j.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {j.tags.slice(0, 4).map((t: string) => (
                      <span key={t} className="rounded border bg-white/60 px-2 py-0.5 text-[11px]">{t}</span>
                    ))}
                  </div>
                )}
                {j.salary && <p className="mt-3 text-sm font-medium" style={{ color: "var(--color-primary)" }}>{j.salary}</p>}
              </a>
            </ScrollReveal>
          ))}
        </div>
      </section>


      {openId && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setOpenId(null)}>
          <div className="glass rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold">Apply to this job</h3>
            <p className="mt-1 text-xs text-muted-foreground">Add a short cover note (optional).</p>
            <textarea value={cover} onChange={(e) => setCover(e.target.value)} rows={5} className="mt-3 w-full rounded-md border px-3 py-2 text-sm" placeholder="Why you're a great fit…" />
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setOpenId(null)} className="rounded-md border px-3 py-1.5 text-sm">Cancel</button>
              <button onClick={() => apply.mutate(openId)} disabled={apply.isPending} className="rounded-md px-3 py-1.5 text-sm font-semibold text-white" style={{ background: "var(--color-primary)" }}>{apply.isPending ? "Submitting…" : "Submit application"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function JobCard({ j, onApply, canApply }: { j: any; onApply: () => void; canApply: boolean }) {
  const deadline = j.application_deadline ? new Date(j.application_deadline) : null;
  const daysLeft = deadline ? Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
  return (
    <article className="lift glass rounded-xl p-5 h-full">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold">{j.job_title}</h3>
          <p className="text-sm text-muted-foreground">{j.company}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {j.is_featured && <span className="badge-featured">Hot</span>}
          {j.is_live && <span className="badge-live">Live</span>}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {j.location && <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{j.location}</span>}
        {j.is_remote && <span className="rounded bg-emerald-100 text-emerald-700 px-2 py-0.5">Remote</span>}
        {j.job_type && <span className="inline-flex items-center gap-1"><Briefcase className="size-3" />{j.job_type}</span>}
        {j.experience_level && <span className="inline-flex items-center gap-1"><GraduationCap className="size-3" />{j.experience_level}</span>}
        {daysLeft !== null && <span className={`inline-flex items-center gap-1 ${daysLeft <= 3 ? "text-destructive font-semibold" : ""}`}><Clock className="size-3" />{daysLeft > 0 ? `${daysLeft}d left` : "Closed"}</span>}
      </div>
      {j.description && <p className="mt-2 text-sm line-clamp-2">{j.description}</p>}
      <div className="mt-3 flex flex-wrap gap-1">
        {(j.requirements ?? []).slice(0, 6).map((r: string) => (
          <span key={r} className="rounded border bg-white/60 px-2 py-0.5 text-xs">{r}</span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        {j.salary_range && <p className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>{j.salary_range}</p>}
        {canApply ? (
          <button onClick={onApply} className="ml-auto rounded-md px-3 py-1.5 text-sm font-semibold text-white" style={{ background: "var(--color-primary)" }}>Apply now</button>
        ) : (
          <a href="/auth" className="ml-auto rounded-md border px-3 py-1.5 text-sm font-semibold">Sign in to apply</a>
        )}
      </div>
    </article>
  );
}
