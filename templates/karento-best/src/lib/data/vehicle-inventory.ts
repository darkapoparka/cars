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
  return supplied ? { ...supplied, id: reference.id } : reference;
}
