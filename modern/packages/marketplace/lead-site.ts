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
    "address": "Oldmoor Road, Bredbury, Stockport SK6 2QE",
    "city": "Bredbury, Stockport",
    "country": "Обединеното кралство",
    "tagline": "Broadbent Car and Servicing — автомобили и съдействие в Bredbury, Stockport."
  },
  "en": {
    "address": "Oldmoor Road, Bredbury, Stockport SK6 2QE",
    "city": "Bredbury, Stockport",
    "country": "United Kingdom",
    "tagline": "Broadbent Car and Servicing — vehicles and dealer support in Bredbury, Stockport."
  }
},
  accent: "#C21C2A",
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
  address: "ул. „Атанас Манчев“ 18, Bredbury, Stockport",
  city: "Bredbury, Stockport",
  district: { bg: "Bredbury, Stockport", en: "Bredbury, Stockport" },
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
  contactUrl: "tel:+447398540293",
  country: "България",
  countryCode: carsLocale.dealerCountry,
  currency: carsLocale.inventoryCurrency,
  email: "transitsellers2020@gmail.com",
  heroPath: "/lead-hero.jpg",
  locale: "en-GB",
  logoPath: "/dealer-brand/logo.webp",
  logoOnLight: "/dealer-brand/logo.webp",
  logoOnDark: "/dealer-brand/logo.webp",
  logoOnAccent: "/dealer-brand/logo.webp",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=Broadbent%20Car%20and%20Servicing%2C%20Oldmoor%20Road%2C%20Bredbury%2C%20Stockport%20SK6%202QE&z=16&output=embed",
  mapsUrl:
    "https://www.google.com/maps/place/Broadbent+cars+%26+servicing/@53.4254393,-2.1235032,17z/data=!3m1!4b1!4m6!3m5!1s0x487bb5b81f56cc3b:0x4ac3e2367b9af59b!8m2!3d53.4254393!4d-2.1209283!16s%2Fg%2F11nqy649kj?hl=en",
  name: "Broadbent Car and Servicing",
  phoneDisplay: "07398 540293",
  phoneHref: "tel:+447398540293",
  shortName: "Broadbent Car and Servicing",
  slug: "stockport-broadbent-car-and-servicing",
  socialLinks: {},
  staticDemoMode: true,
  tagline: "Премиум автомобили, внос и собствен лизинг в Bredbury, Stockport.",
};
// LEAD_SITE_CONFIG_END
