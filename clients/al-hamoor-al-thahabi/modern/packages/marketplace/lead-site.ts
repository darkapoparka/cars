export type LeadSiteCurrency = "AED" | "BGN" | "EUR" | "USD" | "GBP";

export interface LeadSiteConfig {
  readonly logoDarkPath: string;
  readonly distanceUnit: string;
  readonly previewNotice: string;
  readonly locationNote: string;
  readonly priceNotice: string;
  readonly hours: string;
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
  readonly socialLinks?: Partial<
    Record<"youtube" | "instagram" | "facebook" | "tiktok", string>
  >;
  readonly staticDemoMode: boolean;
  readonly tagline: string;
}

// LEAD_SITE_CONFIG_START
export const leadSite: LeadSiteConfig = {
  "accent": "#c13f38",
  "address": "Souk Al Haraj, showroom 353, Sharjah",
  "city": "Sharjah",
  "contactUrl": "tel:+971545555204",
  "country": "United Arab Emirates",
  "countryCode": "AE",
  "currency": "AED",
  "email": "",
  "heroPath": "/dealer/showroom.webp",
  "locale": "en-AE",
  "logoPath": "/dealer/logo-light.png",
  "logoDarkPath": "/dealer/logo-dark.png",
  "mapsEmbedUrl": "https://maps.google.com/maps?q=Al+Hamoor+Al+Thahabi+Souk+Al+Haraj+353+Sharjah&output=embed",
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Al+Hamoor+Al+Thahabi+Souk+Al+Haraj+353+Sharjah",
  "name": "Al Hamoor Al Thahabi Used Cars",
  "phoneDisplay": "+971 54 555 5204",
  "phoneHref": "tel:+971545555204",
  "shortName": "Al Hamoor Al Thahabi",
  "slug": "al-hamoor-al-thahabi",
  "socialLinks": {},
  "staticDemoMode": true,
  "tagline": "Used cars in Sharjah. Clear details. A direct conversation.",
  "distanceUnit": "km",
  "previewNotice": "Independent design preview. Dated listing samples, not a live stock feed. Confirm availability, price, vehicle condition and location directly. No dealership approval or form delivery is implied.",
  "locationNote": "The YallaMotor dealer profile publishes showroom 353 in Sharjah; DubiCars vehicle cards are labelled Dubai. Confirm the selected vehicle's viewing location before travelling. No exact coordinate is asserted.",
  "priceNotice": "Confirm the advertised price and final terms directly with the dealership.",
  "hours": "Please confirm opening hours and arrange your visit with the dealership."
};
// LEAD_SITE_CONFIG_END
