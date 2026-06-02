import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminStats } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin — Overview" }] }),
  component: AdminDash,
});

function AdminDash() {
  const fn = useServerFn(adminStats);
  const q = useQuery({ queryKey: ["admin-stats"], queryFn: () => fn() });
  const s = q.data ?? { users: 0, modules: 0, jobs: 0, credentials: 0 };
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin overview</h1>
      <div className="mt-5 grid gap-4 md:grid-cols-4">
        {Object.entries(s).map(([k, v]) => (
          <div key={k} className="rounded-xl border bg-white p-5">
            <div className="text-xs uppercase text-muted-foreground">{k}</div>
            <div className="mt-1 text-3xl font-bold">{v as number}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
