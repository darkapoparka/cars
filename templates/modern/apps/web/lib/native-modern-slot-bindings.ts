import { withBasePath } from "@repo/internationalization/paths";

type Family = "evaluation" | "card" | "chip" | "mobile-quick" | "page";
type Binding = { family: Family; path: readonly string[]; key?: string; default?: string; predicate?: "zero" | "positive" | "not"; format?: "string" };
type Atom = { target: "text" | "hidden" | "style.display" | "href" | "title" | "aria-label" | "aria-pressed" | "aria-current" | "aria-haspopup" | "loading" | "value"; binding: Binding; serializer?: "mounted-native-href" | "native-hidden-display" | "native-current-page" | "native-optional-label" | "native-dialog-presence" };
type Input = { kind: "category" | "listing"; locale: string; marker: string; key?: string };
const atom = (target: Atom["target"], path: readonly string[], family: Family = "evaluation", key?: string, extra: Partial<Binding> = {}, serializer?: Atom["serializer"]): Atom => ({ target, binding: { family, path, ...(key === undefined ? {} : { key }), ...extra }, ...(serializer ? { serializer } : {}) });
const visibility = (path: readonly string[], family: Family = "evaluation", key?: string, predicate?: Binding["predicate"]): Atom[] => [atom("hidden", path, family, key, predicate ? { predicate } : {}), atom("style.display", path, family, key, predicate ? { predicate } : {}, "native-hidden-display")];

/** Exact native Link mount semantics. External/protocol-relative values decline. */
export const mapNativeModernSlotHref = (href: string): string | undefined => href.startsWith("/") && !href.startsWith("//") ? withBasePath(href) : undefined;

/** These are required source/native serializer owners, never synthesized markup.
 * The producer must bind their emitted graph source and actual query oracle. */
export const nativeModernSlotSerializerOwners = Object.freeze({
  mountedHref: "@repo/internationalization/paths:withBasePath",
  hiddenDisplay: "original native JSX hidden plus conditional display:none",
  currentPage: "marketplace-pagination.tsx:page === currentPage ? 'page' : undefined",
  controlClassChoices: ["desktop-filter-controls.tsx:cn", "mobile-dealer-discovery-header.tsx:getMobileQuickPillClassName", "marketplace-pagination.tsx:cn"],
  layout: "marketplace-results-policy.ts:getMarketplaceListingGridClassName",
  head: ["native-inventory-metadata.tsx:NativeInventoryMetadata", "native-public-listing-metadata.ts:createNativeListingStaticMetadata"],
  imageHints: "original native next/image SSR image/preload serializer",
  hydration: "actual same-root canonical/query Flight and original IDs/ARIA oracle",
});

/** Finite scalar bindings owned by the original component expressions/reducers.
 * A missing marker declines; source/node counts and class/head/image coverage
 * remain mandatory admission gates in the compiled producer. */
