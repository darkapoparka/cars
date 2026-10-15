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
    "address": "Шоурум 61, Souq Al Haraj, Sharjah, ОАЕ",
    "city": "Шарджа",
    "country": "Обединени арабски емирства",
    "tagline": "Al Basma Motors — автомобили и съдействие в Шарджа."
  },
  "en": {
    "address": "Showroom 61, Souq Al Haraj, Sharjah, UAE",
    "city": "Sharjah",
    "country": "United Arab Emirates",
    "tagline": "Al Basma — vehicles and dealer support in Sharjah."
  }
},
  accent: "#09090b",
  desktopAccent: "#09090b",
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
  address: "Showroom 61, Souq Al Haraj, Sharjah, UAE",
  city: "Sharjah",
  district: { bg: "Шарджа", en: "Sharjah" },
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
  contactUrl: "tel:+971543422222",
  country: "United Arab Emirates",
  countryCode: carsLocale.dealerCountry,
  currency: carsLocale.inventoryCurrency,
  email: "admin@albasmamotors.com",
  heroPath: "/lead-hero.jpg",
  locale: "en-AE",
  logoPath: "/dealer-brand/v2-e73f3eb48de7300c/logo-on-light.webp",
  logoInversePath: "/dealer-brand/v2-e73f3eb48de7300c/logo-on-dark.webp",
  logoOnLight: "/dealer-brand/v2-e73f3eb48de7300c/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-e73f3eb48de7300c/logo-on-dark.webp",
  logoOnAccent: "/dealer-brand/v2-e73f3eb48de7300c/logo-on-dark.webp",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=Showroom%2061%2C%20Souq%20Al%20Haraj%2C%20Sharjah%2C%20UAE&z=16&hl=en&output=embed",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Showroom%2061%2C%20Souq%20Al%20Haraj%2C%20Sharjah%2C%20UAE",
  name: "Al Basma Motors",
  phoneDisplay: "+971 54 342 2222",
  phoneHref: "tel:+971543422222",
  shortName: "Al Basma",
  slug: "al-basma-motors",
  socialLinks: {"facebook":"https://www.facebook.com/albasmamotors","instagram":"https://www.instagram.com/albasmamotors"},
  staticDemoMode: true,
  tagline: "Al Basma — vehicles and dealer support in Sharjah.",
};
// LEAD_SITE_CONFIG_END
