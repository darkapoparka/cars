import { formatMoney, getListingPath, type VehicleListing } from "@repo/marketplace";
import { getLeadCopy } from "@repo/marketplace/lead-copy";
import { isDealershipSite } from "@repo/marketplace/site-config";
import { getCanonicalUrl, getLocalizedPath, normalizeSeoLocale } from "@repo/seo/metadata";
import { createPublicLocalizedMetadata, getPublicInventoryRobots, type PublicSearchParams } from "./public-metadata";
import { getPublicWebBaseUrl } from "./public-url";
const getAdvertisedPrice = (listing: VehicleListing) =>
  listing.supply?.nativePrice ?? listing.price;

const getListingDescription = (listing: VehicleListing, locale: string) =>
  `${formatMoney(getAdvertisedPrice(listing), locale)} - ${listing.spec.year} ${
    listing.spec.make
  } ${listing.spec.model} ${locale === "bg" ? "в" : "in"} ${isDealershipSite ? getLeadCopy(locale).city : listing.location.city}.`;

const getAbsoluteUrl = (path: string): string => getCanonicalUrl(path, { baseUrl: getPublicWebBaseUrl() });

export const createNativeListingStaticMetadata = ({ listing, locale, query, nativeHeadOwned = false }: { listing: VehicleListing; locale: string; query: PublicSearchParams; nativeHeadOwned?: boolean }) => {
  const listingUrl = getAbsoluteUrl(
    getLocalizedPath(normalizeSeoLocale(locale), getListingPath(listing))
  );

  return createPublicLocalizedMetadata({
    baseUrl: getPublicWebBaseUrl(),
    description: getListingDescription(listing, locale),
    image: listing.images[0]?.url,
    locale,
    openGraph: {
      url: listingUrl,
    },
    path: getListingPath(listing),
    robots: nativeHeadOwned ? undefined : getPublicInventoryRobots(query),
    title: listing.title,
  });
};
