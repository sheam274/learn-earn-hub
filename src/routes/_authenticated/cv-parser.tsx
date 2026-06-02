import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/cv-parser")({
  head: () => ({ meta: [{ title: "ATS CV Parser — Learn & Earn" }, { name: "description", content: "Parse a resume to find engineering sector matches." }] }),
  component: Parser,
});

const SECTOR_KEYWORDS: Record<string, string[]> = {
  "Web Development": ["react", "javascript", "typescript", "css", "html", "node", "next", "tailwind", "redux", "vite"],
  "Data Science": ["python", "pandas", "numpy", "scikit", "tensorflow", "pytorch", "sql", "statistics", "ml", "ai"],
  "Networking": ["tcp", "ip", "routing", "bgp", "ospf", "vlan", "firewall", "linux", "cisco"],
  "Mobile App Development": ["react native", "flutter", "kotlin", "swift", "android", "ios"],
  "VLSI Design": ["verilog", "systemverilog", "uvm", "cmos", "rtl", "synthesis", "vlsi"],
  "Power Systems": ["power", "matlab", "transmission", "load flow", "etap", "protection", "smart grid"],
  "Industrial Automation": ["plc", "scada", "hmi", "ladder", "siemens", "rockwell", "automation"],
  "Structural Engineering": ["etabs", "staad", "rcc", "steel design", "concrete", "structural"],
  "CAD & BIM": ["autocad", "revit", "navisworks", "bim", "cad", "civil 3d"],
  "Project Management": ["pmp", "scheduling", "wbs", "primavera", "ms project", "estimation"],
  "Digital Marketing": ["seo", "sem", "google ads", "analytics", "content", "social media"],
  "3D Animation": ["blender", "maya", "3ds max", "rigging", "modeling", "animation"],
};

function score(text: string) {
  const lc = text.toLowerCase();
  return Object.entries(SECTOR_KEYWORDS).map(([sector, kws]) => {
    const hits = kws.filter((k) => lc.includes(k));
    return { sector, score: Math.round((hits.length / kws.length) * 100), hits };
  }).sort((a, b) => b.score - a.score);
}

function Parser() {
  const [text, setText] = useState("");
  const [results, setResults] = useState<ReturnType<typeof score>>([]);

  async function onFile(f: File) {
    const t = await f.text();
    setText(t);
    setResults(score(t));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 page-enter">
      <h1 className="text-3xl font-bold">ATS CV Parser</h1>
      <p className="mt-1 text-muted-foreground">Drop a .txt resume or paste text — we'll match it to engineering sectors.</p>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
        className="mt-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white p-8 text-center"
      >
        <p className="text-sm text-muted-foreground">Drag &amp; drop a .txt file here</p>
        <p className="my-2 text-xs text-muted-foreground">or</p>
        <label className="cursor-pointer rounded-md px-4 py-2 text-sm font-semibold" style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}>
          Choose file
          <input type="file" accept=".txt" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        </label>
      </div>

      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setResults(score(e.target.value)); }}
        placeholder="…or paste resume text here"
        rows={8}
        className="mt-4 w-full rounded-md border bg-white px-3 py-2 text-sm"
      />

      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Sector matches</h2>
          <div className="mt-3 space-y-2">
            {results.slice(0, 8).map((r) => (
              <div key={r.sector} className="rounded-md border bg-white p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{r.sector}</span>
                  <span className="text-sm font-semibold">{r.score}%</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded bg-muted">
                  <div className="h-full" style={{ width: `${r.score}%`, background: "var(--color-accent)" }} />
                </div>
                {r.hits.length > 0 && <p className="mt-1 text-xs text-muted-foreground">Matched: {r.hits.join(", ")}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
