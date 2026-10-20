import type { DealerContent, VehicleCardContent } from "../content.ts";
import type { LocaleContext } from "../i18n/context.svelte.ts";
import {
  vehicleListings,
  rentalRows,
  type ListingVehicle,
} from "./vehicle-listing.ts";
import { dashboardOwnerInventory, dashboardWishlist } from "./dashboard.ts";
import { referenceVehicles } from "./vehicles.ts";
import {
  referenceHeading,
  referenceSliderGallery,
  type DetailHeading,
  type DetailSliderGallery,
} from "./vehicle-detail.ts";

/** Retained type contract for the unused reference sidebar component. */
export type VehicleDetailIntent = "rental" | "sale" | "enquiry";
export interface SelectedReferenceVehicle {
  readonly id: string;
  readonly card: VehicleCardContent;
}

const catalog = [
  ...Object.values(vehicleListings).flat(),
  ...rentalRows.map((row) => ({ ...row, sample: true })),
  ...dashboardWishlist.map((row) => ({ ...row, sample: true })),
  ...dashboardOwnerInventory.map((card) => ({
    ...card,
    id: `owner:${card.image}`,
  })),
  ...Object.values(referenceVehicles)
    .flat()
    .map((card) => ({
      ...card,
      id: `reference:${card.image}:${card.title}`,
    })),
];

/** Reference identities are matched exactly; an unknown explicit ID never falls back. */
export function selectedReferenceVehicle(
  params: Pick<URLSearchParams, "getAll">,
  inventory: DealerContent["inventory"] = {},
): SelectedReferenceVehicle | null {
  const ids = params.getAll("vehicle");
  if (ids.length > 1) return null;
  const source = ids.length
    ? catalog.find((card) => card.id === ids[0])
    : vehicleListings.gridFourColumns[0];
  if (!source) return null;
  const supplied = inventory[source.title];
  return {
    id: source.id,
    card: {
      ...source,
      ...supplied,
      ...(supplied ? { detailImage: supplied.detailImage } : {}),
    },
  };
}

/** Supplied dealer destinations remain authoritative. */
export function referenceVehicleDestination(
  card: Pick<VehicleCardContent, "href"> &
    Partial<
      Pick<VehicleCardContent, "title" | "image"> & Pick<ListingVehicle, "id">
    >,
): string {
  const id =
    card.id ??
    catalog.find(
      (source) => source.title === card.title && source.image === card.image,
    )?.id;
  if (!id) return card.href;
  const destination = new URL(card.href, "https://reference.invalid");
  if (
    destination.origin !== "https://reference.invalid" ||
    !["/vehicle", "/cars-details-3"].includes(destination.pathname) ||
    destination.searchParams.has("id")
  )
    return card.href;
  destination.searchParams.set("vehicle", id);
  return destination.pathname + destination.search + destination.hash;
}

/** Identity only: the full reference gallery and every default detail panel remain. */
export function referenceVehicleIdentity(
  selected: SelectedReferenceVehicle,
  locale: Pick<LocaleContext, "t">,
): { heading: DetailHeading; gallery: DetailSliderGallery } {
  const { card } = selected;
  const listingPhoto = {
    src: card.detailImage ?? card.image,
    alt: card.sample ? locale.t("image.illustrative") : card.imageAlt,
  };
  return {
    heading: {
      ...referenceHeading,
      title: card.title,
      mobileTitle: card.title,
      titleKey: undefined,
      location: card.location,
    },
    gallery: {
      slides: [
        listingPhoto,
        ...referenceSliderGallery.slides.map((photo) => ({
          ...photo,
          alt: locale.t("gallery.photo"),
        })),
      ],
      thumbnails: [
        { ...listingPhoto, src: card.image },
        ...referenceSliderGallery.thumbnails.map((photo) => ({
          ...photo,
          alt: locale.t("gallery.photo"),
        })),
      ],
    },
  };
}
