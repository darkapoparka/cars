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
      className="flex flex-wrap items-center gap-x-2 gap-y-1 text-micro text-muted-foreground lg:grid lg:grid-cols-2 lg:gap-1 lg:text-meta lg:text-secondary-foreground min-[390px]:text-meta"
      data-slot="vehicle-card-spec-pills"
    >
      {facts.map((fact) => (
        <li
          aria-label={fact.displayValue ? fact.value : undefined}
          className="flex min-w-0 max-w-full items-center font-medium tabular-nums lg:min-h-7 lg:rounded-md lg:border lg:border-border/40 lg:bg-secondary lg:px-2 lg:py-1"
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
