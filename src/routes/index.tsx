import { createFileRoute } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BrandMark } from "@/components/Brand";
import { Sparkles, GraduationCap, Briefcase, Award, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TalentBD — Learn skills, earn credentials, land jobs in Bangladesh" },
      { name: "description", content: "TalentBD is Bangladesh's learn-and-earn platform: courses, certifications, CV builder, ATS parser, and a local + global jobs marketplace." },
      { property: "og:title", content: "TalentBD" },
      { property: "og:description", content: "Build skills. Earn credentials. Land the job." },
    ],
  }),
  component: Landing,
});

const CATS = [
  { name: "IT/Software", icon: "💻" },
  { name: "Engineering", icon: "⚙️" },
  { name: "Banking/Finance", icon: "🏦" },
  { name: "Marketing", icon: "📣" },
  { name: "Design", icon: "🎨" },
  { name: "Healthcare", icon: "🩺" },
  { name: "Education", icon: "🎓" },
  { name: "Sales", icon: "💼" },
];

function Landing() {
  return (
    <div className="page-enter">
      {/* Premium Hero */}
      <section className="relative overflow-hidden">
        <CseHeroScene />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-16 md:py-24 md:grid-cols-2 md:px-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-semibold">
              <Sparkles className="size-3.5" style={{ color: "var(--color-primary)" }} />
              <span className="text-gradient">Premium · Bangladesh's #1 learn-and-earn</span>
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Build skills.<br />
              Earn credentials.<br />
              <span className="text-gradient">Land the job.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              TalentBD is Bangladesh's premium learn-and-earn platform — courses, verified certifications,
              a dual-style CV builder, an ATS parser, and a local + global jobs marketplace.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="/auth"
                className="shimmer inline-flex items-center gap-2 rounded-md px-5 py-3 font-semibold text-white shadow-lg"
                style={{ background: "linear-gradient(135deg, var(--color-primary), oklch(0.45 0.18 250))" }}
              >
                Get started free <ArrowRight className="size-4" />
              </a>
              <a href="/jobs" className="rounded-md border bg-white/70 px-5 py-3 font-semibold backdrop-blur hover:bg-white">
                Browse jobs
              </a>
            </div>
            <div className="mt-9 grid max-w-md grid-cols-3 gap-3">
              {[["12+", "Courses"], ["3", "Disciplines"], ["100%", "Free start"]].map(([n, l]) => (
                <div key={l} className="glass rounded-xl p-3 text-center">
                  <div className="text-xl font-extrabold text-gradient">{n}</div>
                  <div className="text-xs text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Logo showcase + feature card */}
          <ScrollReveal>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl opacity-50 blur-3xl"
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }} />
              <div className="relative glass-dark rounded-3xl p-6 md:p-8">
                <div className="float-slow mx-auto mb-4 flex size-32 items-center justify-center rounded-2xl bg-white/95 p-3 shadow-2xl ring-pulse relative">
                  <BrandMark size={104} />
                </div>
                <h3 className="text-center text-lg font-bold">What you get inside</h3>
                <ul className="mt-4 grid gap-2.5 text-sm">
                  {[
                    { icon: GraduationCap, t: "Courses across CSE, EEE, Civil" },
                    { icon: Award, t: "Pass 80% → certified credential" },
                    { icon: Sparkles, t: "Standard + Premium CV builder" },
                    { icon: Briefcase, t: "Local BD + global remote jobs" },
                  ].map(({ icon: Icon, t }) => (
                    <li key={t} className="flex items-center gap-3 rounded-lg bg-white/10 px-3 py-2">
                      <Icon className="size-4" style={{ color: "var(--color-accent)" }} />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Crossover */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <ScrollReveal>
          <div className="crossover grid gap-4 rounded-2xl glass p-6 md:grid-cols-3">
            {[
              { title: "Learn", body: "Structured tracks across web dev, networking, VLSI, power systems, BIM and more." },
              { title: "Certify", body: "Pass timed quizzes to write a verified credential straight to your profile." },
              { title: "Get hired", body: "Apply to vetted local and global remote engineering roles." },
            ].map((c, i) => (
              <ScrollReveal key={c.title} delay={i * 80}>
                <div className="lift rounded-xl bg-white/70 backdrop-blur p-5 h-full">
                  <h3 className="text-lg font-semibold text-gradient">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <ScrollReveal>
          <h2 className="text-3xl font-bold">Popular job categories</h2>
          <p className="mt-1 text-muted-foreground">Like bdjobs — but with built-in learning to get you hired faster.</p>
        </ScrollReveal>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {CATS.map((c, i) => (
            <ScrollReveal key={c.name} delay={(i % 4) * 60}>
              <a href="/jobs" className="lift glass rounded-xl p-5 block">
                <div className="text-3xl">{c.icon}</div>
                <div className="mt-2 font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground">View jobs →</div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Disciplines */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <ScrollReveal><h2 className="text-3xl font-bold">Disciplines we cover</h2></ScrollReveal>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { d: "Computer Science", thumb: "thumb-cse", items: ["Web Development", "Networking", "Data Science", "Mobile Apps", "3D Animation", "Digital Marketing"] },
            { d: "Electrical & Electronic", thumb: "thumb-eee", items: ["Power Systems", "VLSI", "Industrial Automation"] },
            { d: "Civil Engineering", thumb: "thumb-civil", items: ["Structural", "CAD & BIM", "Project Management"] },
          ].map((g, i) => (
            <ScrollReveal key={g.d} delay={i * 100}>
              <div className="lift glass rounded-xl overflow-hidden h-full">
                <div className={`${g.thumb} thumb-grid h-28 relative`}>
                  <div className="absolute inset-0 flex items-end p-4">
                    <h3 className="font-bold text-white text-lg drop-shadow">{g.d}</h3>
                  </div>
                </div>
                <ul className="p-5 space-y-1 text-sm text-muted-foreground">
                  {g.items.map((it) => <li key={it}>• {it}</li>)}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <ScrollReveal>
          <div className="glass-dark rounded-2xl p-10 text-center" style={{ background: "linear-gradient(135deg, var(--color-primary), oklch(0.45 0.18 250))" }}>
            <h2 className="text-3xl font-bold text-white">Ready to grow your career?</h2>
            <p className="mt-2 text-white/85">Sign up free and start learning today.</p>
            <a href="/auth" className="mt-5 inline-block rounded-md px-6 py-3 font-semibold shimmer" style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}>Create free account</a>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
