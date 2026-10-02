import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import {
  emptyFilters,
  parseFilters,
  filterQuery,
  filterVehicles,
  calculateLoan,
  safeReturn,
  validatedIds,
} from "../src/lib/domain.ts";
const cars = JSON.parse(
  readFileSync(new URL("../src/data/vehicles.json", import.meta.url), "utf8"),
);
test("combined make, model, condition and budget filters select the matching cars", () => {
  const matches = filterVehicles(cars, {
    ...emptyFilters,
    make: "audi",
    condition: "Used",
    max: "50000",
  });
  assert.ok(matches.length > 0);
  assert.ok(
    matches.every(
      (v) => v.make === "Audi" && v.condition === "Used" && v.price <= 50000,
    ),
  );
  assert.equal(
    filterVehicles(cars, { ...emptyFilters, make: "Audi", model: "Cooper" })
      .length,
    0,
  );
});
test("keyword search, inclusive price boundaries and sort are coherent", () => {
  const v = cars[0];
  const exact = filterVehicles(cars, {
    ...emptyFilters,
    q: v.title.toUpperCase(),
    min: String(v.price),
    max: String(v.price),
  });
  assert.ok(exact.some((x) => x.id === v.id));
  const ordered = filterVehicles(cars, { ...emptyFilters, sort: "price-low" });
  assert.ok(ordered.every((v, i) => !i || v.price >= ordered[i - 1].price));
  assert.equal(
    filterVehicles(cars, { ...emptyFilters, q: "no-such-car" }).length,
    0,
  );
});
test("filter URLs round-trip without losing context and reject invalid numeric selections", () => {
  const original = {
    ...emptyFilters,
    make: "Mercedes-Benz",
    max: "65000",
    sort: "price-high",
    page: 2,
  };
  assert.deepEqual(parseFilters(filterQuery(original)), original);
  const invalid = parseFilters(
    "?min=NaN&max=-5&year=Infinity&sort=bad&page=-9",
  );
  assert.equal(invalid.min, "");
  assert.equal(invalid.max, "");
  assert.equal(invalid.year, "");
  assert.equal(invalid.page, 1);
  assert.equal(invalid.sort, "recommended");
});
test("zero interest and a full deposit have the expected repayments", () => {
  assert.deepEqual(calculateLoan(50000, 5000, 0, 60), {
    principal: 45000,
    monthly: 750,
    interest: 0,
    total: 50000,
    months: 60,
  });
  const paid = calculateLoan(50000, 50000, 6.9, 60);
  assert.equal(paid.monthly, 0);
  assert.equal(paid.total, 50000);
});
test("interest-bearing loan estimates amortize the balance and reject invalid input", () => {
  const result = calculateLoan(10000, 0, 12, 12);
  assert.ok(Math.abs(result.monthly - 888.4878868) < 0.0001);
  assert.ok(result.interest > 0);
  assert.ok("error" in calculateLoan(10000, 10001, 6, 60));
  assert.ok("error" in calculateLoan(10000, 0, -1, 60));
  assert.ok("error" in calculateLoan(10000, 0, 6, 0));
  assert.ok("error" in calculateLoan(NaN, 0, 6, 60));
});
test("return navigation only accepts internal browsing destinations", () => {
  assert.equal(
    safeReturn("/inventory/?make=Ford&page=2"),
    "/inventory/?make=Ford&page=2",
  );
  assert.equal(safeReturn("/favorites/"), "/favorites/");
  assert.equal(safeReturn("/"), "/");
  for (const value of [
    "//example.com",
    "https://example.com",
    "javascript:alert(1)",
    "/contact/",
    null,
  ])
    assert.equal(safeReturn(value), "/inventory/");
});
test("corrupt or obsolete browser selections cannot create invalid vehicle IDs", () => {
  assert.deepEqual(
    validatedIds(["a", "a", "b", 7, {}, "obsolete"], ["a", "b"]),
    ["a", "b"],
  );
  assert.deepEqual(validatedIds({ id: "a" }, ["a"]), []);
});
test("all catalogue images and gallery photos are local source assets", () => {
  assert.equal(new Set(cars.map((v) => v.id)).size, cars.length);
  assert.equal(new Set(cars.map((v) => v.slug)).size, cars.length);
  for (const v of cars)
    for (const image of [v.image, ...v.gallery])
      assert.ok(
        existsSync(new URL("../public" + image, import.meta.url)),
        `${v.title}: ${image}`,
      );
});
