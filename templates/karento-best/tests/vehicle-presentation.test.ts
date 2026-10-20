import assert from "node:assert/strict";
import { test } from "node:test";
import { vehicleListings } from "../src/lib/data/vehicle-listing.ts";
import { selectedReferenceVehicle } from "../src/lib/data/vehicle-detail-selection.ts";
import { presentVehicle } from "../src/lib/i18n/vehicle.ts";
import type { VehicleCardContent } from "../src/lib/content.ts";
import type { LocaleContext } from "../src/lib/i18n/context.svelte.ts";
import type { Locale } from "../src/lib/i18n/locales.ts";
import {
  translate,
  formatNumber,
  formatMoney,
  formatCount,
} from "../src/lib/i18n/messages.ts";

function context(
  locale: Locale,
): Pick<LocaleContext, "t" | "number" | "money" | "count"> {
  return {
    t: (key, ...args) => translate(locale, key, ...args),
    number: (value) => formatNumber(value, locale),
    money: (value, currency) => formatMoney(value, currency, locale),
    count: (value, entity = "vehicles") => formatCount(value, entity, locale),
  };
}

test("complete dealer records do not inherit reference stock facts", () => {
  const source = vehicleListings.gridFourColumns[0];
  const supplied: VehicleCardContent = {
    sample: false,
    image: "/supplied-vehicle.webp",
    imageAlt: "Supplied electric vehicle",
    href: "/vehicle?id=supplied-record",
    title: "Supplied electric vehicle",
    location: "Sofia",
    mileage: "40,000 km",
    transmission: "Single-speed",
    fuel: "Electric",
    seats: "5 seats",
    price: "€19,000",
    pricePeriod: "",
    action: "View car",
    rating: "",
    reviews: "",
  };
  const selected = selectedReferenceVehicle(
    new URLSearchParams({ vehicle: source.id }),
    { [source.title]: supplied },
  );
  assert.ok(selected);
  assert.equal(selected.id, source.id);
  assert.equal(selected.card.href, supplied.href);
  for (const locale of ["en", "bg"] as const) {
    assert.deepEqual(
      presentVehicle(selected.card, context(locale)),
      presentVehicle(supplied, context(locale)),
    );
  }
});

test("stock highlights remain optional, regardless of a vehicle's foreign location", () => {
  const stock = {
    ...vehicleListings.gridFourColumns[0],
    sample: false,
    listingHighlights: undefined,
  };
  for (const locale of ["en", "bg"] as const) {
    assert.equal(presentVehicle(stock, context(locale)).listingHighlights, "");
  }
});

test("new import and registration can coexist and follow the visitor language", () => {
  const stock = {
    ...vehicleListings.gridFourColumns[0],
    sample: false,
    listingHighlights: ["new-import", "registered"] as const,
  };
  assert.equal(
    presentVehicle(stock, context("bg")).listingHighlights,
    "Нов внос · Регистриран",
  );
  assert.equal(
    presentVehicle(stock, context("en")).listingHighlights,
    "New import · Registered",
  );
  assert.equal(
    presentVehicle({ ...stock, listingHighlights: ["serviced"] }, context("bg"))
      .listingHighlights,
    "Напълно обслужен",
  );
});
