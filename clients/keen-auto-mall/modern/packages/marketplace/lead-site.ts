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
  "accent": "#e86f13",
  "address": "2420 NW 16th Lane, Suite E, Pompano Beach, FL 33064",
  "city": "Pompano Beach",
  "contactUrl": "tel:+19547106047",
  "country": "United States",
  "countryCode": "US",
  "currency": "USD",
  "email": "",
  "heroPath": "/dealer/inventory/6572737-1.webp",
  "locale": "en-US",
  "logoPath": "/dealer/logo-light.png",
  "logoDarkPath": "/dealer/logo-dark.png",
  "mapsEmbedUrl": "https://maps.google.com/maps?q=Keen+Auto+Mall+2420+NW+16th+Lane+Pompano+Beach+FL+33064&output=embed",
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Keen+Auto+Mall+2420+NW+16th+Lane+Pompano+Beach+FL+33064",
  "name": "Keen Auto Mall",
  "phoneDisplay": "(954) 710-6047",
  "phoneHref": "tel:+19547106047",
  "shortName": "Keen Auto Mall",
  "slug": "keen-auto-mall",
  "socialLinks": {
    "instagram": "https://www.instagram.com/keenautomall/"
  },
  "staticDemoMode": true,
  "tagline": "Used cars in Pompano Beach. Compare the details and discuss your next car.",
  "distanceUnit": "mi",
  "previewNotice": "Independent design preview with dated advertised samples, not a live feed. Confirm availability, condition and total price directly. No dealership approval or enquiry delivery is implied.",
  "locationNote": "Confirm the selected vehicle, opening hours and your viewing appointment directly before travelling.",
  "priceNotice": "The dealer's published terms add tax, tag and title plus a $1,298 dealer fee, $1,995 reconditioning fee, $598 electronic filing fee and $189 private tag agency fee. These are not included in the sample advertised prices. Confirm a written total for the specific vehicle. The site describes vehicles as sold as-is, with optional service contracts and finance subject to application and approval.",
  "hours": "Contact the dealership to confirm opening hours and arrange a visit."
};
// LEAD_SITE_CONFIG_END
