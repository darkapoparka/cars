import { translate } from "#lib/i18n/messages.ts";
import type { Locale } from "#lib/i18n/locales.ts";
import type { PlainMessageKey } from "#lib/i18n/text.ts";
import { serviceDetails } from "./service-details.ts";
import {
  serviceFilters,
  type ServiceFilterId,
  type ServiceCardContent,
} from "./services.ts";

/** Search only the supplied service record and its supplied category label. */
export function filterDesktopServices(
  cards: readonly ServiceCardContent[],
  query: string,
  category: ServiceFilterId,
  language: Locale = "en",
) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matching = cards.filter((service) => {
    const filter: { label: string; labelKey?: PlainMessageKey } | undefined =
      serviceFilters.find((filter) => filter.id === service.category);
    const label = filter?.labelKey
      ? translate(language, filter.labelKey)
      : (filter?.label ?? "");
    const description =
      serviceDetails[service.id]?.[language === "bg" ? "bg" : "en"] ??
      (service.descriptionKey
        ? translate(language, service.descriptionKey)
        : service.description);
    const text =
      `${service.title} ${service.titleKey ? translate(language, service.titleKey) : ""} ${service.summary} ${service.summaryKey ? translate(language, service.summaryKey) : ""} ${description} ${label}`.toLowerCase();
    return terms.every((term) => text.includes(term));
  });
  return {
    cards: matching.filter(
      (service) => category === "all" || service.category === category,
    ),
    filters: serviceFilters.map((filter) => ({
      ...filter,
      count: matching.filter(
        (service) => filter.id === "all" || service.category === filter.id,
      ).length,
    })),
  };
}
