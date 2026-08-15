import Link from "next/link";

export default function ObrigadoPage() {
  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col justify-center px-6 py-16 text-center">
      <p className="text-4xl" aria-hidden>
        🥰💛
      </p>
      <h1 className="mt-3 font-display text-4xl">Muito obrigado</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Seu carinho já entrou na lista. Guardamos seu nome pra gente agradecer
        de verdade depois — de coração.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-xl bg-clay px-5 py-3 text-sm font-semibold text-white"
      >
        Voltar pra listinha
      </Link>
    </main>
  );
}
