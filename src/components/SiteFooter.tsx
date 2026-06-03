import { Link } from "@tanstack/react-router";
import { BrandMark } from "@/components/Brand";
import { Facebook, Linkedin, Twitter, Youtube, Globe } from "lucide-react";

type Col = { title: string; links: { label: string; to: string }[] };

const columns: Col[] = [
  {
    title: "Jobs",
    links: [
      { label: "All jobs", to: "/jobs" },
      { label: "Remote jobs", to: "/jobs?remote=remote" },
      { label: "IT / Software", to: "/jobs?category=IT%2FSoftware" },
      { label: "Engineering", to: "/jobs?category=Engineering" },
      { label: "Banking / Finance", to: "/jobs?category=Banking%2FFinance" },
      { label: "Marketing", to: "/jobs?category=Marketing" },
      { label: "Internships", to: "/jobs?type=Internship" },
      { label: "Hot / Featured", to: "/jobs#featured" },
    ],
  },
  {
    title: "Companies",
    links: [
      { label: "Browse companies", to: "/companies" },
      { label: "Top employers", to: "/companies" },
      { label: "Salaries", to: "/salaries" },
      { label: "Company reviews", to: "/companies" },
    ],
  },
  {
    title: "Career",
    links: [
      { label: "CV Builder", to: "/cv-builder" },
      { label: "CV / ATS Parser", to: "/cv-parser" },
      { label: "Career advice", to: "/career-advice" },
      { label: "Interview prep", to: "/interview-prep" },
      { label: "My applications", to: "/my-applications" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "All tracks", to: "/learn" },
      { label: "Certifications", to: "/assessments" },
      { label: "Computer Science", to: "/learn" },
      { label: "Electrical & Electronic", to: "/learn" },
      { label: "Civil Engineering", to: "/learn" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About TalentBD", to: "/" },
      { label: "For employers", to: "/auth" },
      { label: "Help center", to: "/career-advice" },
      { label: "Sign in", to: "/auth" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-gradient-to-b from-transparent to-[oklch(0.18_0.04_265)] text-white/90">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        {/* Brand row */}
        <div className="grid gap-8 md:grid-cols-[1.2fr_3fr]">
          <div>
            <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight">
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-white/10 p-1.5 ring-1 ring-white/20">
                <BrandMark size={28} />
              </span>
              <span className="text-xl">TalentBD</span>
              <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">Premium</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-white/70">
              Bangladesh's premium learn-and-earn platform. Build skills, earn verified credentials, and land local or global remote jobs.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[
                { Icon: Facebook, href: "https://facebook.com" },
                { Icon: Linkedin, href: "https://linkedin.com" },
                { Icon: Twitter, href: "https://twitter.com" },
                { Icon: Youtube, href: "https://youtube.com" },
                { Icon: Globe, href: "https://w3schools.com" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 transition hover:bg-white/20 hover:scale-110"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-white">{col.title}</h4>
                <ul className="mt-3 space-y-2 text-sm text-white/70">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="transition hover:text-white hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-12 grid gap-4 rounded-xl bg-white/5 p-5 ring-1 ring-white/10 md:grid-cols-4 text-center">
          {[
            ["10K+", "Active learners"],
            ["500+", "Live jobs"],
            ["120+", "Hiring companies"],
            ["80%", "Pass rate to certify"],
          ].map(([n, l]) => (
            <div key={l as string}>
              <div className="text-2xl font-extrabold text-gradient">{n}</div>
              <div className="text-xs text-white/60">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-white/60 md:flex-row md:px-6">
          <p>© {new Date().getFullYear()} TalentBD. Built in Bangladesh.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <a href="/" className="hover:text-white">Privacy</a>
            <a href="/" className="hover:text-white">Terms</a>
            <a href="/" className="hover:text-white">Cookie policy</a>
            <a href="/" className="hover:text-white">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
