import assert from "node:assert/strict";
import fs from "node:fs";
import { load } from "cheerio";
import { resolveRoute, sourceKeys } from "../src/lib/routes.ts";

const base = process.env.KARENTO_NATIVE_URL || "http://127.0.0.1:6466";
let internalLinks = 0;
const results: { route: string; ids: number }[] = [];
for (const key of sourceKeys) {
  const route = "/" + key;
  const response = await fetch(base + route);
  assert.equal(response.status, 200, route);
  const html = load(await response.text());
  const ids = new Set<string>();
  html("[id]").each((_, element) => {
    const id = html(element).attr("id");
    if (!id) return;
    assert.ok(!ids.has(id), `${route}: duplicate id ${id}`);
    ids.add(id);
  });
  html("label[for], [aria-controls], [aria-labelledby]").each((_, element) => {
    for (const attribute of ["for", "aria-controls", "aria-labelledby"]) {
      const targets = html(element).attr(attribute)?.trim().split(/\s+/) || [];
      for (const target of targets)
        assert.ok(ids.has(target), `${route}: ${attribute} target ${target}`);
    }
  });
  html("a[href]").each((_, element) => {
    const href = html(element).attr("href");
    if (!href?.startsWith("/") || href.startsWith("//")) return;
    const path = new URL(href, base).pathname;
    if (path.startsWith("/assets/")) return;
    assert.ok(resolveRoute(decodeURIComponent(path)), `${route}: ${href}`);
    internalLinks++;
  });
  results.push({ route, ids: ids.size });
}
fs.mkdirSync(".runtime/evidence", { recursive: true });
fs.writeFileSync(
  ".runtime/evidence/links.json",
  JSON.stringify({ results, internalLinks }, null, 2),
);
console.log(
  `${results.length} variants have unique IDs, valid control associations and ${internalLinks} resolving internal links.`,
);
