import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Learn & Earn — Engineering careers, accelerated" },
      { name: "description", content: "Multi-engineering learning, certifications, dual CV builder, ATS parser, and a global+local jobs marketplace." },
      { property: "og:title", content: "Learn & Earn" },
      { property: "og:description", content: "Build skills. Earn credentials. Land jobs." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="page-enter">
      {/* Hero band */}
      <section className="relative overflow-hidden" style={{ background: "var(--color-primary)" }}>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 md:px-6">
          <div className="text-white">
            <span className="badge-live">Live</span>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">
              Learn engineering. Earn credentials. Land the job.
            </h1>
            <p className="mt-4 max-w-xl text-white/85">
              A multi-discipline learning platform for CSE, EEE, and Civil Engineering — with assessments,
              a dual-style CV builder, an ATS parser, and a local + global jobs marketplace.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/auth" className="rounded-md px-5 py-2.5 font-semibold" style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}>Get started</a>
              <a href="/jobs" className="rounded-md border border-white/40 px-5 py-2.5 font-semibold text-white">Browse jobs</a>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold text-white">What's inside</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                "12+ curated modules across CSE, EEE, and Civil",
                "Timed assessments — pass 80% to certify",
                "Standard + Premium CV builder with print-ready output",
                "Drag-and-drop ATS resume parser",
                "Local & remote engineering job listings",
                "Admin console for full content control",
              ].map((t) => (
                <li key={t} className="flex gap-2"><span style={{ color: "var(--color-accent)" }}>●</span>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Crossover panel */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="crossover grid gap-4 rounded-2xl border bg-white p-6 shadow-sm md:grid-cols-3">
          {[
            { title: "Learn", body: "Structured tracks across web dev, networking, VLSI, power systems, BIM and more." },
            { title: "Certify", body: "Pass timed quizzes to write a verified credential straight to your profile." },
            { title: "Get hired", body: "Apply to vetted local and global remote engineering roles." },
          ].map((c) => (
            <div key={c.title} className="lift rounded-xl border p-5">
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <h2 className="text-2xl font-bold">Disciplines we cover</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { d: "Computer Science", items: ["Web Development", "Networking", "Data Science", "Mobile Apps", "3D Animation", "Digital Marketing"] },
            { d: "Electrical & Electronic", items: ["Power Systems", "VLSI", "Industrial Automation"] },
            { d: "Civil Engineering", items: ["Structural", "CAD & BIM", "Project Management"] },
          ].map((g) => (
            <div key={g.d} className="lift rounded-xl border bg-white p-5">
              <h3 className="font-semibold">{g.d}</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {g.items.map((i) => <li key={i}>• {i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
