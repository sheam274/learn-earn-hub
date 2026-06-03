import { createFileRoute } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useMemo, useState } from "react";
import { TrendingUp, Search } from "lucide-react";

export const Route = createFileRoute("/salaries")({
  head: () => ({
    meta: [
      { title: "Salary insights — Bangladesh & remote | TalentBD" },
      { name: "description", content: "Salary benchmarks for engineers, designers, and finance roles across Bangladesh and global remote markets." },
      { property: "og:title", content: "Salary insights — TalentBD" },
      { property: "og:description", content: "Pay benchmarks by role, level and location across BD + remote." },
    ],
  }),
  component: Salaries,
});

type Row = { role: string; category: string; entry: string; mid: string; senior: string; remote: string };

const ROWS: Row[] = [
  { role: "Software Engineer", category: "IT/Software", entry: "৳35-55k", mid: "৳70-120k", senior: "৳150-280k", remote: "$2k-6k/mo" },
  { role: "Frontend Developer (React)", category: "IT/Software", entry: "৳30-50k", mid: "৳65-110k", senior: "৳140-240k", remote: "$1.8k-5k/mo" },
  { role: "Backend Developer (Node/Java)", category: "IT/Software", entry: "৳35-55k", mid: "৳75-130k", senior: "৳160-300k", remote: "$2.2k-6.5k/mo" },
  { role: "Data Scientist", category: "IT/Software", entry: "৳45-70k", mid: "৳90-150k", senior: "৳180-320k", remote: "$2.5k-7k/mo" },
  { role: "Mobile Developer (Flutter/RN)", category: "IT/Software", entry: "৳35-55k", mid: "৳70-120k", senior: "৳150-260k", remote: "$2k-6k/mo" },
  { role: "DevOps / SRE", category: "IT/Software", entry: "৳45-70k", mid: "৳90-160k", senior: "৳180-330k", remote: "$2.8k-7.5k/mo" },
  { role: "UI/UX Designer", category: "Design", entry: "৳30-50k", mid: "৳60-110k", senior: "৳130-220k", remote: "$1.5k-4.5k/mo" },
  { role: "Electrical Engineer", category: "Engineering", entry: "৳30-50k", mid: "৳60-110k", senior: "৳130-230k", remote: "—" },
  { role: "Civil / Structural Engineer", category: "Engineering", entry: "৳28-48k", mid: "৳55-100k", senior: "৳120-200k", remote: "—" },
  { role: "Project Manager (Construction)", category: "Engineering", entry: "৳40-65k", mid: "৳80-140k", senior: "৳160-280k", remote: "—" },
  { role: "Bank Officer (PO/MTO)", category: "Banking/Finance", entry: "৳35-50k", mid: "৳70-120k", senior: "৳150-280k", remote: "—" },
  { role: "Financial Analyst", category: "Banking/Finance", entry: "৳40-60k", mid: "৳80-140k", senior: "৳160-300k", remote: "$1.8k-4.5k/mo" },
  { role: "Digital Marketer", category: "Marketing", entry: "৳25-45k", mid: "৳55-100k", senior: "৳120-200k", remote: "$1.5k-4k/mo" },
  { role: "Sales Executive", category: "Sales", entry: "৳22-40k + comm.", mid: "৳45-90k + comm.", senior: "৳110-200k + comm.", remote: "—" },
];

function Salaries() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const cats = useMemo(() => Array.from(new Set(ROWS.map((r) => r.category))), []);
  const filtered = useMemo(
    () => ROWS.filter((r) => (!cat || r.category === cat) && (!q || r.role.toLowerCase().includes(q.toLowerCase()))),
    [q, cat],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 page-enter">
      <ScrollReveal>
        <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-semibold">
          <TrendingUp className="size-3.5" style={{ color: "var(--color-primary)" }} />
          <span className="text-gradient">Live market benchmarks</span>
        </div>
        <h1 className="mt-4 text-4xl font-extrabold">Salary <span className="text-gradient">insights</span></h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Indicative monthly pay ranges across Bangladesh and global remote markets. Use the numbers to negotiate confidently.
        </p>
      </ScrollReveal>

      <div className="mt-6 glass rounded-xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search role e.g. React, DevOps" className="w-full rounded-md border bg-white/60 pl-9 pr-3 py-2 text-sm" />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-md border bg-white/60 px-3 py-2 text-sm">
          <option value="">All categories</option>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <ScrollReveal>
        <div className="mt-6 overflow-hidden rounded-xl glass">
          <table className="w-full text-sm">
            <thead className="bg-white/40 text-left">
              <tr>
                <th className="p-3 font-semibold">Role</th>
                <th className="p-3 font-semibold hidden md:table-cell">Category</th>
                <th className="p-3 font-semibold">Entry</th>
                <th className="p-3 font-semibold">Mid</th>
                <th className="p-3 font-semibold">Senior</th>
                <th className="p-3 font-semibold hidden md:table-cell">Remote (USD)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.role} className="border-t border-white/30 hover:bg-white/30 transition">
                  <td className="p-3 font-medium">{r.role}</td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">{r.category}</td>
                  <td className="p-3">{r.entry}</td>
                  <td className="p-3 font-semibold" style={{ color: "var(--color-primary)" }}>{r.mid}</td>
                  <td className="p-3">{r.senior}</td>
                  <td className="p-3 hidden md:table-cell">{r.remote}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No roles match those filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </ScrollReveal>

      <p className="mt-4 text-xs text-muted-foreground">
        Ranges are indicative, based on industry benchmarks and TalentBD employer listings. Actual offers vary by company, location, and experience.
      </p>
    </div>
  );
}
