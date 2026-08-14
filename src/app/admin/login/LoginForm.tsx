"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/actions/admin";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, null);

  return (
    <form action={action} className="mt-6 space-y-3">
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Senha</span>
        <input
          type="password"
          name="password"
          required
          className="w-full rounded-xl border border-line bg-white px-3 py-3"
        />
      </label>
      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-ink py-3 text-sm font-semibold text-cream disabled:opacity-60"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
