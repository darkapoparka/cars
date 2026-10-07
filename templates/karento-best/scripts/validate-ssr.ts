import assert from "node:assert/strict";
import fs from "node:fs";
import { load } from "cheerio";
import { canonicalRoutes, sourceKeys } from "../src/lib/routes.ts";
import { mainText, referencePage } from "./reference.ts";

const native = process.env.KARENTO_NATIVE_URL || "http://127.0.0.1:6466";
const paths = [
  ...new Set([
    ...Object.keys(canonicalRoutes).map((key) => "/" + key),
    ...sourceKeys.flatMap((key) => ["/" + key, "/" + key + ".html"]),
  ]),
];
const results: { route: string; status: number; textMatch?: boolean }[] = [];
for (const route of paths) {
  const reference = referencePage(route);
  const response = await fetch(native + route);
  assert.equal(response.status, 200, route);
  const body = await response.text();
  const actual = load(body);
  assert.equal(actual("main").length, 1, route);
  assert.equal(actual("header.header").length, 1, route);
  assert.equal(actual("title").text(), reference.title, route + " title");
  assert.equal(mainText(body), reference.mainText, route + " visible content");
  assert.deepEqual(
    actual("main img")
      .map((_, image) => actual(image).attr("src"))
      .get(),
    reference.images,
    route + " image sequence",
  );
  results.push({ route, status: response.status, textMatch: true });
}
for (const route of [
  "/missing",
  "/toString",
  "/constructor",
  "/__proto__",
  "/vehicles/nope",
  "/Vehicles",
  "/vehicles.html.html",
  "/%74oString",
  "/unknown?x=1",
]) {
  const response = await fetch(native + route);
  assert.equal(response.status, 404, route);
  const html = load(await response.text());
  assert.equal(html("header.header").length, 1, route);
  assert.match(html("main").text(), /404|not found|lost/i, route);
  results.push({ route, status: 404 });
}
fs.mkdirSync(".runtime/evidence", { recursive: true });
fs.writeFileSync(
  ".runtime/evidence/ssr.json",
  JSON.stringify(results, null, 2),
);
console.log(
  `${paths.length} SSR compositions/aliases match the approved Best checkpoint, plus 9 designed HTTP 404 paths.`,
);
