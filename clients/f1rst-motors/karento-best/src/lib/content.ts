import type { PlainMessageKey } from "./i18n/text.ts";
import type { DealerFinanceContent } from "./data/finance.ts";
import type { ImportSourceItem } from "./data/editorial.ts";
import type { ImportCountryChoice } from "./data/import-sources.ts";
import type { NewsArticleContent } from "./data/news.ts";
import type { AboutContent } from "./data/about.ts";
export type VehicleListingHighlight = "new-import" | "registered" | "serviced";

/** Sample cards preserve reference artwork and copy. They are not dealer stock. */
export interface VehicleCardContent {
  sample: boolean;
  image: string;
  /** Supplied larger photo of the same listing for its detail gallery. */
  detailImage?: string;
  imageAlt: string;
  href: string;
  title: string;
  location: string;
  /** Up to two supplied stock facts; never inferred from price, origin or mileage. */
  listingHighlights?:
    | readonly [VehicleListingHighlight]
    | readonly [VehicleListingHighlight, VehicleListingHighlight];
  mileage: string;
  transmission: string;
  fuel: string;
  seats: string;
  bodyType?: string;
  price: string;
  pricePeriod: string;
  action: string;
  rating: string;
  reviews: string;
  reviewCount?: number;
  seatsCount?: number;
  actionKey?: PlainMessageKey;
  pricePeriodKey?: PlainMessageKey;
  priceAmount?: number;
  currency?: string;
  mileageValue?: number;
  mileageUnit?: "km" | "mi";
  fuelType?: "diesel" | "gasoline" | "electric" | "hybrid" | "lpg" | "other";
  transmissionType?: "automatic" | "manual" | "other";
}
export interface DealerContent {
  name: string;
  locale: string;
  logo: {
    light: string;
    footer: string;
    archivedDark: string;
    alt: string;
    favicon?: string;
    monochromeOnDark?: boolean;
  };
  hero?: { desktopImage: string; imageAlt: string };
  vehicleFilters?: {
    layout: "drawer" | "modal";
    showLayoutOptions?: boolean;
  };
  contacts: { phone: string; email: string };
  locations: readonly {
    name: string;
    address: string;
    country?: string;
    avatar?: string;
    mapUrl?: string;
    phone?: string;
    phoneHref?: string;
    email?: string;
    emailHref?: string;
  }[];
  inventory: Readonly<Record<string, VehicleCardContent>>;
  /** Supplied content; omitted collections retain identified reference examples. */
  finance?: DealerFinanceContent;
  importSources?: readonly ImportSourceItem[];
  /** Country filter choices may include markets with no supplied source records. */
  importCountryChoices?: readonly ImportCountryChoice[];
  news?: readonly NewsArticleContent[];
  about?: AboutContent;
  copy: Readonly<Record<string, string>>;
  reviewedAccent?: {
    base: string;
    hover: string;
    contrast: string;
    soft: string;
  };
  contentStatus: "reference-demo" | "owner-reviewed";
  businessPreview?: {
    mode: "dated-listing-snapshot" | "illustrative-not-dealer-stock";
    observedAt: string;
    inventoryCount: number;
    city: string;
    countryCode: string;
    currency: string;
    contactBeforeVisit: true;
  };
}
export const dealer: DealerContent = {
  "name": "F1rst Motors",
  "locale": "en-AE",
  "logo": {
    "light": "/dealer-brand/v2-1cc6f1fb3927da42/logo-on-light.webp",
    "footer": "/dealer-brand/v2-1cc6f1fb3927da42/logo-on-dark.webp",
    "archivedDark": "/dealer-brand/v2-1cc6f1fb3927da42/logo-on-dark.webp",
    "alt": "F1rst Motors",
    "favicon": "/dealer-brand/v2-1cc6f1fb3927da42/logo-on-light.webp",
    "monochromeOnDark": false
  },
  "contacts": {
    "phone": "+97143201030",
    "email": "info@f1rstmotors.com"
  },
  "hero": {
    "desktopImage": "/assets/imgs/hero/hero-3/dealership-desktop.webp",
    "imageAlt": "Illustrative silver car outside a modern showroom"
  },
  "locations": [
    {
      "name": "F1rst Motors",
      "address": "Danube Building - 409 Sheikh Zayed Rd - Al Quoz - Al Quoz 1 - Dubai, UAE",
      "country": "United Arab Emirates",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=F1rst%20Motors%2C%20Danube%20Building%20-%20409%20Sheikh%20Zayed%20Rd%20-%20Al%20Quoz%20-%20Al%20Quoz%201%20-%20Dubai%2C%20UAE",
      "phone": "+971 4 320 1030",
      "phoneHref": "tel:+97143201030",
      "email": "info@f1rstmotors.com",
      "emailHref": "mailto:info@f1rstmotors.com"
    }
  ],
  "inventory": {},
  "copy": {
    "home.hero": "F1rst Motors",
    "home.hero.mobile": "Find your next car.",
    "home.brandsIntro": "Explore our dated vehicle examples.",
    "contact.agents": "Contact the dealership",
    "contact.hours": "Mon-Thu 10:00-21:00; Friday 14:00-21:00; Saturday 10:00-21:00; Sunday Closed",
    "inventory.notice": "Dated public stock sample, not a live feed. Confirm price, specifications and availability directly with F1rst Motors. Demo forms do not send messages."
  },
  "businessPreview": {
    "mode": "dated-listing-snapshot",
    "observedAt": "2026-09-09",
    "inventoryCount": 10,
    "city": "Dubai",
    "countryCode": "AE",
    "currency": "AED",
    "contactBeforeVisit": true
  },
  "contentStatus": "reference-demo"
};
