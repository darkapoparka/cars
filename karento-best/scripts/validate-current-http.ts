import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";
import { dealer } from "../src/lib/content.ts";
import {
  canonicalRoutes,
  resolveRoute,
  sourceKeys,
  type SourceKey,
} from "../src/lib/routes.ts";
import {
  localeCookie,
  locales,
  normalizeLocale,
  type Locale,
} from "../src/lib/i18n/locales.ts";

const base = (
  process.env.KARENTO_NATIVE_URL || "http://127.0.0.1:6466"
).replace(/\/+$/, "");
const baseUrl = new URL(base);
assert.ok(["http:", "https:"].includes(baseUrl.protocol), "HTTP preview URL");
assert.ok(
  !baseUrl.username && !baseUrl.password,
  "URL must not contain credentials",
);
const routes = [
  ...new Set([
    ...Object.keys(canonicalRoutes).map((key) => "/" + key),
    ...sourceKeys.flatMap((key) => ["/" + key, "/" + key + ".html"]),
  ]),
];
const titles = new Map<SourceKey, string>();
const results: {
  group: string;
  route: string;
  status: number;
  locale: Locale;
  title: string;
}[] = [];

async function inspect(
  route: string,
  locale: Locale,
  status: 200 | 404,
  group: string,
  cookie?: Locale,
  explicitLanguage = true,
) {
  const url = new URL(base + route);
  if (explicitLanguage) url.searchParams.set("lang", locale);
  const response = await fetch(url, {
    headers: cookie ? { Cookie: `${localeCookie}=${cookie}` } : undefined,
    signal: AbortSignal.timeout(30000),
  });
  const label = `${group}: ${url.pathname}${url.search}`;
  assert.equal(response.status, status, `${label}: HTTP status`);
  assert.match(
    response.headers.get("content-type") || "",
    /text\/html/i,
    `${label}: HTML response`,
  );
  assert.equal(response.headers.get("content-language"), locale, label);
  const cache = response.headers.get("cache-control") || "";
  assert.match(cache, /\bprivate\b/i, `${label}: request-private HTML`);
  assert.match(cache, /\bno-store\b/i, `${label}: uncached HTML`);
  for (const name of ["cdn-cache-control", "vercel-cdn-cache-control"]) {
    // Providers may consume their CDN header rather than expose it publicly.
    const value = response.headers.get(name);
    if (value !== null)
      assert.match(value, /\bno-store\b/i, `${label}: ${name}`);
  }
  if (explicitLanguage) {
    assert.ok(
      response.headers
        .getSetCookie()
        .some((value) => value.startsWith(`${localeCookie}=${locale};`)),
      `${label}: explicit language preference`,
    );
  }
  const html = load(await response.text());
  assert.equal(html("main").length, 1, `${label}: one main`);
  assert.equal(html("header.header").length, 1, `${label}: one shared header`);
  assert.equal(
    html("html").attr("lang"),
    locale,
    `${label}: document language`,
  );
  assert.equal(html("title").length, 1, `${label}: one document title`);
  const title = html("title").text().trim();
  const suffix = ` | ${dealer.name}`;
  assert.ok(title.endsWith(suffix), `${label}: dealer-aware title (${title})`);
  assert.ok(
    title.slice(0, -suffix.length).trim(),
    `${label}: descriptive title`,
  );
  assert.equal(
    html("header.header .main-menu a[href]").first().text().trim(),
    locales[locale].messages["ui.header.home"],
    `${label}: translated shared navigation`,
  );
  if (status === 404)
    assert.match(
      html("main").text(),
      /404|not found|lost/i,
      `${label}: recovery view`,
    );
  results.push({
    group,
    route: url.pathname + url.search,
    status,
    locale,
    title,
  });
  return title;
}

for (const route of routes) {
  const key = resolveRoute(route);
  assert.ok(key, `Known route resolves: ${route}`);
  const title = await inspect(route, "en", 200, "canonical-and-aliases");
  const previous = titles.get(key);
  if (previous)
    assert.equal(title, previous, `${route}: alias title consistency`);
  else titles.set(key, title);
}

const bulgarianRoutes = [
  "/",
  "/vehicles",
  "/vehicle",
  "/services",
  "/shop",
  "/news",
  "/membership",
  "/contact",
  "/account",
];
for (const route of bulgarianRoutes) {
  assert.ok(
    resolveRoute(route),
    `Localized canonical route resolves: ${route}`,
  );
  await inspect(route, "bg", 200, "bulgarian-canonical");
}

// Independent HTTP requests carry different visitors' preferences concurrently.
await Promise.all([
  inspect("/", "en", 200, "explicit-over-cookie", "bg"),
  inspect("/", "bg", 200, "explicit-over-cookie", "en"),
  inspect("/", "en", 200, "saved-preference", "en", false),
  inspect("/", "bg", 200, "saved-preference", "bg", false),
  inspect("/?lang=fr", "bg", 200, "invalid-query-fallback", "bg", false),
  inspect(
    "/?lang=en&lang=bg",
    "bg",
    200,
    "duplicate-query-fallback",
    "bg",
    false,
  ),
  inspect(
    "/",
    normalizeLocale(dealer.locale),
    200,
    "dealer-default",
    undefined,
    false,
  ),
]);

const missingRoutes = [
  "/missing",
  "/toString",
  "/constructor",
  "/__proto__",
  "/vehicles/nope",
  "/Vehicles",
  "/vehicles.html.html",
  "/%74oString",
  "/unknown?x=1",
];
for (const route of missingRoutes) {
  assert.equal(
    resolveRoute(decodeURIComponent(route.split("?")[0])),
    null,
    route,
  );
  await inspect(route, "en", 404, "genuine-404");
}

const summary = {
  contract:
    "Current HTTP structure, routes, identity, locale and cache; no preserved pixel/content equivalence claim",
  base,
  dealer: dealer.name,
  canonicalAndAliases: routes.length,
  bulgarianCanonical: bulgarianRoutes.length,
  localeIsolation: 7,
  genuine404: missingRoutes.length,
  requests: results.length,
};
const directory = process.env.KARENTO_EVIDENCE_DIR;
if (directory) {
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(
    path.join(directory, "current-http.json"),
    JSON.stringify({ ...summary, results }, null, 2) + "\n",
  );
}
console.log(JSON.stringify(summary));
