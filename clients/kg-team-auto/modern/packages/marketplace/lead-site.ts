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
    "address": "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите",
    "city": "Пловдив",
    "country": "България",
    "tagline": "K-G Team Auto — автомобили и съдействие в Пловдив."
  },
  "en": {
    "address": "South Industrial Zone, Ring Road opposite Chiirite Hotel, Plovdiv",
    "city": "Plovdiv",
    "country": "Bulgaria",
    "tagline": "K-G Team Auto — vehicles and dealer support in Plovdiv."
  }
},
  accent: "#c40101",
  address: "ул. „Атанас Манчев“ 18, Пловдив",
  city: "Пловдив",
  district: { bg: "Пловдив", en: "Plovdiv" },
  sellCategoryAssets: {
    car: "/lead-sell-car-v1.png",
    motorbike: "/lead-sell-motorcycle-v1.png",
    truck: "/lead-sell-truck-v1.png",
    van: "/lead-sell-van-v1.png",
  },
  financingArtworkPath: "/images/services/leasing-red-suv-v2.webp",
  contactUrl: "tel:+359877346262",
  country: "България",
  countryCode: carsLocale.dealerCountry,
  currency: carsLocale.inventoryCurrency,
  email: "",
  heroPath: "/lead-hero.jpg",
  locale: "bg-BG",
  logoPath: "/dealer-brand/logo-on-dark.webp",
  logoOnLight: "/dealer-brand/logo-on-light.webp",
  logoOnDark: "/dealer-brand/logo-on-dark.webp",
  logoOnAccent: "/dealer-brand/logo-on-accent.webp",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=K-G%20Team%20Auto%2C%20%D0%98%D0%BD%D0%B4%D1%83%D1%81%D1%82%D1%80%D0%B8%D0%B0%D0%BB%D0%BD%D0%B0%20%D0%B7%D0%BE%D0%BD%D0%B0%20%E2%80%93%20%D0%AE%D0%B3%2C%20%D0%9E%D0%BA%D0%BE%D0%BB%D0%BE%D0%B2%D1%80%D1%8A%D1%81%D1%82%D0%B5%D0%BD%20%D0%BF%D1%8A%D1%82%20%D1%81%D1%80%D0%B5%D1%89%D1%83%20%D1%85%D0%BE%D1%82%D0%B5%D0%BB%20%D0%A7%D0%B8%D0%B8%D1%80%D0%B8%D1%82%D0%B5&z=16&output=embed",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=K-G%20Team%20Auto%2C%20%D0%98%D0%BD%D0%B4%D1%83%D1%81%D1%82%D1%80%D0%B8%D0%B0%D0%BB%D0%BD%D0%B0%20%D0%B7%D0%BE%D0%BD%D0%B0%20%E2%80%93%20%D0%AE%D0%B3%2C%20%D0%9E%D0%BA%D0%BE%D0%BB%D0%BE%D0%B2%D1%80%D1%8A%D1%81%D1%82%D0%B5%D0%BD%20%D0%BF%D1%8A%D1%82%20%D1%81%D1%80%D0%B5%D1%89%D1%83%20%D1%85%D0%BE%D1%82%D0%B5%D0%BB%20%D0%A7%D0%B8%D0%B8%D1%80%D0%B8%D1%82%D0%B5",
  name: "K-G Team Auto",
  phoneDisplay: "+359877346262",
  phoneHref: "tel:+359877346262",
  shortName: "K-G Team Auto",
  slug: "kg-team-auto",
  socialLinks: {},
  staticDemoMode: true,
  tagline: "Премиум автомобили, внос и собствен лизинг в Пловдив.",
};
// LEAD_SITE_CONFIG_END
