export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function parseReaisToCents(input: string) {
  const cleaned = input.trim().replace(/\s/g, "").replace("R$", "");
  if (!cleaned) return null;
  const normalized = cleaned.includes(",")
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : cleaned;
  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value * 100);
}

export function percentOf(part: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((part / total) * 1000) / 10);
}

export function remainingCents(
  priceCents: number,
  contributions: { amountCents: number; status: string }[],
) {
  const paid = contributions
    .filter((item) => item.status === "confirmed")
    .reduce((sum, item) => sum + item.amountCents, 0);
  return Math.max(0, priceCents - paid);
}
