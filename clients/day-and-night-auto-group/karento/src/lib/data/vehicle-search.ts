import { saleMakes, saleModels } from "./sale-search.ts";

export interface VehicleSearchCriteria {
  q: string;
  make: string;
  model: string;
}
export interface RecentVehicleSearch extends VehicleSearchCriteria {
  purpose: "buy" | "rent";
}
export const vehicleSearchStorageKey = "daynight.vehicle-search.v1";
export const emptyVehicleSearch: VehicleSearchCriteria = {
  q: "",
  make: "",
  model: "",
};

const normalized = (value: string) =>
  value
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
export function vehicleSearchLabel(value: VehicleSearchCriteria): string {
  const structured = [value.make, value.model].filter(Boolean).join(" ");
  if (
    structured &&
    normalized(value.q).startsWith(normalized(structured) + " ")
  )
    return value.q;
  return [
    structured,
    value.q && normalized(value.q) !== normalized(structured) ? value.q : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

export function rentalVehicleQuery(value: VehicleSearchCriteria): string {
  return value.model
    ? [value.make, value.model].filter(Boolean).join(" ")
    : value.q;
}

/** A display separator must never become a keyword when editing a combined search. */
export function vehicleSearchText(value: VehicleSearchCriteria): string {
  return vehicleSearchLabel(value).replaceAll(" · ", " ");
}

export function vehicleSearchSuggestions(
  cars: readonly { title: string }[],
  query: string,
) {
  const terms = normalized(query).split(" ").filter(Boolean);
  const makes = saleMakes(cars);
  const choices = makes.flatMap((make) => [
    { q: "", make, model: "" },
    ...saleModels(cars, make).map((model) => ({ q: "", make, model })),
  ]);
  return (
    terms.length
      ? choices.filter((value) => {
          const label = normalized(vehicleSearchLabel(value));
          return terms.every((term) => label.includes(term));
        })
      : choices.filter((value) => !value.model)
  ).slice(0, 8);
}

/** Only actual submitted searches are stored, locally and without rental dates. */
export function readRecentVehicleSearches(
  raw: string | null,
): RecentVehicleSearch[] {
  try {
    const data: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(data)) return [];
    const valid = data
      .filter(
        (value): value is RecentVehicleSearch =>
          value !== null &&
          typeof value === "object" &&
          (value.purpose === "buy" || value.purpose === "rent") &&
          [value.q, value.make, value.model].every(
            (field) => typeof field === "string" && field.length <= 160,
          ) &&
          !!(value.q.trim() || value.make.trim()),
      )
      .slice(0, 10)
      .map(({ purpose, q, make, model }) => ({
        purpose,
        q: q.trim(),
        make: make.trim(),
        model: make.trim() ? model.trim() : "",
      }));
    return valid.filter(
      (value, index) =>
        valid.findIndex(
          (other) =>
            other.purpose === value.purpose &&
            normalized(vehicleSearchLabel(other)) ===
              normalized(vehicleSearchLabel(value)),
        ) === index,
    );
  } catch {
    return [];
  }
}

export function rememberVehicleSearch(
  raw: string | null,
  criteria: VehicleSearchCriteria,
  purpose: "buy" | "rent",
) {
  const previous = readRecentVehicleSearches(raw);
  const next = { ...criteria, purpose };
  const key = (value: RecentVehicleSearch) =>
    JSON.stringify([value.purpose, normalized(vehicleSearchLabel(value))]);
  const all = vehicleSearchLabel(criteria)
    ? [next, ...previous.filter((value) => key(value) !== key(next))]
    : previous;
  return all.filter(
    (value, index) =>
      all.slice(0, index).filter((other) => other.purpose === value.purpose)
        .length < 5,
  );
}
