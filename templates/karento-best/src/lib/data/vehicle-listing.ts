import type { PlainMessageKey } from "#lib/i18n/text.ts";
import type { VehicleCardContent } from "#lib/content.ts";

/** Reference listings preserve the approved sample presentation; they are not dealer stock. */
export interface ListingVehicle extends VehicleCardContent {
  id: string;
}
export interface ListingFilterChoice {
  labelKey?: PlainMessageKey;
  label: string;
  count: string;
}
export interface ListingBrand {
  readonly id: string;
  readonly light: string;
  readonly dark: string;
}
export interface RentalRow {
  listingHighlights?: VehicleCardContent["listingHighlights"];
  reviewCount?: number;
  baggageCount?: number;
  bodyKey?: PlainMessageKey;
  fuelType?: VehicleCardContent["fuelType"];
  transmissionType?: VehicleCardContent["transmissionType"];
  seatsCount?: number;
  id: string;
  image: string;
  imageAlt: string;
  href: string;
  title: string;
  titleLabel: string;
  location: string;
  sale: string;
  rating: string;
  reviews: string;
  mileage: string;
  transmission: string;
  baggage: string;
  fuel: string;
  seats: string;
  body: string;
  price: string;
  pricePeriod: string;
  action: string;
}
export interface ListingProduct {
  reviewsKey?: PlainMessageKey;
  actionKey?: PlainMessageKey;
  featureKeys?: readonly [
    PlainMessageKey | null,
    PlainMessageKey | null,
    PlainMessageKey | null,
  ];
  id: string;
  image: string;
  imageAlt: string;
  href: string;
  title: string;
  titleLabel: string;
  rating: string;
  reviews: string;
  features: readonly [string, string, string];
  originalPrice: string;
  price: string;
  action: string;
}

const vehicleDefaults = {
  sample: true,
  imageAlt: "Carento",
  href: "/vehicle",
  location: "New South Wales, Australia",
  mileage: "25,100 miles",
  transmission: "Automatic",
  transmissionType: "automatic",
  fuel: "Diesel",
  fuelType: "diesel",
  seats: "7 seats",
  seatsCount: 7,
  pricePeriod: "/ day",
  pricePeriodKey: "pricing.day",
  action: "Book Now",
  actionKey: "action.book",
  reviews: "(672 reviews)",
  reviewCount: 672,
  rating: "4.96 ",
} satisfies Pick<
  ListingVehicle,
  | "reviewCount"
  | "transmissionType"
  | "fuelType"
  | "seatsCount"
  | "actionKey"
  | "pricePeriodKey"
  | "sample"
  | "imageAlt"
  | "href"
  | "location"
  | "mileage"
  | "transmission"
  | "fuel"
  | "seats"
  | "pricePeriod"
  | "action"
  | "reviews"
  | "rating"
>;
function vehicle(
  card: Omit<ListingVehicle, keyof typeof vehicleDefaults>,
): ListingVehicle {
  return { ...vehicleDefaults, ...card };
}

