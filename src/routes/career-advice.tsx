import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BookOpen, Briefcase, Award, Target, Mail, Users } from "lucide-react";

export const Route = createFileRoute("/career-advice")({
  head: () => ({
    meta: [
      { title: "Career advice & playbooks | TalentBD" },
      { name: "description", content: "Practical, Bangladesh-specific career advice: writing a winning CV, acing interviews, negotiating salary, switching to remote, and more." },
      { property: "og:title", content: "Career advice — TalentBD" },
    ],
  }),
  component: CareerAdvice,
});

const ARTICLES = [
  { icon: BookOpen, title: "How to write a CV that beats ATS bots", body: "Pick the right keywords, structure your experience, and use measurable bullets. Most Bangladeshi CVs fail the ATS — here's how to fix yours.", to: "/cv-builder", cta: "Open the CV builder" },
  { icon: Briefcase, title: "From local job to global remote", body: "A step-by-step playbook to land your first international remote role from Dhaka or Chittagong — including timezone strategy and Stripe/Wise payouts.", to: "/jobs?remote=remote", cta: "See remote jobs" },
  { icon: Award, title: "Why certifications matter in BD", body: "Verified credentials shave 30%+ off your job search. Pick the right track, pass the assessment, and signal credibility to employers.", to: "/learn", cta: "Browse learning tracks" },
  { icon: Target, title: "Salary negotiation in Bangladesh", body: "Use market data to negotiate offers — without burning bridges. Scripts, ranges, and what to do when they say 'this is our final offer'.", to: "/salaries", cta: "View salary insights" },
  { icon: Mail, title: "Cold-emailing recruiters that works", body: "A four-line template that gets 30%+ reply rates from hiring managers at BD startups and global remote teams.", to: "/career-advice", cta: "Read template" },
  { icon: Users, title: "Networking on LinkedIn from Bangladesh", body: "What to post, who to follow, and how to ask for referrals without sounding desperate.", to: "/career-advice", cta: "Read guide" },
];

function CareerAdvice() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 page-enter">
      <ScrollReveal>
        <h1 className="text-4xl font-extrabold">Career <span className="text-gradient">advice</span></h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Curated playbooks built for engineers and professionals in Bangladesh — from your first CV to landing a global remote role.
        </p>
      </ScrollReveal>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ARTICLES.map((a, i) => (
          <ScrollReveal key={a.title} delay={(i % 3) * 80}>
            <article className="lift glass rounded-xl p-6 h-full flex flex-col">
              <div className="flex size-11 items-center justify-center rounded-xl text-white shadow-lg" style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
                <a.icon className="size-5" />
              </div>
              <h2 className="mt-4 text-lg font-bold leading-tight">{a.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground flex-1">{a.body}</p>
              <Link to={a.to} className="mt-4 inline-flex items-center text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
                {a.cta} →
              </Link>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
