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
  "name": "IS AUTO Varna",
  "locale": "bg-BG",
  "logo": {
    "light": "/dealer-brand/logo-on-light-20260919.webp",
    "footer": "/dealer-brand/logo-on-dark-20260919.webp",
    "archivedDark": "/dealer-brand/logo-on-dark-20260919.webp",
    "alt": "IS AUTO Varna",
    "favicon": "/dealer-brand/logo-on-light-20260919.webp",
    "monochromeOnDark": false
  },
  "contacts": {
    "phone": "+359899266666",
    "email": "varna@isauto.net"
  },
  "hero": {
    "desktopImage": "/assets/imgs/hero/hero-3/dealership-desktop.webp",
    "imageAlt": "Illustrative silver car outside a modern showroom"
  },
  "locations": [
    {
      "name": "IS AUTO Varna",
      "address": "Бизнес парк Варна, сграда B6, Варна, България",
      "country": "България",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=IS%20AUTO%20Varna%2C%20%D0%91%D0%B8%D0%B7%D0%BD%D0%B5%D1%81%20%D0%BF%D0%B0%D1%80%D0%BA%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D1%81%D0%B3%D1%80%D0%B0%D0%B4%D0%B0%20B6%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F",
      "phone": "0899 266 666",
      "phoneHref": "tel:+359899266666",
      "email": "varna@isauto.net",
      "emailHref": "mailto:varna@isauto.net"
    }
  ],
  "inventory": {},
  "copy": {
    "home.hero": "IS AUTO Varna",
    "home.hero.mobile": "Find your next car.",
    "home.brandsIntro": "Explore our dated vehicle examples.",
    "contact.agents": "Contact the dealership",
    "contact.hours": "Понеделник–петък 09:00–18:00; събота 10:00–16:00; неделя почивен ден",
    "inventory.notice": "Датирана извадка от публичните обяви към 16.09.2026 г.; потвърдете цената и наличността директно с IS AUTO Varna."
  },
  "businessPreview": {
    "mode": "dated-listing-snapshot",
    "observedAt": "2026-09-16",
    "inventoryCount": 6,
    "city": "Варна",
    "countryCode": "BG",
    "currency": "EUR",
    "contactBeforeVisit": true
  },
  "contentStatus": "reference-demo"
};
