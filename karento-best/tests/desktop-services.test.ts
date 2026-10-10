import assert from "node:assert/strict";
import test from "node:test";
import { filterDesktopServices } from "../src/lib/data/desktop-services.ts";
import { serviceCards } from "../src/lib/data/services.ts";

test("desktop service search combines keywords and category without changing supplied records", () => {
  const results = filterDesktopServices(
    serviceCards,
    "  LUXURY   rentals ",
    "rentals",
  );
  assert.deepEqual(results.cards, [serviceCards[2]]);
  assert.equal(results.cards[0].href, "/contact#contact-enquiry");
  assert.equal(
    filterDesktopServices(serviceCards, "luxury", "transfers").cards.length,
    0,
  );
});

test("desktop service category counts reflect the search before category selection", () => {
  const results = filterDesktopServices(serviceCards, "transfers", "rentals");
  assert.equal(results.cards.length, 0);
  assert.deepEqual(
    results.filters.map(({ id, count }) => [id, count]),
    [
      ["all", 3],
      ["rentals", 0],
      ["transfers", 3],
      ["concierge", 0],
      ["assistance", 0],
    ],
  );
});

test("empty search restores all nine services and unknown keywords produce an empty state", () => {
  assert.deepEqual(
    filterDesktopServices(serviceCards, " ", "all").cards,
    serviceCards,
  );
  const empty = filterDesktopServices(
    serviceCards,
    "no-supplied-service",
    "all",
  );
  assert.equal(empty.cards.length, 0);
  assert.ok(empty.filters.every(({ count }) => count === 0));
});

test("Bulgarian service search resolves authored labels while retaining the original category and record", () => {
  const result = filterDesktopServices(
    serviceCards,
    "луксозни",
    "rentals",
    "bg",
  );
  assert.deepEqual(result.cards, [serviceCards[2]]);
  assert.equal(result.cards[0].category, "rentals");
  assert.equal(result.cards[0].href, "/contact#contact-enquiry");
  assert.equal(
    filterDesktopServices(serviceCards, "трансфери", "transfers", "bg").cards
      .length,
    3,
  );
});
