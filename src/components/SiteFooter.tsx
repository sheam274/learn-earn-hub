export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-muted-foreground md:px-6">
        © {new Date().getFullYear()} Learn &amp; Earn — Engineering careers, accelerated.
      </div>
    </footer>
  );
}
