export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatReaisNumber(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function maskReaisInput(raw: string, maxCents: number) {
  const hasComma = raw.includes(",");
  const [intRaw = "", ...decParts] = raw.replace(/[^\d,]/g, "").split(",");
  const intDigits = intRaw.replace(/^0+(?=\d)/, "");
  const decDigits = decParts.join("").slice(0, 2);

  if (!intDigits && !hasComma) {
    return { display: "", cents: 0 };
  }

  const whole = Number(intDigits || "0");
  if (!Number.isFinite(whole)) {
    return { display: "", cents: 0 };
  }

  const frac = Number(decDigits.padEnd(2, "0").slice(0, 2));
  const typedCents = whole * 100 + (hasComma ? frac : 0);

  if (typedCents > maxCents) {
    return { display: formatReaisNumber(maxCents), cents: maxCents };
  }

  const intFormatted = whole.toLocaleString("pt-BR");
  return {
    display: hasComma ? `${intFormatted},${decDigits}` : intFormatted,
    cents,
  };
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