export const vehicleListings = {
  // Illustrative reseller highlights belong to these sample inputs, not card defaults.
  gridFourColumns: [
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-6.png:Hyundai Sonata SEL Plus",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-6.png",
      title: "Hyundai Sonata SEL Plus",
      price: "$72.15",
      listingHighlights: ["new-import"],
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-5.png:Buick Enclave Avenir",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-5.png",
      title: "Buick Enclave Avenir",
      price: "$69.56",
      listingHighlights: ["registered"],
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-4.png:Chevrolet Silverado",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-4.png",
      title: "Chevrolet Silverado",
      price: "$253.0",
      listingHighlights: ["registered", "serviced"],
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-3.png:Subaru Outback Limited XT",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-3.png",
      title: "Subaru Outback Limited XT",
      price: "$75.86",
      listingHighlights: ["new-import", "registered"],
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-2.png:Jeep Wrangler",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-2.png",
      title: "Jeep Wrangler",
      price: "$160.8",
      listingHighlights: ["new-import"],
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-16.png:Kia Telluride SX",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-16.png",
      title: "Kia Telluride SX",
      price: "$98.65",
      listingHighlights: ["registered"],
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-17.png:Mini Cooper S Hardtop 2 Door",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-17.png",
      title: "Mini Cooper S Hardtop 2 Door",
      price: "$84.5",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-8.png:Subaru Impreza WRX STI",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-8.png",
      title: "Subaru Impreza WRX STI",
      price: "$130.2",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-7.png:Audi Q5 2.0T Premium Plus",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-7.png",
      title: "Audi Q5 2.0T Premium Plus",
      price: "$150.6",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-13.png:GMC Sierra 2500HD Denali",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-13.png",
      title: "GMC Sierra 2500HD Denali",
      price: "$98.67",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-12.png:Ford Mustang GT Premium",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-12.png",
      title: "Ford Mustang GT Premium",
      price: "$89.32",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-11.png:Mazda MX-5 Miata Club",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-11.png",
      title: "Mazda MX-5 Miata Club",
      price: "$89.56",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-11.png:Subaru Impreza WRX STI",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-11.png",
      title: "Subaru Impreza WRX STI",
      price: "$658.0",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-18.png:Porsche 911 Carrera S",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-18.png",
      title: "Porsche 911 Carrera S",
      price: "$125.0",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-19.png:Subaru Outback Limited XT",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-19.png",
      title: "Subaru Outback Limited XT",
      price: "$75.86",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-20.png:Toyota Camry LE Hybrid",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-20.png",
      title: "Toyota Camry LE Hybrid",
      price: "$32.47",
    }),
  ],
  dealerRecommendations: [
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-6.png:Hyundai Sonata SEL Plus",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-6.png",
      title: "Hyundai Sonata SEL Plus",
      price: "$72.15",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-5.png:Buick Enclave Avenir",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-5.png",
      title: "Buick Enclave Avenir",
      price: "$69.56",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-4.png:Chevrolet Silverado",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-4.png",
      title: "Chevrolet Silverado",
      price: "$253.0",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-3.png:Subaru Outback Limited XT",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-3.png",
      title: "Subaru Outback Limited XT",
      price: "$75.86",
    }),
  ],
  gridThreeColumns: [
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-8/car-1.png:Hyundai Sonata SEL Plus",
      image: "/assets/imgs/cars-listing/cars-listing-8/car-1.png",
      title: "Hyundai Sonata SEL Plus",
      price: "$72.15",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-8/car-2.png:Buick Enclave Avenir",
      image: "/assets/imgs/cars-listing/cars-listing-8/car-2.png",
      title: "Buick Enclave Avenir",
      price: "$69.56",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-8/car-3.png:Chevrolet Silverado 1500 LTZ Crew Cab",
      image: "/assets/imgs/cars-listing/cars-listing-8/car-3.png",
      title: "Chevrolet Silverado 1500 LTZ Crew Cab",
      price: "$253.0",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-8/car-4.png:Subaru Outback Limited XT",
      image: "/assets/imgs/cars-listing/cars-listing-8/car-4.png",
      title: "Subaru Outback Limited XT",
      price: "$75.86",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-8/car-5.png:Jeep Wrangler",
      image: "/assets/imgs/cars-listing/cars-listing-8/car-5.png",
      title: "Jeep Wrangler",
      price: "$160.8",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-8/car-6.png:Kia Telluride SX",
      image: "/assets/imgs/cars-listing/cars-listing-8/car-6.png",
      title: "Kia Telluride SX",
      price: "$98.65",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-8/car-7.png:Mini Cooper S Hardtop 2 Door",
      image: "/assets/imgs/cars-listing/cars-listing-8/car-7.png",
      title: "Mini Cooper S Hardtop 2 Door",
      price: "$84.5",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-8/car-8.png:Subaru Impreza WRX STI",
      image: "/assets/imgs/cars-listing/cars-listing-8/car-8.png",
      title: "Subaru Impreza WRX STI",
      price: "$130.2",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-8/car-9.png:Audi Q5 2.0T Premium Plus",
      image: "/assets/imgs/cars-listing/cars-listing-8/car-9.png",
      title: "Audi Q5 2.0T Premium Plus",
      price: "$150.6",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-8/car-10.png:GMC Sierra 2500HD Denali",
      image: "/assets/imgs/cars-listing/cars-listing-8/car-10.png",
      title: "GMC Sierra 2500HD Denali",
      price: "$98.67",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-8/car-11.png:Ford Mustang GT Premium",
      image: "/assets/imgs/cars-listing/cars-listing-8/car-11.png",
      title: "Ford Mustang GT Premium",
      price: "$89.32",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-8/car-12.png:Mazda MX-5 Miata Club",
      image: "/assets/imgs/cars-listing/cars-listing-8/car-12.png",
      title: "Mazda MX-5 Miata Club",
      price: "$89.56",
    }),
  ],
  gridSidebar: [
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-1.png:GMC Sierra 2500HD Denali",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-1.png",
      title: "GMC Sierra 2500HD Denali",
      price: "$98.67",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-2.png:Ford Mustang GT Premium",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-2.png",
      title: "Ford Mustang GT Premium",
      price: "$89.32",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-3.png:Mazda MX-5 Miata Club",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-3.png",
      title: "Mazda MX-5 Miata Club",
      price: "$89.56",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-4.png:Subaru Impreza WRX STI",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-4.png",
      title: "Subaru Impreza WRX STI",
      price: "$658.0",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-5.png:Porsche 911 Carrera S",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-5.png",
      title: "Porsche 911 Carrera S",
      price: "$125.0",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-6.png:Toyota Camry LE Hybrid",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-6.png",
      title: "Toyota Camry LE Hybrid",
      price: "$32.47",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-7.png:Hyundai Sonata SEL Plus",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-7.png",
      title: "Hyundai Sonata SEL Plus",
      price: "$72.15",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-8.png:Buick Enclave Avenir",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-8.png",
      title: "Buick Enclave Avenir",
      price: "$69.56",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-9.png:Chevrolet Silverado",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-9.png",
      title: "Chevrolet Silverado",
      price: "$253.0",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-10.png:Subaru Outback Limited XT",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-10.png",
      title: "Subaru Outback Limited XT",
      price: "$75.86",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-11.png:Jeep Wrangler Rubicon Unlimited",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-11.png",
      title: "Jeep Wrangler Rubicon Unlimited",
      price: "$160.8",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-12.png:Kia Telluride SX",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-12.png",
      title: "Kia Telluride SX",
      price: "$98.65",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-13.png:Mini Cooper S Hardtop 2 Door",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-13.png",
      title: "Mini Cooper S Hardtop 2 Door",
      price: "$84.5",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-14.png:Subaru Impreza WRX STI",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-14.png",
      title: "Subaru Impreza WRX STI",
      price: "$130.2",
    }),
    vehicle({
      id: "/assets/imgs/cars-listing/cars-listing-6/car-15.png:Audi Q5 2.0T Premium Plus",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-15.png",
      title: "Audi Q5 2.0T Premium Plus",
      price: "$150.6",
    }),
  ],
} satisfies Record<string, readonly ListingVehicle[]>;

