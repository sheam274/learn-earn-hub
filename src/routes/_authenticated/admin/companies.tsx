import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { adminDeleteCompany, adminListCompanies, adminUpsertCompany } from "@/lib/jobs.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/companies")({
  head: () => ({ meta: [{ title: "Admin · Companies — TalentBD" }] }),
  component: AdminCompanies,
});

const empty = { name: "", slug: "", logo_url: "", website: "", industry: "", location: "", description: "" };

function AdminCompanies() {
  const listFn = useServerFn(adminListCompanies);
  const upFn = useServerFn(adminUpsertCompany);
  const delFn = useServerFn(adminDeleteCompany);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-companies"], queryFn: () => listFn() });
  const [form, setForm] = useState<any>(empty);

  const save = useMutation({
    mutationFn: () => upFn({ data: form }),
    onSuccess: () => { toast.success("Saved"); setForm(empty); qc.invalidateQueries({ queryKey: ["admin-companies"] }); },
    onError: (e: any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-companies"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        {(q.data ?? []).map((c: any) => (
          <div key={c.id} className="glass rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">{c.name}</h3>
              <p className="text-xs text-muted-foreground">/{c.slug} · {c.industry ?? "—"} · {c.location ?? "—"}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setForm(c)} className="rounded-md border px-3 py-1.5 text-xs">Edit</button>
              <button onClick={() => del.mutate(c.id)} className="rounded-md border px-3 py-1.5 text-xs text-destructive">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <aside className="glass rounded-xl p-4 h-fit">
        <h3 className="font-semibold">{form.id ? "Edit company" : "New company"}</h3>
        <div className="mt-3 space-y-2 text-sm">
          {[
            ["name", "Name"], ["slug", "Slug (lowercase-dashes)"], ["industry", "Industry"],
            ["location", "Location"], ["logo_url", "Logo URL"], ["website", "Website URL"],
          ].map(([k, label]) => (
            <input key={k} placeholder={label} value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="w-full rounded-md border px-3 py-1.5" />
          ))}
          <textarea placeholder="Description" value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-md border px-3 py-1.5" rows={3} />
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={() => save.mutate()} className="rounded-md px-3 py-1.5 text-sm font-semibold text-white" style={{ background: "var(--color-primary)" }}>Save</button>
          {form.id && <button onClick={() => setForm(empty)} className="rounded-md border px-3 py-1.5 text-sm">New</button>}
        </div>
      </aside>
    </div>
  );
}
