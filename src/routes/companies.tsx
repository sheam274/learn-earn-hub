import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listCompaniesPublic } from "@/lib/jobs.functions";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Globe, MapPin, Building2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/companies")({
  head: () => ({
    meta: [
      { title: "Companies — TalentBD" },
      { name: "description", content: "Browse employers hiring on TalentBD across Bangladesh and globally." },
      { property: "og:title", content: "Companies — TalentBD" },
      { property: "og:url", content: "/companies" },
    ],
    links: [{ rel: "canonical", href: "/companies" }],
  }),
  component: Companies,
});

function Companies() {
  const fn = useServerFn(listCompaniesPublic);
  const q = useQuery({ queryKey: ["companies"], queryFn: () => fn() });
  const [search, setSearch] = useState("");
  const list = (q.data ?? []).filter((c: any) =>
    `${c.name} ${c.industry ?? ""} ${c.location ?? ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 page-enter">
      <h1 className="text-3xl font-bold">Companies hiring on TalentBD</h1>
      <p className="mt-1 text-muted-foreground">Explore employers and their open roles.</p>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, industry, location"
        className="mt-6 w-full rounded-md border bg-white/70 backdrop-blur px-3 py-2 text-sm"
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((c: any, i: number) => (
          <ScrollReveal key={c.id} delay={(i % 6) * 60}>
            <article className="lift glass rounded-xl p-5 h-full">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: "var(--color-primary)" }}>
                  {c.logo_url ? <img src={c.logo_url} alt={c.name} className="size-12 rounded-lg object-cover" /> : c.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.industry ?? "—"} · {c.location ?? "—"}</p>
                </div>
              </div>
              {c.description && <p className="mt-3 text-sm">{c.description}</p>}
              {c.website && <a href={c.website} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium" style={{ color: "var(--color-primary)" }}>Visit website →</a>}
            </article>
          </ScrollReveal>
        ))}
        {list.length === 0 && <p className="text-sm text-muted-foreground">No companies match.</p>}
      </div>
    </div>
  );
}
