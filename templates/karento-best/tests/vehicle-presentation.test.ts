import assert from "node:assert/strict";
import { test } from "node:test";
import { vehicleListings } from "../src/lib/data/vehicle-listing.ts";
import { presentVehicle } from "../src/lib/i18n/vehicle.ts";
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
