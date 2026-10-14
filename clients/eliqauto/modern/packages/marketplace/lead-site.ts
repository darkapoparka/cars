import { carsLocale } from './cars-locale';
import type {
  PublicInventoryFilterLayout,
  PublicSiteArtwork,
  PublicSiteConfig,
} from "@repo/marketplace-domain/site-config";
import { inventoryCopy } from "./content/inventory-copy";

export type LeadSiteCurrency = "AED" | "BGN" | "EUR" | "USD";

export interface LeadSiteCopy {
  readonly address: string;
  readonly city: string;
  readonly country: string;
  readonly tagline: string;
}

export type DealerInventoryCopy = Readonly<
  Record<
    string,
    {
      readonly sourceDescription?: string;
      readonly bg: {
        readonly description: string;
        readonly imageAlts: readonly string[];
      };
      readonly en: {
        readonly description: string;
        readonly imageAlts: readonly string[];
      };
    }
  >
>;

export interface LeadSiteConfig {
  readonly accent: string;
  readonly address: string;
  readonly artwork?: Partial<PublicSiteArtwork>;
  readonly city: string;
  readonly colorMode?: "light";
  readonly contactUrl: string;
  readonly country: string;
  readonly countryCode: string;
  readonly currency: LeadSiteCurrency;
  readonly desktopAccent?: string;
  readonly desktopInventoryFilterLayout?: PublicInventoryFilterLayout;
  /** Source-bound master identity; dealer adaptation changes the slug and disables it. */
  readonly desktopPreviewIdentity?: {
    readonly sourceSlug: string;
    readonly label: string;
    readonly wordmark: string;
    readonly markArtwork?: string;
    readonly copy: Readonly<Record<"bg" | "en", string>>;
  };
  readonly district: { readonly bg: string; readonly en: string };
  readonly email: string;
  readonly financingArtworkPath: string;
  readonly heroPath: string;
  readonly iconPath?: string;
  readonly inventoryCategories?: readonly (
    | "car"
    | "truck"
    | "van"
    | "motorbike"
  )[];
  readonly inventoryCopy?: DealerInventoryCopy;
  readonly locale: string;
  readonly localizedCopy?: Readonly<Record<"bg" | "en", LeadSiteCopy>>;
  readonly logoInversePath?: string;
  readonly logoPath: string;
  readonly logoOnLight: string;
  readonly logoOnDark: string;
  readonly logoOnAccent: string;
  readonly mapsEmbedUrl: string;
  readonly mapsUrl: string;
  readonly mobileFinancingArtworkPath?: string;
  readonly mobileShowroomArtworkPath?: string;
  readonly name: string;
  readonly phoneDisplay: string;
  readonly phoneHref: string;
  readonly publicDefaultLocale?: "bg" | "en";
  readonly publicLocales?: readonly ("bg" | "en")[];
  readonly sellCategoryAssets: Readonly<
    Record<"car" | "motorbike" | "truck" | "van", string>
  >;
  readonly services?: Partial<PublicSiteConfig["services"]>;
  readonly shortName: string;
  readonly slug: string;
  readonly socialLinks?: Partial<
    Record<"youtube" | "instagram" | "facebook" | "tiktok", string>
  >;
  readonly staticDemoMode: boolean;
  readonly tagline: string;
  readonly websiteKind?: PublicSiteConfig["kind"];
}

// LEAD_SITE_CONFIG_START
export const leadSite: LeadSiteConfig = {
  websiteKind: "dealership",
  publicLocales: carsLocale.enabledLocales,
  publicDefaultLocale: carsLocale.defaultLocale,
  inventoryCopy,
  localizedCopy: {
  "bg": {
    "address": "ул. Свобода, на гърба на Гробищен парк, Пазарджик",
    "city": "Пазарджик",
    "country": "България",
    "tagline": "ELIQ AUTO — автомобили и съдействие в Пазарджик."
  },
  "en": {
    "address": "Svoboda Street, behind the cemetery park, Pazardzhik",
    "city": "Pazardzhik",
    "country": "Bulgaria",
    "tagline": "ELIQ AUTO — vehicles and dealer support in Pazardzhik."
  }
},
  accent: "#30343b",
  desktopAccent: "#4b5057",
  desktopInventoryFilterLayout: "quick",
  desktopPreviewIdentity: {
    sourceSlug: "day-night-auto-group",
    label: "Modern",
    wordmark: "Modern",
    markArtwork: "/images/brand/modern-logo-v2.webp",
    copy: {
      bg: "Открийте следващия си автомобил.",
      en: "Find your next car.",
    },
  },
  address: "ул. Свобода, на гърба на Гробищен парк, Пазарджик",
  city: "Пазарджик",
  district: { bg: "Пазарджик", en: "Pazardzhik" },
  sellCategoryAssets: {
    car: "/lead-sell-car-v1.png",
    motorbike: "/lead-sell-motorcycle-v1.png",
    truck: "/lead-sell-truck-v1.png",
    van: "/lead-sell-van-v1.png",
  },
  financingArtworkPath: "/images/services/leasing-red-suv-v2.webp",
  mobileFinancingArtworkPath: "/images/lease/mobile-pdp-finance-studio-v2.webp",
  mobileShowroomArtworkPath:
    "/images/lease/mobile-pdp-showroom-blue-hour-v1.webp",
  contactUrl: "tel:+359896781662",
  country: "Bulgaria",
  countryCode: carsLocale.dealerCountry,
  currency: carsLocale.inventoryCurrency,
  email: "",
  heroPath: "/lead-hero.jpg",
  locale: "bg-BG",
  logoPath: "/dealer-brand/logo-on-light-20260919.webp",
  logoInversePath: "/dealer-brand/logo-on-dark-20260919.webp",
  logoOnLight: "/dealer-brand/logo-on-light-20260919.webp",
  logoOnDark: "/dealer-brand/logo-on-dark-20260919.webp",
  logoOnAccent: "/dealer-brand/logo-on-accent-20260919.webp",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=ELIQ%20AUTO%2C%20%D1%83%D0%BB.%20%D0%A1%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B0%2C%20%D0%BD%D0%B0%20%D0%B3%D1%8A%D1%80%D0%B1%D0%B0%20%D0%BD%D0%B0%20%D0%93%D1%80%D0%BE%D0%B1%D0%B8%D1%89%D0%B5%D0%BD%20%D0%BF%D0%B0%D1%80%D0%BA%2C%20%D0%9F%D0%B0%D0%B7%D0%B0%D1%80%D0%B4%D0%B6%D0%B8%D0%BA&z=16&output=embed",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=ELIQ%20AUTO%2C%20%D1%83%D0%BB.%20%D0%A1%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B0%2C%20%D0%BD%D0%B0%20%D0%B3%D1%8A%D1%80%D0%B1%D0%B0%20%D0%BD%D0%B0%20%D0%93%D1%80%D0%BE%D0%B1%D0%B8%D1%89%D0%B5%D0%BD%20%D0%BF%D0%B0%D1%80%D0%BA%2C%20%D0%9F%D0%B0%D0%B7%D0%B0%D1%80%D0%B4%D0%B6%D0%B8%D0%BA",
  name: "ELIQ AUTO",
  phoneDisplay: "0896 781 662",
  phoneHref: "tel:+359896781662",
  shortName: "ELIQ AUTO",
  slug: "eliqauto",
  socialLinks: {"youtube":"https://www.youtube.com/channel/UCGXhr1QYqALiBBQpBYZtpmw"},
  staticDemoMode: true,
  tagline: "ELIQ AUTO — автомобили и съдействие в Пазарджик.",
};
// LEAD_SITE_CONFIG_END
