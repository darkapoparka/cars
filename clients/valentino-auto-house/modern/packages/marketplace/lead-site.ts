import dealerPack from "./dealer-pack.json";

export type LeadSiteCurrency = "AED" | "BGN" | "EUR" | "USD";

export interface LeadSiteConfig {
  readonly accent: string;
  readonly address: string;
  readonly city: string;
  readonly contactUrl: string;
  readonly country: string;
  readonly countryCode: string;
  readonly currency: LeadSiteCurrency;
  readonly email: string;
  readonly heroPath: string;
  readonly locale: string;
  readonly logoPath: string;
  readonly logoLightPath: string;
  readonly logoDarkPath: string;
  readonly hoursLabel: string;
  readonly stockNotice: string;
  readonly mapsEmbedUrl: string;
  readonly mapsUrl: string;
  readonly name: string;
  readonly phoneDisplay: string;
  readonly phoneHref: string;
  readonly shortName: string;
  readonly slug: string;
  readonly socialLinks?: Partial<Record<"youtube" | "instagram" | "facebook" | "tiktok", string>>;
  readonly staticDemoMode: boolean;
  readonly tagline: string;
}

const dealer = dealerPack.dealer;
const addressQuery = encodeURIComponent(`${dealer.address}, България`);

// LEAD_SITE_CONFIG_START
// One dated source pack drives identity and stock; this is not a live dealer feed.
export const leadSite: LeadSiteConfig = {
  accent: dealer.accent,
  address: dealer.addressLine,
  city: dealer.city,
  contactUrl: `tel:${dealer.phoneE164}`,
  country: "България",
  countryCode: dealer.country,
  currency: "EUR",
  email: "",
  heroPath: "/media/stock/11785220779595617-1.webp",
  locale: dealer.locale,
  logoPath: dealer.logo,
  logoLightPath: dealer.logoLight,
  logoDarkPath: dealer.logoDark,
  hoursLabel: "Пон–Пет 07:00–19:00 · Съб 07:00–17:00 · Неделя: почивен ден",
  stockNotice: dealer.stockNotice,
  // Address search, not a claim of verified geographic coordinates.
  mapsEmbedUrl: `https://maps.google.com/maps?q=${addressQuery}&output=embed`,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${addressQuery}`,
  name: dealer.name,
  phoneDisplay: dealer.phone,
  phoneHref: `tel:${dealer.phoneE164}`,
  shortName: dealer.shortName,
  slug: dealer.slug,
  socialLinks: {},
  staticDemoMode: true,
  tagline: "Употребявани автомобили в София, Горубляне. Наличност и оглед по телефона.",
};
// LEAD_SITE_CONFIG_END
