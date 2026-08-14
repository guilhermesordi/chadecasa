import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { logoutAdmin } from "@/app/actions/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-full">
      <header className="border-b border-line bg-card px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <p className="font-display text-lg">Admin</p>
          <nav className="flex flex-wrap items-center gap-3 text-sm">
            <Link href="/admin">Início</Link>
            <Link href="/admin/produtos">Produtos</Link>
            <Link href="/admin/contribuicoes">Ajudas</Link>
            <Link href="/admin/config">PIX</Link>
            <Link href="/" className="text-muted">
              Ver site
            </Link>
            <form action={logoutAdmin}>
              <button type="submit" className="text-muted">
                Sair
              </button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-6">{children}</div>
    </div>
  );
}
