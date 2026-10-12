import { evaluateNativeListingStaticQuery, type NativeListingStaticQueryContext } from "./native-listing-static-query";
import { evaluateNativeMarketplaceStaticQuery, type NativeStaticQueryContext } from "./native-marketplace-static-query";
import { createNativeMarketplaceSlotPlan } from "./native-marketplace-static-slot-plan";

type Data = Record<string, unknown>;
interface NativeStaticEntryInput {
  graphSeal: string;
  routes: ReadonlyMap<string, NativeStaticQueryContext | NativeListingStaticQueryContext>;
  receipts: ReadonlyMap<string, Uint8Array>;
  requestPolicy: (request: Request, env: unknown, context: unknown, row: Data, proof: Data) => Promise<Data | undefined> | Data | undefined;
  responsePolicy: (request: Request, env: unknown, context: unknown, row: Data, evaluation: Data, requestPolicy: Data, proof: Data) => Promise<Data | undefined> | Data | undefined;
}

/** Producer binds this explicit pure entry to the same graph, inventory and
 * captured official native response policy. No SSR/React entry is imported. */
export const createNativeMarketplaceStaticEntry = ({ graphSeal, routes, receipts, requestPolicy, responsePolicy }: NativeStaticEntryInput) => ({
  nativeQueryAbi: 1,
  graphSeal,
  evaluate: (href: string, row: Data) => {
    const pathname = new URL(href).pathname;
    const selected = routes.get(pathname);
    if (!selected || row.pathname !== pathname || row.inventorySeal !== selected.inventory.inventorySeal) return;
    return "kind" in selected && selected.kind === "listing"
      ? evaluateNativeListingStaticQuery(href, selected)
      : evaluateNativeMarketplaceStaticQuery(href, selected as NativeStaticQueryContext);
  },
  getReceipt: (seal: string) => receipts.get(seal)?.slice(),
  createSlotPlan: (evaluation: Data, _row: Data, receipt: Parameters<typeof createNativeMarketplaceSlotPlan>[1], policy: Data) =>
    createNativeMarketplaceSlotPlan(evaluation, receipt, policy),
  getResponsePolicy: responsePolicy,
  getRequestPolicy: requestPolicy,
});

/** Full source-backed catalogue/detail factory; retained export remains compatible. */
export const createNativeModernStaticEntry = createNativeMarketplaceStaticEntry;
export { createNativeModernRouteContexts } from "./native-modern-route-contexts";

export { getNativeModernSlotBindings, mapNativeModernSlotHref, nativeModernSlotSerializerOwners } from "./native-modern-slot-bindings";
