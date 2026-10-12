import type { MarketplaceSearchParams } from "./search";
import type { PriceCurrency, VehicleListing } from "./types";
import { projectMarketplaceListings } from "./query";

export interface PublicDemoIdentity {
  slug: string;
  city: string;
  country: string;
  countryCode: string;
  currency: PriceCurrency;
  name: string;
  logoPath: string;
}

/** Public immutable inventory only; producer must admit the exact inventory/identity seal. */
export interface NativeMarketplaceInventory {
  schemaVersion: 1;
  inventorySeal: string;
  identity: PublicDemoIdentity;
  listings: readonly VehicleListing[];
  pageSize: number;
}

export function projectPublicDemoDestination(
  listing: VehicleListing | undefined,
  destinationCountryCode?: string
): VehicleListing | null {
  if (!(listing?.supply && destinationCountryCode)) {
    return listing ?? null;
  }

  const destinationIsEligible =
    listing.supply.delivery.eligibleCountryCodes.includes(
      destinationCountryCode
    );

  return {
    ...listing,
    supply: {
      ...listing.supply,
      delivery: {
        ...listing.supply.delivery,
        destinationCountryCode,
        status: destinationIsEligible
          ? listing.supply.delivery.status
          : "unavailable",
      },
    },
  };
}

export const projectPublicDemoIdentity = (listing: VehicleListing, identity: PublicDemoIdentity): VehicleListing => ({
  ...listing,
  badges: listing.badges.filter(
    (badge) => badge !== "certified" && badge !== "verified"
  ),
  dealerOrgId: `dealer-${identity.slug}`,
  location: {
    city: identity.city,
    country: identity.country,
  },
  ...(listing.monthlyEstimate
    ? {
        monthlyEstimate: {
          ...listing.monthlyEstimate,
          currency: identity.currency,
        },
      }
    : {}),
  price: {
    ...listing.price,
    currency: identity.currency,
  },
  seller: {
    ...listing.seller,
    city: identity.city,
    displayName: identity.name,
    id: `dealer-${identity.slug}`,
    logoUrl: identity.logoPath,
    type: "dealer",
    verificationStatus: "unverified",
  },
  ...(listing.supply
    ? {
        supply: {
          delivery: {
            ...listing.supply.delivery,
            destinationCountryCode: identity.countryCode,
            eligibleCountryCodes: [identity.countryCode],
            status: "eligible",
          },
          documentCount: 0,
          landedCostStatus: "unknown",
          nativePrice: { ...listing.price, currency: identity.currency },
          origin: {
            city: identity.city,
            country: identity.country,
            countryCode: identity.countryCode,
          },
          priceConversion: { status: "native" },
          provenance: {
            freshnessStatus: "unknown",
            sourceDisplayName: identity.name,
            sourceKind: "manual",
          },
          supplier: {
            kybStatus: "not_started",
            orgType: "dealer",
            trustStatus: "unverified",
            verifiedImporter: false,
          },
        },
      }
    : {}),
});


export const projectPublicDemoMarketplaceListings = (
  listings: readonly VehicleListing[],
  filters: MarketplaceSearchParams,
  pageSize: number,
  identity: PublicDemoIdentity
) => {
  const projection = projectMarketplaceListings(listings, filters, pageSize);
  return {
    ...projection,
    listings: projection.listings
      .map((listing) => projectPublicDemoIdentity(listing, identity))
      .map((listing) => projectPublicDemoDestination(listing, filters.deliverTo) ?? listing),
  };
};
