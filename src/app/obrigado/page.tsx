import Link from "next/link";

export default function ObrigadoPage() {
  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col justify-center px-6 py-16 text-center">
      <h1 className="font-display text-4xl">Obrigado</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Seu comprovante foi salvo. A lista já atualizou com a sua parte, e
        guardamos seu nome para agradecer depois.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-xl bg-clay px-5 py-3 text-sm font-semibold text-white"
      >
        Voltar para a lista
      </Link>
    </main>
  );
}
