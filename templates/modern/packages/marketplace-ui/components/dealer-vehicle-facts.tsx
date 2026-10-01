export function DealerVehicleFacts({
  facts,
  label,
}: {
  readonly facts: readonly {
    id: string;
    value: string;
    displayValue?: string;
    mobileDisplayValue?: string;
  }[];
  readonly label: string;
}) {
  const rows = Array.from({ length: Math.ceil(facts.length / 2) }, (_, index) =>
    facts.slice(index * 2, index * 2 + 2)
  );

  return (
    <>
      <div className="lg:hidden">
        <ul
          aria-label={label}
          className="grid gap-1.5 text-card-spec text-secondary-foreground"
          data-slot="vehicle-card-spec-pills"
        >
          {rows.map((row) => (
            <li className="grid min-w-0 grid-cols-2 gap-1.5" key={row[0].id}>
              {row.map((fact) => (
                <span
                  className="flex min-h-6 min-w-0 max-w-full items-center justify-center rounded-md border border-border/40 bg-secondary px-1.5 py-0.5 font-normal tabular-nums"
                  data-fact={fact.id}
                  data-slot="vehicle-card-spec"
                  key={fact.id}
                  title={fact.value}
                >
                  <span
                    aria-hidden={
                      fact.mobileDisplayValue || fact.displayValue
                        ? true
                        : undefined
                    }
                    className="min-w-0 truncate"
                  >
                    {fact.mobileDisplayValue ?? fact.displayValue ?? fact.value}
                  </span>
                  {fact.mobileDisplayValue || fact.displayValue ? (
                    <span className="sr-only">{fact.value}</span>
                  ) : null}
                </span>
              ))}
            </li>
          ))}
        </ul>
      </div>
      <div className="hidden lg:contents">
        <ul
          aria-label={label}
          className="grid grid-cols-2 items-center gap-1 text-meta text-secondary-foreground"
          data-slot="vehicle-card-spec-pills"
        >
          {facts.map((fact) => (
            <li
              aria-label={fact.displayValue ? fact.value : undefined}
              className="flex min-h-7 min-w-0 max-w-full items-center justify-self-stretch rounded-md border border-border/40 bg-secondary px-2 py-1 font-medium tabular-nums"
              data-slot="vehicle-card-spec"
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
      </div>
    </>
  );
}
