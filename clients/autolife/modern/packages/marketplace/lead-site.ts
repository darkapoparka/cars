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
    "address": "ГП4, разклон за с. Тополи",
    "city": "Варна",
    "country": "България",
    "tagline": "Аутолайф — автомобили и съдействие в Варна."
  },
  "en": {
    "address": "GP4, turnoff for Topoli village, Varna",
    "city": "Varna",
    "country": "Bulgaria",
    "tagline": "AUTOLIFE — vehicles and dealer support in Varna."
  }
},
  accent: "#a46d24",
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
  contactUrl: "tel:+359895766736",
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
    "https://maps.google.com/maps?q=43.22861,27.8253778&z=15&output=embed",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=43.22861,27.8253778",
  name: "Аутолайф",
  phoneDisplay: "0895 766 736",
  phoneHref: "tel:+359895766736",
  shortName: "Аутолайф",
  slug: "autolife",
  socialLinks: {},
  staticDemoMode: true,
  tagline: "Премиум автомобили, внос и собствен лизинг в Варна.",
};
// LEAD_SITE_CONFIG_END
