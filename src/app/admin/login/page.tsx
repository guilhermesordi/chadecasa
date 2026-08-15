import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Entrar",
};

export default async function AdminLoginPage() {
  if (await isAdmin()) {
    redirect("/admin");
  }

  return (
    <main className="mx-auto flex min-h-full max-w-sm flex-col justify-center px-4">
      <h1 className="font-display text-3xl">Admin</h1>
      <p className="mt-1 text-sm text-muted">Área para gerenciar a lista.</p>
      <LoginForm />
    </main>
  );
}
