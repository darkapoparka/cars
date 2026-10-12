import assert from "node:assert/strict";
import test from "node:test";
import type { ImportSourceItem } from "../src/lib/data/editorial.ts";
import { importSources } from "../src/lib/data/editorial.ts";
import {
  filterImportSources,
  findImportSource,
  importCountryFilters,
  importSourceHref,
  suppliedImportSources,
} from "../src/lib/data/import-sources.ts";

const sources: readonly ImportSourceItem[] = [
  {
    id: "supplier a",
    name: "European Source",
    nameLabel: "European Source",
    address: "Munich",
    image: "/a.svg",
    countryCode: "DE",
  },
  {
    id: "supplier-b",
    name: "City Source",
    nameLabel: "City Source",
    address: "London",
    image: "/b.svg",
    countryCode: "GB",
  },
  {
    id: "supplier-c",
    name: "BMW specialist",
    nameLabel: "BMW specialist",
    address: "No supplied origin",
    image: "/c.svg",
  },
];

test("import providers preserve explicit empty and supplied source collections", () => {
  assert.equal(suppliedImportSources({}), importSources);
  assert.deepEqual(suppliedImportSources({ importSources: [] }), []);
  assert.equal(suppliedImportSources({ importSources: sources }), sources);
});

test("source search matches names, locations and localized supplied countries by words", () => {
  assert.deepEqual(
    filterImportSources(sources, "SOURCE munich", "all").sources,
    [sources[0]],
  );
  assert.deepEqual(
    filterImportSources(sources, "германия", "all", "bg").sources,
    [sources[0]],
  );
  assert.equal(filterImportSources(sources, "London", "DE").sources.length, 0);
});

test("country choices come only from supplied country codes and counts follow search", () => {
  const result = filterImportSources(sources, "source", "GB");
  assert.deepEqual(result.sources, [sources[1]]);
  assert.deepEqual(
    result.countries.map(({ id, count }) => [id, count]),
    [
      ["DE", 1],
      ["GB", 1],
    ],
  );
  assert.deepEqual(filterImportSources([sources[2]], "", "all").countries, []);
  assert.deepEqual(
    filterImportSources(importSources, "", "all").countries.map(({ id }) => id),
    ["GB"],
  );
});

test("missing source IDs show the first example, unknown IDs never select another source", () => {
  assert.equal(findImportSource(sources, null), sources[0]);
  assert.equal(findImportSource(sources, "supplier-b"), sources[1]);
  assert.equal(findImportSource(sources, "unknown"), undefined);
  assert.equal(findImportSource([], null), undefined);
});

test("source destinations encode the selected ID while retaining existing query and hash", () => {
  assert.equal(
    importSourceHref(sources[0], "/import/source?lang=bg#overview"),
    "/import/source?lang=bg&source=supplier+a#overview",
  );
});

test("reference country pills retain actual source origins without inventing sources", () => {
  assert.deepEqual(
    importCountryFilters(importSources).map(({ id }) => id),
    ["DE", "CA", "KR", "US", "CN", "GB"],
  );
  assert.deepEqual(
    filterImportSources(importSources, "", "all").sources,
    importSources,
  );
  assert.deepEqual(filterImportSources(importSources, "", "DE").sources, []);
});

test("configured country pills normalize and de-duplicate choices and supplied origins", () => {
  const choices = [
    { code: " gb " },
    { code: "JP" },
    { code: "de" },
    { code: "JP" },
    { code: "invalid" },
  ];
  assert.deepEqual(
    importCountryFilters(sources, "en", choices).map(({ id }) => id),
    ["GB", "JP", "DE"],
  );
  assert.deepEqual(
    importCountryFilters([sources[2]], "en", []).map(({ id }) => id),
    [],
  );
  assert.deepEqual(importCountryFilters(sources, "bg", [{ code: "DE" }])[0], {
    id: "DE",
    label: "Германия",
  });
});
