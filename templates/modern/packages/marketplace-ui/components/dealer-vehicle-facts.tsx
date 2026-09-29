import { cn } from "@repo/design-system/lib/utils";

export function DealerVehicleFacts({
  className,
  facts,
  label,
  layout = "grid",
}: {
  readonly className?: string;
  readonly facts: readonly {
    id: string;
    value: string;
    displayValue?: string;
  }[];
  readonly label: string;
  readonly layout?: "grid" | "inline";
}) {
  return (
    <ul
      aria-label={label}
      className={cn(
        "gap-1 text-micro text-secondary-foreground min-[360px]:text-meta",
        layout === "inline" ? "flex flex-wrap" : "grid grid-cols-2",
        className
      )}
      data-slot="vehicle-card-spec-pills"
    >
      {facts.map((fact) => (
        <li
          aria-label={fact.displayValue ? fact.value : undefined}
          className={cn(
            "flex min-h-6 min-w-0 items-center rounded-md border border-border/40 bg-secondary py-0.5 font-medium tabular-nums min-[360px]:min-h-7",
            layout === "inline"
              ? "max-w-full px-0.5 min-[390px]:px-1.5"
              : "px-0.5 lg:px-2 min-[390px]:px-1 min-[360px]:py-1"
          )}
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
