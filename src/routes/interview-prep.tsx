import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useState } from "react";
import { CheckCircle2, MessageSquare, Code2, Building2 } from "lucide-react";

export const Route = createFileRoute("/interview-prep")({
  head: () => ({
    meta: [
      { title: "Interview preparation — TalentBD" },
      { name: "description", content: "Practice questions, checklists, and behavioral frameworks to ace your next interview in Bangladesh or with a global remote team." },
      { property: "og:title", content: "Interview prep — TalentBD" },
    ],
  }),
  component: InterviewPrep,
});

const TABS = [
  {
    id: "behavioral",
    label: "Behavioral",
    icon: MessageSquare,
    qs: [
      "Tell me about a time you failed and what you learned.",
      "Describe a conflict with a teammate and how you resolved it.",
      "Walk me through your most impactful project.",
      "How do you prioritize when everything is urgent?",
      "Why TalentBD / why this company?",
    ],
  },
  {
    id: "technical",
    label: "Technical (Eng)",
    icon: Code2,
    qs: [
      "Reverse a linked list in O(n) time and O(1) extra space.",
      "Explain how indexes work in a relational database.",
      "What happens when you type a URL into a browser and hit enter?",
      "Design a URL shortener (rate limits, key generation, storage).",
      "Difference between TCP and UDP, and when to use each.",
    ],
  },
  {
    id: "system",
    label: "System Design",
    icon: Building2,
    qs: [
      "Design a job board like bdjobs.com.",
      "Design a CV/ATS parser at scale.",
      "How would you build a chat assistant for 1M users?",
      "Design a salary insights dashboard with real-time updates.",
      "Trade-offs between SQL and NoSQL for a learning platform.",
    ],
  },
  {
    id: "checklist",
    label: "Day-of checklist",
    icon: CheckCircle2,
    qs: [
      "Researched 3 facts about the company and the interviewer.",
      "Tested camera, mic, and internet on the actual link.",
      "Printed CV + portfolio links open in a tab.",
      "Prepared 3 STAR stories covering ownership, conflict, failure.",
      "Have 2 thoughtful questions ready for them.",
    ],
  },
];

function InterviewPrep() {
  const [tab, setTab] = useState(TABS[0].id);
  const active = TABS.find((t) => t.id === tab)!;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 page-enter">
      <ScrollReveal>
        <h1 className="text-4xl font-extrabold">Interview <span className="text-gradient">prep</span></h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Bite-sized prompts and checklists, organized for behavioral, technical, and system-design rounds.
        </p>
      </ScrollReveal>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${tab === t.id ? "text-white shadow-md" : "bg-white/60 hover:bg-white"}`}
            style={tab === t.id ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))", borderColor: "transparent" } : {}}
          >
            <t.icon className="size-4" />
            {t.label}
          </button>
        ))}
      </div>

      <ScrollReveal>
        <div className="mt-6 glass rounded-xl p-6">
          <h2 className="text-xl font-bold">{active.label}</h2>
          <ul className="mt-4 space-y-3">
            {active.qs.map((q, i) => (
              <li key={i} className="flex gap-3 rounded-lg bg-white/50 p-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: "var(--color-primary)" }}>{i + 1}</span>
                <p className="text-sm">{q}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/cv-builder" className="rounded-md px-4 py-2 text-sm font-semibold text-white" style={{ background: "var(--color-primary)" }}>Polish your CV</Link>
            <Link to="/jobs" className="rounded-md border bg-white/60 px-4 py-2 text-sm font-semibold">Apply to jobs</Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
