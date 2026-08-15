"use client";

import { useActionState, useMemo, useState } from "react";
import { CopyButton } from "./CopyButton";
import { submitContribution } from "@/app/actions/contribute";
import { formatBRL, percentOf } from "@/lib/money";

type Props = {
  productId: string;
  priceCents: number;
  remainingCents: number;
  pixKey: string;
  pixName: string;
};

export function ContributeFlow({
  productId,
  priceCents,
  remainingCents,
  pixKey,
  pixName,
}: Props) {
  const [amount, setAmount] = useState(remainingCents);
  const [step, setStep] = useState<"valor" | "pix" | "comprovante">("valor");
  const [state, action, pending] = useActionState(submitContribution, null);

  const pct = percentOf(amount, priceCents);
  const customLabel = useMemo(
    () =>
      (amount / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [amount],
  );

  function setPctOfRemaining(fraction: number) {
    const next = Math.max(1, Math.round(remainingCents * fraction));
    setAmount(Math.min(remainingCents, next));
  }

  function onCustomChange(value: string) {
    const cents = Math.round(
      Number(value.replace(/\./g, "").replace(",", ".")) * 100,
    );
    if (!Number.isFinite(cents)) return;
    setAmount(Math.min(remainingCents, Math.max(1, cents)));
  }

  if (remainingCents <= 0) {
    return (
      <p className="rounded-2xl bg-sage/10 px-4 py-3 text-sm text-sage">
        Esse item já foi abraçado por completo. Obrigado 💛
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {step === "valor" && (
        <section className="space-y-4 rounded-2xl bg-card p-4 ring-1 ring-line">
          <h2 className="font-display text-xl">Quanto cabe pra você? 🙂</h2>
          <p className="text-sm text-muted">
            Qualquer valor ajuda. Pode ser uma partezinha ou o restante (
            {formatBRL(remainingCents)}).
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[0.25, 0.5, 0.75, 1].map((fraction) => (
              <button
                key={fraction}
                type="button"
                onClick={() => setPctOfRemaining(fraction)}
                className={`rounded-xl py-2 text-sm font-medium ring-1 ${
                  amount ===
                  Math.min(
                    remainingCents,
                    Math.max(1, Math.round(remainingCents * fraction)),
                  )
                    ? "bg-clay text-white ring-clay"
                    : "bg-cream text-ink ring-line"
                }`}
              >
                {fraction === 1 ? "O que falta" : `${fraction * 100}%`}
              </button>
            ))}
          </div>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Valor em reais</span>
            <input
              inputMode="decimal"
              value={customLabel}
              onChange={(event) => onCustomChange(event.target.value)}
              className="w-full rounded-xl border border-line bg-white px-3 py-3 text-base"
            />
          </label>
          <p className="text-sm font-medium">
            {formatBRL(amount)} · {pct}% do produto
          </p>
          <button
            type="button"
            onClick={() => setStep("pix")}
            className="w-full rounded-xl bg-clay py-3 text-sm font-semibold text-white"
          >
            Continuar com carinho
          </button>
        </section>
      )}

      {step === "pix" && (
        <section className="space-y-4 rounded-2xl bg-card p-4 ring-1 ring-line">
          <h2 className="font-display text-xl">
            PIX de {formatBRL(amount)} 💛
          </h2>
          {pixName ? (
            <p className="text-sm text-muted">Titular: {pixName}</p>
          ) : null}
          <div className="break-all rounded-xl bg-cream px-3 py-3 font-mono text-sm">
            {pixKey}
          </div>
          <CopyButton text={pixKey} />
          <p className="text-xs text-muted">
            É só um PIX no seu ritmo. Depois, manda o comprovante pra gente
            registrar o carinho.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setStep("valor")}
              className="rounded-xl py-3 text-sm font-medium ring-1 ring-line"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={() => setStep("comprovante")}
              className="rounded-xl bg-clay py-3 text-sm font-semibold text-white"
            >
              Já paguei
            </button>
          </div>
        </section>
      )}

      {step === "comprovante" && (
        <section className="space-y-4 rounded-2xl bg-card p-4 ring-1 ring-line">
          <h2 className="font-display text-xl">Conta pra gente quem ajudou 😊</h2>
          <p className="text-sm text-muted">
            Valor: {formatBRL(amount)}. Seu nome fica guardado só pra
            agradecermos depois.
          </p>
          <form action={action} className="space-y-3">
            <input type="hidden" name="productId" value={productId} />
            <input type="hidden" name="amountCents" value={amount} />
            <label className="block text-sm">
              <span className="mb-1 block text-muted">Seu nome</span>
              <input
                name="name"
                required
                autoComplete="name"
                className="w-full rounded-xl border border-line bg-white px-3 py-3 text-base"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-muted">Foto ou PDF do comprovante</span>
              <input
                name="receipt"
                type="file"
                required
                accept="image/*,application/pdf"
                className="w-full rounded-xl border border-line bg-white px-3 py-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-cream file:px-3 file:py-1"
              />
            </label>
            {state?.error ? (
              <p className="text-sm text-red-700">{state.error}</p>
            ) : null}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStep("pix")}
                className="rounded-xl py-3 text-sm font-medium ring-1 ring-line"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-xl bg-clay py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {pending ? "Enviando..." : "Enviar com carinho"}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
