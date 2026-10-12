"use client";
import { NativeInventoryMetadata } from "./native-inventory-metadata";

import type { NativeMarketplaceInventory } from "@repo/marketplace";
import { useSearchParams } from "next/navigation";
import { projectNativeListingQuery, type NativeListingRoute } from "../lib/native-listing-query-policy";
import { ListingDetail, type ListingDetailProps } from "./listing-detail";

interface NativeListingDetailProps extends Omit<ListingDetailProps,
  "listing" | "relatedListings" | "destinationCountryCode" | "marketplaceHref" | "nativeQuery"> {
  inventory: NativeMarketplaceInventory;
  route: NativeListingRoute;
  initialHref: string;
}

/** The same native detail tree owns hydration and browser query navigation.
 * Captured HTML uses source-authored atoms; canonical Flight carries immutable
 * inventory/route props, so its listing tree does not carry stale query props. */
export function NativeListingDetail({ inventory, route, initialHref, ...props }: NativeListingDetailProps) {
  const search = useSearchParams();
  const url = new URL(initialHref);
  // The tagged hook reads the actual SSR request and pending browser URL.
  // The immutable route supplies its mounted pathname without serializing query.
  url.search = search.toString();
  const nativeQuery = projectNativeListingQuery(url.href, inventory, route);
  if (!nativeQuery) throw new Error("Unqualified native detail query source");
  return <><NativeInventoryMetadata initialHref={initialHref} /><ListingDetail {...props}
    destinationCountryCode={nativeQuery.destinationCountryCode}
    listing={nativeQuery.listing}
    marketplaceHref={nativeQuery.backHref}
    nativeQuery={nativeQuery}
    relatedListings={nativeQuery.cards.map(row => row.listing)} /></>;
}
