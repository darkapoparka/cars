import type { VehicleCardContent } from "../content.ts";
import type { LocaleContext } from "./context.svelte.ts";

type VehicleFacts = Pick<
  VehicleCardContent,
  | "price"
  | "mileage"
  | "fuel"
  | "transmission"
  | "priceAmount"
  | "currency"
  | "mileageValue"
  | "mileageUnit"
  | "fuelType"
  | "transmissionType"
  | "seats"
  | "seatsCount"
> &
  Partial<
    Pick<
      VehicleCardContent,
      | "action"
      | "actionKey"
      | "pricePeriod"
      | "pricePeriodKey"
      | "reviews"
      | "reviewCount"
      | "listingHighlights"
    >
  >;
/** Formats explicit listing facts only. No inferred price, currency conversion or phrase translation. */
export function presentVehicle(
  vehicle: VehicleFacts,
  locale: Pick<LocaleContext, "t" | "number" | "money" | "count">,
) {
  return {
    listingHighlights:
      vehicle.listingHighlights
        ?.map((highlight) => locale.t(`vehicle.highlight.${highlight}`))
        .join(" · ") ?? "",
    reviews:
      typeof vehicle.reviewCount === "number"
        ? `(${locale.count(vehicle.reviewCount, "reviews")})`
        : (vehicle.reviews ?? ""),
    seats:
      typeof vehicle.seatsCount === "number"
        ? locale.t("unit.seats", { count: locale.number(vehicle.seatsCount) })
        : vehicle.seats || locale.t("vehicle.notProvided"),
    action: vehicle.actionKey
      ? locale.t(vehicle.actionKey)
      : (vehicle.action ?? ""),
    pricePeriod: vehicle.pricePeriodKey
      ? locale.t(vehicle.pricePeriodKey)
      : (vehicle.pricePeriod ?? ""),
    price:
      typeof vehicle.priceAmount === "number" && vehicle.currency
        ? locale.money(vehicle.priceAmount, vehicle.currency)
        : vehicle.price || locale.t("vehicle.notProvided"),
    mileage:
      typeof vehicle.mileageValue === "number" && vehicle.mileageUnit
        ? `${locale.number(vehicle.mileageValue)} ${locale.t(`unit.${vehicle.mileageUnit}`)}`
        : vehicle.mileage || locale.t("vehicle.notProvided"),
    fuel: vehicle.fuelType
      ? locale.t(`fuel.${vehicle.fuelType}`)
      : vehicle.fuel || locale.t("vehicle.notProvided"),
    transmission: vehicle.transmissionType
      ? locale.t(`transmission.${vehicle.transmissionType}`)
      : vehicle.transmission || locale.t("vehicle.notProvided"),
  };
}
