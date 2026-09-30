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
      className="flex flex-wrap gap-1 text-micro text-secondary-foreground lg:grid lg:grid-cols-2 lg:text-meta min-[390px]:text-meta"
      data-slot="vehicle-card-spec-pills"
    >
      {facts.map((fact) => (
        <li
          aria-label={fact.displayValue ? fact.value : undefined}
          className="flex min-h-6 min-w-0 max-w-full items-center rounded-md border border-border/40 bg-secondary px-1 py-0.5 font-medium tabular-nums lg:min-h-7 lg:px-2 lg:py-1"
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
