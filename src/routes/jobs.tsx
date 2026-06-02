import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listJobsPublic } from "@/lib/jobs.functions";

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "Engineering Jobs — Learn & Earn" }, { name: "description", content: "Local and global engineering job listings." }] }),
  component: Jobs,
});

function Jobs() {
  const fn = useServerFn(listJobsPublic);
  const q = useQuery({ queryKey: ["jobs"], queryFn: () => fn() });
  const [search, setSearch] = useState("");
  const [remote, setRemote] = useState<"all" | "remote" | "onsite">("all");

  const filtered = (q.data ?? []).filter((j: any) => {
    const t = `${j.job_title} ${j.company} ${(j.requirements ?? []).join(" ")}`.toLowerCase();
    if (search && !t.includes(search.toLowerCase())) return false;
    if (remote === "remote" && !j.is_remote) return false;
    if (remote === "onsite" && j.is_remote) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 page-enter">
      <h1 className="text-3xl font-bold">Jobs marketplace</h1>
      <p className="mt-1 text-muted-foreground">Local Bangladesh roles + global remote engineering jobs.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, company, skill" className="flex-1 min-w-64 rounded-md border px-3 py-2 text-sm" />
        <select value={remote} onChange={(e) => setRemote(e.target.value as any)} className="rounded-md border px-3 py-2 text-sm">
          <option value="all">All</option>
          <option value="remote">Remote only</option>
          <option value="onsite">On-site only</option>
        </select>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {filtered.map((j: any) => (
          <article key={j.id} className="lift rounded-xl border bg-white p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">{j.job_title}</h3>
                <p className="text-sm text-muted-foreground">{j.company}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {j.is_live && <span className="badge-live">Live</span>}
                {j.is_remote && <span className="rounded bg-muted px-2 py-0.5 text-xs">Remote</span>}
              </div>
            </div>
            {j.description && <p className="mt-2 text-sm">{j.description}</p>}
            <div className="mt-3 flex flex-wrap gap-1">
              {(j.requirements ?? []).map((r: string) => (
                <span key={r} className="rounded border px-2 py-0.5 text-xs">{r}</span>
              ))}
            </div>
            {j.salary_range && <p className="mt-3 text-sm font-medium" style={{ color: "var(--color-primary)" }}>{j.salary_range}</p>}
          </article>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground">No jobs match those filters.</p>}
      </div>
    </div>
  );
}
