import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getMyCv, saveMyCv } from "@/lib/cv.functions";
import { toast } from "sonner";
import { Plus, Trash2, Mail, Phone, MapPin, Globe, Linkedin, Github, Printer, Save } from "lucide-react";

export const Route = createFileRoute("/_authenticated/cv-builder")({
  head: () => ({ meta: [{ title: "CV Builder — TalentBD" }, { name: "description", content: "Build a professional, print-ready CV with standard or premium layouts." }] }),
  component: CvBuilder,
});

type Experience = { id: string; role: string; company: string; period: string; bullets: string };
type Education = { id: string; degree: string; school: string; period: string; details: string };
type Project = { id: string; name: string; link: string; description: string };

type Payload = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  photo: string;
  summary: string;
  skills: string;
  languages: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
};

const uid = () => Math.random().toString(36).slice(2, 9);

const empty: Payload = {
  name: "", title: "", email: "", phone: "", location: "",
  website: "", linkedin: "", github: "", photo: "",
  summary: "", skills: "", languages: "",
  experience: [], education: [], projects: [],
};

function migrate(p: any): Payload {
  if (!p) return empty;
  return {
    ...empty,
    ...p,
    experience: Array.isArray(p.experience)
      ? p.experience
      : typeof p.experience === "string" && p.experience
      ? [{ id: uid(), role: "", company: "", period: "", bullets: p.experience }]
      : [],
    education: Array.isArray(p.education)
      ? p.education
      : typeof p.education === "string" && p.education
      ? [{ id: uid(), degree: "", school: "", period: "", details: p.education }]
      : [],
    projects: Array.isArray(p.projects) ? p.projects : [],
  };
}

