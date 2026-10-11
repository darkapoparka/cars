import assert from "node:assert/strict";
import { test } from "node:test";
import { brandingAttributes } from "../src/lib/branding.ts";

test("the baseline emits no accent overrides", () => {
  assert.deepEqual(brandingAttributes({ locale: "en" }), {
    locale: "en",
    style: "",
  });
});
test("reviewed accent tokens and locale have one explicit rendering boundary", () => {
  const result = brandingAttributes({
    locale: "en-gb",
    reviewedAccent: {
      base: "#171717",
      hover: "#333333",
      contrast: "#ffffff",
      soft: "#f2f2f2",
    },
  });
  assert.equal(result.locale, "en-GB");
  assert.equal(
    result.style,
    "--karento-accent:#171717;--karento-accent-hover:#333333;--karento-accent-contrast:#ffffff;--karento-accent-soft:#f2f2f2",
  );
});
test("malformed locale and CSS injection are rejected", () => {
  assert.throws(() => brandingAttributes({ locale: 'en\" invalid' }));
  assert.throws(() =>
    brandingAttributes({
      locale: "en",
      reviewedAccent: {
        base: "#171717;background:url(https://example.invalid)",
        hover: "#333333",
        contrast: "#ffffff",
        soft: "#f2f2f2",
      },
    }),
  );
});
