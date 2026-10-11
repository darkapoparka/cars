import assert from "node:assert/strict";
import test from "node:test";
import {
  clearDesktopFilterPane,
  desktopFilterChoices,
  removeDesktopFilterSelection,
  selectDesktopFilterMake,
  selectDesktopFilterType,
} from "../src/lib/data/desktop-catalog-modal.ts";
import { readDesktopCatalogFilters } from "../src/lib/data/desktop-catalog.ts";
import { vehicleListings } from "../src/lib/data/vehicle-listing.ts";

test("make and model option counts reflect the remaining filters", () => {
  const filters = readDesktopCatalogFilters(
    new URLSearchParams("make=Subaru&model=Impreza+WRX+STI&budget=100"),
  );
  const makes = desktopFilterChoices(
    vehicleListings.gridFourColumns,
    filters,
    "make",
  );
  assert.equal(makes.find((choice) => choice.value === "Subaru")?.count, 2);
  assert.equal(makes.find((choice) => choice.value === "Toyota")?.count, 1);
  const models = desktopFilterChoices(
    vehicleListings.gridFourColumns,
    filters,
    "model",
  );
  assert.equal(
    models.find((choice) => choice.value === "Outback Limited XT")?.count,
    2,
  );
  assert.equal(
    models.find((choice) => choice.value === "Impreza WRX STI")?.count,
    0,
  );
});

test("body type counts match a type change that clears the dependent make and model", () => {
  const filters = readDesktopCatalogFilters(
    new URLSearchParams(
      "type=SUV&make=Audi&model=Q5+2.0T+Premium+Plus&budget=100",
    ),
  );
  const types = desktopFilterChoices(
    vehicleListings.gridFourColumns,
    filters,
    "type",
  );
  assert.equal(types.find((choice) => choice.value === "Sedan")?.count, 2);
  assert.equal(types.find((choice) => choice.value === "Estate")?.count, 2);
  const next = selectDesktopFilterType(filters, "Estate");
  assert.equal(next.make, "");
  assert.equal(next.model, "");
  assert.equal(next.budget, "100");
  assert.equal(filters.make, "Audi");
});

test("make changes and chip removal reset the model without losing independent criteria", () => {
  const filters = readDesktopCatalogFilters(
    new URLSearchParams(
      "make=Subaru&model=Impreza+WRX+STI&fuel=Diesel&sort=price-desc",
    ),
  );
  assert.deepEqual(selectDesktopFilterMake(filters, "Toyota"), {
    ...filters,
    make: "Toyota",
    model: "",
  });
  assert.deepEqual(removeDesktopFilterSelection(filters, "make"), {
    ...filters,
    make: "",
    model: "",
  });
  assert.deepEqual(removeDesktopFilterSelection(filters, "fuel"), {
    ...filters,
    fuel: "",
  });
});

test("clearing price resets both ends of the range and preserves sort and other criteria", () => {
  const filters = readDesktopCatalogFilters(
    new URLSearchParams("minPrice=50&budget=200&make=Audi&sort=price-asc"),
  );
  const cleared = clearDesktopFilterPane(filters, "price");
  assert.deepEqual(cleared, { ...filters, minPrice: "", budget: "" });
  assert.equal(filters.minPrice, "50");
});

test("missing dealer facets produce no invented options or seats", () => {
  const items = [{ title: "Audi Example", price: "$50,000", sample: false }];
  const filters = readDesktopCatalogFilters(new URLSearchParams());
  for (const facet of [
    "type",
    "fuel",
    "transmission",
    "minSeats",
    "model",
  ] as const) {
    assert.deepEqual(desktopFilterChoices(items, filters, facet), []);
  }
});
