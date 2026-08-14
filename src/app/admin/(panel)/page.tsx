import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [products, contributions] = await Promise.all([
    prisma.product.findMany({ include: { contributions: true } }),
    prisma.contribution.findMany({
      where: { status: "confirmed" },
      include: { product: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);
  const total = await prisma.contribution.aggregate({
    where: { status: "confirmed" },
    _sum: { amountCents: true },
    _count: true,
  });

  return (
    <main className="space-y-6">
      <h1 className="font-display text-3xl">Painel</h1>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card p-4 ring-1 ring-line">
          <p className="text-xs text-muted">Produtos</p>
          <p className="mt-1 font-display text-2xl">{products.length}</p>
        </div>
        <div className="rounded-2xl bg-card p-4 ring-1 ring-line">
          <p className="text-xs text-muted">Já juntado</p>
          <p className="mt-1 font-display text-2xl">
            {formatBRL(total._sum.amountCents || 0)}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          href="/admin/produtos/novo"
          className="rounded-xl bg-clay px-4 py-2 text-sm font-semibold text-white"
        >
          Novo produto
        </Link>
        <Link
          href="/admin/contribuicoes"
          className="rounded-xl px-4 py-2 text-sm font-medium ring-1 ring-line"
        >
          Ver comprovantes
        </Link>
      </div>
      <section className="space-y-3">
        <h2 className="font-display text-xl">Últimas ajudas</h2>
        {contributions.length === 0 ? (
          <p className="text-sm text-muted">Nenhuma contribuição ainda.</p>
        ) : (
          contributions.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-card p-4 text-sm ring-1 ring-line"
            >
              <p className="font-medium">{item.contributorName}</p>
              <p className="text-muted">
                {item.product.name} · {formatBRL(item.amountCents)}
              </p>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
