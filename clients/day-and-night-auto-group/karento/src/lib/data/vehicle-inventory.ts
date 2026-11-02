import { dealerDetailFor } from "./dealer-detail.ts";
import type { DealerContent } from "../content.ts";
import type { ListingVehicle } from "./vehicle-listing.ts";

/** Supplied inventory replaces complete records; only the template slot ID remains. */
export function resolveInventoryVehicle(
  reference: ListingVehicle,
  inventory: DealerContent["inventory"],
): ListingVehicle {
  const supplied = Object.hasOwn(inventory, reference.title)
    ? inventory[reference.title]
    : undefined;
  const record = supplied ? { ...supplied, id: reference.id } : reference;
  const id = new URL(record.href, "https://preview.invalid").searchParams.get("id");
  const detail = id ? dealerDetailFor(id) : null;
  const year = Number(detail?.specifications.find((fact) => fact.id === "year")?.value);
  return Number.isInteger(year) && year > 1900 ? { ...record, year } : record;
}
