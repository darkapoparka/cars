import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { load } from "cheerio";
import { catalogMake } from "../src/lib/data/mobile-catalog.ts";
import profile from "../src/lib/server/dealer-profile.json" with { type: "json" };
const root = path.resolve(import.meta.dirname, "..");
const base = "http://127.0.0.1:6691";
const manifest = JSON.parse(
  await fs.readFile(
    path.join(
      root,
      ".runtime/evidence/signature-correction/source-manifest.json",
    ),
    "utf8",
  ),
);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
// Explicit owner-authorized follow-up; the original baseline mode stays strict.
const homeSearch = process.argv.includes("--home-search");
const homeSearchPaths = [
  "src/lib/discovery/DiscoverySearch.svelte",
  "src/lib/components/search/DealershipVehicleSearch.svelte",
  "src/lib/sections/DesktopDealershipHero.svelte",
  "src/lib/components/search/VehicleSearch.svelte",
  "src/lib/discovery/DiscoveryHome.svelte",
  "src/lib/pages/index-3.svelte",
  "src/lib/components/Header.svelte",
  // Owner-authorized shared header/dock consistency follow-up.
  "src/lib/components/MobileNavigation.svelte",
  "src/lib/pages/marketplace-home.svelte",
  // Owner-authorized Cars/Services/Shop mobile card family.
  "src/lib/discovery/DiscoveryCard.svelte",
  "src/lib/components/vehicle-listing/ListingVehicleGrid.svelte",
  "src/lib/components/mobile/MobileMediaRow.svelte",
  "src/lib/components/mobile/MobileServiceCard.svelte",
  "src/lib/sections/ServiceBenefits.svelte",
  "src/lib/components/vehicle-listing/MobileProductCard.svelte",
  "src/lib/components/vehicle-listing/ListingProductGrid.svelte",
  "src/lib/components/vehicle-listing/MobileCatalog.svelte",
];
const adapted = new Set([
  ...manifest.adaptedPaths,
  ...(homeSearch ? homeSearchPaths : []),
]);
assert.equal(
  catalogMake({ title: "Land Rover Range Rover Sport", price: "" }),
  "Land Rover",
);
assert.equal(
  catalogMake({ title: "Mercedes-Benz GLA 45 AMG", price: "" }),
  "Mercedes-Benz",
);
let identicalSourceFiles = 0;
for (const file of manifest.sourceFiles) {
  assert.equal(
    hash(await fs.readFile(path.join(manifest.source, file.path))),
    file.sha256,
    "Master changed: " + file.path,
  );
  if (!adapted.has(file.path)) {
    assert.equal(
      hash(await fs.readFile(path.join(root, file.path))),
      file.sha256,
      "Unexpected client design drift: " + file.path,
    );
    identicalSourceFiles++;
  }
}
async function page(route, mobile = false) {
  const response = await fetch(base + route, {
    headers: mobile ? { "user-agent": "Mozilla/5.0 Android Mobile" } : {},
  });
  assert.equal(response.status, 200, route);
  const html = await response.text();
  assert(!html.includes('class="dn-site"'), "Rejected shell must not load");
  const d = load(html);
  assert(
    d("title").text().includes(profile.business.name),
    route + ": dealer metadata",
  );
  assert.equal(
    d("script[src]").filter((_, e) =>
      /\/dealer-ui\.js|\/assets\/js\/main\.js|jquery/i.test(d(e).attr("src")),
    ).length,
    0,
    route + ": no legacy loader",
  );
  return d;
}
const home = await page("/?lang=en", true);
assert(home(".discovery-home").length, "Promoted master phone Home");
assert(home("h1").text().includes("Find your next car."));
if (homeSearch) {
  assert.deepEqual(
    home(".search-purpose button")
      .map((_, element) => home(element).text().trim())
      .get(),
    ["Buy", "Rent"],
  );
}
assert(
  home('img[src="/dealer-brand/logo-on-light.webp"]').length,
  "Existing dealer logo",
);
const desktopHome = await page("/?lang=en");
if (homeSearch) {
  assert.deepEqual(
    desktopHome(".hero-search .search-purpose button")
      .map((_, element) => desktopHome(element).text().trim())
      .get(),
    ["Buy", "Rent"],
  );
}
assert.equal(
  desktopHome(".desktop-hero-title").text().trim(),
  homeSearch ? "Find your next car." : "Discover your next car today.",
);
const vehicles = await page("/vehicles?lang=en", true);
for (const listing of profile.listings) {
  assert(
    vehicles(`a[href*="id=${listing.id}"]`).length,
    "Card link " + listing.id,
  );
  const detail = await page("/vehicle?id=" + listing.id + "&lang=en");
  assert(
    detail(`main img[src="${listing.image}"]`).length,
    "Correct native detail image " + listing.id,
  );
  assert.equal(
    (await fetch(base + listing.image, { method: "HEAD" })).status,
    200,
    listing.image,
  );
}
const defaultDetail = await page("/vehicle?lang=en");
assert(defaultDetail(`main img[src="${profile.listings[0].image}"]`).length);
const contact = await page("/contact?lang=en");
assert(contact('a[href^="tel:"]').length);
assert.equal(
  contact('a[href^="tel:"]').filter(
    (_, e) => dPhone(contact(e).attr("href")) !== profile.business.phoneE164,
  ).length,
  0,
  "Foreign phone",
);
function dPhone(value) {
  return decodeURIComponent(value.slice(4)).replace(/[\s()-]/g, "");
}
let cssFiles = 0;
for (const file of manifest.sourceFiles.filter((item) =>
  item.path.startsWith("static/"),
)) {
  const response = await fetch(base + "/" + file.path.slice(7));
  assert.equal(response.status, 200);
  assert.equal(
    hash(Buffer.from(await response.arrayBuffer())),
    file.sha256,
    "Served master CSS " + file.path,
  );
  cssFiles++;
}
assert.equal((await fetch(base + "/not-a-real-route")).status, 404);
assert.equal((await fetch(base + "/dealer-ui.js")).status, 404);
const result = {
  result: "passed",
  sourceDigest: manifest.sourceDigest,
  sourceFiles: manifest.sourceFiles.length,
  identicalSourceFiles,
  cssFiles,
  detailIds: profile.listings.length,
  stockImages: profile.listings.length,
  nativeHome: "phone and desktop",
  contact: "passed",
  unknownRoute: 404,
  legacyLoader: 404,
  ...(homeSearch ? { authorizedHomeSearchPaths: homeSearchPaths } : {}),
};
await fs.writeFile(
  path.join(
    root,
    `.runtime/evidence/${homeSearch ? "signature-search" : "signature-correction"}/http-result.json`,
  ),
  JSON.stringify(result, null, 2),
);
console.log(JSON.stringify(result));
