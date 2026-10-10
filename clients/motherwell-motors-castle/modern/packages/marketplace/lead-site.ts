import { carsLocale } from './cars-locale';
import type {
  PublicInventoryFilterLayout,
  PublicSiteArtwork,
  PublicSiteConfig,
} from "@repo/marketplace-domain/site-config";
import { inventoryCopy } from "./content/inventory-copy";

export type LeadSiteCurrency = "AED" | "BGN" | "EUR" | "GBP" | "USD";

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
    "address": "23a Biggar Road, Cleland Industrial Estate, Motherwell ML1 5PB",
    "city": "Cleland / Motherwell, Scotland",
    "country": "Обединеното кралство",
    "tagline": "Motors Castle — автомобили и съдействие в Cleland / Motherwell, Scotland."
  },
  "en": {
    "address": "23a Biggar Road, Cleland Industrial Estate, Motherwell ML1 5PB",
    "city": "Cleland / Motherwell, Scotland",
    "country": "United Kingdom",
    "tagline": "Motors Castle — vehicles and dealer support in Cleland / Motherwell, Scotland."
  }
},
  accent: "#18181B",
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
  address: "23a Biggar Road, Cleland Industrial Estate, Motherwell ML1 5PB",
  city: "Cleland / Motherwell, Scotland",
  district: { bg: "Cleland / Motherwell, Scotland", en: "Cleland / Motherwell, Scotland" },
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
  contactUrl: "tel:+447850472427",
  country: "United Kingdom",
  countryCode: carsLocale.dealerCountry,
  currency: carsLocale.inventoryCurrency,
  email: "davidautodesign5@gmail.com",
  heroPath: "/lead-hero.jpg",
  locale: "en-GB",
  logoInversePath: "/dealer-brand/logo-on-dark-20261011.webp",
  logoPath: "/dealer-brand/logo-on-light-20261011.webp",
  logoOnLight: "/dealer-brand/logo-on-light-20261011.webp",
  logoOnDark: "/dealer-brand/logo-on-dark-20261011.webp",
  logoOnAccent: "/dealer-brand/logo-on-accent-20261011.webp",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=Motors%20Castle%2C%2023a%20Biggar%20Road%2C%20Cleland%20Industrial%20Estate%2C%20Motherwell%20ML1%205PB&z=16&output=embed",
  mapsUrl:
    "https://www.google.com/maps/place/Motors+castle/@55.8074316,-3.9127636,17z/data=!3m1!4b1!4m6!3m5!1s0x48886d0a398a8f65:0x37c826e322dfbe0c!8m2!3d55.8074316!4d-3.9101887!16s%2Fg%2F11xkpv82zf?hl=en",
  name: "Motors Castle",
  phoneDisplay: "07850 472427",
  phoneHref: "tel:+447850472427",
  shortName: "Motors Castle",
  slug: "motherwell-motors-castle",
  socialLinks: {},
  staticDemoMode: true,
  tagline: "Explore used cars in Motherwell.",
};
// LEAD_SITE_CONFIG_END
