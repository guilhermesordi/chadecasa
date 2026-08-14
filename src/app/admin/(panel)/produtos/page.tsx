import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBRL, remainingCents, percentOf } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { contributions: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="rounded-xl bg-clay px-4 py-2 text-sm font-semibold text-white"
        >
          Novo
        </Link>
      </div>
      <ul className="space-y-3">
        {products.map((product) => {
          const remaining = remainingCents(
            product.priceCents,
            product.contributions,
          );
          const leftPct = percentOf(remaining, product.priceCents);
          return (
            <li key={product.id}>
              <Link
                href={`/admin/produtos/${product.id}`}
                className="block rounded-2xl bg-card p-4 ring-1 ring-line"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm">{formatBRL(product.priceCents)}</p>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {product.active ? "Visível" : "Oculto"} ·{" "}
                  {remaining <= 0
                    ? "completo"
                    : `${leftPct}% ainda compráveis`}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
