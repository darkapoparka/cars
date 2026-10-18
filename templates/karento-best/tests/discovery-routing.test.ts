import assert from "node:assert/strict";
import { test } from "node:test";
import {
  discoveryCars,
  discoveryDestination,
  discoveryReturn,
  emptyDiscoveryFilters,
  findCar,
} from "../src/lib/discovery/discovery.ts";

test("Home car links select their own record at the canonical route", () => {
  for (const car of discoveryCars) {
    const destination = new URL(car.href, "https://preview.invalid");
    assert.equal(destination.pathname, "/");
    assert.equal(findCar(destination.searchParams.get("car")), car);
  }
});

test("Home search preserves locale and supplied state while leaving car details", () => {
  const destination = new URL(
    discoveryDestination(
      "  SUV  ",
      { ...emptyDiscoveryFilters, make: "Toyota", priceMax: "20000" },
      new URLSearchParams(
        "lang=bg&campaign=preview&car=toyota-compact&collection=offers&returnTo=%2F2",
      ),
      "#collection-suvs",
    ),
    "https://preview.invalid",
  );
  assert.equal(destination.pathname, "/");
  assert.equal(destination.searchParams.get("q"), "SUV");
  assert.equal(destination.searchParams.get("make"), "Toyota");
  assert.equal(destination.searchParams.get("priceMax"), "20000");
  assert.equal(destination.searchParams.get("lang"), "bg");
  assert.equal(destination.searchParams.get("campaign"), "preview");
  assert.equal(destination.hash, "#collection-suvs");
  for (const key of ["car", "collection", "returnTo"])
    assert.equal(destination.searchParams.has(key), false);
});

test("detail returns restore canonical and bookmarked discovery results", () => {
  assert.equal(
    discoveryReturn("/?q=SUV&make=Toyota&lang=bg#results"),
    "/?q=SUV&make=Toyota&lang=bg#results",
  );
  assert.equal(
    discoveryReturn("/2?collection=offers&lang=en#collection-offers"),
    "/?collection=offers&lang=en#collection-offers",
  );
  assert.equal(discoveryReturn("/2"), "/");
  assert.equal(discoveryReturn("/?q=SUV&returnTo=%2F2"), "/?q=SUV");
  for (const value of [
    null,
    "https://elsewhere.invalid/",
    "//elsewhere.invalid/",
    "/vehicles",
    "/2/../vehicles",
    "/?car=audi-premium",
    "/2?car=audi-premium",
  ])
    assert.equal(discoveryReturn(value), "/", String(value));
});
