import Link from "next/link";
import { remainingCents, formatBRL, percentOf } from "@/lib/money";
import { ProgressBar } from "./ProgressBar";

type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  priceCents: number;
  contributions: { amountCents: number; status: string }[];
};

export function ProductCard({ product }: { product: Product }) {
  const remaining = remainingCents(product.priceCents, product.contributions);
  const funded = product.priceCents - remaining;
  const fundedPct = percentOf(funded, product.priceCents);
  const done = remaining <= 0;

  return (
    <Link
      href={`/produtos/${product.id}`}
      className="block overflow-hidden rounded-2xl bg-card ring-1 ring-line transition hover:ring-clay/40"
    >
      <div className="relative aspect-[4/3] bg-line">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#efe6d8] text-3xl font-display text-clay">
            {product.name.slice(0, 1)}
          </div>
        )}
        {done ? (
          <span className="absolute right-3 top-3 rounded-full bg-sage px-3 py-1 text-xs font-semibold text-white">
            Já temos ✨
          </span>
        ) : null}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-lg leading-tight">{product.name}</h2>
          <p className="shrink-0 text-sm text-muted">{formatBRL(product.priceCents)}</p>
        </div>
        <ProgressBar funded={funded} total={product.priceCents} />
        <p className="text-xs text-muted">
          {done
            ? "Completinho, obrigado 💛"
            : funded > 0
              ? `${fundedPct}% já veio com carinho · ainda dá pra somar`
              : "Pode contribuir com o que couber no bolso 🙂"}
        </p>
      </div>
    </Link>
  );
}
