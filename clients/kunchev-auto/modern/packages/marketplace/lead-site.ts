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

// LEAD_SITE_CONFIG_START
export const leadSite: LeadSiteConfig = {
  accent: "#b5122b",
  address: "Индустриална зона, срещу КАТ Плевен",
  city: "Плевен",
  contactUrl: "tel:+359878932725",
  country: "България",
  countryCode: "BG",
  currency: "EUR",
  email: "",
  heroPath: "/lead-car-left.webp",
  locale: "bg-BG",
  logoPath: "/lead-logo.png",
  mapsEmbedUrl: "https://maps.google.com/maps?q=%D0%98%D0%BD%D0%B4%D1%83%D1%81%D1%82%D1%80%D0%B8%D0%B0%D0%BB%D0%BD%D0%B0%20%D0%B7%D0%BE%D0%BD%D0%B0%2C%20%D1%81%D1%80%D0%B5%D1%89%D1%83%20%D0%9A%D0%90%D0%A2%20%D0%9F%D0%BB%D0%B5%D0%B2%D0%B5%D0%BD&z=16&output=embed",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=%D0%98%D0%BD%D0%B4%D1%83%D1%81%D1%82%D1%80%D0%B8%D0%B0%D0%BB%D0%BD%D0%B0%20%D0%B7%D0%BE%D0%BD%D0%B0%2C%20%D1%81%D1%80%D0%B5%D1%89%D1%83%20%D0%9A%D0%90%D0%A2%20%D0%9F%D0%BB%D0%B5%D0%B2%D0%B5%D0%BD",
  name: "КЪНЧЕВ",
  phoneDisplay: "0878 932 725",
  phoneHref: "tel:+359878932725",
  shortName: "КЪНЧЕВ",
  slug: "kunchev-auto",
  staticDemoMode: true,
  tagline: "Автомобили в Плевен с директен контакт за наличност, състояние и оглед.",
};
// LEAD_SITE_CONFIG_END
