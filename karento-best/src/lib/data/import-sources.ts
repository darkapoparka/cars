import type { ImportSourceItem } from "./editorial.ts";
import { importSources } from "./editorial.ts";
import { dealer, type DealerContent } from "#lib/content.ts";
import type { Locale } from "#lib/i18n/locales.ts";
import { matchesSearchTerms } from "./search.ts";

export interface ImportCountryChoice {
  readonly code: string;
}

/** Reference country filter choices; supplied records remain the sole source of results. */
export const referenceImportCountryChoices = [
  { code: "DE" },
  { code: "CA" },
  { code: "KR" },
  { code: "US" },
  { code: "CN" },
] as const satisfies readonly ImportCountryChoice[];

/** An explicit empty provider stays empty instead of restoring reference sources. */
export function suppliedImportSources(
  content: Pick<DealerContent, "importSources"> = dealer,
): readonly ImportSourceItem[] {
  return content.importSources ?? importSources;
}

export function findImportSource(
  sources: readonly ImportSourceItem[],
  id: string | null,
): ImportSourceItem | undefined {
  return id === null ? sources[0] : sources.find((source) => source.id === id);
}

export function importSourceHref(
  source: Pick<ImportSourceItem, "id">,
  destination = "/import/source",
): string {
  const url = new URL(destination, "https://karento.invalid");
  url.searchParams.set("source", source.id);
  return `${url.pathname}${url.search}${url.hash}`;
}

function sourceCountry(source: ImportSourceItem): string | undefined {
  return normalizedCountryCode(source.countryCode);
}

function normalizedCountryCode(value: string | undefined): string | undefined {
  const code = value?.trim().toUpperCase();
  return code && /^[A-Z]{2}$/.test(code) ? code : undefined;
}

/** Merge configured filter choices with supplied origins without fabricating records. */
export function importCountryFilters(
  sources: readonly ImportSourceItem[],
  language: Locale = "en",
  choices: readonly ImportCountryChoice[] = referenceImportCountryChoices,
) {
  const countries = new Intl.DisplayNames([language], { type: "region" });
  const codes = [
    ...new Set([
      ...choices.flatMap((choice) => normalizedCountryCode(choice.code) ?? []),
      ...sources.flatMap((source) => sourceCountry(source) ?? []),
    ]),
  ];
  return codes.map((id) => ({ id, label: countries.of(id) ?? id }));
}

export function filterImportSources(
  sources: readonly ImportSourceItem[],
  query: string,
  country: string,
  language: Locale = "en",
) {
  const countries = new Intl.DisplayNames([language], { type: "region" });
  const matching = sources.filter((source) => {
    const code = sourceCountry(source);
    return matchesSearchTerms(
      `${source.name} ${source.address} ${code ? countries.of(code) : ""}`,
      query,
      language,
    );
  });
  const codes = [
    ...new Set(sources.flatMap((source) => sourceCountry(source) ?? [])),
  ];
  return {
    sources: matching.filter(
      (source) => country === "all" || sourceCountry(source) === country,
    ),
    countries: codes.map((id) => ({
      id,
      label: countries.of(id) ?? id,
      count: matching.filter((source) => sourceCountry(source) === id).length,
    })),
    matchingCount: matching.length,
  };
}
