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
  "name": "Excellent Cars",
  "locale": "bg-BG",
  "logo": {
    "light": "/dealer-brand/v2-23abd64e1e990a72/logo-on-light.webp",
    "footer": "/dealer-brand/v2-23abd64e1e990a72/logo-on-dark.webp",
    "archivedDark": "/dealer-brand/v2-23abd64e1e990a72/logo-on-dark.webp",
    "alt": "Excellent Cars",
    "favicon": "/dealer-brand/v2-23abd64e1e990a72/logo-on-light.webp",
    "monochromeOnDark": false
  },
  "contacts": {
    "phone": "+359895996559",
    "email": ""
  },
  "hero": {
    "desktopImage": "/assets/imgs/hero/hero-3/dealership-desktop.webp",
    "imageAlt": "Illustrative silver car outside a modern showroom"
  },
  "locations": [
    {
      "name": "Excellent Cars",
      "address": "бул. „Ян Хунияди“, ъгъла с бул. „Цар Освободител“",
      "country": "България",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Excellent%20Cars%2C%20%D0%B1%D1%83%D0%BB.%20%D0%AF%D0%BD%20%D0%A5%D1%83%D0%BD%D0%B8%D1%8F%D0%B4%D0%B8%20%D0%B8%20%D0%A6%D0%B0%D1%80%20%D0%9E%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0",
      "phone": "0895 996 559",
      "phoneHref": "tel:+359895996559",
      "email": "",
      "emailHref": ""
    }
  ],
  "inventory": {},
  "copy": {
    "home.hero": "Excellent Cars",
    "home.hero.mobile": "Find your next car.",
    "home.brandsIntro": "Explore our dated vehicle examples.",
    "contact.agents": "Contact the dealership",
    "contact.hours": "Понеделник – петък: 08:30–19:00; Събота: 09:00–18:00; Неделя: почивен ден",
    "inventory.notice": "Подбрани публикувани обяви към 07.09.2026. Наличностите и условията се потвърждават по телефона."
  },
  "businessPreview": {
    "mode": "dated-listing-snapshot",
    "observedAt": "2026-09-07",
    "inventoryCount": 16,
    "city": "Варна",
    "countryCode": "BG",
    "currency": "EUR",
    "contactBeforeVisit": true
  },
  "contentStatus": "reference-demo"
};
