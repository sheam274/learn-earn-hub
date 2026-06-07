import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listCompaniesPublic } from "@/lib/jobs.functions";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CompanyLogo } from "@/components/CompanyLogo";
import { Globe, MapPin, Building2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/companies/")({
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
            <Link
              to="/companies/$slug"
              params={{ slug: c.slug }}
              className="lift glass rounded-xl p-5 h-full block group"
            >
              <div className="flex items-center gap-3">
                <CompanyLogo name={c.name} url={c.logo_url} website={c.website} size={48} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold group-hover:underline truncate">{c.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {[c.industry, c.location].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
              </div>
              {c.description && <p className="mt-3 text-sm line-clamp-3">{c.description}</p>}
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                {c.industry && <span className="inline-flex items-center gap-1"><Building2 className="size-3" />{c.industry}</span>}
                {c.location && <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{c.location}</span>}
                {c.website && <span className="inline-flex items-center gap-1"><Globe className="size-3" />{c.website.replace(/^https?:\/\//, "").split("/")[0]}</span>}
              </div>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium" style={{ color: "var(--color-primary)" }}>
                View company & jobs <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </ScrollReveal>
        ))}
        {list.length === 0 && <p className="text-sm text-muted-foreground">No companies match.</p>}
      </div>
    </div>
  );
}

