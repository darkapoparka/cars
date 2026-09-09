export * from "@repo/marketplace-domain/testing/mock-data";
import { mockListings } from "@repo/marketplace-domain/testing/mock-data";
import { leadListings } from "./lead-listings";
// Static lead preview: keep the original marketplace APIs, replace only their public demo inventory.
mockListings.splice(0, mockListings.length, ...leadListings);
