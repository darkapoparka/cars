import { dealerDetailFor } from "./dealer-detail.ts";

export interface RentalRequest {
  pickup: string;
  returning: string;
  preference: string;
}

export function localToday(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function rentalDate(value: string | null): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const date = new Date(value + "T12:00:00Z");
  return Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
    ? value
    : "";
}

export function readRentalRequest(
  params: Pick<URLSearchParams, "get">,
): RentalRequest {
  const pickup = rentalDate(params.get("pickup"));
  const returning = rentalDate(params.get("returning"));
  return {
    pickup,
    returning: returning && (!pickup || returning >= pickup) ? returning : "",
    preference: (params.get("preference") ?? "").trim().slice(0, 120),
  };
}

export function rentalDestination(request: RentalRequest): string {
  const params = new URLSearchParams();
  const valid = readRentalRequest(new URLSearchParams({ ...request }));
  for (const key of ["pickup", "returning", "preference"] as const) {
    if (valid[key]) params.set(key, valid[key]);
  }
  return "/rent" + (params.size ? "?" + params.toString() : "");
}

/** A detail action carries a known sale listing; generic Contact never defaults to a car. */
export function vehicleEnquiryHref(
  params: Pick<URLSearchParams, "get" | "has">,
  intent: "purchase" | "viewing" = "purchase",
): string {
  const selected = params.has("vehicle")
    ? null
    : dealerDetailFor(params.get("id"));
  if (!selected) return "/contact#contact-enquiry";
  const query = new URLSearchParams({ vehicleId: selected.id, intent });
  if (params.get("returnTo"))
    query.set("returnTo", buyReturn(params.get("returnTo")));
  return "/contact?" + query.toString() + "#contact-enquiry";
}

/** Only internal sale-result return destinations are allowed. */
export function buyReturn(value: string | null): string {
  if (
    !value?.startsWith("/vehicles?") &&
    value !== "/vehicles" &&
    !value?.startsWith("/vehicles#")
  )
    return "/vehicles";
  const url = new URL(value, "https://preview.invalid");
  return url.pathname === "/vehicles"
    ? url.pathname + url.search + url.hash
    : "/vehicles";
}
