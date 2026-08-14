"use client";

import { useActionState } from "react";
import { saveProduct } from "@/app/actions/admin";
import { formatBRL } from "@/lib/money";

type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  priceCents: number;
  active: boolean;
};

export function ProductForm({ product }: { product?: Product }) {
  const [state, action, pending] = useActionState(saveProduct, null);

  const defaultPrice = product
    ? (product.priceCents / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "";

  return (
    <form action={action} className="space-y-3">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Nome</span>
        <input
          name="name"
          required
          defaultValue={product?.name}
          className="w-full rounded-xl border border-line bg-white px-3 py-3"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Descrição</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={product?.description}
          className="w-full rounded-xl border border-line bg-white px-3 py-3"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Preço (R$)</span>
        <input
          name="price"
          required
          defaultValue={defaultPrice}
          className="w-full rounded-xl border border-line bg-white px-3 py-3"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Foto</span>
        <input
          name="image"
          type="file"
          accept="image/*"
          className="w-full rounded-xl border border-line bg-white px-3 py-3 text-sm"
        />
        {product?.imageUrl ? (
          <p className="mt-1 text-xs text-muted">
            Foto atual: {product.imageUrl}. Envie outra para trocar.
          </p>
        ) : null}
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="active"
          defaultChecked={product?.active ?? true}
        />
        Visível no site
      </label>
      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-ink py-3 text-sm font-semibold text-cream disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Salvar"}
      </button>
      {product ? (
        <p className="text-xs text-muted">Preço atual: {formatBRL(product.priceCents)}</p>
      ) : null}
    </form>
  );
}
