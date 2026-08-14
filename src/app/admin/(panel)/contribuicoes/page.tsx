import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/money";
import { confirmContribution, rejectContribution } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export default async function ContributionsPage() {
  const items = await prisma.contribution.findMany({
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="space-y-4">
      <h1 className="font-display text-3xl">Ajudas</h1>
      <p className="text-sm text-muted">
        Nomes e comprovantes para agradecer. Se o PIX não cair, rejeite — o %
        volta para a lista.
      </p>
      {items.length === 0 ? (
        <p className="text-sm text-muted">Nada enviado ainda.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="space-y-2 rounded-2xl bg-card p-4 text-sm ring-1 ring-line"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{item.contributorName}</p>
                  <p className="text-muted">
                    {item.product.name} · {formatBRL(item.amountCents)}
                  </p>
                  <p className="text-xs text-muted">
                    {item.createdAt.toLocaleString("pt-BR")} ·{" "}
                    {item.status === "confirmed" ? "contado na lista" : "rejeitado"}
                  </p>
                </div>
              </div>
              <a
                href={`/admin/comprovantes/${item.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-sm font-medium text-clay"
              >
                Ver comprovante
              </a>
              {item.status === "confirmed" ? (
                <form action={rejectContribution}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className="text-sm text-red-700">
                    Rejeitar (devolver %)
                  </button>
                </form>
              ) : (
                <form action={confirmContribution}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className="text-sm text-sage">
                    Contar de novo
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
