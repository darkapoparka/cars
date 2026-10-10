import { test } from "node:test";
import assert from "node:assert/strict";
import {
  supportedLocales,
  normalizeLocale,
  resolveRequestLocale,
} from "../src/lib/i18n/locales.ts";
import {
  catalogProblems,
  translate,
  formatMoney,
  formatCount,
} from "../src/lib/i18n/messages.ts";
import { localeHref, localizedShareUrl } from "../src/lib/i18n/paths.ts";

test("all advertised locale catalogs have the same keys and interpolation contracts", () => {
  assert.deepEqual(supportedLocales, ["en", "bg"]);
  assert.deepEqual(catalogProblems(), []);
  assert.equal(
    translate("bg", "dealer.contact.heading", { dealer: "Авто Пример" }),
    "Свържете се с Авто Пример",
  );
  assert.equal(
    translate("en", "dealer.contact.heading", { dealer: "Auto Example" }),
    "Contact Auto Example",
  );
});
test("request locale precedence is explicit query, saved preference, dealer default, honest fallback", () => {
  const url = (query: string) =>
    new URL(`https://dealer.example/variant-6/vehicle?id=abc${query}`);
  assert.equal(resolveRequestLocale(url("&lang=en"), "bg", "bg-BG"), "en");
  assert.equal(resolveRequestLocale(url("&lang=bg"), "en", "en"), "bg");
  assert.equal(resolveRequestLocale(url("&lang=fr"), "bg", "en"), "bg");
  assert.equal(resolveRequestLocale(url("&lang=en&lang=bg"), "bg", "en"), "bg");
  assert.equal(resolveRequestLocale(url(""), "bad", "bg-BG"), "bg");
  assert.equal(normalizeLocale("de-DE"), "en");
  assert.equal(normalizeLocale("__proto__"), "en");
});
test("switching mounted vehicle language retains its identity, filters and hash exactly once", () => {
  assert.equal(
    localeHref("/vehicle?id=one%2Ftwo&sort=price#photos", "bg", "/variant-6"),
    "/variant-6/vehicle?id=one%2Ftwo&sort=price&lang=bg#photos",
  );
  assert.equal(
    localeHref("/variant-6/vehicle?id=second&lang=bg", "en", "/variant-6"),
    "/variant-6/vehicle?id=second&lang=en",
  );
  assert.equal(localeHref("/", "bg", "/variant-6"), "/variant-6/?lang=bg");
  assert.equal(
    localeHref("mailto:dealer@example.com", "bg", "/variant-6"),
    "mailto:dealer@example.com",
  );
  assert.equal(
    localeHref("https://maps.google.com/?q=address", "en", "/variant-6"),
    "https://maps.google.com/?q=address",
  );
  assert.equal(localeHref("#photos", "en", "/variant-6"), "#photos");
  assert.throws(() => localeHref("/\\evil", "en"), /Unsafe/);
});
test("interleaved visitors keep independent translations and the listing's actual currency", async () => {
  const requests = Array.from({ length: 60 }, (_, index) =>
    index % 2 ? ("en" as const) : ("bg" as const),
  );
  const output = await Promise.all(
    requests.map(async (locale) => {
      await new Promise<void>((resolve) =>
        setTimeout(resolve, locale === "bg" ? 2 : 1),
      );
      return {
        locale,
        label: translate(locale, "navigation.vehicles"),
        price: formatMoney(20000, "EUR", locale),
      };
    }),
  );
  for (const result of output) {
    assert.equal(
      result.label,
      result.locale === "en" ? "Vehicles" : "Автомобили",
    );
    assert.match(result.price, /€|EUR/);
    assert.doesNotMatch(result.price, /BGN|лв/);
  }
});
test("vehicle counts use native singular/plural and explicit fractional prices keep their cents", () => {
  assert.equal(formatCount(1, "vehicles", "en"), "1 vehicle");
  assert.equal(formatCount(2, "vehicles", "en"), "2 vehicles");
  assert.equal(formatCount(1, "vehicles", "bg"), "1 автомобил");
  assert.equal(formatCount(2, "vehicles", "bg"), "2 автомобила");
  assert.equal(formatCount(1, "services", "en"), "1 service");
  assert.equal(formatCount(2, "services", "en"), "2 services");
  assert.equal(formatCount(1, "services", "bg"), "1 услуга");
  assert.equal(formatCount(2, "services", "bg"), "2 услуги");
  assert.match(formatMoney(19999.99, "EUR", "en"), /19,999\.99/);
  assert.match(formatMoney(19999.99, "EUR", "bg"), /19\s999,99/);
});

test("shared URLs make the resolved visitor language explicit without losing a mounted stock ID", () => {
  const cookieLocaleUrl = new URL(
    "https://dealer.example/variant-6/vehicle?id=real%2Fid#photos",
  );
  assert.equal(
    localizedShareUrl(cookieLocaleUrl, "bg", "/variant-6"),
    "https://dealer.example/variant-6/vehicle?id=real%2Fid&lang=bg#photos",
  );
  assert.equal(
    localizedShareUrl(
      new URL("https://dealer.example/vehicle?id=another&lang=bg"),
      "en",
      "/variant-6",
    ),
    "https://dealer.example/variant-6/vehicle?id=another&lang=en",
  );
});
