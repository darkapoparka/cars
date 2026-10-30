import { defineParams } from "@sveltejs/kit/params";
import { site, type Locale } from "#lib/config/site.ts";

export const params = defineParams({
  // Only non-default locales get a URL prefix; the default locale lives at the root.
  lang: (param): Locale | undefined =>
    site.locales.find(
      (locale) => locale === param && locale !== site.defaultLocale,
    ),
});
