import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { adminListJobs, adminUpsertJob, adminToggleJobLive, adminDeleteJob } from "@/lib/jobs.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/jobs")({
  head: () => ({ meta: [{ title: "Admin — Jobs" }] }),
  component: AdminJobs,
});

function AdminJobs() {
  const listFn = useServerFn(adminListJobs);
  const upFn = useServerFn(adminUpsertJob);
  const toggleFn = useServerFn(adminToggleJobLive);
  const delFn = useServerFn(adminDeleteJob);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-jobs"], queryFn: () => listFn() });
  const [f, setF] = useState({ id: "", job_title: "", company: "", description: "", salary_range: "", discipline: "cse", is_remote: false, is_live: true, requirements: "" });

  const save = useMutation({
    mutationFn: () => upFn({ data: { id: f.id || undefined, job_title: f.job_title, company: f.company, description: f.description, salary_range: f.salary_range, discipline: f.discipline, is_remote: f.is_remote, is_live: f.is_live, requirements: f.requirements.split(",").map((s) => s.trim()).filter(Boolean) } }),
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["admin-jobs"] }); qc.invalidateQueries({ queryKey: ["jobs"] }); setF({ id: "", job_title: "", company: "", description: "", salary_range: "", discipline: "cse", is_remote: false, is_live: true, requirements: "" }); },
    onError: (e: any) => toast.error(e.message),
  });
  const toggle = useMutation({ mutationFn: (j: any) => toggleFn({ data: { id: j.id, is_live: !j.is_live } }), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-jobs"] }) });
  const del = useMutation({ mutationFn: (id: string) => delFn({ data: { id } }), onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-jobs"] }); } });

  return (
    <div>
      <h1 className="text-2xl font-bold">Jobs</h1>
      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 space-y-2 text-sm">
          <h2 className="font-semibold">{f.id ? "Edit" : "Add"} job</h2>
          <input placeholder="Job title" value={f.job_title} onChange={(e) => setF({ ...f, job_title: e.target.value })} className="w-full rounded-md border px-3 py-2" />
          <input placeholder="Company" value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} className="w-full rounded-md border px-3 py-2" />
          <textarea placeholder="Description" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="w-full rounded-md border px-3 py-2" />
          <input placeholder="Salary range" value={f.salary_range} onChange={(e) => setF({ ...f, salary_range: e.target.value })} className="w-full rounded-md border px-3 py-2" />
          <input placeholder="Requirements (comma sep)" value={f.requirements} onChange={(e) => setF({ ...f, requirements: e.target.value })} className="w-full rounded-md border px-3 py-2" />
          <select value={f.discipline} onChange={(e) => setF({ ...f, discipline: e.target.value })} className="w-full rounded-md border px-3 py-2">
            <option value="cse">CSE</option><option value="eee">EEE</option><option value="civil">Civil</option>
          </select>
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.is_remote} onChange={(e) => setF({ ...f, is_remote: e.target.checked })} /> Remote</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.is_live} onChange={(e) => setF({ ...f, is_live: e.target.checked })} /> Live</label>
          <button onClick={() => save.mutate()} className="rounded-md px-4 py-2 font-semibold" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>Save</button>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <h2 className="font-semibold">All jobs</h2>
          <ul className="mt-3 divide-y text-sm">
            {(q.data ?? []).map((j: any) => (
              <li key={j.id} className="flex items-center justify-between gap-2 py-2">
                <div>
                  <p className="font-medium">{j.job_title} {j.is_live && <span className="badge-live ml-1">Live</span>}</p>
                  <p className="text-xs text-muted-foreground">{j.company} · {j.is_remote ? "Remote" : "On-site"}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setF({ id: j.id, job_title: j.job_title ?? "", company: j.company ?? "", description: j.description ?? "", salary_range: j.salary_range ?? "", discipline: j.discipline ?? "cse", is_remote: !!j.is_remote, is_live: !!j.is_live, requirements: (j.requirements ?? []).join(", ") })} className="rounded-md border px-2 py-1 text-xs">Edit</button>
                  <button onClick={() => toggle.mutate(j)} className="rounded-md border px-2 py-1 text-xs">{j.is_live ? "Unpublish" : "Publish"}</button>
                  <button onClick={() => del.mutate(j.id)} className="rounded-md px-2 py-1 text-xs text-white" style={{ background: "var(--color-destructive)" }}>Del</button>
                </div>
              </li>

            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
