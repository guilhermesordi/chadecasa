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
    <main className="mx-auto min-h-full max-w-6xl px-4 pb-20 pt-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-card px-5 py-8 ring-1 ring-line sm:px-8 sm:py-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#f3e4d2]/60"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-[#e8f0e4]/70"
        />

        <p className="relative text-sm font-medium text-clay">
          Com carinho, da nossa casa nova 🏡💛
        </p>
        <h1 className="relative mt-2 font-display text-4xl leading-[1.15] sm:text-5xl">
          {settings.eventTitle}
          {settings.hostName ? (
            <>
              <span className="text-muted"> · </span>
              <span>{settings.hostName}</span>
            </>
          ) : null}
        </h1>
        <p className="relative mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {settings.welcomeText}
        </p>
        <div className="relative mt-6 flex flex-wrap gap-2 text-sm text-ink">
          <span className="rounded-full bg-cream px-3 py-1.5 ring-1 ring-line">
            😊 Sem pressão
          </span>
          <span className="rounded-full bg-cream px-3 py-1.5 ring-1 ring-line">
            ✨ Qualquer valor ajuda
          </span>
          <span className="rounded-full bg-cream px-3 py-1.5 ring-1 ring-line">
            🤝 Pode dividir um item
          </span>
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl">
            Lista de opções de presentes
          </h2>
          <p className="mt-1 text-sm text-muted">
            Olha com calma e escolhe o que fizer sentido pra você — no valor que
            couber.
          </p>
        </div>
        {open.length === 0 ? (
          <p className="rounded-2xl bg-sage/10 px-4 py-5 text-sm leading-relaxed text-sage">
            {products.length === 0
              ? "Ainda estamos montando a lista. Volta já já ✨"
              : "Uau, tudo da listinha já foi abraçado. Obrigado de coração 💛"}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {open.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {done.length > 0 ? (
        <section className="mt-12 space-y-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl">
              Já chegou com carinho ✨
            </h2>
            <p className="mt-1 text-sm text-muted">
              Esses itens a gente já conseguiu junto.
            </p>
          </div>
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
