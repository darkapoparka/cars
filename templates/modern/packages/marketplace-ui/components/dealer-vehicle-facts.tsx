export function DealerVehicleFacts({
  facts,
  label,
}: {
  readonly facts: readonly { id: string; value: string }[];
  readonly label: string;
}) {
  return (
    <ul
      aria-label={label}
      className="grid grid-cols-[minmax(0,1fr)_auto] gap-1 text-micro text-secondary-foreground lg:grid-cols-2 min-[360px]:text-meta"
      data-slot="vehicle-card-spec-pills"
    >
      {facts.map((fact) => (
        <li
          className="flex min-h-6 min-w-0 items-center rounded-md border border-border/40 bg-secondary px-1 py-0.5 font-medium tabular-nums min-[360px]:min-h-7 min-[360px]:px-2 min-[360px]:py-1"
          key={fact.id}
          title={fact.value}
        >
          <span
            className={
              fact.id === "year" || fact.id === "mileage"
                ? "whitespace-nowrap"
                : "min-w-0 break-words"
            }
          >
            {fact.value}
          </span>
        </li>
      ))}
    </ul>
  );
}
