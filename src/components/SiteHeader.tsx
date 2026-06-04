import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, LogOut, ChevronDown, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { BrandMark } from "@/components/Brand";
import { useServerFn } from "@tanstack/react-start";
import { getMyProfile } from "@/lib/profile.functions";
import { useQuery } from "@tanstack/react-query";

type NavItem = { to: string; label: string; children?: { to: string; label: string; desc?: string }[] };

const baseNav: NavItem[] = [
  {
    to: "/jobs",
    label: "Jobs",
    children: [
      { to: "/jobs", label: "All jobs", desc: "Local Bangladesh + global remote" },
      { to: "/jobs?remote=remote", label: "Remote jobs", desc: "Live feed via Remotive" },
      { to: "/jobs?type=Internship", label: "Internships", desc: "Kickstart your career" },
      { to: "/salaries", label: "Salaries", desc: "Pay benchmarks by role" },
    ],
  },
  {
    to: "/companies",
    label: "Companies",
    children: [
      { to: "/companies", label: "Browse companies", desc: "Profiles & open roles" },
      { to: "/salaries", label: "Salary insights", desc: "Compensation data" },
    ],
  },
  {
    to: "/learn",
    label: "Learn",
    children: [
      { to: "/learn", label: "All tracks", desc: "CSE, EEE & Civil" },
      { to: "/assessments", label: "Certifications", desc: "Verified credentials" },
    ],
  },
  {
    to: "/career-advice",
    label: "Career",
    children: [
      { to: "/career-advice", label: "Career advice", desc: "Guides & playbooks" },
      { to: "/interview-prep", label: "Interview prep", desc: "Practice + checklists" },
      { to: "/cv-builder", label: "CV Builder", desc: "Standard + Premium templates" },
      { to: "/cv-parser", label: "CV / ATS Parser", desc: "Match your CV to a job" },
    ],
  },
];

export function SiteHeader() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const nav = useNavigate();

  const fetchProfile = useServerFn(getMyProfile);
  const { data: profileData } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => fetchProfile({}),
    enabled: !!user,
  });
  const isAdmin = profileData?.isAdmin ?? false;

  async function signOut() {
    await supabase.auth.signOut();
    nav({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-40 w-full glass-header text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight group">
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-white/10 p-1 ring-1 ring-white/20 transition group-hover:bg-white/20">
            <BrandMark size={28} />
          </span>
          <span className="text-lg">TalentBD</span>
          <span className="hidden sm:inline ml-1 rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/90">Premium</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link to="/" className="rounded-md px-3 py-1.5 text-sm font-medium opacity-90 hover:opacity-100 hover:bg-white/10 transition" activeProps={{ style: { color: "var(--color-accent)", opacity: 1 } }} activeOptions={{ exact: true }}>Home</Link>
          {baseNav.map((item) => (
            <div key={item.label} className="relative" onMouseEnter={() => setHover(item.label)} onMouseLeave={() => setHover(null)}>
              <a
                href={item.to}
                className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium opacity-90 hover:opacity-100 hover:bg-white/10 transition"
              >
                {item.label}
                {item.children && <ChevronDown className="size-3.5 opacity-70" />}
              </a>
              {item.children && hover === item.label && (
                <div className="absolute left-0 top-full pt-2 z-50">
                  <div className="glass min-w-[260px] rounded-xl border border-white/10 p-2 shadow-2xl text-foreground">
                    {item.children.map((c) => (
                      <a
                        key={c.to + c.label}
                        href={c.to}
                        className="block rounded-lg px-3 py-2 text-sm hover:bg-white/60"
                      >
                        <div className="font-semibold">{c.label}</div>
                        {c.desc && <div className="text-xs text-muted-foreground">{c.desc}</div>}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {user && (
            <Link to="/dashboard" className="rounded-md px-3 py-1.5 text-sm font-medium opacity-90 hover:opacity-100 hover:bg-white/10 transition" activeProps={{ style: { color: "var(--color-accent)", opacity: 1 } }}>Dashboard</Link>
          )}
          {user && isAdmin && (
            <Link to="/admin/dashboard" className="rounded-md px-3 py-1.5 text-sm font-medium opacity-90 hover:opacity-100 hover:bg-white/10 transition flex items-center gap-1" activeProps={{ style: { color: "var(--color-accent)", opacity: 1 } }}>
              <ShieldCheck className="size-3.5" /> Admin
            </Link>
          )}
          {user ? (
            <button onClick={signOut} className="ml-2 inline-flex items-center gap-1 rounded-md border border-white/30 px-3 py-1.5 text-sm hover:bg-white/10">
              <LogOut className="size-4" /> Sign out
            </button>
          ) : (
            <Link to="/auth" className="ml-2 rounded-md px-3 py-1.5 text-sm font-semibold" style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}>
              Sign in
            </Link>
          )}
        </nav>

        <button className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/10 px-4 pb-4 glass-header max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-1 pt-2">
            <Link to="/" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-white/10">Home</Link>
            {baseNav.map((item) => (
              <div key={item.label} className="border-t border-white/10 pt-2 mt-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60">{item.label}</div>
                {(item.children ?? [{ to: item.to, label: item.label }]).map((c) => (
                  <a key={c.to + c.label} href={c.to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm hover:bg-white/10">
                    {c.label}
                  </a>
                ))}
              </div>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="mt-2 rounded-md px-3 py-2 text-sm hover:bg-white/10">Dashboard</Link>
                {isAdmin && (
                  <Link to="/admin/dashboard" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-white/10 flex items-center gap-1">
                    <ShieldCheck className="size-3.5" /> Admin
                  </Link>
                )}
                <Link to="/my-applications" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-white/10">My applications</Link>
                <button onClick={signOut} className="mt-2 rounded-md border border-white/30 px-3 py-2 text-left text-sm">Sign out</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="mt-2 rounded-md px-3 py-2 text-sm font-semibold" style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
