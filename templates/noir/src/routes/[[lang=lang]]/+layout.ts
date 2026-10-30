import { site, type Locale } from "#lib/config/site.ts";

export const load = ({ params }) => ({
  locale: (params.lang ?? site.defaultLocale) as Locale,
});
