export function SiteFooter() {
  return (
    <footer className="mt-16 border-t glass">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm md:grid-cols-3 md:px-6">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="inline-block size-6 rounded-md" style={{ background: "var(--color-accent)" }} />
            TalentBD
          </div>
          <p className="mt-2 text-muted-foreground">Bangladesh's learn-and-earn platform for engineers and professionals.</p>
        </div>
        <div>
          <h4 className="font-semibold">Job seekers</h4>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li><a href="/jobs">Browse jobs</a></li>
            <li><a href="/companies">Companies</a></li>
            <li><a href="/cv-builder">CV Builder</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Learn</h4>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li><a href="/learn">Courses</a></li>
            <li><a href="/assessments">Certifications</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t px-4 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TalentBD. All rights reserved.
      </div>
    </footer>
  );
}
