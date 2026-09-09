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
      className="grid grid-cols-2 gap-1"
      data-slot="vehicle-card-spec-pills"
    >
      {facts.map((fact) => (
        <li
          className="flex h-6 min-w-0 items-center rounded-md bg-zinc-100 px-2 font-medium text-[11px] text-zinc-700 tabular-nums"
          key={fact.id}
          title={fact.value}
        >
          <span className="truncate">{fact.value}</span>
        </li>
      ))}
    </ul>
  );
}
