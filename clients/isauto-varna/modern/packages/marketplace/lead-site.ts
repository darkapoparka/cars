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
    "address": "Бизнес парк Варна, сграда B6, Варна, България",
    "city": "Варна",
    "country": "България",
    "tagline": "IS AUTO Varna — автомобили и съдействие в Варна."
  },
  "en": {
    "address": "Varna Business Park, Building B6, Varna, Bulgaria",
    "city": "Varna",
    "country": "Bulgaria",
    "tagline": "IS AUTO Varna — vehicles and dealer support in Varna."
  }
},
  accent: "#d71920",
  address: "ул. „Атанас Манчев“ 18, Бизнес парк Варна",
  city: "Варна",
  district: { bg: "Бизнес парк Варна", en: "Varna Business Park" },
  sellCategoryAssets: {
    car: "/lead-sell-car-v1.png",
    motorbike: "/lead-sell-motorcycle-v1.png",
    truck: "/lead-sell-truck-v1.png",
    van: "/lead-sell-van-v1.png",
  },
  financingArtworkPath: "/images/services/leasing-red-suv-v2.webp",
  contactUrl: "tel:+359899266666",
  country: "България",
  countryCode: carsLocale.dealerCountry,
  currency: carsLocale.inventoryCurrency,
  email: "varna@isauto.net",
  heroPath: "/lead-hero.jpg",
  locale: "bg-BG",
  logoPath: "/dealer-brand/logo-on-dark-20260919.webp",
  logoOnLight: "/dealer-brand/logo-on-light-20260919.webp",
  logoOnDark: "/dealer-brand/logo-on-dark-20260919.webp",
  logoOnAccent: "/dealer-brand/logo-on-accent-20260919.webp",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=IS%20AUTO%20Varna%2C%20%D0%91%D0%B8%D0%B7%D0%BD%D0%B5%D1%81%20%D0%BF%D0%B0%D1%80%D0%BA%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D1%81%D0%B3%D1%80%D0%B0%D0%B4%D0%B0%20B6%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F&z=16&output=embed",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=IS%20AUTO%20Varna%2C%20%D0%91%D0%B8%D0%B7%D0%BD%D0%B5%D1%81%20%D0%BF%D0%B0%D1%80%D0%BA%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D1%81%D0%B3%D1%80%D0%B0%D0%B4%D0%B0%20B6%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F",
  name: "IS AUTO Varna",
  phoneDisplay: "0899 266 666",
  phoneHref: "tel:+359899266666",
  shortName: "IS AUTO",
  slug: "isauto-varna",
  socialLinks: {"facebook":"https://www.facebook.com/isauto1","instagram":"https://www.instagram.com/is__auto/?hl=bg"},
  staticDemoMode: true,
  tagline: "Премиум автомобили, внос и собствен лизинг в Варна.",
};
// LEAD_SITE_CONFIG_END
