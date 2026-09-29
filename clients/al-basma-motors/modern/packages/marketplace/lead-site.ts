import { carsLocale } from './cars-locale';
import type {
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
  accent: "#454b50",
  address: "ул. „Атанас Манчев“ 18, Sharjah",
  city: "Sharjah",
  district: { bg: "Шарджа", en: "Sharjah" },
  sellCategoryAssets: {
    car: "/lead-sell-car-v1.png",
    motorbike: "/lead-sell-motorcycle-v1.png",
    truck: "/lead-sell-truck-v1.png",
    van: "/lead-sell-van-v1.png",
  },
  financingArtworkPath: "/images/services/leasing-red-suv-v2.webp",
  contactUrl: "tel:+971543422222",
  country: "България",
  countryCode: carsLocale.dealerCountry,
  currency: carsLocale.inventoryCurrency,
  email: "admin@albasmamotors.com",
  heroPath: "/lead-hero.jpg",
  locale: "en-AE",
  logoPath: "/dealer-brand/logo-on-dark.webp",
  logoOnLight: "/dealer-brand/logo-on-light.webp",
  logoOnDark: "/dealer-brand/logo-on-dark.webp",
  logoOnAccent: "/dealer-brand/logo-on-accent.webp",
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
  tagline: "Премиум автомобили, внос и собствен лизинг в Sharjah.",
};
// LEAD_SITE_CONFIG_END
