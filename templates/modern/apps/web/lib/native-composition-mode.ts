import { withBasePath } from "@repo/internationalization/paths";
import { getCurrentPublicDataMode } from "./public-data-policy";
import { getPublicNativeMarketplaceInventory } from "./public-marketplace-data";
import { nativeInventorySeal, nativeQuerySourceMode } from "./cars-native-composition-binding";

/** Explicit provider-only module. Its generated binding is source/digest-owned;
 * ordinary template source does not import or generate it. */
export function getNativeCompositionInventory() {
  if (nativeQuerySourceMode !== "original-public-demo-query-v1" || getCurrentPublicDataMode() !== "demo") return;
  return getPublicNativeMarketplaceInventory(nativeInventorySeal);
}

export function nativeDetailSourceEligible() {
  const inventory = getNativeCompositionInventory();
  return Boolean(inventory && inventory.listings.every(row => !row.supply));
}

export function createNativeInitialHref(pathname: string, raw: Record<string, string | string[] | undefined>) {
  const url = new URL(withBasePath(pathname), "https://native-source.invalid");
  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) for (const entry of value) url.searchParams.append(key, entry);
    else if (typeof value === "string") url.searchParams.append(key, value);
  }
  return url.href;
}
