import assert from "node:assert/strict";
import { test } from "node:test";
import {
  listingBrands,
  vehicleListings,
} from "../src/lib/data/vehicle-listing.ts";

test("repeated brand artwork retains unique keys for Svelte hydration", () => {
  assert.equal(listingBrands.length, 12);
  assert.equal(new Set(listingBrands.map((brand) => brand.id)).size, 12);
  assert.deepEqual(
    listingBrands.slice(-3).map(({ light, dark }) => ({ light, dark })),
    listingBrands.slice(0, 3).map(({ light, dark }) => ({ light, dark })),
  );
});

test("each vehicle layout has unique stable card identities", () => {
  for (const [layout, vehicles] of Object.entries(vehicleListings)) {
    assert.equal(
      new Set(vehicles.map((vehicle) => vehicle.id)).size,
      vehicles.length,
      layout,
    );
  }
});
