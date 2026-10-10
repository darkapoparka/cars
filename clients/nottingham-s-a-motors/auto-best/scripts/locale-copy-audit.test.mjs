import test from "node:test";
import assert from "node:assert/strict";
import { translatedEnglishPatterns } from "./locale-copy-audit.mjs";
const row = (en, bg = "Локализиран текст", disposition = "translate") => ({ en, bg, disposition });
const matches = (rows, text) => translatedEnglishPatterns(rows).some(pattern => new RegExp(pattern, "u").test(text));
test("recognizes interpolated All 6 cars rather than only literal catalog entries", () => {
  assert(matches([row("All {p0} cars")], "All 6 cars"));
  assert(!matches([row("All {p0} cars")], "Всички 6 автомобила"));
});
test("escapes punctuation and anchors the complete known message", () => {
  const rows = [row("Payment ({p0}) + APR?")];
  assert(matches(rows, "Payment (250) + APR?"));
  assert(!matches(rows, "Payment 250 APR"));
  assert(!matches(rows, "Custom prefix Payment (250) + APR?"));
});
test("excludes invariant names, currencies and short domain patterns", () => {
  for (const text of ["BMW {p0}", "{p0} AED"]) assert.deepEqual(translatedEnglishPatterns([row(text)]), []);
  assert.deepEqual(translatedEnglishPatterns([row("All {p0} cars", "All {p0} cars")]), []);
  assert.deepEqual(translatedEnglishPatterns([row("All {p0} cars", "Локализиран", "invariant")]), []);
});
test("normalizes catalog whitespace and removes duplicates", () => {
  const patterns = translatedEnglishPatterns([row("All  {p0}  cars"), row("All {p0} cars")]);
  assert.equal(patterns.length, 1);
  assert(new RegExp(patterns[0], "u").test("All 6 cars"));
});
test("does not classify already-covered static catalog entries as dynamic", () => {
  assert.deepEqual(translatedEnglishPatterns([row("All available cars")]), []);
});
