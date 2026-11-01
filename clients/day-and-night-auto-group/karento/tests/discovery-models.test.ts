import assert from "node:assert/strict";
import test from "node:test";
import {
  discoveryBrands,
  discoveryModels,
  emptyDiscoveryFilters,
  searchCars,
} from "../src/lib/discovery/discovery.ts";

test("model choices remain unique when the dealer has several cars of one model", () => {
  for (const make of discoveryBrands) {
    const values = discoveryModels(make).map((option) => option.value);
    assert.equal(values.length, new Set(values).size, make);
  }
  assert.equal(
    discoveryModels("BMW").filter((option) => option.value === "BMW X6").length,
    1,
  );
  assert.equal(
    searchCars("", { ...emptyDiscoveryFilters, make: "BMW", model: "BMW X6" })
      .length,
    2,
  );
});
