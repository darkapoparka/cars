import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { coreEn, coreBg } from "../src/lib/i18n/catalogs/core.ts";

const source = (file: string) => fs.readFileSync(file, "utf8");

test("shared dealer hero copy stays concise and labels illustrative cars", () => {
  for (const [catalog, heading, intro, illustrative] of [
    [
      coreEn,
      "Find your car.",
      "Explore the listings.",
      "Explore example cars.",
    ],
    [
      coreBg,
      "Открийте своята кола.",
      "Разгледайте обявите.",
      "Разгледайте примерни коли.",
    ],
  ] as const) {
    assert.equal(catalog["dealer.home.heading"], heading);
    assert.equal(catalog["dealer.home.intro"], intro);
    assert.equal(catalog["dealer.home.illustrativeIntro"], illustrative);
  }
  assert.match(coreEn["dealer.stock.illustrativeNotice"], /not verified/);
  assert.match(coreBg["dealer.stock.illustrativeNotice"], /не са потвърдена/);
});

test("hero logo selection is available in SSR and keeps both contrast assets", () => {
  const header = source("src/lib/components/Header.svelte");
  const hero = header.slice(
    header.indexOf("const heroHeader"),
    header.indexOf("const preview"),
  );
  assert.match(hero, /resolveRoute\(page\.params\.path/);
  assert.doesNotMatch(hero, /phone\.current/);
  assert.match(header, /src=\{dealer\.logo\.light\}/);
  assert.match(header, /src=\{dealer\.logo\.archivedDark\}/);
  const css = source("static/mobile.css");
  for (const mode of ["light", "dark"]) {
    assert.match(
      css,
      new RegExp(
        `\\.header\\.mobile-hero-header:not\\(\\.mobile-header-scrolled\\)\\s+\\.header-logo\\s+\\.${mode}-mode\\s*\\{\\s*display:\\s*${mode === "dark" ? "block" : "none"}\\s*!important`,
      ),
    );
  }
});

test("business previews retain the complete website navigation", () => {
  for (const file of [
    "src/lib/components/Header.svelte",
    "src/lib/components/MobileNavigation.svelte",
    "src/lib/discovery/DiscoveryNavigation.svelte",
  ]) {
    assert.doesNotMatch(source(file), /businessPreview/, file);
  }
  const header = source("src/lib/components/Header.svelte");
  for (const route of [
    "/vehicles",
    "/services",
    "/shop",
    "/membership",
    "/contact",
  ]) {
    assert.ok(header.includes(`locale.href("${route}")`), route);
  }
});

test("phone specifications keep complete values in compact two-column cells", () => {
  const specifications = source(
    "src/lib/components/vehicle-detail/VehicleSpecifications.svelte",
  );
  assert.match(specifications, /\.list-feature-car\s*\{\s*display:\s*flex;/);
  assert.match(specifications, /flex-wrap:\s*wrap/);
  assert.match(specifications, /flex:\s*0 0 calc\(\(100% - 8px\) \/ 2\)/);
  assert.match(specifications, /min-width:\s*max-content/);
  const phone = specifications.slice(
    specifications.indexOf("@media (max-width: 767.98px)"),
    specifications.indexOf("@media (min-width: 992px)"),
  );
  assert.match(phone, /item-feature-car-inner\s*\{\s*gap:\s*6px/);
  assert.match(phone, /feature-image\s*\{[^}]*flex:\s*0 0 20px/);
  assert.match(phone, /feature-image\s*\{[^}]*margin-right:\s*0/);
  assert.match(specifications, /white-space:\s*nowrap/);
  assert.match(specifications, /overflow-wrap:\s*normal/);
  assert.match(specifications, /locale\.number\(specification\.valueNumber\)/);
  assert.match(
    specifications,
    /locale\.t\(`unit\.\$\{specification\.unit\}`\)/,
  );
});

test("phone specification text and icons share one visual treatment", () => {
  const css = source("static/mobile.css");
  const text = css.match(
    /\.list-feature-car \.feature-info p\s*\{([^}]+)\}/,
  )?.[1];
  assert.ok(text);
  for (const [property, token] of [
    ["font-family", "--karento-font-sans"],
    ["font-size", "--karento-type-body-small-size"],
    ["font-weight", "--karento-type-body-small-weight"],
    ["line-height", "--karento-type-body-small-leading"],
  ]) {
    assert.ok(text.includes(`${property}: var(${token})`), property);
  }
  assert.match(text, /font-variant-numeric:\s*tabular-nums/);
  assert.match(text, /letter-spacing:\s*0/);
  assert.match(
    css,
    /html\[lang="bg"\] \.list-feature-car \.feature-info p\s*\{\s*font-family:\s*Arial, sans-serif;/,
  );
  const icons = css.match(
    /\.list-feature-car \.feature-image img\s*\{([^}]+)\}/,
  )?.[1];
  assert.ok(icons);
  assert.match(icons, /width:\s*20px/);
  assert.match(icons, /height:\s*20px/);
  assert.match(icons, /filter:\s*brightness\(0\)/);
});

test("restored discovery does not invent dealer stock counts or editorial claims", () => {
  const types = source("src/lib/sections/VehicleTypeShowcase.svelte");
  assert.match(
    types,
    /dealer\.businessPreview\s*\? locale\.t\("reference\.bodyTypes\.browse"\)/,
  );
  for (const file of [
    "src/lib/sections/UpcomingVehicleNews.svelte",
    "src/lib/components/editorial/MobileNewsCollection.svelte",
  ]) {
    assert.match(
      source(file),
      /dealer\.businessPreview && !dealer\.news/,
      file,
    );
    assert.ok(source(file).includes('"editorial.list.sampleSummary"'), file);
  }
});
