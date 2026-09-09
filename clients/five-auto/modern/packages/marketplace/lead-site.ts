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

const address = "ул. „Сребърна“ 6, Промишлена зона Север, Бургас";
const mapQuery = encodeURIComponent(address);

export const leadSite: LeadSiteConfig = {
  accent: "#2d2d2d",
  address,
  city: "Бургас",
  contactUrl: "tel:+359887555255",
  country: "България",
  countryCode: "BG",
  currency: "EUR",
  email: "",
  heroPath: "/inventory/11788534934699972-1.webp",
  locale: "bg-BG",
  logoPath: "/brand/logo.png",
  mapsEmbedUrl: `https://www.google.com/maps?q=${mapQuery}&z=16&output=embed`,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
  name: "FIVE AUTO",
  phoneDisplay: "0887 555 255",
  phoneHref: "tel:+359887555255",
  shortName: "FIVE AUTO",
  slug: "five-auto",
  socialLinks: {},
  staticDemoMode: true,
  tagline: "Подбрани публикувани автомобили в Бургас. Потвърдете наличност, цена и условия преди оглед."
};
