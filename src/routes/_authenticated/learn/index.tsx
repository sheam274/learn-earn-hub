import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listModulesPublic } from "@/lib/learning.functions";

export const Route = createFileRoute("/_authenticated/learn/")({
  head: () => ({ meta: [{ title: "Learn — Engineering tracks" }, { name: "description", content: "Browse curated learning tracks across CSE, EEE, and Civil engineering." }] }),
  component: LearnIndex,
});

const disciplineLabels: Record<string, string> = {
  cse: "Computer Science",
  eee: "Electrical & Electronic",
  civil: "Civil Engineering",
};

function LearnIndex() {
  const fn = useServerFn(listModulesPublic);
  const q = useQuery({ queryKey: ["modules"], queryFn: () => fn() });
  const grouped = (q.data ?? []).reduce<Record<string, any[]>>((acc, m) => {
    (acc[m.discipline] ||= []).push(m);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 page-enter">
      <h1 className="text-3xl font-bold">Learning tracks</h1>
      <p className="mt-1 text-muted-foreground">Pick a discipline and start a module.</p>
      <div className="mt-8 space-y-10">
        {Object.entries(grouped).map(([disc, list]) => (
          <div key={disc}>
            <h2 className="text-xl font-semibold">{disciplineLabels[disc] ?? disc.toUpperCase()}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {list.map((m) => (
                <Link
                  key={m.id}
                  to="/learn/$discipline/$topic"
                  params={{ discipline: m.discipline, topic: m.section_slug }}
                  className="lift rounded-xl border bg-white p-5"
                >
                  <h3 className="font-semibold">{m.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
