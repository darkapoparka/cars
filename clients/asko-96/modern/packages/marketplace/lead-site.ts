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
    "address": "бул. „Ботевградско шосе“ 300",
    "city": "София",
    "country": "България",
    "tagline": "АСКО 96 — автомобили и съдействие в София."
  },
  "en": {
    "address": "300 Botevgradsko Shose Blvd., София",
    "city": "София",
    "country": "Bulgaria",
    "tagline": "ASKO96 — vehicles and dealer support in София."
  }
},
  accent: "#d7ae35",
  address: "ул. „Атанас Манчев“ 18, София",
  city: "София",
  district: { bg: "София", en: "София" },
  sellCategoryAssets: {
    car: "/lead-sell-car-v1.png",
    motorbike: "/lead-sell-motorcycle-v1.png",
    truck: "/lead-sell-truck-v1.png",
    van: "/lead-sell-van-v1.png",
  },
  financingArtworkPath: "/images/services/leasing-red-suv-v2.webp",
  contactUrl: "tel:+359899769696",
  country: "България",
  countryCode: carsLocale.dealerCountry,
  currency: carsLocale.inventoryCurrency,
  email: "askogroup@abv.bg",
  heroPath: "/lead-hero.jpg",
  locale: "bg-BG",
  logoPath: "/dealer-brand/logo-on-dark.webp",
  logoOnLight: "/dealer-brand/logo-on-light.webp",
  logoOnDark: "/dealer-brand/logo-on-dark.webp",
  logoOnAccent: "/dealer-brand/logo-on-accent.webp",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=%D0%90%D0%A1%D0%9A%D0%9E%2096%2C%20%D0%91%D0%BE%D1%82%D0%B5%D0%B2%D0%B3%D1%80%D0%B0%D0%B4%D1%81%D0%BA%D0%BE%20%D1%88%D0%BE%D1%81%D0%B5%20300%2C%20%D0%A1%D0%BE%D1%84%D0%B8%D1%8F&output=embed",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=%D0%90%D0%A1%D0%9A%D0%9E%2096%2C%20%D0%91%D0%BE%D1%82%D0%B5%D0%B2%D0%B3%D1%80%D0%B0%D0%B4%D1%81%D0%BA%D0%BE%20%D1%88%D0%BE%D1%81%D0%B5%20300%2C%20%D0%A1%D0%BE%D1%84%D0%B8%D1%8F",
  name: "АСКО 96",
  phoneDisplay: "0899 76 96 96",
  phoneHref: "tel:+359899769696",
  shortName: "АСКО 96",
  slug: "asko-96",
  socialLinks: {"facebook":"https://www.facebook.com/p/Asko96-100050328800477/","youtube":"https://www.youtube.com/@asko96bulgaria"},
  staticDemoMode: true,
  tagline: "Премиум автомобили, внос и собствен лизинг в София.",
};
// LEAD_SITE_CONFIG_END
