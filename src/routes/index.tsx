import { createFileRoute } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ScrollReveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TalentBD — Learn skills, earn credentials, land jobs in Bangladesh" },
      { name: "description", content: "TalentBD is Bangladesh's learn-and-earn platform: courses, certifications, CV builder, ATS parser, and a local + global jobs marketplace." },
      { property: "og:title", content: "TalentBD" },
      { property: "og:description", content: "Build skills. Earn credentials. Land the job." },
      { property: "og:url", content: "/" },
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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 md:px-6">
          <div>
            <span className="badge-live">Live · Bangladesh</span>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              Build skills. Earn credentials. <span style={{ color: "var(--color-primary)" }}>Land the job.</span>
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              TalentBD is Bangladesh's learn-and-earn platform — multi-discipline courses, verified certifications,
              a dual-style CV builder, an ATS parser, and a local + global jobs marketplace.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/auth" className="rounded-md px-5 py-2.5 font-semibold text-white" style={{ background: "var(--color-primary)" }}>Get started</a>
              <a href="/jobs" className="rounded-md border px-5 py-2.5 font-semibold bg-white/60 backdrop-blur">Browse jobs</a>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
              {[["12+", "Courses"], ["3", "Disciplines"], ["100%", "Free to start"]].map(([n, l]) => (
                <div key={l} className="glass rounded-lg p-3 text-center">
                  <div className="text-xl font-bold" style={{ color: "var(--color-primary)" }}>{n}</div>
                  <div className="text-xs text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <ScrollReveal>
            <div className="glass-dark rounded-2xl p-6">
              <h3 className="text-lg font-semibold">What's inside</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  "Courses across CSE, EEE, and Civil",
                  "Timed assessments — pass 80% to certify",
                  "Standard + Premium CV builder (print-ready)",
                  "ATS resume parser with discipline match",
                  "Local Bangladesh + global remote jobs",
                  "One-click apply + application tracking",
                ].map((t) => (
                  <li key={t} className="flex gap-2"><span style={{ color: "var(--color-accent)" }}>●</span>{t}</li>
                ))}
              </ul>
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
                  <h3 className="text-lg font-semibold">{c.title}</h3>
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
          <h2 className="text-2xl font-bold">Popular job categories</h2>
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
        <ScrollReveal><h2 className="text-2xl font-bold">Disciplines we cover</h2></ScrollReveal>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { d: "Computer Science", items: ["Web Development", "Networking", "Data Science", "Mobile Apps", "3D Animation", "Digital Marketing"] },
            { d: "Electrical & Electronic", items: ["Power Systems", "VLSI", "Industrial Automation"] },
            { d: "Civil Engineering", items: ["Structural", "CAD & BIM", "Project Management"] },
          ].map((g, i) => (
            <ScrollReveal key={g.d} delay={i * 100}>
              <div className="lift glass rounded-xl p-5 h-full">
                <h3 className="font-semibold">{g.d}</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
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
            <a href="/auth" className="mt-5 inline-block rounded-md px-6 py-3 font-semibold" style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}>Create free account</a>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
