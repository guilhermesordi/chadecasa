export function ProgressBar({
  funded,
  total,
}: {
  funded: number;
  total: number;
}) {
  const pct = total <= 0 ? 0 : Math.min(100, (funded / total) * 100);
  const complete = pct >= 100;

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-line">
      <div
        className={`h-full rounded-full ${complete ? "bg-sage" : "bg-clay"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
