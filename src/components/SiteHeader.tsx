import Link from "next/link";

export function SiteHeader({
  title,
  backHref,
}: {
  title: string;
  backHref?: string;
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-cream/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        {backHref ? (
          <Link href={backHref} className="text-sm text-muted">
            Voltar
          </Link>
        ) : null}
        <p className="font-display text-lg">{title}</p>
      </div>
    </header>
  );
}
