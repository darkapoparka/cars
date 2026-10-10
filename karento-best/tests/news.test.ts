import assert from "node:assert/strict";
import test from "node:test";
import {
  filterNews,
  newsArticleDestination,
  newsCategories,
  referenceNews,
  selectedNewsArticle,
  suppliedNews,
  type NewsArticleContent,
} from "../src/lib/data/news.ts";
import { translate } from "../src/lib/i18n/messages.ts";
import type { CatalogText } from "../src/lib/i18n/text.ts";
import type { Locale } from "../src/lib/i18n/locales.ts";

const resolve = (locale: Locale) => (text: CatalogText) =>
  typeof text === "string" ? text : translate(locale, text.message);

test("news combines translated keyword search and supplied categories", () => {
  assert.equal(
    filterNews(referenceNews, "  BUDGET  ", "", resolve("en"), "en").length,
    4,
  );
  const trip = filterNews(
    referenceNews,
    "Budget",
    "Road Trips",
    resolve("en"),
    "en",
  );
  assert.deepEqual(
    trip.map((article) => article.id),
    ["newsGrid-6"],
  );
  assert.equal(
    filterNews(referenceNews, "no-such-article", "", resolve("en"), "en")
      .length,
    0,
  );
  assert.equal(
    filterNews(referenceNews, "бюджет", "Road Trips", resolve("bg"), "bg")
      .length,
    1,
  );
  assert.equal(
    filterNews(referenceNews, "", "", resolve("en"), "en").length,
    12,
  );
});

test("article links retain query and hash while selecting a stable supplied ID", () => {
  for (const article of referenceNews) {
    const destination = newsArticleDestination(
      article,
      "/news/article?lang=bg&campaign=news#read",
    );
    const url = new URL(destination, "http://karento.local");
    assert.equal(url.searchParams.get("lang"), "bg");
    assert.equal(url.searchParams.get("campaign"), "news");
    assert.equal(url.hash, "#read");
    assert.equal(selectedNewsArticle(referenceNews, url.searchParams), article);
    assert.ok(article.sample);
    assert.ok(article.body.length);
  }
});

test("unknown, empty and prototype-name article IDs cannot select unrelated content", () => {
  for (const id of ["missing", "constructor", "__proto__", ""]) {
    assert.equal(
      selectedNewsArticle(referenceNews, new URLSearchParams({ article: id })),
      undefined,
    );
  }
  assert.equal(
    selectedNewsArticle(referenceNews, new URLSearchParams()),
    undefined,
  );
});

test("an explicit provider owns its collection, categories and article body without sample fallback", () => {
  const article: NewsArticleContent = {
    id: "owner/article & announcement",
    image: "/supplied/news.webp",
    category: "showroom",
    categoryLabel: "Showroom updates",
    title: "Our showroom announcement",
    introduction: "Supplied introduction",
    body: [{ heading: "Visit details", paragraphs: ["Supplied article body"] }],
    sample: false,
  };
  const provider = [article];
  assert.equal(suppliedNews(provider), provider);
  assert.deepEqual(suppliedNews([]), []);
  assert.equal(suppliedNews(), referenceNews);
  assert.deepEqual(newsCategories(provider), [
    { id: "showroom", label: "Showroom updates" },
  ]);
  const selected = selectedNewsArticle(
    provider,
    new URL(newsArticleDestination(article), "http://karento.local")
      .searchParams,
  );
  assert.equal(selected, article);
  assert.equal(selected?.body[0].paragraphs[0], "Supplied article body");
  assert.equal(selected?.publishedAt, undefined);
  assert.equal(selected?.commentsCount, undefined);
  assert.deepEqual(
    filterNews(
      provider,
      "showroom announcement",
      "showroom",
      resolve("en"),
      "en",
    ),
    provider,
  );
});
