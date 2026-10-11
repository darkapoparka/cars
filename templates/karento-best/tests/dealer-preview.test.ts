import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";

const source = (file: string) => fs.readFileSync(file, "utf8");

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
    "src/routes/2/DiscoveryNavigation.svelte",
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

test("phone specifications keep complete values on one line with content-sized cells", () => {
  const specifications = source(
    "src/lib/components/vehicle-detail/VehicleSpecifications.svelte",
  );
  assert.match(specifications, /\.list-feature-car\s*\{\s*display:\s*flex;/);
  assert.match(specifications, /flex-wrap:\s*wrap/);
  assert.match(specifications, /min-width:\s*max-content/);
  assert.match(specifications, /white-space:\s*nowrap/);
  assert.match(specifications, /overflow-wrap:\s*normal/);
  assert.match(specifications, /locale\.number\(specification\.valueNumber\)/);
  assert.match(
    specifications,
    /locale\.t\(`unit\.\$\{specification\.unit\}`\)/,
  );
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
