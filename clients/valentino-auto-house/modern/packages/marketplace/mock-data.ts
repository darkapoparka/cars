// Retain the full workspace's private test fixtures without using their cars in the public demo.
export * from "@repo/marketplace-domain/testing/mock-data";
// Explicit exports override the inherited public inventory exports at this existing boundary.
export {
  mockListings,
  getMockListings,
  getMockListingBySlug,
  getMockListingById,
  getMockRelatedListings,
  getMockDealerInventory,
  mockSavedListingIds,
  getMockSavedListings,
} from "./source-listings";
