import fs from "node:fs";
import { load } from "cheerio";
import { resolveRoute, type SourceKey } from "../src/lib/routes.ts";
import adjustments from "../provenance/reviewed-reference-adjustments.json" with { type: "json" };

interface ReferencePage {
  title: string;
  mainText: string;
  images: string[];
  compositionSha256: string;
}
// Test-only text/image contracts captured from the approved Cars checkpoint.
// The original 607-file receipt remains independently verified and unchanged.
const pages = JSON.parse(
  fs.readFileSync(
    new URL("../provenance/reviewed-compositions.json", import.meta.url),
    "utf8",
  ),
) as Record<string, ReferencePage>;
// Only the declared metadata cleanup differs from the preserved title contract.
// Body, images and captured composition hashes remain independently asserted.
const titles: Partial<Record<SourceKey, string>> = adjustments.titles.values;
export function mainText(body: string): string {
  const $ = load(body);
  // Block boundaries create visible separation even when HTML has no newline.
  $("main br").replaceWith(" ");
  $(
    "main p,main h1,main h2,main h3,main h4,main h5,main h6,main li,main div,main section,main legend",
  ).append(" ");
  return $("main").text().replace(/\s+/g, " ").trim();
}
export function referencePage(route: string): ReferencePage {
  const key = resolveRoute(route);
  if (!key || !Object.hasOwn(pages, key))
    throw new Error(`No captured reference for ${route}`);
  return titles[key] ? { ...pages[key], title: titles[key] } : pages[key];
}