export const rentalRows = [
  {
    id: "/assets/imgs/cars-listing/cars-listing-9/car-list.png",
    image: "/assets/imgs/cars-listing/cars-listing-9/car-list.png",
    imageAlt: "Carento",
    href: "/vehicle",
    title: "Mini Cooper S Hardtop 2 Door",
    titleLabel: "Mini Cooper S Hardtop 2 Door",
    location: "Manchester, England",
    sale: "-25%",
    rating: "4.96 ",
    reviews: "(672 reviews)",
    reviewCount: 672,
    mileage: "Unlimited mileage",
    transmission: "Automatic",
    transmissionType: "automatic",
    baggage: "3 Large bags",
    baggageCount: 3,
    fuel: "Diesel",
    fuelType: "diesel",
    seats: "7 seats",
    seatsCount: 7,
    body: "SUVs",
    bodyKey: "reference.listing.filter.suv",
    price: "$202.87",
    pricePeriod: "/ night",
    action: "Book Now",
  },
  {
    id: "/assets/imgs/cars-listing/cars-listing-9/car-list2.png",
    image: "/assets/imgs/cars-listing/cars-listing-9/car-list2.png",
    imageAlt: "Carento",
    href: "/vehicle",
    title: "Volvo XC90 T6 Inscription",
    titleLabel: "Volvo XC90 T6 Inscription",
    location: "Manchester, England",
    sale: "-25%",
    rating: "4.96 ",
    reviews: "(672 reviews)",
    reviewCount: 672,
    mileage: "Unlimited mileage",
    transmission: "Automatic",
    transmissionType: "automatic",
    baggage: "3 Large bags",
    baggageCount: 3,
    fuel: "Diesel",
    fuelType: "diesel",
    seats: "7 seats",
    seatsCount: 7,
    body: "SUVs",
    bodyKey: "reference.listing.filter.suv",
    price: "$778.35",
    pricePeriod: "/ night",
    action: "Book Now",
  },
  {
    id: "/assets/imgs/cars-listing/cars-listing-9/car-list3.png",
    image: "/assets/imgs/cars-listing/cars-listing-9/car-list3.png",
    imageAlt: "Carento",
    href: "/vehicle",
    title: "Cadillac Escalade ESV Premium Luxury",
    titleLabel: "Cadillac Escalade ESV Premium Luxury",
    location: "Manchester, England",
    sale: "-25%",
    rating: "4.96 ",
    reviews: "(672 reviews)",
    reviewCount: 672,
    mileage: "Unlimited mileage",
    transmission: "Automatic",
    transmissionType: "automatic",
    baggage: "3 Large bags",
    baggageCount: 3,
    fuel: "Diesel",
    fuelType: "diesel",
    seats: "7 seats",
    seatsCount: 7,
    body: "SUVs",
    bodyKey: "reference.listing.filter.suv",
    price: "$779.58",
    pricePeriod: "/ night",
    action: "Book Now",
  },
  {
    id: "/assets/imgs/cars-listing/cars-listing-9/car-list4.png",
    image: "/assets/imgs/cars-listing/cars-listing-9/car-list4.png",
    imageAlt: "Carento",
    href: "/vehicle",
    title: "Honda Civic Si Coupe",
    titleLabel: "Honda Civic Si Coupe",
    location: "Manchester, England",
    sale: "-25%",
    rating: "4.96 ",
    reviews: "(672 reviews)",
    reviewCount: 672,
    mileage: "Unlimited mileage",
    transmission: "Automatic",
    transmissionType: "automatic",
    baggage: "3 Large bags",
    baggageCount: 3,
    fuel: "Diesel",
    fuelType: "diesel",
    seats: "7 seats",
    seatsCount: 7,
    body: "SUVs",
    bodyKey: "reference.listing.filter.suv",
    price: "$601.13",
    pricePeriod: "/ night",
    action: "Book Now",
  },
  {
    id: "/assets/imgs/cars-listing/cars-listing-9/car-list5.png",
    image: "/assets/imgs/cars-listing/cars-listing-9/car-list5.png",
    imageAlt: "Carento",
    href: "/vehicle",
    title: "Kia Telluride SX",
    titleLabel: "Kia Telluride SX",
    location: "Manchester, England",
    sale: "-25%",
    rating: "4.96 ",
    reviews: "(672 reviews)",
    reviewCount: 672,
    mileage: "Unlimited mileage",
    transmission: "Automatic",
    transmissionType: "automatic",
    baggage: "3 Large bags",
    baggageCount: 3,
    fuel: "Diesel",
    fuelType: "diesel",
    seats: "7 seats",
    seatsCount: 7,
    body: "SUVs",
    bodyKey: "reference.listing.filter.suv",
    price: "$450.54",
    pricePeriod: "/ night",
    action: "Book Now",
  },
  {
    id: "/assets/imgs/cars-listing/cars-listing-9/car-list6.png",
    image: "/assets/imgs/cars-listing/cars-listing-9/car-list6.png",
    imageAlt: "Carento",
    href: "/vehicle",
    title: "Land Rover Range Rover Velar P250 S",
    titleLabel: "Land Rover Range Rover Velar P250 S",
    location: "Manchester, England",
    sale: "-25%",
    rating: "4.96 ",
    reviews: "(672 reviews)",
    reviewCount: 672,
    mileage: "Unlimited mileage",
    transmission: "Automatic",
    transmissionType: "automatic",
    baggage: "3 Large bags",
    baggageCount: 3,
    fuel: "Diesel",
    fuelType: "diesel",
    seats: "7 seats",
    seatsCount: 7,
    body: "SUVs",
    bodyKey: "reference.listing.filter.suv",
    price: "$928.41",
    pricePeriod: "/ night",
    action: "Book Now",
  },
] satisfies readonly RentalRow[];
export const listingProducts = [
  {
    id: "/assets/imgs/shop/shop-list/product1.png",
    image: "/assets/imgs/shop/shop-list/product1.png",
    imageAlt: "Carento",
    href: "/shop/product",
    title: "Mobil 1 Extended Performance Full Synthetic Motor Oil",
    titleLabel:
      "Mobil 1 Extended\n                                                    Performance Full Synthetic Motor Oil",
    rating: "4.9 5 ",
    reviews: "(672 reviews)",
    reviewsKey: "reference.shop.reviewCount",
    features: [
      "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend",
      "Confident driving in all weather conditions",
      "Visual Alignment Indicators",
    ],
    featureKeys: [
      null,
      "reference.shop.feature.weather",
      "reference.shop.feature.alignment",
    ],
    originalPrice: "$68.53",
    price: "$98.67",
    action: "Buy Now",
    actionKey: "reference.shop.buy",
  },
  {
    id: "/assets/imgs/shop/shop-list/product2.png",
    image: "/assets/imgs/shop/shop-list/product2.png",
    imageAlt: "Carento",
    href: "/shop/product",
    title: "Thinkware F770 Dash Cam Dual Channel Wifi",
    titleLabel:
      "Thinkware F770\n                                                    Dash Cam Dual Channel Wifi",
    rating: "4.9 5 ",
    reviews: "(672 reviews)",
    reviewsKey: "reference.shop.reviewCount",
    features: [
      "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend",
      "Confident driving in all weather conditions",
      "Visual Alignment Indicators",
    ],
    featureKeys: [
      null,
      "reference.shop.feature.weather",
      "reference.shop.feature.alignment",
    ],
    originalPrice: "$68.53",
    price: "$98.67",
    action: "Buy Now",
    actionKey: "reference.shop.buy",
  },
  {
    id: "/assets/imgs/shop/shop-list/product3.png",
    image: "/assets/imgs/shop/shop-list/product3.png",
    imageAlt: "Carento",
    href: "/shop/product",
    title: "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend",
    titleLabel:
      "Mobil Delvac\n                                                    1300 Super Heavy Duty Synthetic Blend",
    rating: "4.9 5 ",
    reviews: "(672 reviews)",
    reviewsKey: "reference.shop.reviewCount",
    features: [
      "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend",
      "Confident driving in all weather conditions",
      "Visual Alignment Indicators",
    ],
    featureKeys: [
      null,
      "reference.shop.feature.weather",
      "reference.shop.feature.alignment",
    ],
    originalPrice: "$68.53",
    price: "$98.67",
    action: "Buy Now",
    actionKey: "reference.shop.buy",
  },
  {
    id: "/assets/imgs/shop/shop-list/product4.png",
    image: "/assets/imgs/shop/shop-list/product4.png",
    imageAlt: "Carento",
    href: "/shop/product",
    title: "Spyder® – Projector Headlight Misubisi 2024",
    titleLabel:
      "Spyder® –\n                                                    Projector Headlight Misubisi 2024",
    rating: "4.9 5 ",
    reviews: "(672 reviews)",
    reviewsKey: "reference.shop.reviewCount",
    features: [
      "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend",
      "Confident driving in all weather conditions",
      "Visual Alignment Indicators",
    ],
    featureKeys: [
      null,
      "reference.shop.feature.weather",
      "reference.shop.feature.alignment",
    ],
    originalPrice: "$68.53",
    price: "$98.67",
    action: "Buy Now",
    actionKey: "reference.shop.buy",
  },
  {
    id: "/assets/imgs/shop/shop-list/product5.png",
    image: "/assets/imgs/shop/shop-list/product5.png",
    imageAlt: "Carento",
    href: "/shop/product",
    title: "HRE FlowForm® – FT01 Tarma Honda 2024",
    titleLabel:
      "HRE FlowForm® –\n                                                    FT01 Tarma Honda 2024",
    rating: "4.9 5 ",
    reviews: "(672 reviews)",
    reviewsKey: "reference.shop.reviewCount",
    features: [
      "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend",
      "Confident driving in all weather conditions",
      "Visual Alignment Indicators",
    ],
    featureKeys: [
      null,
      "reference.shop.feature.weather",
      "reference.shop.feature.alignment",
    ],
    originalPrice: "$68.53",
    price: "$98.67",
    action: "Buy Now",
    actionKey: "reference.shop.buy",
  },
  {
    id: "/assets/imgs/shop/shop-list/product6.png",
    image: "/assets/imgs/shop/shop-list/product6.png",
    imageAlt: "Carento",
    href: "/shop/product",
    title: "Right Stuff® – Drilled and Slotted Brake Rotor",
    titleLabel:
      "Right Stuff® –\n                                                    Drilled and Slotted Brake Rotor",
    rating: "4.9 5 ",
    reviews: "(672 reviews)",
    reviewsKey: "reference.shop.reviewCount",
    features: [
      "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend",
      "Confident driving in all weather conditions",
      "Visual Alignment Indicators",
    ],
    featureKeys: [
      null,
      "reference.shop.feature.weather",
      "reference.shop.feature.alignment",
    ],
    originalPrice: "$68.53",
    price: "$98.67",
    action: "Buy Now",
    actionKey: "reference.shop.buy",
  },
  {
    id: "/assets/imgs/shop/shop-list/product7.png",
    image: "/assets/imgs/shop/shop-list/product7.png",
    imageAlt: "Carento",
    href: "/shop/product",
    title: "PIRELLI TIRES® – P4 FOUR SEASONS PLUS",
    titleLabel:
      "PIRELLI TIRES® –\n                                                    P4 FOUR SEASONS PLUS",
    rating: "4.9 5 ",
    reviews: "(672 reviews)",
    reviewsKey: "reference.shop.reviewCount",
    features: [
      "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend",
      "Confident driving in all weather conditions",
      "Visual Alignment Indicators",
    ],
    featureKeys: [
      null,
      "reference.shop.feature.weather",
      "reference.shop.feature.alignment",
    ],
    originalPrice: "$68.53",
    price: "$98.67",
    action: "Buy Now",
    actionKey: "reference.shop.buy",
  },
  {
    id: "/assets/imgs/shop/shop-list/product8.png",
    image: "/assets/imgs/shop/shop-list/product8.png",
    imageAlt: "Carento",
    href: "/shop/product",
    title: "Lumen® – Custom Sealed Beam LED Headlights",
    titleLabel:
      "Lumen® – Custom\n                                                    Sealed Beam LED Headlights",
    rating: "4.9 5 ",
    reviews: "(672 reviews)",
    reviewsKey: "reference.shop.reviewCount",
    features: [
      "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend",
      "Confident driving in all weather conditions",
      "Visual Alignment Indicators",
    ],
    featureKeys: [
      null,
      "reference.shop.feature.weather",
      "reference.shop.feature.alignment",
    ],
    originalPrice: "$68.53",
    price: "$98.67",
    action: "Buy Now",
    actionKey: "reference.shop.buy",
  },
  {
    id: "/assets/imgs/shop/shop-list/product9.png",
    image: "/assets/imgs/shop/shop-list/product9.png",
    imageAlt: "Carento",
    href: "/shop/product",
    title: "Shell Rotella T1 SAE 30 Conventional Heavy Duty",
    titleLabel:
      "Shell Rotella T1\n                                                    SAE 30 Conventional Heavy Duty",
    rating: "4.9 5 ",
    reviews: "(672 reviews)",
    reviewsKey: "reference.shop.reviewCount",
    features: [
      "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend",
      "Confident driving in all weather conditions",
      "Visual Alignment Indicators",
    ],
    featureKeys: [
      null,
      "reference.shop.feature.weather",
      "reference.shop.feature.alignment",
    ],
    originalPrice: "$68.53",
    price: "$98.67",
    action: "Buy Now",
    actionKey: "reference.shop.buy",
  },
  {
    id: "/assets/imgs/shop/shop-list/product10.png",
    image: "/assets/imgs/shop/shop-list/product10.png",
    imageAlt: "Carento",
    href: "/shop/product",
    title: "R1 Concepts® – eLINE Series Plain Brake Rotors",
    titleLabel:
      "R1 Concepts® –\n                                                    eLINE Series Plain Brake Rotors",
    rating: "4.9 5 ",
    reviews: "(672 reviews)",
    reviewsKey: "reference.shop.reviewCount",
    features: [
      "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend",
      "Confident driving in all weather conditions",
      "Visual Alignment Indicators",
    ],
    featureKeys: [
      null,
      "reference.shop.feature.weather",
      "reference.shop.feature.alignment",
    ],
    originalPrice: "$68.53",
    price: "$98.67",
    action: "Buy Now",
    actionKey: "reference.shop.buy",
  },
  {
    id: "/assets/imgs/shop/shop-list/product11.png",
    image: "/assets/imgs/shop/shop-list/product11.png",
    imageAlt: "Carento",
    href: "/shop/product",
    title: "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend",
    titleLabel:
      "Mobil Delvac\n                                                    1300 Super Heavy Duty Synthetic Blend",
    rating: "4.9 5 ",
    reviews: "(672 reviews)",
    reviewsKey: "reference.shop.reviewCount",
    features: [
      "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend",
      "Confident driving in all weather conditions",
      "Visual Alignment Indicators",
    ],
    featureKeys: [
      null,
      "reference.shop.feature.weather",
      "reference.shop.feature.alignment",
    ],
    originalPrice: "$68.53",
    price: "$98.67",
    action: "Buy Now",
    actionKey: "reference.shop.buy",
  },
  {
    id: "/assets/imgs/shop/shop-list/product12.png",
    image: "/assets/imgs/shop/shop-list/product12.png",
    imageAlt: "Carento",
    href: "/shop/product",
    title: "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend",
    titleLabel:
      "Mobil Delvac\n                                                    1300 Super Heavy Duty Synthetic Blend",
    rating: "4.9 5 ",
    reviews: "(672 reviews)",
    reviewsKey: "reference.shop.reviewCount",
    features: [
      "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend",
      "Confident driving in all weather conditions",
      "Visual Alignment Indicators",
    ],
    featureKeys: [
      null,
      "reference.shop.feature.weather",
      "reference.shop.feature.alignment",
    ],
    originalPrice: "$68.53",
    price: "$98.67",
    action: "Buy Now",
    actionKey: "reference.shop.buy",
  },
] satisfies readonly ListingProduct[];
export const listingFilterChoices = {
  "Car type": [
    {
      label: "All ",
      labelKey: "reference.listing.filter.all",
      count: "198",
    },
    {
      label: "Sedans",
      labelKey: "reference.listing.filter.sedans",
      count: "32",
    },
    {
      label: "SUVs ",
      labelKey: "reference.listing.filter.suv",
      count: "13",
    },
    {
      label: "Coupes",
      labelKey: "reference.listing.filter.coupes",
      count: "23",
    },
    {
      label: "Hatchbacks",
      labelKey: "reference.listing.filter.hatchbacks",
      count: "35",
    },
    {
      label: "Convertibles",
      labelKey: "reference.listing.filter.convertibles",
      count: "56",
    },
    {
      label: "Trucks",
      labelKey: "reference.listing.filter.trucks",
      count: "76",
    },
  ],
  "Car Amenities": [
    {
      label: "All",
      labelKey: "reference.listing.filter.all",
      count: "32",
    },
    {
      label: "Leather upholstery",
      labelKey: "reference.listing.filter.leather",
      count: "13",
    },
    {
      label: "Heated seats",
      labelKey: "reference.listing.filter.heatedSeats",
      count: "23",
    },
    {
      label: "Sunroof/Moonroof",
      labelKey: "reference.listing.filter.sunroof",
      count: "23",
    },
    {
      label: "Keyless entry/start",
      labelKey: "reference.listing.filter.keyless",
      count: "35",
    },
    {
      label: "Heads-up display",
      labelKey: "reference.listing.filter.headup",
      count: "56",
    },
    {
      label: "Adaptive cruise control",
      labelKey: "reference.listing.filter.adaptiveCruise",
      count: "76",
    },
  ],
  "Fuel Type": [
    {
      label: "All",
      labelKey: "reference.listing.filter.all",
      count: "32",
    },
    {
      label: "Plug-in Hybrid (PHEV)",
      labelKey: "reference.listing.filter.phev",
      count: "13",
    },
    {
      label: "Hybrid (HEV)",
      labelKey: "reference.listing.filter.hev",
      count: "23",
    },
    {
      label: "Electric Vehicle (EV)",
      labelKey: "reference.listing.filter.ev",
      count: "23",
    },
    {
      label: "Diesel",
      labelKey: "reference.listing.filter.diesel",
      count: "35",
    },
    {
      label: "Gasoline/Petrol",
      labelKey: "reference.listing.filter.petrol",
      count: "56",
    },
    {
      label: "Hydrogen",
      labelKey: "reference.listing.filter.hydrogen",
      count: "76",
    },
  ],
  "Booking Location": [
    {
      label: "Maldives Haven",
      count: "198",
    },
    {
      label: "Santorini Retreat",
      count: "32",
    },
    {
      label: "Parisian Plaza",
      count: "13",
    },
    {
      label: "Tokyo Tower View",
      count: "23",
    },
    {
      label: "Caribbean Cove",
      count: "35",
    },
    {
      label: "Swiss Alps Lodge",
      count: "56",
    },
    {
      label: "New York Cityscape",
      count: "76",
    },
    {
      label: "Dubai Oasis",
      count: "76",
    },
    {
      label: "Barcelona Beachfront",
      count: "76",
    },
    {
      label: "London Luxe",
      count: "76",
    },
  ],
  Categories: [
    {
      label: "Accessories",
      labelKey: "reference.listing.filter.accessories",
      count: "198",
    },
    {
      label: "Automotive Rims",
      labelKey: "reference.listing.filter.rims",
      count: "32",
    },
    {
      label: "Brakes",
      labelKey: "reference.listing.filter.brakes",
      count: "13",
    },
    {
      label: "Detailing",
      labelKey: "reference.listing.filter.detailing",
      count: "23",
    },
    {
      label: "Headlight",
      labelKey: "reference.listing.filter.headlight",
      count: "35",
    },
    {
      label: "Tires & Wheels",
      labelKey: "reference.listing.filter.tires",
      count: "56",
    },
    {
      label: "Auto Safety & Security ",
      labelKey: "reference.listing.filter.safety",
      count: "76",
    },
  ],
  Brands: [
    {
      label: "All",
      labelKey: "reference.listing.filter.all",
      count: "32",
    },
    {
      label: "Honda",
      count: "13",
    },
    {
      label: "Hyundai",
      count: "23",
    },
    {
      label: "Jaguar",
      count: "23",
    },
    {
      label: "Lexus",
      count: "35",
    },
    {
      label: "Lotus",
      count: "56",
    },
    {
      label: "Toyota",
      count: "76",
    },
  ],
} satisfies Record<string, readonly ListingFilterChoice[]>;
export const listingBrands = [
  {
    id: "lexus",
    light: "/assets/imgs/page/homepage2/lexus.png",
    dark: "/assets/imgs/page/homepage2/lexus-w.png",
  },
  {
    id: "mer",
    light: "/assets/imgs/page/homepage2/mer.png",
    dark: "/assets/imgs/page/homepage2/mer-w.png",
  },
  {
    id: "bugatti",
    light: "/assets/imgs/page/homepage2/bugatti.png",
    dark: "/assets/imgs/page/homepage2/bugatti-w.png",
  },
  {
    id: "jaguar",
    light: "/assets/imgs/page/homepage2/jaguar.png",
    dark: "/assets/imgs/page/homepage2/jaguar-w.png",
  },
  {
    id: "honda",
    light: "/assets/imgs/page/homepage2/honda.png",
    dark: "/assets/imgs/page/homepage2/honda-w.png",
  },
  {
    id: "chevrolet",
    light: "/assets/imgs/page/homepage2/chevrolet.png",
    dark: "/assets/imgs/page/homepage2/chevrolet-w.png",
  },
  {
    id: "acura",
    light: "/assets/imgs/page/homepage2/acura.png",
    dark: "/assets/imgs/page/homepage2/acura-w.png",
  },
  {
    id: "bmw",
    light: "/assets/imgs/page/homepage2/bmw.png",
    dark: "/assets/imgs/page/homepage2/bmw-w.png",
  },
  {
    id: "toyota",
    light: "/assets/imgs/page/homepage2/toyota.png",
    dark: "/assets/imgs/page/homepage2/toyota-w.png",
  },
  {
    id: "lexus-repeat",
    light: "/assets/imgs/page/homepage2/lexus.png",
    dark: "/assets/imgs/page/homepage2/lexus-w.png",
  },
  {
    id: "mer-repeat",
    light: "/assets/imgs/page/homepage2/mer.png",
    dark: "/assets/imgs/page/homepage2/mer-w.png",
  },
  {
    id: "bugatti-repeat",
    light: "/assets/imgs/page/homepage2/bugatti.png",
    dark: "/assets/imgs/page/homepage2/bugatti-w.png",
  },
] as const satisfies readonly ListingBrand[];