export const getNativeModernSlotBindings = ({ kind, marker, key }: Input): readonly Atom[] | undefined => {
  if (key !== undefined && (key.length > 256 || ["__proto__", "constructor", "prototype"].includes(key))) return;
  if (key !== undefined && marker.includes(":") && !marker.endsWith(":" + key)) return;
  if (kind === "listing") {
    if (marker === "back-href") return [atom("href", ["backHref"], "evaluation", undefined, {}, "mounted-native-href")];
    if (marker === "related-hidden") return visibility(["related", "hidden"]);
    if (marker === "related-container" && key) return visibility(["hidden"], "card", key);
  }
  const text: Record<string, readonly string[]> = {
    "inventory-title": ["controls", "resultTitle"], "toolbar-result-title": ["controls", "resultTitle"],
    "toolbar-result-count": ["controls", "resultCount"], "dealer-result-count": ["controls", "resultCount"],
    "results-mobile-count": ["controls", "mobileResultCount"], "dealer-sort-label": ["controls", "sortLabel"],
    "narrow-filter-count": ["controls", "filterCount"], "inventory-filter-count": ["controls", "filterCount"],
    "mobile-filter-count": ["controls", "mobileConditionFilterCount"], "mobile-search-label": ["controls", "mobileSearch", "label"],
    "sidebar-draft-status-text": ["controls", "sidebarStatus", "text"],
    "empty-title": ["controls", "emptyCopy", "title"], "empty-description": ["controls", "emptyCopy", "description"],
  };
  if (Object.hasOwn(text, marker)) {
    const count = ["narrow-filter-count", "inventory-filter-count", "mobile-filter-count"].includes(marker);
    return [atom("text", text[marker]!, "evaluation", undefined, count ? { format: "string" } : {}), ...(count ? visibility(text[marker]!, "evaluation", undefined, "zero") : [])];
  }
  if (marker === "sidebar-draft-status") return visibility(["controls", "sidebarStatus", "hidden"]);
  if (marker === "applied-filters") return [atom("hidden", ["controls", "filterCount"], "evaluation", undefined, { predicate: "zero" })];
  if (["toolbar-clear-filters", "clear-all-filters"].includes(marker)) return visibility(["controls", "filterCount"], "evaluation", undefined, "zero");
  if (marker === "narrow-filter-trigger") return [atom("aria-label", ["controls", "narrowFiltersAriaLabel"])];
  if (marker === "mobile-search-trigger") return [atom("aria-label", ["controls", "mobileSearch", "ariaLabel"])];
  if (marker === "mobile-filter-trigger") return [atom("aria-label", ["controls", "mobileFilters", "ariaLabel"]), atom("title", ["controls", "mobileFilters", "title"])];
  if (marker === "search-query-input") return [atom("value", ["filters", "q"], "evaluation", undefined, { default: "" })];
  if (/^(inventory|sidebar)-label:(?:desktop-hero-)?(make|model|price|year|mileage|fuel|transmission|body|seller|location|power|extras|category)$/.test(marker)) {
    const field=marker.split(":")[1]!.replace(/^desktop-hero-/, "");
    if (marker.startsWith("sidebar-")) return [atom("text", ["controls", "sidebarFields", "labels", field])];
    return [atom("text", ["controls", "inventoryFields", ...(["make", "model", "price"].includes(field) ? [field] : ["labels", field])])];
  }
  if (/^(inventory|sidebar)-trigger:(?:desktop-hero-)?(make|model|price|year|mileage|fuel|transmission|body|seller|power|extras|location|category)$/.test(marker)) {
    const field=marker.split(":")[1]!.replace(/^desktop-hero-/, "");
    const state=field === "price" && marker.startsWith("sidebar-") ? "sidebarPrice" : field;
    const pressed=atom("aria-pressed", ["controls", "activeFields", state]);
    return marker.startsWith("inventory-") ? [pressed, atom("title", ["controls", "inventoryFields", ...(["make", "model", "price"].includes(field) ? [field] : ["labels", field])])] : [pressed];
  }
  if (marker === "dealer-sort-trigger") return [atom("title", ["controls", "sortLabel"])];
  if (marker === "result-grid") return visibility(["layout", "gridHidden"]);
  if (marker === "result-empty") return visibility(["layout", "emptyHidden"]);
  if (marker === "pagination") return visibility(["pagination", "hidden"]);
  if (marker === "empty-clear-link") return [...visibility(["emptyAction", "filtered"], "evaluation", undefined, "not"), atom("href", ["emptyAction", "href"], "evaluation", undefined, {}, "mounted-native-href")];
  if (marker === "empty-category-action") return visibility(["emptyAction", "filtered"]);
  if (["pagination-prev", "pagination-next"].includes(marker)) {
    const side=marker.endsWith("prev") ? "previous" : "next";
    return [...visibility(["pagination", side, "hidden"]), atom("href", ["pagination", side, "href"], "evaluation", undefined, {}, "mounted-native-href")];
  }
  if (marker.startsWith("pagination-page:") && key) return [...visibility(["hidden"], "page", key), atom("href", ["href"], "page", key, {}, "mounted-native-href"), atom("aria-current", ["current"], "page", key, {}, "native-current-page")];
  if (marker.startsWith("chip-label:") && key) return [atom("text", ["label"], "chip", key)];
  if (marker.startsWith("chip:") && key) return [...visibility(["hidden"], "chip", key), atom("aria-label", ["ariaLabel"], "chip", key)];
  if (marker.startsWith("mobile-pill-label:") && key) return [atom("text", ["label"], "mobile-quick", key)];
  if (marker.startsWith("mobile-pill:") && key) return [...visibility(["hidden"], "mobile-quick", key), atom("aria-pressed", ["active"], "mobile-quick", key), atom("aria-label", ["clearLabel"], "mobile-quick", key, { default: "" }, "native-optional-label"), atom("aria-haspopup", ["hasClearLabel"], "mobile-quick", key, {}, "native-dialog-presence")];
  if (marker.startsWith("mobile-pill-clear:") && key) return [atom("style.display", ["hasClearLabel"], "mobile-quick", key, { predicate: "not" }, "native-hidden-display")];
  if (marker.startsWith("mobile-pill-open:") && key) return [atom("style.display", ["hasClearLabel"], "mobile-quick", key, {}, "native-hidden-display")];
  if (marker === "card-link" && key) return [atom("href", ["href"], "card", key, {}, "mounted-native-href")];
  if (marker === "card-image" && key) return [atom("loading", ["loading"], "card", key)];
  if (marker === "card-delivery" && key) return [atom("text", ["deliveryLabel"], "card", key, { default: "" })];
  if (marker === "card-container" && key) return visibility(["hidden"], "card", key);
  return;
};
