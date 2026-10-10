import { message, type CatalogText } from "#lib/i18n/text.ts";
import type { Locale } from "#lib/i18n/locales.ts";
import { newsGrid, referenceEditorialMetadata } from "./editorial.ts";
import { matchesSearchTerms } from "./search.ts";

export interface NewsArticleSection {
  readonly heading: CatalogText;
  readonly paragraphs: readonly CatalogText[];
}

/** Stable legacy reference links; missing supplied bodies use article recovery. */
export const referenceNewsLinkIds = {
  rentalExperience: "reference-rental-experience",
  rentalNeeds: "reference-rental-needs",
  luxuryOccasions: "reference-luxury-occasions",
  scenicDrives: "reference-scenic-drives",
  rentingAbroad: "reference-renting-abroad",
  familyRoadTrips: "newsList-1",
  hiddenRentalFees: "newsList-2",
  peakTravelRental: "newsList-3",
  rentalInsurance: "newsList-4",
  businessTravel: "reference-business-travel",
  nationalParks: "reference-national-parks",
  extendRental: "reference-extend-rental",
  returnChecklist: "reference-return-checklist",
  escalade: "reference-escalade",
  bmw: "reference-bmw",
  rodeo: "reference-rodeo",
} as const;

/** An article owns its title, artwork and body; sample content stays explicit. */
export interface NewsArticleContent {
  readonly id: string;
  readonly image: string;
  readonly imageAlt?: CatalogText;
  readonly category: string;
  readonly categoryLabel: CatalogText;
  readonly title: CatalogText;
  readonly titleLabel?: CatalogText;
  readonly avatar?: string;
  readonly author?: string;
  readonly publishedAt?: string;
  readonly readMinutes?: number;
  readonly commentsCount?: number;
  readonly introduction: CatalogText;
  readonly body: readonly NewsArticleSection[];
  readonly sample: boolean;
}

const deliveryArticle = {
  introduction: message("editorial.sample.delivery.introduction"),
  body: [
    {
      heading: message("editorial.sample.delivery.useHeading"),
      paragraphs: [message("editorial.sample.delivery.useBody")],
    },
    {
      heading: message("editorial.sample.delivery.costsHeading"),
      paragraphs: [message("editorial.sample.delivery.costsBody")],
    },
    {
      heading: message("editorial.sample.delivery.checksHeading"),
      paragraphs: [message("editorial.sample.delivery.checksBody")],
    },
  ],
} as const;

const budgetArticle = {
  introduction: message("editorial.sample.budget.introduction"),
  body: [
    {
      heading: message("editorial.sample.budget.planningHeading"),
      paragraphs: [message("editorial.sample.budget.planningBody")],
    },
    {
      heading: message("editorial.sample.budget.valueHeading"),
      paragraphs: [message("editorial.sample.budget.valueBody")],
    },
    {
      heading: message("editorial.sample.budget.checksHeading"),
      paragraphs: [message("editorial.sample.budget.checksBody")],
    },
  ],
} as const;

export const referenceNews: readonly NewsArticleContent[] = newsGrid.map(
  (item) => ({
    ...item,
    ...(item.title.message === "editorial.title.budgetTravelHacks"
      ? budgetArticle
      : deliveryArticle),
    publishedAt: referenceEditorialMetadata.date,
    readMinutes: referenceEditorialMetadata.minutes,
    commentsCount: referenceEditorialMetadata.comments,
    sample: true,
  }),
);

/** An intentionally empty provider stays empty instead of gaining sample news. */
export function suppliedNews(
  articles?: readonly NewsArticleContent[],
): readonly NewsArticleContent[] {
  return articles ?? referenceNews;
}

export function newsCategories(articles: readonly NewsArticleContent[]) {
  const categories = new Map<string, CatalogText>();
  for (const article of articles) {
    if (!categories.has(article.category)) {
      categories.set(article.category, article.categoryLabel);
    }
  }
  return [...categories].map(([id, label]) => ({ id, label }));
}

export function filterNews(
  articles: readonly NewsArticleContent[],
  query: string,
  category: string,
  text: (value: CatalogText) => string,
  locale: Locale,
): readonly NewsArticleContent[] {
  return articles.filter(
    (article) =>
      (!category || article.category === category) &&
      matchesSearchTerms(
        `${text(article.title)} ${text(article.categoryLabel)} ${article.category} ${article.author ?? ""}`,
        query,
        locale,
      ),
  );
}

export function newsArticleDestination(
  article: Pick<NewsArticleContent, "id">,
  destination = "/news/article",
): string {
  const url = new URL(destination, "http://karento.local");
  url.searchParams.set("article", article.id);
  return `${url.pathname}${url.search}${url.hash}`;
}

export function selectedNewsArticle(
  articles: readonly NewsArticleContent[],
  parameters: Pick<URLSearchParams, "get">,
): NewsArticleContent | undefined {
  const id = parameters.get("article");
  return id ? articles.find((article) => article.id === id) : undefined;
}
