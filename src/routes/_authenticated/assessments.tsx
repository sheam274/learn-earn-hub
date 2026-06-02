import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listModulesPublic } from "@/lib/learning.functions";
import { listMyCredentials } from "@/lib/assessments.functions";

export const Route = createFileRoute("/_authenticated/assessments")({
  head: () => ({ meta: [{ title: "Assessments — Learn & Earn" }, { name: "description", content: "Take timed assessments to earn verified credentials." }] }),
  component: Assessments,
});

function Assessments() {
  const mFn = useServerFn(listModulesPublic);
  const cFn = useServerFn(listMyCredentials);
  const mods = useQuery({ queryKey: ["modules"], queryFn: () => mFn() });
  const creds = useQuery({ queryKey: ["my-creds"], queryFn: () => cFn() });
  const earned = new Set((creds.data ?? []).map((c: any) => c.module_id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 page-enter">
      <h1 className="text-3xl font-bold">Assessments</h1>
      <p className="mt-1 text-muted-foreground">Pick a module and certify. 80% required to pass.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(mods.data ?? []).map((m: any) => (
          <Link key={m.id} to="/learn/$discipline/$topic" params={{ discipline: m.discipline, topic: m.section_slug }} className="lift rounded-xl border bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{m.title}</h3>
              {earned.has(m.id) && <span className="rounded bg-muted px-2 py-0.5 text-xs">Certified</span>}
            </div>
            <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{m.discipline}</p>
            <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
