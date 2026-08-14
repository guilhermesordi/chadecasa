"use client";

import { useState } from "react";

export function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="w-full rounded-xl bg-clay px-4 py-3 text-sm font-semibold text-white active:bg-clay-dark"
    >
      {copied ? "Copiado" : label || "Copiar chave PIX"}
    </button>
  );
}
