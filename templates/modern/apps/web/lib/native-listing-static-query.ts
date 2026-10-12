import type { NativeMarketplaceInventory } from "@repo/marketplace";
import { projectNativeListingQuery, type NativeListingRoute } from "../../../packages/marketplace-ui/lib/native-listing-query-policy";
import { createNativeListingStaticMetadata } from "./native-public-listing-metadata";

export interface NativeListingStaticQueryContext {
  kind: "listing";
  inventory: NativeMarketplaceInventory;
  route: NativeListingRoute;
}

export const evaluateNativeListingStaticQuery = (href: string, context: NativeListingStaticQueryContext) => {
  const evaluation = projectNativeListingQuery(href, context.inventory, context.route);
  if (!evaluation) return;
  return { ...evaluation, metadata: createNativeListingStaticMetadata({ listing: evaluation.listing, locale: context.route.locale, query: evaluation.rawSearchParams, nativeHeadOwned: false }) };
};
