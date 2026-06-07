import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getCompanyBySlug } from "@/lib/jobs.functions";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CompanyLogo } from "@/components/CompanyLogo";
import { Globe, MapPin, Briefcase, Building2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/companies/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Company · TalentBD` },
      { name: "description", content: `Open roles, profile and details for ${params.slug} on TalentBD.` },
      { property: "og:title", content: `${params.slug} on TalentBD` },
    ],
  }),
  component: CompanyDetail,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl p-10 text-sm text-destructive">{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl p-10 text-sm">Company not found. <Link to="/companies" className="underline">Back to companies</Link></div>
  ),
});

function CompanyDetail() {
  const { slug } = Route.useParams();
  const fn = useServerFn(getCompanyBySlug);
  const q = useQuery({ queryKey: ["company", slug], queryFn: () => fn({ data: { slug } }) });

  if (q.isLoading) return <div className="mx-auto max-w-5xl p-10 text-sm text-muted-foreground">Loading…</div>;
  if (!q.data) throw notFound();
  const { company, jobs } = q.data;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 page-enter">
      <Link to="/companies" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All companies
      </Link>

      <ScrollReveal>
        <header className="mt-4 glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6">
          <CompanyLogo name={company.name} url={company.logo_url} website={company.website} size={96} className="!rounded-2xl" />
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {company.industry && <span className="inline-flex items-center gap-1"><Building2 className="size-4" />{company.industry}</span>}
              {company.location && <span className="inline-flex items-center gap-1"><MapPin className="size-4" />{company.location}</span>}
              {company.website && (
                <a href={company.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline" style={{ color: "var(--color-primary)" }}>
                  <Globe className="size-4" />{company.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
            {company.description && <p className="mt-4 text-sm leading-relaxed">{company.description}</p>}
          </div>
        </header>
      </ScrollReveal>

      <section className="mt-10">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Briefcase className="size-5" style={{ color: "var(--color-primary)" }} /> Open roles at {company.name}
        </h2>
        {jobs.length === 0 && (
          <p className="mt-3 text-sm text-muted-foreground">No live openings right now — check back soon.</p>
        )}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {jobs.map((j: any) => (
            <Link key={j.id} to="/jobs/$jobId" params={{ jobId: j.id }} className="lift glass rounded-xl p-5 block">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold hover:underline">{j.job_title}</h3>
                {j.is_featured && <span className="badge-featured">Hot</span>}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {[j.location, j.job_type, j.experience_level].filter(Boolean).join(" · ")}
                {j.is_remote && " · Remote"}
              </p>
              {j.salary_range && (
                <p className="mt-2 text-sm font-medium" style={{ color: "var(--color-primary)" }}>{j.salary_range}</p>
              )}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
