import { createCategoryMetadata } from "./public-route-metadata";
/** Pure worker metadata always retains the original rule; native route head source owns browser updates. */
export const getNativeCategoryMarketplaceMetadata = (input: Parameters<typeof createCategoryMetadata>[0]) => createCategoryMetadata({ ...input, nativeHeadOwned: false });
export const createNativeMarketplaceCategoryMetadata = getNativeCategoryMarketplaceMetadata;
