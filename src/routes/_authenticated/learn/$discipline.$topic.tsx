import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getModulePublic } from "@/lib/learning.functions";
import { submitQuiz } from "@/lib/assessments.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/learn/$discipline/$topic")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.topic} — ${params.discipline.toUpperCase()} | Learn & Earn` },
      { name: "description", content: `Learn ${params.topic} (${params.discipline}) with video, docs, and a certifying quiz.` },
    ],
  }),
  component: Topic,
});

function Topic() {
  const { discipline, topic } = Route.useParams();
  const fn = useServerFn(getModulePublic);
  const subFn = useServerFn(submitQuiz);
  const q = useQuery({ queryKey: ["module", discipline, topic], queryFn: () => fn({ data: { discipline, slug: topic } }) });
  const [docOpen, setDocOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const submit = useMutation({
    mutationFn: (vars: { moduleId: string }) => subFn({ data: { moduleId: vars.moduleId, answers } }),
    onSuccess: (r) => {
      setResult({ score: r.score, passed: r.passed });
      r.passed ? toast.success(`Passed! Credential saved (${r.score}%)`) : toast.error(`Score ${r.score}%. Need 80% to certify.`);
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (q.isLoading) return <div className="p-10 text-center text-muted-foreground">Loading…</div>;
  if (!q.data) return <div className="p-10 text-center">Not found. <Link to="/learn">Back</Link></div>;
  const { module: m, quizzes } = q.data;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 page-enter">
      <Link to="/learn" className="text-sm" style={{ color: "var(--color-primary)" }}>← All tracks</Link>
      <h1 className="mt-2 text-3xl font-bold">{m.title}</h1>
      <p className="mt-1 text-muted-foreground">{m.description}</p>

      {m.video_url && (
        <div className="mt-6 aspect-video w-full overflow-hidden rounded-xl border bg-black shadow-2xl">
          <iframe
            src={m.video_url}
            title={m.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <div className="mt-6 rounded-xl border bg-white">
        <button onClick={() => setDocOpen((v) => !v)} className="flex w-full items-center justify-between p-4 text-left font-semibold">
          <span>📖 Documentation</span>
          <span className="text-sm text-muted-foreground">{docOpen ? "Hide" : "Show"}</span>
        </button>
        {docOpen && (
          <pre className="whitespace-pre-wrap border-t p-4 text-sm leading-relaxed">{m.documentation_body}</pre>
        )}
      </div>

      {Array.isArray(m.resources) && m.resources.length > 0 && (
        <div className="mt-6 rounded-xl border bg-white p-5">
          <h2 className="font-semibold flex items-center gap-2">📚 Recommended resources <span className="text-xs font-normal text-muted-foreground">(W3Schools, MDN, official docs)</span></h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {m.resources.map((r: any, i: number) => (
              <li key={i}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="lift flex items-center gap-3 rounded-lg border bg-white/70 p-3 text-sm hover:bg-white"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md text-white text-xs font-bold" style={{ background: r.type === "pdf" ? "oklch(0.55 0.2 25)" : "var(--color-primary)" }}>
                    {r.type === "pdf" ? "PDF" : "DOC"}
                  </span>
                  <span className="font-medium">{r.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {quizzes.length > 0 && (
        <div className="mt-8 rounded-xl border bg-white p-6">
          <h2 className="text-xl font-semibold">Assessment</h2>
          <p className="text-sm text-muted-foreground">Score 80% or higher to earn a credential.</p>
          <div className="mt-4 space-y-5">
            {quizzes.map((qz: any, idx: number) => (
              <div key={qz.id}>
                <p className="font-medium">{idx + 1}. {qz.question}</p>
                <div className="mt-2 grid gap-2">
                  {qz.choices.map((c: string) => (
                    <label key={c} className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted">
                      <input type="radio" name={qz.id} value={c} checked={answers[qz.id] === c} onChange={() => setAnswers({ ...answers, [qz.id]: c })} />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            disabled={submit.isPending || Object.keys(answers).length < quizzes.length}
            onClick={() => submit.mutate({ moduleId: m.id })}
            className="mt-5 rounded-md px-5 py-2 font-semibold disabled:opacity-50"
            style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}
          >
            {submit.isPending ? "Scoring…" : "Submit answers"}
          </button>
          {result && (
            <div className="mt-4 rounded-md border p-3 text-sm" style={{ background: result.passed ? "color-mix(in oklab, var(--color-accent) 15%, white)" : undefined }}>
              You scored <strong>{result.score}%</strong> — {result.passed ? "credential earned." : "try again to certify."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
