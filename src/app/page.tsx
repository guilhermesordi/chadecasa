import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [settings, products] = await Promise.all([
    getSettings(),
    prisma.product.findMany({
      where: { active: true },
      include: { contributions: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const open = products.filter((product) => {
    const paid = product.contributions
      .filter((item) => item.status === "confirmed")
      .reduce((sum, item) => sum + item.amountCents, 0);
    return paid < product.priceCents;
  });
  const done = products.filter((product) => !open.includes(product));

  return (
    <main className="mx-auto min-h-full max-w-6xl px-4 pb-16 pt-8">
      <p className="text-sm font-medium tracking-wide text-clay uppercase">
        Lista de presentes
      </p>
      <h1 className="mt-1 font-display text-4xl leading-tight">
        {settings.eventTitle}
        {settings.hostName ? ` · ${settings.hostName}` : ""}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {settings.welcomeText}
      </p>

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-2xl">Ainda dá pra ajudar</h2>
        {open.length === 0 ? (
          <p className="text-sm text-muted">Todos os itens já foram completados.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {open.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {done.length > 0 ? (
        <section className="mt-10 space-y-4">
          <h2 className="font-display text-2xl">Já temos</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {done.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
