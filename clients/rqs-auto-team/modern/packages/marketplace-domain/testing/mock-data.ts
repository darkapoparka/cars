// Retain the template's complete static-demo export contract and query helpers.
// Catalogue-only records have no invented external listing ID: the UI uses their
// descriptive internal slug instead. Public source URLs remain in the descriptions.
export * from './dealer-demo-data';
import { mockListings } from './dealer-demo-data';
for (const listing of mockListings) {
  if (!listing.id) listing.id = `preview-${listing.slug}`;
}
