export type LeadSiteCurrency = "AED" | "BGN" | "EUR" | "USD";
export interface LeadSiteConfig {
  readonly accent: string; readonly address: string; readonly city: string; readonly contactUrl: string; readonly country: string;
  readonly countryCode: string; readonly currency: LeadSiteCurrency; readonly district: { readonly bg: string; readonly en: string };
  readonly email: string; readonly financingArtworkPath: string; readonly heroPath: string; readonly locale: string; readonly logoPath: string;
  readonly mapsEmbedUrl: string; readonly mapsUrl: string; readonly name: string; readonly phoneDisplay: string; readonly phoneHref: string;
  readonly sellCategoryAssets: Readonly<Record<"car" | "motorbike" | "truck" | "van", string>>;
  readonly shortName: string; readonly slug: string; readonly socialLinks?: Partial<Record<"youtube" | "instagram" | "facebook" | "tiktok", string>>;
  readonly staticDemoMode: boolean; readonly tagline: string;
}
const mapQuery = encodeURIComponent('Бизнес парк Варна, сграда B6, Варна, България');
export const leadSite: LeadSiteConfig = {
  accent: "#d71920",
  address: "Бизнес парк Варна, сграда B6", city: "Варна", district: { bg: "Бизнес парк Варна", en: "Business Park Varna" },
  sellCategoryAssets: { car: "/variant-2/lead-sell-car-v1.png", motorbike: "/variant-2/lead-sell-motorcycle-v1.png", truck: "/variant-2/lead-sell-truck-v1.png", van: "/variant-2/lead-sell-van-v1.png" },
  financingArtworkPath: "/variant-2/images/services/leasing-red-suv-v2.png",
  contactUrl: "tel:+359899266666", country: "България", countryCode: "BG", currency: "EUR", email: "varna@isauto.net",
  heroPath: "/lead-hero.jpg", locale: "bg-BG", logoPath: "/variant-2/isauto/logo-light.png",
  mapsEmbedUrl: `https://www.google.com/maps?q=${mapQuery}&z=16&output=embed`,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
  name: "IS AUTO Varna", phoneDisplay: "0899 266 666", phoneHref: "tel:+359899266666", shortName: "IS AUTO", slug: "isauto-varna",
  socialLinks: {"instagram":"https://www.instagram.com/is__auto/?hl=bg","youtube":"","facebook":"https://www.facebook.com/isauto1"},
  staticDemoMode: true,
  tagline: "Нови и употребявани автомобили, внос и съдействие при покупка във Варна."
};
