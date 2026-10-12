import type { VehicleListing } from "@repo/marketplace";
import { getDeliveryTruth } from "./listing-truth";
import { getLocalizedVehicleCardDeliveryLabel } from "./vehicle-card-view-policy";

/** Original native Results priority rule, shared by React and the cheap query plan. */
export const getMarketplacePriorityListingCount = (discovery: boolean, wide: boolean) =>
  discovery || wide ? 4 : 3;

/** Native delivery label; no parallel policy or HTML formatter. */
export const getNativeMarketplaceCardDeliveryLabel = (listing: VehicleListing, locale?: string) => {
  const delivery = getDeliveryTruth(listing);
  return delivery ? getLocalizedVehicleCardDeliveryLabel(delivery, locale) : undefined;
};
