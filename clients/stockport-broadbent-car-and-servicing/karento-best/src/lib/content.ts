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
  "name": "Broadbent Car and Servicing",
  "locale": "en-GB",
  "logo": {
    "light": "/dealer-brand/logo.webp",
    "footer": "/dealer-brand/logo.webp",
    "archivedDark": "/dealer-brand/logo.webp",
    "alt": "Broadbent Car and Servicing",
    "favicon": "/dealer-brand/app-icon.png",
    "monochromeOnDark": false
  },
  "contacts": {
    "phone": "+447398540293",
    "email": "transitsellers2020@gmail.com"
  },
  "hero": {
    "desktopImage": "/assets/imgs/hero/hero-3/dealership-desktop.webp",
    "imageAlt": "Illustrative silver car outside a modern showroom"
  },
  "locations": [
    {
      "name": "Broadbent Car and Servicing",
      "address": "Oldmoor Road, Bredbury, Stockport SK6 2QE",
      "country": "United Kingdom",
      "mapUrl": "https://www.google.com/maps/place/Broadbent+cars+%26+servicing/@53.4254393,-2.1235032,17z/data=!3m1!4b1!4m6!3m5!1s0x487bb5b81f56cc3b:0x4ac3e2367b9af59b!8m2!3d53.4254393!4d-2.1209283!16s%2Fg%2F11nqy649kj?hl=en",
      "phone": "07398 540293",
      "phoneHref": "tel:+447398540293",
      "email": "transitsellers2020@gmail.com",
      "emailHref": "mailto:transitsellers2020@gmail.com"
    }
  ],
  "inventory": {},
  "copy": {
    "home.hero": "Broadbent Car and Servicing",
    "home.hero.mobile": "Find your next car.",
    "home.brandsIntro": "Explore our dated vehicle examples.",
    "contact.agents": "Contact the dealership",
    "contact.hours": "Contact the dealership before visiting.",
    "inventory.notice": "Vehicle images are generated illustrations, not photographs of the advertised vehicles. Listing details were observed on 10 October 2026; confirm each original advert, price, condition and availability with the dealership."
  },
  "businessPreview": {
    "mode": "dated-listing-snapshot",
    "observedAt": "2026-10-10",
    "inventoryCount": 10,
    "city": "Bredbury, Stockport",
    "countryCode": "GB",
    "currency": "GBP",
    "contactBeforeVisit": true
  },
  "contentStatus": "reference-demo"
};
