import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { formatBRL, percentOf, remainingCents } from "@/lib/money";
import { SiteHeader } from "@/components/SiteHeader";
import { ProgressBar } from "@/components/ProgressBar";
import { ContributeFlow } from "@/components/ContributeFlow";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, settings] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { contributions: true },
    }),
    getSettings(),
  ]);

  if (!product || !product.active) {
    notFound();
  }

  const remaining = remainingCents(product.priceCents, product.contributions);
  const funded = product.priceCents - remaining;
  const leftPct = percentOf(remaining, product.priceCents);

  return (
    <div className="min-h-full">
      <SiteHeader title={product.name} backHref="/" />
      <main className="mx-auto max-w-lg px-4 py-5 pb-16">
        <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-line">
          <div className="aspect-[4/3] bg-line">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt=""
                className="h-full w-full object-contain object-center p-3"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[#efe6d8] font-display text-6xl text-clay">
                {product.name.slice(0, 1)}
              </div>
            )}
          </div>
          <div className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <h1 className="font-display text-2xl leading-tight">{product.name}</h1>
              <p className="shrink-0 font-semibold">{formatBRL(product.priceCents)}</p>
            </div>
            {product.description ? (
              <p className="text-sm leading-relaxed text-muted">{product.description}</p>
            ) : null}
            <p className="rounded-xl bg-cream px-3 py-2 text-sm text-ink">
              Sem pressão 💛 pode ser o valor todo ou só uma parte — o que
              fizer sentido pra você.
            </p>
            <ProgressBar funded={funded} total={product.priceCents} />
            <p className="text-sm text-muted">
              {remaining <= 0
                ? "Completinho, obrigado ✨"
                : funded > 0
                  ? `${leftPct}% ainda pode receber carinho · faltam ${formatBRL(remaining)}`
                  : `Valor total: ${formatBRL(product.priceCents)} · contribui com o que quiser`}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <ContributeFlow
            productId={product.id}
            priceCents={product.priceCents}
            remainingCents={remaining}
            pixKey={settings.pixKey}
            pixName={settings.pixName}
          />
        </div>
      </main>
    </div>
  );
}
