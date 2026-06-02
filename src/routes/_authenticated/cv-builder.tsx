import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getMyCv, saveMyCv } from "@/lib/cv.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/cv-builder")({
  head: () => ({ meta: [{ title: "CV Builder — Learn & Earn" }, { name: "description", content: "Build a standard or premium CV, print-ready." }] }),
  component: CvBuilder,
});

type Payload = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string;
  experience: string;
  education: string;
};

const empty: Payload = { name: "", title: "", email: "", phone: "", location: "", summary: "", skills: "", experience: "", education: "" };

function CvBuilder() {
  const getFn = useServerFn(getMyCv);
  const saveFn = useServerFn(saveMyCv);
  const q = useQuery({ queryKey: ["my-cv"], queryFn: () => getFn() });
  const [style, setStyle] = useState<"standard" | "premium">("standard");
  const [data, setData] = useState<Payload>(empty);

  useEffect(() => {
    if (q.data) {
      setStyle((q.data.selected_style as any) ?? "standard");
      setData({ ...empty, ...(q.data.builder_payload as any) });
    }
  }, [q.data]);

  const save = useMutation({
    mutationFn: () => saveFn({ data: { selected_style: style, builder_payload: data as any } }),
    onSuccess: () => toast.success("CV saved"),
    onError: (e: any) => toast.error(e.message),
  });

  function field<K extends keyof Payload>(k: K) {
    return {
      value: data[k],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setData({ ...data, [k]: e.target.value }),
    };
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 page-enter">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">CV Builder</h1>
        <div className="flex items-center gap-2">
          <select value={style} onChange={(e) => setStyle(e.target.value as any)} className="rounded-md border px-3 py-2 text-sm">
            <option value="standard">Standard (B&W)</option>
            <option value="premium">Premium (Two-column)</option>
          </select>
          <button onClick={() => save.mutate()} className="rounded-md px-4 py-2 text-sm font-semibold" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>Save</button>
          <button onClick={() => window.print()} className="rounded-md border px-4 py-2 text-sm font-semibold">Print / PDF</button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="no-print space-y-3 rounded-xl border bg-white p-5">
          <Input label="Full name" {...field("name")} />
          <Input label="Title / Role" {...field("title")} />
          <Input label="Email" {...field("email")} />
          <Input label="Phone" {...field("phone")} />
          <Input label="Location" {...field("location")} />
          <Textarea label="Summary" {...field("summary")} />
          <Textarea label="Skills (comma separated)" {...field("skills")} />
          <Textarea label="Experience" {...field("experience")} rows={6} />
          <Textarea label="Education" {...field("education")} />
        </div>

        <div className="cv-print-area rounded-xl border bg-white p-8 shadow-sm">
          {style === "standard" ? <StandardCv d={data} /> : <PremiumCv d={data} />}
        </div>
      </div>
    </div>
  );
}

function Input(props: { label: string; value: string; onChange: any }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{props.label}</span>
      <input value={props.value} onChange={props.onChange} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
    </label>
  );
}
function Textarea(props: { label: string; value: string; onChange: any; rows?: number }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{props.label}</span>
      <textarea rows={props.rows ?? 3} value={props.value} onChange={props.onChange} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
    </label>
  );
}
function StandardCv({ d }: { d: Payload }) {
  return (
    <div className="text-black">
      <h2 className="text-2xl font-bold">{d.name || "Your Name"}</h2>
      <p className="text-sm">{d.title}</p>
      <p className="mt-1 text-xs text-gray-600">{[d.email, d.phone, d.location].filter(Boolean).join(" · ")}</p>
      <hr className="my-3 border-black" />
      <Section h="Summary"><p className="text-sm">{d.summary}</p></Section>
      <Section h="Skills"><p className="text-sm">{d.skills}</p></Section>
      <Section h="Experience"><pre className="whitespace-pre-wrap text-sm font-sans">{d.experience}</pre></Section>
      <Section h="Education"><pre className="whitespace-pre-wrap text-sm font-sans">{d.education}</pre></Section>
    </div>
  );
}
function PremiumCv({ d }: { d: Payload }) {
  return (
    <div className="grid grid-cols-3 gap-4 text-sm">
      <aside className="col-span-1 rounded p-4 text-white" style={{ background: "var(--color-primary)" }}>
        <h2 className="text-xl font-bold leading-tight">{d.name || "Your Name"}</h2>
        <p className="mt-1 text-xs opacity-90">{d.title}</p>
        <div className="mt-4 space-y-2 text-xs">
          <p>{d.email}</p>
          <p>{d.phone}</p>
          <p>{d.location}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-xs font-semibold uppercase" style={{ color: "var(--color-accent)" }}>Skills</h3>
          <p className="mt-1 text-xs">{d.skills}</p>
        </div>
      </aside>
      <main className="col-span-2 space-y-4">
        <Section h="Summary"><p>{d.summary}</p></Section>
        <Section h="Experience"><pre className="whitespace-pre-wrap font-sans">{d.experience}</pre></Section>
        <Section h="Education"><pre className="whitespace-pre-wrap font-sans">{d.education}</pre></Section>
      </main>
    </div>
  );
}
function Section({ h, children }: { h: string; children: React.ReactNode }) {
  return (
    <section className="mt-3">
      <h3 className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--color-primary)" }}>{h}</h3>
      <div className="mt-1">{children}</div>
    </section>
  );
}
