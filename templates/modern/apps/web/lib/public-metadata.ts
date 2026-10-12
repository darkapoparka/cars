import { getPublicSearchRobots } from "./native-public-search-metadata";
export { getPublicSearchRobots } from "./native-public-search-metadata";
import { withBasePath } from "@repo/internationalization/paths";
import { leadSite } from "@repo/marketplace";
import { isDealershipSite } from "@repo/marketplace/site-config";
import { createLocalizedMetadata as createSeoLocalizedMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { getCurrentPublicDataMode } from "./public-data-policy";
import {
  getPublicLocales,
  normalizePublicLocale,
} from "./public-locale-policy";

type PublicLocalizedMetadataInput = Parameters<
  typeof createSeoLocalizedMetadata
>[0];

export type PublicSearchParams = Record<string, string | string[] | undefined>;

export const PUBLIC_SOCIAL_IMAGE_PATH = "/-/opengraph-image.png";


export const getPublicInventoryRobots = (
  searchParams?: PublicSearchParams
): Metadata["robots"] | undefined => {
  const dataMode = getCurrentPublicDataMode();

  if (dataMode === "unavailable") {
    return {
      follow: false,
      index: false,
    };
  }

  return getPublicSearchRobots(searchParams);
};

export const createPublicLocalizedMetadata = (
  properties: PublicLocalizedMetadataInput
): Metadata => {
  const defaultImage = isDealershipSite
    ? leadSite.heroPath
    : PUBLIC_SOCIAL_IMAGE_PATH;
  const image = withBasePath(properties.image ?? defaultImage);
  const brandSuffix = [` | ${leadSite.name}`, ` | ${leadSite.shortName}`].find(
    (suffix) => properties.title.endsWith(suffix)
  );
  const title = brandSuffix
    ? properties.title.slice(0, -brandSuffix.length)
    : properties.title;
  const metadata = createSeoLocalizedMetadata({
    ...properties,
    title,
    alternateLocales: (
      properties.alternateLocales ?? getPublicLocales()
    ).filter((locale) => getPublicLocales().includes(locale)),
    locale: normalizePublicLocale(properties.locale),
    image,
    siteName: leadSite.name,
  });

  return {
    ...metadata,
    twitter: {
      ...(metadata.twitter ?? {}),
      images:
        properties.twitter?.images ??
        ([{ alt: title, url: image }] satisfies NonNullable<
          Metadata["twitter"]
        >["images"]),
    },
  };
};
