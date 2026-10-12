import { leadSite, mockListings, type NativeMarketplaceInventory } from "@repo/marketplace";
export const getNativeImmutablePublicInventory = (inventorySeal: string): NativeMarketplaceInventory => {
  if (!/^[a-f0-9]{64}$/.test(inventorySeal)) throw new Error("A sealed public demo inventory is required");
  return { schemaVersion: 1, inventorySeal, identity: leadSite, listings: mockListings, pageSize: 24 };
};
