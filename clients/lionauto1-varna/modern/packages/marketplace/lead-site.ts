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
    "address": "бул.Цар Освободител третата автокъща в ляво след Италмодо, Варна, България",
    "city": "Варна",
    "country": "България",
    "tagline": "Лион Ауто — автомобили и съдействие в Варна."
  },
  "en": {
    "address": "Tsar Osvoboditel tretata avtokashta v lyavo sled Italmodo, Varna, Balgariya",
    "city": "Varna",
    "country": "Bulgaria",
    "tagline": "Лион Ауто — vehicles and dealer support in Varna."
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
  address: "бул.Цар Освободител третата автокъща в ляво след Италмодо, Варна, България",
  city: "Варна",
  district: { bg: "Варна", en: "Varna" },
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
  contactUrl: "tel:+359895753001",
  country: "BG",
  countryCode: carsLocale.dealerCountry,
  currency: carsLocale.inventoryCurrency,
  email: "",
  heroPath: "/lead-hero.jpg",
  locale: "bg-BG",
  logoPath: "/dealer-brand/v2-b288ae392c379daa/logo-on-light.webp",
  logoInversePath: "/dealer-brand/v2-b288ae392c379daa/logo-on-dark.webp",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=%D0%9B%D0%B8%D0%BE%D0%BD%20%D0%90%D1%83%D1%82%D0%BE%2C%20%D0%B1%D1%83%D0%BB.%D0%A6%D0%B0%D1%80%20%D0%9E%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%20%D1%82%D1%80%D0%B5%D1%82%D0%B0%D1%82%D0%B0%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BA%D1%8A%D1%89%D0%B0%20%D0%B2%20%D0%BB%D1%8F%D0%B2%D0%BE%20%D1%81%D0%BB%D0%B5%D0%B4%20%D0%98%D1%82%D0%B0%D0%BB%D0%BC%D0%BE%D0%B4%D0%BE%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F&z=16&output=embed",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=%D0%9B%D0%B8%D0%BE%D0%BD%20%D0%90%D1%83%D1%82%D0%BE%2C%20%D0%B1%D1%83%D0%BB.%D0%A6%D0%B0%D1%80%20%D0%9E%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%20%D1%82%D1%80%D0%B5%D1%82%D0%B0%D1%82%D0%B0%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BA%D1%8A%D1%89%D0%B0%20%D0%B2%20%D0%BB%D1%8F%D0%B2%D0%BE%20%D1%81%D0%BB%D0%B5%D0%B4%20%D0%98%D1%82%D0%B0%D0%BB%D0%BC%D0%BE%D0%B4%D0%BE%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F",
  name: "Лион Ауто",
  phoneDisplay: "0895753001",
  phoneHref: "tel:+359895753001",
  shortName: "Лион Ауто",
  slug: "lionauto1-varna",
  socialLinks: {},
  staticDemoMode: true,
  tagline: "Лион Ауто — автомобили и съдействие в Варна.",
};
// LEAD_SITE_CONFIG_END
