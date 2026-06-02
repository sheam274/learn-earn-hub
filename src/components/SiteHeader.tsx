import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/jobs", label: "Jobs" },
];
const authedLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/learn", label: "Learn" },
  { to: "/assessments", label: "Assessments" },
  { to: "/cv-builder", label: "CV Builder" },
  { to: "/cv-parser", label: "CV Parser" },
  { to: "/jobs", label: "Jobs" },
];

export function SiteHeader() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const links = user ? authedLinks : publicLinks;

  async function signOut() {
    await supabase.auth.signOut();
    nav({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-40 w-full" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="inline-block size-7 rounded-md" style={{ background: "var(--color-accent)" }} />
          <span className="text-lg">Learn &amp; Earn</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-1.5 text-sm font-medium opacity-90 hover:opacity-100"
              activeProps={{ style: { color: "var(--color-accent)", opacity: 1 } }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={signOut}
              className="ml-2 inline-flex items-center gap-1 rounded-md border border-white/30 px-3 py-1.5 text-sm hover:bg-white/10"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          ) : (
            <Link
              to="/auth"
              className="ml-2 rounded-md px-3 py-1.5 text-sm font-semibold"
              style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}
            >
              Sign in
            </Link>
          )}
        </nav>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 px-4 pb-4">
          <div className="flex flex-col gap-1 pt-2">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-white/10">
                {l.label}
              </Link>
            ))}
            {user ? (
              <button onClick={signOut} className="mt-2 rounded-md border border-white/30 px-3 py-2 text-left text-sm">Sign out</button>
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
