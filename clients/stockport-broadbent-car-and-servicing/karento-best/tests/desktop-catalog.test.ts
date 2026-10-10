import assert from "node:assert/strict";
import test from "node:test";
import {
  clearDesktopCatalogDestination,
  desktopCatalogDestination,
  catalogMileageInMiles,
  matchDesktopCatalog,
  readDesktopCatalogFilters,
  removeDesktopCatalogFilterDestination,
  selectDesktopCatalogTypeDestination,
  vehicleBodyType,
} from "../src/lib/data/desktop-catalog.ts";
import { vehicleListings } from "../src/lib/data/vehicle-listing.ts";

test("desktop body type combines with make, model and budget", () => {
  const filters = readDesktopCatalogFilters(
    new URLSearchParams(
      "type=SUV&make=Audi&model=Q5+2.0T+Premium+Plus&budget=200",
    ),
  );
  const results = matchDesktopCatalog(vehicleListings.gridFourColumns, filters);
  assert.deepEqual(
    results.map((card) => card.title),
    ["Audi Q5 2.0T Premium Plus"],
  );
  assert.equal(
    matchDesktopCatalog(vehicleListings.gridFourColumns, {
      ...filters,
      type: "Sedan",
    }).length,
    0,
  );
});

test("removing a make also removes its model and preserves the remaining filters and sort", () => {
  assert.equal(
    removeDesktopCatalogFilterDestination(
      "/vehicles",
      new URLSearchParams(
        "type=SUV&make=Audi&model=Q5&budget=200&sort=price-asc&utm_source=hero&filters=1",
      ),
      "make",
    ),
    "/vehicles?type=SUV&budget=200&sort=price-asc&utm_source=hero#vehicle-results",
  );
  assert.equal(
    removeDesktopCatalogFilterDestination(
      "/vehicles",
      new URLSearchParams(
        "type=SUV&make=Audi&model=Q5&budget=200&sort=price-desc",
      ),
      "budget",
    ),
    "/vehicles?type=SUV&make=Audi&model=Q5&sort=price-desc#vehicle-results",
  );
});

test("quick body type changes clear dependent make and model but preserve budget and sorting", () => {
  const parameters = new URLSearchParams(
    "type=SUV&make=Audi&model=Q5&budget=200&sort=price-asc&utm_source=hero",
  );
  assert.equal(
    selectDesktopCatalogTypeDestination("/vehicles", parameters, "Sedan"),
    "/vehicles?type=Sedan&budget=200&sort=price-asc&utm_source=hero#vehicle-results",
  );
  assert.equal(
    selectDesktopCatalogTypeDestination("/vehicles", parameters, "SUV"),
    "/vehicles?type=SUV&make=Audi&model=Q5&budget=200&sort=price-asc&utm_source=hero#vehicle-results",
  );
});

test("desktop price sorting applies within the selected body type and budget", () => {
  const filters = readDesktopCatalogFilters(
    new URLSearchParams("type=SUV&budget=160&sort=price-desc"),
  );
  const results = matchDesktopCatalog(vehicleListings.gridFourColumns, filters);
  assert.deepEqual(
    results.map((card) => card.title),
    ["Audi Q5 2.0T Premium Plus", "Kia Telluride SX", "Buick Enclave Avenir"],
  );
});

test("an empty desktop type preserves every catalogue entry and its order", () => {
  assert.deepEqual(
    matchDesktopCatalog(
      vehicleListings.gridFourColumns,
      readDesktopCatalogFilters(new URLSearchParams()),
    ),
    vehicleListings.gridFourColumns,
  );
});

test("dealer body metadata is explicit and sample lookups cannot use prototype names", () => {
  assert.equal(
    vehicleBodyType({ title: "Audi Q5 2.0T Premium Plus", price: "$100" }),
    "",
  );
  assert.equal(
    vehicleBodyType({
      title: "Audi Q5 2.0T Premium Plus",
      price: "$100",
      sample: true,
      bodyType: "Crossover",
    }),
    "Crossover",
  );
  assert.equal(
    vehicleBodyType({ title: "toString", price: "$100", sample: true }),
    "",
  );
  assert.equal(
    vehicleBodyType({
      title: "Subaru Impreza WRX STI",
      price: "$100",
      sample: true,
    }),
    "",
  );
});

