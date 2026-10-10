import { message, type CatalogText } from "#lib/i18n/text.ts";
export type VehicleSearchCategory = "all" | "new" | "used";

export interface SearchCategoryOption {
  readonly value: VehicleSearchCategory;
  readonly label: CatalogText;
}

export interface SearchFieldContent {
  readonly label: CatalogText;
  readonly value: string;
}

export interface VehicleSearchContent {
  readonly categories: readonly SearchCategoryOption[];
  readonly locations: readonly string[];
  readonly pickupLocation: SearchFieldContent;
  readonly dropoffLocation: SearchFieldContent;
  readonly pickupDate: SearchFieldContent;
  readonly returnDate: SearchFieldContent;
  readonly help: { readonly label: CatalogText; readonly href: string };
  readonly actionLabel: CatalogText;
}

/** Preserved reference search copy; these are demonstration locations and dates. */
export const referenceVehicleSearch = {
  categories: [
    {
      value: "all",
      label: message(
        "reference.ancillary.referenceVehicleSearch.categories.1.label",
      ),
    },
    {
      value: "new",
      label: message(
        "reference.ancillary.referenceVehicleSearch.categories.2.label",
      ),
    },
    {
      value: "used",
      label: message(
        "reference.ancillary.referenceVehicleSearch.categories.3.label",
      ),
    },
  ],
  locations: ["Paris, France", "Tokyo, Japan", "New York City, USA"],
  pickupLocation: {
    label: message(
      "reference.ancillary.referenceVehicleSearch.pickupLocation.label",
    ),
    value: "New York, USA",
  },
  dropoffLocation: {
    label: message(
      "reference.ancillary.referenceVehicleSearch.dropoffLocation.label",
    ),
    value: "Delaware, USA",
  },
  pickupDate: {
    label: message(
      "reference.ancillary.referenceVehicleSearch.pickupDate.label",
    ),
    value: "Thu, Oct 01 2024",
  },
  returnDate: {
    label: message(
      "reference.ancillary.referenceVehicleSearch.returnDate.label",
    ),
    value: "Mon, Oct 07 2024",
  },
  help: {
    label: message("reference.ancillary.referenceVehicleSearch.help.label"),
    href: "/contact",
  },
  actionLabel: message(
    "reference.ancillary.referenceVehicleSearch.actionLabel",
  ),
} as const satisfies VehicleSearchContent;

/** Match every supplied search term; whitespace and case do not affect results. */
export function matchesSearchTerms(
  text: string,
  query: string,
  locale?: string,
): boolean {
  const searchable = text.toLocaleLowerCase(locale);
  return query
    .trim()
    .toLocaleLowerCase(locale)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => searchable.includes(term));
}
