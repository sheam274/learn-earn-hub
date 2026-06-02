import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listModulesPublic, adminUpsertModule, adminDeleteModule } from "@/lib/learning.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/modules")({
  head: () => ({ meta: [{ title: "Admin — Modules" }] }),
  component: AdminModules,
});

function AdminModules() {
  const listFn = useServerFn(listModulesPublic);
  const upFn = useServerFn(adminUpsertModule);
  const delFn = useServerFn(adminDeleteModule);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["modules"], queryFn: () => listFn() });
  const [form, setForm] = useState({ id: "", discipline: "cse", section_slug: "", title: "", description: "", video_url: "", documentation_body: "" });

  const save = useMutation({
    mutationFn: () => upFn({ data: { ...form, id: form.id || undefined } as any }),
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["modules"] }); setForm({ id: "", discipline: "cse", section_slug: "", title: "", description: "", video_url: "", documentation_body: "" }); },
    onError: (e: any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["modules"] }); },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Modules</h1>
      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-5">
          <h2 className="font-semibold">{form.id ? "Edit" : "Add"} module</h2>
          <div className="mt-3 space-y-2 text-sm">
            <select value={form.discipline} onChange={(e) => setForm({ ...form, discipline: e.target.value })} className="w-full rounded-md border px-3 py-2">
              <option value="cse">CSE</option><option value="eee">EEE</option><option value="civil">Civil</option>
            </select>
            <input placeholder="section-slug" value={form.section_slug} onChange={(e) => setForm({ ...form, section_slug: e.target.value })} className="w-full rounded-md border px-3 py-2" />
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-md border px-3 py-2" />
            <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-md border px-3 py-2" />
            <input placeholder="YouTube embed URL" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} className="w-full rounded-md border px-3 py-2" />
            <textarea placeholder="Markdown documentation" rows={6} value={form.documentation_body} onChange={(e) => setForm({ ...form, documentation_body: e.target.value })} className="w-full rounded-md border px-3 py-2" />
            <button onClick={() => save.mutate()} disabled={save.isPending} className="rounded-md px-4 py-2 font-semibold" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
              {save.isPending ? "…" : "Save"}
            </button>
            {form.id && <button onClick={() => setForm({ id: "", discipline: "cse", section_slug: "", title: "", description: "", video_url: "", documentation_body: "" })} className="ml-2 rounded-md border px-4 py-2">Cancel</button>}
          </div>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <h2 className="font-semibold">Existing</h2>
          <ul className="mt-3 divide-y text-sm">
            {(q.data ?? []).map((m: any) => (
              <li key={m.id} className="flex items-center justify-between gap-2 py-2">
                <div>
                  <p className="font-medium">{m.title}</p>
                  <p className="text-xs text-muted-foreground">{m.discipline} / {m.section_slug}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setForm({ id: m.id, discipline: m.discipline, section_slug: m.section_slug, title: m.title, description: m.description ?? "", video_url: "", documentation_body: "" })} className="rounded-md border px-2 py-1 text-xs">Edit</button>
                  <button onClick={() => del.mutate(m.id)} className="rounded-md px-2 py-1 text-xs text-white" style={{ background: "var(--color-destructive)" }}>Del</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
