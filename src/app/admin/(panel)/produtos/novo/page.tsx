import type { Metadata } from "next";
import { ProductForm } from "../ProductForm";

export const metadata: Metadata = {
  title: "Novo produto",
};

export default function NewProductPage() {
  return (
    <main className="space-y-4">
      <h1 className="font-display text-3xl">Novo produto</h1>
      <ProductForm />
    </main>
  );
}