function CvBuilder() {
  const getFn = useServerFn(getMyCv);
  const saveFn = useServerFn(saveMyCv);
  const q = useQuery({ queryKey: ["my-cv"], queryFn: () => getFn() });
  const [style, setStyle] = useState<"standard" | "premium">("standard");
  const [data, setData] = useState<Payload>(empty);

  useEffect(() => {
    if (q.data) {
      setStyle((q.data.selected_style as any) ?? "standard");
      setData(migrate(q.data.builder_payload));
    }
  }, [q.data]);

  const save = useMutation({
    mutationFn: () => saveFn({ data: { selected_style: style, builder_payload: data as any } }),
    onSuccess: () => toast.success("CV saved"),
    onError: (e: any) => toast.error(e.message),
  });

  function set<K extends keyof Payload>(k: K, v: Payload[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 page-enter">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">CV <span className="text-gradient">Builder</span></h1>
          <p className="text-sm text-muted-foreground">Real-time preview · ATS-friendly · Print to PDF</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={style} onChange={(e) => setStyle(e.target.value as any)} className="rounded-md border px-3 py-2 text-sm bg-white">
            <option value="standard">Standard (single column)</option>
            <option value="premium">Premium (two-column)</option>
          </select>
          <button onClick={() => save.mutate()} disabled={save.isPending} className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" style={{ background: "var(--color-primary)" }}>
            <Save className="size-4" /> Save
          </button>
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-semibold">
            <Printer className="size-4" /> Print / PDF
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="no-print space-y-5 rounded-xl border bg-white p-5">
          <Section title="Personal">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Full name" value={data.name} onChange={(v) => set("name", v)} />
              <Input label="Title / Role" value={data.title} onChange={(v) => set("title", v)} />
              <Input label="Email" value={data.email} onChange={(v) => set("email", v)} />
              <Input label="Phone" value={data.phone} onChange={(v) => set("phone", v)} />
              <Input label="Location" value={data.location} onChange={(v) => set("location", v)} />
              <Input label="Website" value={data.website} onChange={(v) => set("website", v)} />
              <Input label="LinkedIn" value={data.linkedin} onChange={(v) => set("linkedin", v)} />
              <Input label="GitHub" value={data.github} onChange={(v) => set("github", v)} />
              <Input label="Photo URL (optional)" value={data.photo} onChange={(v) => set("photo", v)} className="col-span-2" />
            </div>
          </Section>

          <Section title="Summary">
            <Textarea value={data.summary} onChange={(v) => set("summary", v)} rows={3} placeholder="2-3 sentence professional summary" />
          </Section>

          <Section title="Skills & Languages">
            <Textarea label="Skills (comma separated)" value={data.skills} onChange={(v) => set("skills", v)} placeholder="React, Node.js, SQL, AWS" />
            <Textarea label="Languages" value={data.languages} onChange={(v) => set("languages", v)} placeholder="English (fluent), Bengali (native)" />
          </Section>

          <Repeater
            title="Experience"
            items={data.experience}
            onChange={(items) => set("experience", items)}
            create={() => ({ id: uid(), role: "", company: "", period: "", bullets: "" })}
            render={(item, update) => (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Role" value={item.role} onChange={(v) => update({ ...item, role: v })} />
                  <Input label="Company" value={item.company} onChange={(v) => update({ ...item, company: v })} />
                </div>
                <Input label="Period (e.g. 2022 - Present)" value={item.period} onChange={(v) => update({ ...item, period: v })} />
                <Textarea label="Bullets (one per line)" value={item.bullets} onChange={(v) => update({ ...item, bullets: v })} rows={4} />
              </>
            )}
          />

          <Repeater
            title="Education"
            items={data.education}
            onChange={(items) => set("education", items)}
            create={() => ({ id: uid(), degree: "", school: "", period: "", details: "" })}
            render={(item, update) => (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Degree" value={item.degree} onChange={(v) => update({ ...item, degree: v })} />
                  <Input label="School" value={item.school} onChange={(v) => update({ ...item, school: v })} />
                </div>
                <Input label="Period" value={item.period} onChange={(v) => update({ ...item, period: v })} />
                <Textarea label="Details" value={item.details} onChange={(v) => update({ ...item, details: v })} rows={2} />
              </>
            )}
          />

          <Repeater
            title="Projects"
            items={data.projects}
            onChange={(items) => set("projects", items)}
            create={() => ({ id: uid(), name: "", link: "", description: "" })}
            render={(item, update) => (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Name" value={item.name} onChange={(v) => update({ ...item, name: v })} />
                  <Input label="Link" value={item.link} onChange={(v) => update({ ...item, link: v })} />
                </div>
                <Textarea label="Description" value={item.description} onChange={(v) => update({ ...item, description: v })} rows={2} />
              </>
            )}
          />
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="cv-print-area rounded-xl border bg-white p-8 shadow-sm">
            {style === "standard" ? <StandardCv d={data} /> : <PremiumCv d={data} />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Form primitives --- */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{title}</h3>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  );
}
function Input({ label, value, onChange, className = "" }: { label?: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="text-[11px] font-medium text-muted-foreground">{label}</span>}
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-0.5 w-full rounded-md border px-2.5 py-1.5 text-sm" />
    </label>
  );
}
function Textarea({ label, value, onChange, rows = 3, placeholder }: { label?: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <label className="block">
      {label && <span className="text-[11px] font-medium text-muted-foreground">{label}</span>}
      <textarea rows={rows} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="mt-0.5 w-full rounded-md border px-2.5 py-1.5 text-sm" />
    </label>
  );
}
function Repeater<T extends { id: string }>({
  title, items, onChange, create, render,
}: { title: string; items: T[]; onChange: (items: T[]) => void; create: () => T; render: (item: T, update: (n: T) => void) => React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{title}</h3>
        <button onClick={() => onChange([...items, create()])} className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
          <Plus className="size-3.5" /> Add
        </button>
      </div>
      <div className="mt-2 space-y-3">
        {items.map((it) => (
          <div key={it.id} className="rounded-md border p-3 relative">
            <button onClick={() => onChange(items.filter((x) => x.id !== it.id))} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" aria-label="Remove">
              <Trash2 className="size-3.5" />
            </button>
            <div className="space-y-2">
              {render(it, (n) => onChange(items.map((x) => (x.id === it.id ? n : x))))}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground italic">No entries yet. Click Add to create one.</p>
        )}
      </div>
    </div>
  );
}

/* --- CV previews --- */
function ContactBar({ d }: { d: Payload }) {
  const items = [
    { i: <Mail className="size-3" />, t: d.email },
    { i: <Phone className="size-3" />, t: d.phone },
    { i: <MapPin className="size-3" />, t: d.location },
    { i: <Globe className="size-3" />, t: d.website },
    { i: <Linkedin className="size-3" />, t: d.linkedin },
    { i: <Github className="size-3" />, t: d.github },
  ].filter((x) => x.t);
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-700">
      {items.map((x, i) => (
        <span key={i} className="inline-flex items-center gap-1">{x.i}{x.t}</span>
      ))}
    </div>
  );
}

function StandardCv({ d }: { d: Payload }) {
  return (
    <div className="text-black text-[13px] leading-snug">
      <header className="border-b-2 border-black pb-2">
        <h2 className="text-2xl font-bold tracking-tight">{d.name || "Your Name"}</h2>
        {d.title && <p className="text-sm font-medium">{d.title}</p>}
        <div className="mt-1.5"><ContactBar d={d} /></div>
      </header>
      {d.summary && <CvSection h="Professional Summary"><p>{d.summary}</p></CvSection>}
      {d.skills && <CvSection h="Skills"><p>{d.skills}</p></CvSection>}
      {d.experience.length > 0 && (
        <CvSection h="Experience">
          {d.experience.map((e) => (
            <div key={e.id} className="mb-2.5">
              <div className="flex justify-between font-semibold"><span>{e.role}{e.company && ` · ${e.company}`}</span><span className="text-xs font-normal">{e.period}</span></div>
              {e.bullets && (
                <ul className="ml-4 list-disc text-[12.5px]">
                  {e.bullets.split("\n").filter(Boolean).map((b, i) => <li key={i}>{b.replace(/^[-•*]\s*/, "")}</li>)}
                </ul>
              )}
            </div>
          ))}
        </CvSection>
      )}
      {d.projects.length > 0 && (
        <CvSection h="Projects">
          {d.projects.map((p) => (
            <div key={p.id} className="mb-1.5">
              <div className="font-semibold">{p.name}{p.link && <span className="ml-2 font-normal text-xs">{p.link}</span>}</div>
              {p.description && <p className="text-[12.5px]">{p.description}</p>}
            </div>
          ))}
        </CvSection>
      )}
      {d.education.length > 0 && (
        <CvSection h="Education">
          {d.education.map((e) => (
            <div key={e.id} className="mb-1.5">
              <div className="flex justify-between font-semibold"><span>{e.degree}{e.school && ` · ${e.school}`}</span><span className="text-xs font-normal">{e.period}</span></div>
              {e.details && <p className="text-[12.5px]">{e.details}</p>}
            </div>
          ))}
        </CvSection>
      )}
      {d.languages && <CvSection h="Languages"><p>{d.languages}</p></CvSection>}
    </div>
  );
}

function PremiumCv({ d }: { d: Payload }) {
  return (
    <div className="grid grid-cols-3 gap-4 text-[12.5px] leading-snug text-black">
      <aside className="col-span-1 rounded-md p-4 text-white" style={{ background: "var(--color-primary)" }}>
        {d.photo && <img src={d.photo} alt="" className="mb-3 size-24 rounded-full object-cover ring-2 ring-white/30" />}
        <h2 className="text-lg font-bold leading-tight">{d.name || "Your Name"}</h2>
        {d.title && <p className="mt-0.5 text-xs opacity-90">{d.title}</p>}
        <div className="mt-3 space-y-1.5 text-[11px]">
          {d.email && <p className="flex items-start gap-1.5"><Mail className="size-3 mt-0.5 shrink-0" />{d.email}</p>}
          {d.phone && <p className="flex items-start gap-1.5"><Phone className="size-3 mt-0.5 shrink-0" />{d.phone}</p>}
          {d.location && <p className="flex items-start gap-1.5"><MapPin className="size-3 mt-0.5 shrink-0" />{d.location}</p>}
          {d.website && <p className="flex items-start gap-1.5"><Globe className="size-3 mt-0.5 shrink-0" />{d.website}</p>}
          {d.linkedin && <p className="flex items-start gap-1.5"><Linkedin className="size-3 mt-0.5 shrink-0" />{d.linkedin}</p>}
          {d.github && <p className="flex items-start gap-1.5"><Github className="size-3 mt-0.5 shrink-0" />{d.github}</p>}
        </div>
        {d.skills && (
          <div className="mt-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--color-accent)" }}>Skills</h3>
            <div className="mt-1 flex flex-wrap gap-1">
              {d.skills.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                <span key={s} className="rounded bg-white/15 px-1.5 py-0.5 text-[10px]">{s}</span>
              ))}
            </div>
          </div>
        )}
        {d.languages && (
          <div className="mt-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--color-accent)" }}>Languages</h3>
            <p className="mt-1 text-[11px]">{d.languages}</p>
          </div>
        )}
      </aside>
      <main className="col-span-2 space-y-3">
        {d.summary && <CvSection h="Summary"><p>{d.summary}</p></CvSection>}
        {d.experience.length > 0 && (
          <CvSection h="Experience">
            {d.experience.map((e) => (
              <div key={e.id} className="mb-2.5">
                <div className="flex justify-between font-semibold"><span>{e.role}{e.company && ` · ${e.company}`}</span><span className="text-xs font-normal">{e.period}</span></div>
                {e.bullets && (
                  <ul className="ml-4 list-disc">
                    {e.bullets.split("\n").filter(Boolean).map((b, i) => <li key={i}>{b.replace(/^[-•*]\s*/, "")}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </CvSection>
        )}
        {d.projects.length > 0 && (
          <CvSection h="Projects">
            {d.projects.map((p) => (
              <div key={p.id} className="mb-1.5">
                <div className="font-semibold">{p.name}{p.link && <span className="ml-2 font-normal text-xs">{p.link}</span>}</div>
                {p.description && <p>{p.description}</p>}
              </div>
            ))}
          </CvSection>
        )}
        {d.education.length > 0 && (
          <CvSection h="Education">
            {d.education.map((e) => (
              <div key={e.id} className="mb-1.5">
                <div className="flex justify-between font-semibold"><span>{e.degree}{e.school && ` · ${e.school}`}</span><span className="text-xs font-normal">{e.period}</span></div>
                {e.details && <p>{e.details}</p>}
              </div>
            ))}
          </CvSection>
        )}
      </main>
    </div>
  );
}

function CvSection({ h, children }: { h: string; children: React.ReactNode }) {
  return (
    <section className="mt-3">
      <h3 className="border-b border-current/20 pb-0.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>{h}</h3>
      <div className="mt-1.5">{children}</div>
    </section>
  );
}
