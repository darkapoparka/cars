import type { VehicleListing } from "@repo/marketplace";
import {
  formatVehicleCardMoney,
  getShowroomVehicleHeading,
} from "./vehicle-card-policy";

/** The shortlist needs a display snapshot, rather than the complete listing. */
export interface DesktopSavedCar {
  href: string;
  id: string;
  image: string;
  price: string;
  title: string;
}

export function createDesktopSavedCar(
  listing: VehicleListing,
  href: string,
  locale?: string
): DesktopSavedCar {
  return {
    href,
    id: listing.id,
    image: listing.images[0]?.url ?? "",
    price: formatVehicleCardMoney(listing.price, "comparison", locale),
    title: getShowroomVehicleHeading(listing, locale).title,
  };
}
