import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { test } from "node:test";
import {
  canonicalRoutes,
  sourceKeys,
  resolveRoute,
} from "../src/lib/routes.ts";
const hash = (p: string) =>
  crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
// The standalone publishing mirror contains the original folders. The Cars
// master uses its preserved sibling library and a hash-locked evidence archive.
const library = fs.existsSync("karento/src") ? "karento" : "../karento";
const capturedBest = fs.existsSync("karento-best/src")
  ? "karento-best"
  : "provenance/frozen-best";
function referencePath(file: string) {
  if (file.startsWith("karento/")) {
    const original = path.join(library, file.slice(8));
    // The original instruction file was captured while still untracked in Cars.
    // Preserve its bytes in evidence without staging another owner's file.
    if (file === "karento/AGENTS.md" && !fs.existsSync(original))
      return "provenance/frozen-library/AGENTS.md";
    return original;
  }
  assert.ok(file.startsWith("karento-best/"), file);
  return path.join(capturedBest, file.slice(13));
}
test("all 607 hash-recorded preserved source files match recorded SHA256", () => {
  const baseline = JSON.parse(
    fs.readFileSync("provenance/baseline.json", "utf8"),
  );
  assert.equal(baseline.files.length, 607);
  for (const file of baseline.files)
    assert.equal(hash(referencePath(file.path)), file.sha256, file.path);
});
test("self-contained static assets preserve every original byte", () => {
  const walk = (p: string): string[] =>
    fs
      .readdirSync(p, { withFileTypes: true })
      .flatMap((e) =>
        e.isDirectory() ? walk(path.join(p, e.name)) : [path.join(p, e.name)],
      );
  const originalStatic = path.join(library, "static");
  const assets = walk(originalStatic);
  for (const file of assets)
    assert.equal(
      hash(file),
      hash(path.join("static", path.relative(originalStatic, file))),
      file,
    );
  assert.equal(
    hash("static/dealer-site.css"),
    JSON.parse(fs.readFileSync("provenance/reviewed-source.json", "utf8"))
      .dealerStylesSha256,
  );
  for (const file of walk(
    path.join(capturedBest, "src/lib/server/assets/how-it-works"),
  ))
    assert.equal(
      hash(file),
      hash("static/assets/karento-best/how-it-works/" + path.basename(file)),
    );
});
test("30 canonical keys and 39 source keys retain composition and html aliases", () => {
  assert.equal(Object.keys(canonicalRoutes).length, 30);
  assert.equal(sourceKeys.length, 39);
  for (const [route, key] of Object.entries(canonicalRoutes)) {
    assert.equal(resolveRoute("/" + route), key);
    assert.equal(resolveRoute("/" + route + ".html"), key);
  }
  for (const key of sourceKeys) {
    assert.equal(resolveRoute("/" + key), key);
    assert.equal(resolveRoute("/" + key + ".html"), key);
  }
  for (const path of [
    "/toString",
    "/constructor",
    "/__proto__",
    "/unknown",
    "/vehicles/nope",
    "/Vehicles",
    "/vehicles.html.html",
    "//vehicles",
  ])
    assert.equal(resolveRoute(path), null, path);
});
test("production source has compiled Svelte markup and no raw-page or legacy loader escape hatch", () => {
  const walk = (p: string): string[] =>
    fs
      .readdirSync(p, { withFileTypes: true })
      .flatMap((e) =>
        e.isDirectory() ? walk(p + "/" + e.name) : [p + "/" + e.name],
      );
  for (const file of walk("src")) {
    const source = fs.readFileSync(file, "utf8");
    assert.doesNotMatch(
      source,
      /@html|CapturedPage|cheerio|iframe.*127\.0\.0\.1|\/assets\/js\/main\.js|jquery|jQuery|slick\.js|bootstrap-datepicker\.js|ts-ignore|ts-nocheck/,
      file,
    );
  }
});
