import type { VehicleListing } from "@repo/marketplace";

/** Keep the full admitted native card set; visible rows retain native DOM/sort order. */
export const getNativeMarketplaceResultSlots = (
  visible: readonly VehicleListing[],
  fullInventory?: readonly VehicleListing[]
) => {
  if (!fullInventory) {
    return visible.map((listing, visibleIndex) => ({ listing, hidden: false, visibleIndex }));
  }
  const ids = new Set(fullInventory.map((listing) => listing.id));
  const selected = new Set(visible.map((listing) => listing.id));
  if (ids.size !== fullInventory.length || selected.size !== visible.length ||
    visible.some((listing) => !ids.has(listing.id))) {
    throw new Error("Native card slots require unique admitted inventory IDs");
  }
  return [
    ...visible.map((listing, visibleIndex) => ({ listing, hidden: false, visibleIndex })),
    ...fullInventory.filter((listing) => !selected.has(listing.id))
      .map((listing) => ({ listing, hidden: true, visibleIndex: -1 })),
  ];
};