test("clearing desktop filters removes body type and retains unrelated URL state", () => {
  assert.equal(
    clearDesktopCatalogDestination(
      "/vehicles",
      new URLSearchParams(
        "type=SUV&make=Audi&budget=200&sort=price-asc&filters=1&utm_source=hero",
      ),
    ),
    "/vehicles?utm_source=hero#vehicle-results",
  );
});

test("advanced filters combine actual specification metadata, price bounds and mileage units", () => {
  const cards = [
    {
      title: "Audi Q5",
      price: "$150",
      bodyType: "SUV",
      fuel: "Diesel",
      transmission: "Automatic",
      mileage: "30,000 km",
      seats: "7 seats",
    },
    {
      title: "Audi Q3",
      price: "$110",
      bodyType: "SUV",
      fuel: "Petrol",
      transmission: "Manual",
      mileage: "10,000 miles",
      seats: "5 seats",
    },
    {
      title: "Audi Q7",
      price: "$180",
      bodyType: "SUV",
      fuel: "Diesel",
      transmission: "Automatic",
      mileage: "50,000 miles",
      seats: "7 seats",
    },
    {
      title: "Audi Unknown",
      price: "$140",
      bodyType: "SUV",
      fuel: "Diesel",
      transmission: "Automatic",
    },
  ];
  const filters = readDesktopCatalogFilters(
    new URLSearchParams(
      "type=SUV&make=Audi&minPrice=120&budget=160&fuel=Diesel&transmission=Automatic&maxMileage=20000&minSeats=7&sort=price-desc",
    ),
  );
  assert.deepEqual(matchDesktopCatalog(cards, filters), [cards[0]]);
  assert.deepEqual(
    matchDesktopCatalog(cards, { ...filters, minPrice: "200" }),
    [],
  );
  assert.equal(catalogMileageInMiles("Not supplied"), null);
  assert.equal(catalogMileageInMiles("10,000 miles"), 10000);
});

test("invalid advanced numeric criteria are ignored without inventing vehicle metadata", () => {
  const filters = readDesktopCatalogFilters(
    new URLSearchParams(
      "minPrice=-1&maxMileage=Infinity&minSeats=2.5&fuel=+Diesel+",
    ),
  );
  assert.equal(filters.minPrice, "");
  assert.equal(filters.maxMileage, "");
  assert.equal(filters.minSeats, "");
  assert.equal(filters.fuel, "Diesel");
  assert.deepEqual(
    matchDesktopCatalog([{ title: "Unknown car", price: "$100" }], filters),
    [],
  );
});

test("advanced apply and individual removal preserve sorting and unrelated query state", () => {
  const filters = readDesktopCatalogFilters(
    new URLSearchParams(
      "fuel=Diesel&maxMileage=30000&minSeats=5&sort=price-desc",
    ),
  );
  const destination = desktopCatalogDestination(
    "/vehicles",
    filters,
    new URLSearchParams("campaign=hero&minPrice=999&filters=open"),
  );
  const url = new URL(destination, "http://localhost");
  assert.equal(url.searchParams.get("fuel"), "Diesel");
  assert.equal(url.searchParams.get("maxMileage"), "30000");
  assert.equal(url.searchParams.get("sort"), "price-desc");
  assert.equal(url.searchParams.get("campaign"), "hero");
  assert.equal(url.searchParams.has("minPrice"), false);
  assert.equal(url.searchParams.has("filters"), false);
  assert.equal(
    removeDesktopCatalogFilterDestination(
      "/vehicles",
      url.searchParams,
      "maxMileage",
    ),
    "/vehicles?campaign=hero&fuel=Diesel&minSeats=5&sort=price-desc#vehicle-results",
  );
});

test("clear removes all advanced criteria while keeping unrelated state", () => {
  const destination = clearDesktopCatalogDestination(
    "/vehicles",
    new URLSearchParams(
      "q=Audi&type=SUV&make=Audi&minPrice=100&budget=200&fuel=Diesel&transmission=Automatic&maxMileage=30000&minSeats=7&sort=price-desc&campaign=hero",
    ),
  );
  assert.equal(destination, "/vehicles?campaign=hero#vehicle-results");
});
