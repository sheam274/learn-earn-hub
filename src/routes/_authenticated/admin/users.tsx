import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListUsers, adminSetRole, adminAdjustCredential } from "@/lib/admin.functions";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({ meta: [{ title: "Admin — Users" }] }),
  component: AdminUsers,
});

function AdminUsers() {
  const listFn = useServerFn(adminListUsers);
  const roleFn = useServerFn(adminSetRole);
  const credFn = useServerFn(adminAdjustCredential);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-users"], queryFn: () => listFn() });
  const [credForm, setCredForm] = useState<{ userId: string; name: string; score: string }>({ userId: "", name: "", score: "100" });

  const setRole = useMutation({
    mutationFn: (v: { userId: string; grant: boolean }) => roleFn({ data: { userId: v.userId, role: "admin", grant: v.grant } }),
    onSuccess: () => { toast.success("Role updated"); qc.invalidateQueries({ queryKey: ["admin-users"] }); },
    onError: (e: any) => toast.error(e.message),
  });
  const addCred = useMutation({
    mutationFn: () => credFn({ data: { userId: credForm.userId, credentialName: credForm.name, score: Number(credForm.score) } }),
    onSuccess: () => { toast.success("Credential added"); qc.invalidateQueries({ queryKey: ["admin-users"] }); setCredForm({ userId: "", name: "", score: "100" }); },
  });

  if (q.isLoading) return <p>Loading…</p>;
  const data = q.data;
  const isAdmin = (uid: string) => data?.roles.some((r: any) => r.user_id === uid && r.role === "admin");

  return (
    <div>
      <h1 className="text-2xl font-bold">Users</h1>
      <div className="mt-5 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-xs uppercase">
            <tr><th className="p-3">Name</th><th className="p-3">Discipline</th><th className="p-3">Credentials</th><th className="p-3">Role</th><th className="p-3">Actions</th></tr>
          </thead>
          <tbody>
            {data?.profiles.map((p: any) => {
              const userCreds = data.credentials.filter((c: any) => c.user_id === p.id);
              return (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.name ?? "—"}</td>
                  <td className="p-3">{p.discipline ?? "—"}</td>
                  <td className="p-3">{userCreds.length}</td>
                  <td className="p-3">{isAdmin(p.id) ? <span className="rounded bg-muted px-2 py-0.5 text-xs">Admin</span> : "Student"}</td>
                  <td className="p-3">
                    <button onClick={() => setRole.mutate({ userId: p.id, grant: !isAdmin(p.id) })} className="rounded-md border px-2 py-1 text-xs">
                      {isAdmin(p.id) ? "Revoke admin" : "Grant admin"}
                    </button>
                    <button onClick={() => setCredForm({ userId: p.id, name: "", score: "100" })} className="ml-2 rounded-md border px-2 py-1 text-xs">Add credential</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {credForm.userId && (
        <div className="mt-5 max-w-md rounded-xl border bg-white p-4">
          <h3 className="font-semibold">Add credential</h3>
          <input placeholder="Credential name" value={credForm.name} onChange={(e) => setCredForm({ ...credForm, name: e.target.value })} className="mt-2 w-full rounded-md border px-3 py-2 text-sm" />
          <input type="number" min="0" max="100" value={credForm.score} onChange={(e) => setCredForm({ ...credForm, score: e.target.value })} className="mt-2 w-full rounded-md border px-3 py-2 text-sm" />
          <div className="mt-3 flex gap-2">
            <button onClick={() => addCred.mutate()} disabled={!credForm.name} className="rounded-md px-3 py-1.5 text-sm font-semibold" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>Save</button>
            <button onClick={() => setCredForm({ userId: "", name: "", score: "100" })} className="rounded-md border px-3 py-1.5 text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
