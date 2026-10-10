import assert from "node:assert/strict";
import { test } from "node:test";
import {
  catalogDestination,
  emptyCatalogFilters,
  matchCatalog,
  normalizeCatalogBudget,
  readCatalogFilters,
} from "../src/lib/data/mobile-catalog.ts";

const items = [
  { title: "Subaru Outback Limited XT", price: "$75.86" },
  { title: "Subaru Impreza WRX STI", price: "$84.50" },
  { title: "Toyota Outback Limited XT", price: "$60.00" },
];

const invalidBudgets = [
  "0",
  "0.00",
  "0,00",
  "-1",
  "-0.5",
  "NaN",
  "Infinity",
  "1e2",
  "0x10",
  "100.",
  "100,",
  "10..50",
  "10,,50",
  "1.2,3",
  "1,000.50",
  "1 000",
  "9".repeat(400),
];

test("budget accepts one decimal separator and preserves empty as no limit", () => {
  for (const [input, expected] of [
    ["", ""],
    ["   ", ""],
    ["80", "80"],
    ["75.86", "75.86"],
    ["75,86", "75.86"],
    [" 75,86 ", "75.86"],
    ["0.01", "0.01"],
    ["0,01", "0.01"],
    ["0.0000001", "0.0000001"],
  ]) {
    assert.equal(normalizeCatalogBudget(input), expected, input);
  }
  assert.deepEqual(
    matchCatalog(items, { ...emptyCatalogFilters, budget: "" }),
    items,
  );
});

test("invalid budget drafts cannot produce an applicable preview", () => {
  for (const budget of invalidBudgets) {
    assert.equal(normalizeCatalogBudget(budget), undefined, budget);
    assert.deepEqual(
      matchCatalog(items, { ...emptyCatalogFilters, budget }),
      [],
      budget,
    );
  }
});

test("invalid query budgets are discarded without losing valid filters", () => {
  const filters = {
    q: "Outback",
    make: "Subaru",
    model: "Outback Limited XT",
    budget: "",
    sort: "price-asc",
  };
  for (const budget of invalidBudgets) {
    const restored = readCatalogFilters(
      new URLSearchParams({ ...filters, budget }),
    );
    assert.deepEqual(restored, filters, budget);
    assert.deepEqual(matchCatalog(items, restored), [items[0]], budget);
  }
});

test("decimal preview and applied query select the same vehicles", () => {
  for (const budget of ["75.86", "75,86"]) {
    const draft = {
      ...emptyCatalogFilters,
      make: "Subaru",
      budget,
      sort: "price-desc",
    };
    const destination = catalogDestination(
      "/vehicles",
      draft,
      new URLSearchParams("lang=bg&campaign=summer&filters=open"),
      "#vehicle-results",
    );
    const url = new URL(destination, "http://localhost");
    const restored = readCatalogFilters(url.searchParams);
    assert.equal(restored.budget, "75.86");
    assert.deepEqual(matchCatalog(items, draft), [items[0]]);
    assert.deepEqual(matchCatalog(items, restored), [items[0]]);
    assert.equal(restored.make, "Subaru");
    assert.equal(restored.sort, "price-desc");
    assert.equal(url.searchParams.get("lang"), "bg");
    assert.equal(url.searchParams.get("campaign"), "summer");
    assert.equal(url.searchParams.has("filters"), false);
    assert.equal(url.hash, "#vehicle-results");
  }
  assert.equal(
    readCatalogFilters(new URLSearchParams("budget=75%2C86")).budget,
    "75.86",
  );
});

test("empty and invalid budgets cannot be written back into the URL", () => {
  const filters = {
    ...emptyCatalogFilters,
    q: "Outback",
    make: "Subaru",
    model: "Outback Limited XT",
    sort: "price-asc",
  };
  for (const budget of ["", ...invalidBudgets]) {
    const destination = catalogDestination(
      "/vehicles",
      { ...filters, budget },
      new URLSearchParams("budget=80&lang=bg&campaign=summer"),
    );
    const url = new URL(destination, "http://localhost");
    assert.equal(url.searchParams.has("budget"), false, budget);
    assert.deepEqual(readCatalogFilters(url.searchParams), filters, budget);
    assert.equal(url.searchParams.get("lang"), "bg");
    assert.equal(url.searchParams.get("campaign"), "summer");
  }
});

test("model selection stays within the selected make and survives URL encoding", () => {
  const filters = {
    ...emptyCatalogFilters,
    make: "Subaru",
    model: "Outback Limited XT",
  };
  const destination = catalogDestination("/vehicles", filters);
  const restored = readCatalogFilters(
    new URL(destination, "http://localhost").searchParams,
  );
  assert.deepEqual(restored, filters);
  assert.deepEqual(matchCatalog(items, restored), [items[0]]);
});

test("a model without a make and invalid budget or sort do not filter the catalogue", () => {
  const filters = readCatalogFilters(
    new URLSearchParams("model=Outback&budget=Infinity&sort=unknown"),
  );
  assert.deepEqual(filters, emptyCatalogFilters);
  assert.deepEqual(matchCatalog(items, filters), items);
});

test("sort preserves make and budget constraints while ordering different prices", () => {
  assert.deepEqual(
    matchCatalog(items, {
      ...emptyCatalogFilters,
      make: "Subaru",
      budget: "80",
      sort: "price-desc",
    }),
    [items[0]],
  );
  assert.deepEqual(
    matchCatalog(items, { ...emptyCatalogFilters, sort: "price-asc" }),
    [items[2], items[0], items[1]],
  );
});

test("applying filters removes the open command while retaining unrelated URL state", () => {
  const destination = catalogDestination(
    "/vehicles",
    { ...emptyCatalogFilters, make: "Subaru" },
    new URLSearchParams(
      "filters=open&campaign=summer&model=Outback&sort=price-asc",
    ),
    "#vehicle-results",
  );
  const url = new URL(destination, "http://localhost");
  assert.equal(url.searchParams.get("campaign"), "summer");
  assert.equal(url.searchParams.get("make"), "Subaru");
  assert.equal(url.searchParams.has("filters"), false);
  assert.equal(url.searchParams.has("model"), false);
  assert.equal(url.searchParams.has("sort"), false);
  assert.equal(url.hash, "#vehicle-results");
});
