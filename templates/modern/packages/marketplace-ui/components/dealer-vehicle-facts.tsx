export function DealerVehicleFacts({
  facts,
  label,
}: {
  readonly facts: readonly {
    id: string;
    value: string;
    displayValue?: string;
  }[];
  readonly label: string;
}) {
  return (
    <ul
      aria-label={label}
      className="grid grid-cols-[fit-content(45%)_minmax(0,max-content)] gap-1 text-micro text-secondary-foreground lg:grid-cols-2 min-[390px]:text-meta"
      data-slot="vehicle-card-spec-pills"
    >
      {facts.map((fact) => (
        <li
          aria-label={fact.displayValue ? fact.value : undefined}
          className="flex min-h-6 min-w-0 items-center rounded-md border border-border/40 bg-secondary px-1 py-0.5 font-medium tabular-nums lg:px-2 min-[360px]:min-h-7 min-[360px]:py-1"
          key={fact.id}
          title={fact.value}
        >
          <span
            aria-hidden={fact.displayValue ? true : undefined}
            className={
              fact.id === "year" || fact.id === "mileage"
                ? "whitespace-nowrap"
                : "min-w-0 break-words"
            }
          >
            {fact.displayValue ?? fact.value}
          </span>
        </li>
      ))}
    </ul>
  );
}
