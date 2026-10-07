import referenceLocations from "./reference-locations.json";
/** Sample cards preserve reference artwork and copy. They are not dealer stock. */
export interface VehicleCardContent {
  sample: boolean;
  image: string;
  imageAlt: string;
  href: string;
  title: string;
  location: string;
  mileage: string;
  transmission: string;
  fuel: string;
  seats: string;
  price: string;
  pricePeriod: string;
  action: string;
  rating: string;
  reviews: string;
}
export interface DealerContent {
  name: string;
  locale: string;
  logo: { light: string; footer: string; archivedDark: string; alt: string };
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
  copy: Readonly<Record<string, string>>;
  reviewedAccent?: {
    base: string;
    hover: string;
    contrast: string;
    soft: string;
  };
  contentStatus: "reference-demo" | "owner-reviewed";
}
export const dealer: DealerContent = {
  name: "Karento",
  locale: "en",
  logo: {
    light: "/assets/imgs/template/logo-d.svg",
    footer: "/assets/imgs/template/logo-w.svg",
    archivedDark: "/assets/imgs/template/logo-w.svg",
    alt: "Carento",
  },
  contacts: { phone: "+1 222-555-33-99", email: "support@carento.com" },
  locations: referenceLocations,
  inventory: {},
  copy: {},
  contentStatus: "reference-demo",
};
