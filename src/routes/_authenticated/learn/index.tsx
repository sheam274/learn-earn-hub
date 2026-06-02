import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listModulesPublic } from "@/lib/learning.functions";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BookOpen, PlayCircle, Award } from "lucide-react";

export const Route = createFileRoute("/_authenticated/learn/")({
  head: () => ({ meta: [{ title: "Learn — Engineering tracks | TalentBD" }, { name: "description", content: "Browse curated learning tracks across CSE, EEE, and Civil engineering." }] }),
  component: LearnIndex,
});

const disciplineMeta: Record<string, { label: string; thumb: string; icon: string; blurb: string }> = {
  cse: { label: "Computer Science", thumb: "thumb-cse", icon: "💻", blurb: "Web, networking, data, mobile and more." },
  eee: { label: "Electrical & Electronic", thumb: "thumb-eee", icon: "⚡", blurb: "Power, VLSI, automation." },
  civil: { label: "Civil Engineering", thumb: "thumb-civil", icon: "🏗️", blurb: "Structural, CAD, BIM." },
};

function LearnIndex() {
  const fn = useServerFn(listModulesPublic);
  const q = useQuery({ queryKey: ["modules"], queryFn: () => fn(), staleTime: 60_000 });
  const grouped = (q.data ?? []).reduce<Record<string, any[]>>((acc, m) => {
    (acc[m.discipline] ||= []).push(m);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 page-enter">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold">Learning <span className="text-gradient">tracks</span></h1>
          <p className="mt-1 text-muted-foreground">Pick a discipline, watch the lessons, and earn a verified credential.</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><PlayCircle className="size-4" /> Video</span>
          <span className="flex items-center gap-1"><BookOpen className="size-4" /> Docs</span>
          <span className="flex items-center gap-1"><Award className="size-4" /> Cert</span>
        </div>
      </div>

      {q.isLoading && <div className="mt-10 text-center text-muted-foreground">Loading tracks…</div>}

      <div className="mt-10 space-y-14">
        {Object.entries(grouped).map(([disc, list]) => {
          const meta = disciplineMeta[disc] ?? { label: disc.toUpperCase(), thumb: "thumb-cse", icon: "📚", blurb: "" };
          return (
            <section key={disc}>
              <ScrollReveal>
                <div className="flex items-center gap-3">
                  <div className={`${meta.thumb} thumb-grid flex size-14 items-center justify-center rounded-xl text-2xl shadow-lg`}>
                    {meta.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{meta.label}</h2>
                    <p className="text-sm text-muted-foreground">{meta.blurb} · {list.length} module{list.length === 1 ? "" : "s"}</p>
                  </div>
                </div>
              </ScrollReveal>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((m, i) => (
                  <ScrollReveal key={m.id} delay={(i % 3) * 80}>
                    <Link
                      to="/learn/$discipline/$topic"
                      params={{ discipline: m.discipline, topic: m.section_slug }}
                      className="lift glass group rounded-xl overflow-hidden flex flex-col h-full"
                    >
                      <div className={`${meta.thumb} thumb-grid relative h-32`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayCircle className="size-12 text-white/90 transition group-hover:scale-110" />
                        </div>
                        <span className="absolute top-2 right-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                          {meta.icon} {disc}
                        </span>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-semibold leading-tight">{m.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{m.description}</p>
                        <div className="mt-auto pt-3 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Free · Certifiable</span>
                          <span className="font-semibold" style={{ color: "var(--color-primary)" }}>Start →</span>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
