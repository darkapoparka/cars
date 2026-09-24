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
    "address": "бул. „Цар Освободител“, Кайсиева градина, Варна",
    "city": "Варна",
    "country": "България",
    "tagline": "Навара кар — автомобили и съдействие в Варна."
  },
  "en": {
    "address": "Tsar Osvoboditel Blvd., Kaysieva Gradina, Varna",
    "city": "Varna",
    "country": "Bulgaria",
    "tagline": "Navara Car — vehicles and dealer support in Varna."
  }
},
  accent: "#c40101",
  address: "ул. „Атанас Манчев“ 18, Варна",
  city: "Варна",
  district: { bg: "Варна", en: "Varna" },
  sellCategoryAssets: {
    car: "/lead-sell-car-v1.png",
    motorbike: "/lead-sell-motorcycle-v1.png",
    truck: "/lead-sell-truck-v1.png",
    van: "/lead-sell-van-v1.png",
  },
  financingArtworkPath: "/images/services/leasing-red-suv-v2.webp",
  contactUrl: "tel:+359899192300",
  country: "България",
  countryCode: carsLocale.dealerCountry,
  currency: carsLocale.inventoryCurrency,
  email: "",
  heroPath: "/lead-hero.jpg",
  locale: "bg-BG",
  logoPath: "/dealer-brand/logo-on-dark-20260919.webp",
  logoOnLight: "/dealer-brand/logo-on-light-20260919.webp",
  logoOnDark: "/dealer-brand/logo-on-dark-20260919.webp",
  logoOnAccent: "/dealer-brand/logo-on-accent-20260919.webp",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=%D0%9D%D0%B0%D0%B2%D0%B0%D1%80%D0%B0%20%D0%BA%D0%B0%D1%80%2C%20%D0%B1%D1%83%D0%BB.%20%E2%80%9E%D0%A6%D0%B0%D1%80%20%D0%9E%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%E2%80%9C%2C%20%D0%9A%D0%B0%D0%B9%D1%81%D0%B8%D0%B5%D0%B2%D0%B0%20%D0%B3%D1%80%D0%B0%D0%B4%D0%B8%D0%BD%D0%B0%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0&z=16&output=embed",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=%D0%9D%D0%B0%D0%B2%D0%B0%D1%80%D0%B0%20%D0%BA%D0%B0%D1%80%2C%20%D0%B1%D1%83%D0%BB.%20%E2%80%9E%D0%A6%D0%B0%D1%80%20%D0%9E%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%E2%80%9C%2C%20%D0%9A%D0%B0%D0%B9%D1%81%D0%B8%D0%B5%D0%B2%D0%B0%20%D0%B3%D1%80%D0%B0%D0%B4%D0%B8%D0%BD%D0%B0%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0",
  name: "Навара кар",
  phoneDisplay: "0899 192 300",
  phoneHref: "tel:+359899192300",
  shortName: "Navara Car",
  slug: "navara-car",
  socialLinks: {},
  staticDemoMode: true,
  tagline: "Премиум автомобили, внос и собствен лизинг в Варна.",
};
// LEAD_SITE_CONFIG_END
