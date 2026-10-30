import { page } from "$app/state";
import { resolve } from "$app/paths";
import { site, type Locale } from "#lib/config/site.ts";
import { messages } from "./messages.ts";

/** The current page's locale, set by the [[lang]] layout. */
export const currentLocale = (): Locale =>
  page.data.locale ?? site.defaultLocale;

export const t = () => messages[currentLocale()];

const lang = (locale: Locale) =>
  locale === site.defaultLocale ? undefined : locale;

/** Pages are prerendered as folders, so every link ends in a slash. */
const slash = (path: string) => (path.endsWith("/") ? path : `${path}/`);

export const paths = {
  home: (locale: Locale) =>
    slash(resolve("/[[lang=lang]]", { lang: lang(locale) })),
  collection: (locale: Locale) =>
    slash(resolve("/[[lang=lang]]/collection", { lang: lang(locale) })),
  vehicle: (locale: Locale, id: string) =>
    slash(
      resolve("/[[lang=lang]]/collection/[id]", { lang: lang(locale), id }),
    ),
  contact: (locale: Locale) =>
    slash(resolve("/[[lang=lang]]/contact", { lang: lang(locale) })),
};

/** The current page in another locale, keeping the route and its parameters. */
export function localized(locale: Locale): string {
  switch (page.route.id) {
    case "/[[lang=lang]]/collection":
      return paths.collection(locale);
    case "/[[lang=lang]]/collection/[id]":
      return paths.vehicle(locale, page.params.id ?? "");
    case "/[[lang=lang]]/contact":
      return paths.contact(locale);
    default:
      return paths.home(locale);
  }
}
