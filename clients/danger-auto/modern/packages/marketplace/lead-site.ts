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

// Published contacts and listing checked 2026-09-09:
// https://dangerauto.mobile.bg/contacts
// https://dangerauto.mobile.bg/obiava-11788853280325556-chevrolet-cruze-1-6i-95000km-gaz-inzhektsion
// Local outlined wordmark: proposed demo refresh; see brand/PROVENANCE.json.
// Real vehicle media remains pending; the logo does not stand in for stock photos.
const address = 'бул. Самоковско шосе 1, автоборса Джани до комплекс Боила, Горубляне';
// LEAD_SITE_CONFIG_START
export const leadSite: LeadSiteConfig = {
  accent: "#c40101",
  address,
  city: "София",
  contactUrl: "tel:+359878842409",
  country: "България",
  countryCode: "BG",
  currency: "EUR",
  email: "",
  heroPath: "/assets/images/lead/stock-photo-pending.svg",
  locale: "bg-BG",
  logoPath: "/brand/danger-auto-ink.svg",
  mapsEmbedUrl: "https://maps.google.com/maps?q=42.6425458,23.4007179&z=16&output=embed",
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`DANGER AUTO, ${address}, София`)}`,
  name: "DANGER AUTO",
  phoneDisplay: "0878 842 409",
  phoneHref: "tel:+359878842409",
  shortName: "DANGER AUTO",
  slug: "danger-auto",
  socialLinks: {},
  staticDemoMode: true,
  tagline: "Употребявани автомобили в Горубляне. Наличността и огледът се потвърждават по телефона.",
};
// LEAD_SITE_CONFIG_END
