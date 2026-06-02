import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyProfile } from "@/lib/profile.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    // Component-level admin check; non-admins get redirected on render.
    return {};
  },
  component: AdminLayout,
});

function AdminLayout() {
  const fn = useServerFn(getMyProfile);
  const q = useQuery({ queryKey: ["me"], queryFn: () => fn() });

  if (q.isLoading) return <div className="p-10 text-center text-muted-foreground">Loading…</div>;
  if (!q.data?.isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Admin only</h1>
        <p className="mt-2 text-sm text-muted-foreground">You don't have admin privileges.</p>
        <Link to="/dashboard" className="mt-4 inline-block rounded-md border px-4 py-2 text-sm">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 page-enter">
      <nav className="mb-6 flex flex-wrap gap-2 border-b pb-3 text-sm">
        <Link to="/admin/dashboard" className="rounded-md border px-3 py-1.5" activeProps={{ style: { background: "var(--color-primary)", color: "white" } }}>Overview</Link>
        <Link to="/admin/modules" className="rounded-md border px-3 py-1.5" activeProps={{ style: { background: "var(--color-primary)", color: "white" } }}>Modules</Link>
        <Link to="/admin/jobs" className="rounded-md border px-3 py-1.5" activeProps={{ style: { background: "var(--color-primary)", color: "white" } }}>Jobs</Link>
        <Link to="/admin/users" className="rounded-md border px-3 py-1.5" activeProps={{ style: { background: "var(--color-primary)", color: "white" } }}>Users</Link>
      </nav>
      <Outlet />
    </div>
  );
}
