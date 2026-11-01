import { message, type CatalogText } from "#lib/i18n/text.ts";
import type { ListingVehicle } from "#lib/data/vehicle-listing.ts";
/** Preserved reference-only editorial, team and source examples. */
export type NewsCategory = keyof typeof newsCategoryLabels;

export interface NewsGridItem {
  readonly id: string;
  readonly image: string;
  readonly category: NewsCategory;
  readonly categoryLabel: CatalogText;
  readonly title: CatalogText;
  readonly titleLabel: CatalogText;
  readonly avatar: string;
  readonly author: string;
}

export interface NewsListItem {
  readonly id: string;
  readonly image: string;
  readonly category: string;
  readonly categoryLabel: CatalogText;
  readonly categoryClass: string;
  readonly title: CatalogText;
  readonly titleLabel: CatalogText;
}

export interface ImportSourceItem {
  readonly id: string;
  readonly image: string;
  readonly name: string;
  readonly nameLabel: string;
  readonly address: string;
  /** Supplied ISO country code; never inferred from the vehicle brand. */
  readonly countryCode?: string;
  readonly sample?: boolean;
  readonly mapUrl?: string;
  readonly vehicles?: readonly ListingVehicle[];
}

export interface AgentItem {
  readonly id: string;
  readonly image: string;
  readonly name: string;
  readonly role: CatalogText;
  readonly cardClass: string;
}

export const newsCategoryLabels = {
  "Car Review": message("editorial.category.carReview"),
  "Travel Tips": message("editorial.category.travelTips"),
  "Industry News": message("editorial.category.industryNews"),
  "Car Updates": message("editorial.category.carUpdates"),
  "Rental Advice": message("editorial.category.rentalAdvice"),
  "Road Trips": message("editorial.category.roadTrips"),
  Discovery: message("editorial.category.discovery"),
  "Customer Stories": message("editorial.category.customerStories"),
  Adventure: message("editorial.category.adventure"),
  Luxury: message("editorial.category.luxury"),
  Wanderlust: message("editorial.category.wanderlust"),
  Heritage: message("editorial.category.heritage"),
} as const;

export const referenceEditorialMetadata = {
  date: "2024-09-18",
  minutes: 6,
  comments: 38,
} as const;

export const newsGrid = [
  {
    id: "newsGrid-1",
    image: "/assets/imgs/blog/blog-grid/img-3.png",
    category: "Car Review",
    categoryLabel: newsCategoryLabels["Car Review"],
    title: message("editorial.title.deliveryRideShareGrowth"),
    titleLabel: message("editorial.title.deliveryRideShareGrowth"),
    avatar: "/assets/imgs/blog/blog-grid/avatar1.png",
    author: "Demo editorial",
  },
  {
    id: "newsGrid-2",
    image: "/assets/imgs/blog/blog-grid/img-4.png",
    category: "Travel Tips",
    categoryLabel: newsCategoryLabels["Travel Tips"],
    title: message("editorial.title.deliveryRideShareGrowth"),
    titleLabel: message("editorial.title.deliveryRideShareGrowth"),
    avatar: "/assets/imgs/blog/blog-grid/avatar2.png",
    author: "Demo editorial",
  },
  {
    id: "newsGrid-3",
    image: "/assets/imgs/blog/blog-grid/img-5.png",
    category: "Industry News",
    categoryLabel: newsCategoryLabels["Industry News"],
    title: message("editorial.title.deliveryRideShareGrowth"),
    titleLabel: message("editorial.title.deliveryRideShareGrowth"),
    avatar: "/assets/imgs/blog/blog-grid/avatar3.png",
    author: "Demo editorial",
  },
  {
    id: "newsGrid-4",
    image: "/assets/imgs/blog/blog-grid/img-6.png",
    category: "Car Updates",
    categoryLabel: newsCategoryLabels["Car Updates"],
    title: message("editorial.title.deliveryRideShareGrowth"),
    titleLabel: message("editorial.title.deliveryRideShareGrowth"),
    avatar: "/assets/imgs/blog/blog-grid/avatar4.png",
    author: "Demo editorial",
  },
  {
    id: "newsGrid-5",
    image: "/assets/imgs/blog/blog-grid/img-7.png",
    category: "Rental Advice",
    categoryLabel: newsCategoryLabels["Rental Advice"],
    title: message("editorial.title.budgetTravelHacks"),
    titleLabel: message("editorial.title.budgetTravelHacks"),
    avatar: "/assets/imgs/blog/blog-grid/avatar5.png",
    author: "Demo editorial",
  },
  {
    id: "newsGrid-6",
    image: "/assets/imgs/blog/blog-grid/img-8.png",
    category: "Road Trips",
    categoryLabel: newsCategoryLabels["Road Trips"],
    title: message("editorial.title.budgetTravelHacks"),
    titleLabel: message("editorial.title.budgetTravelHacks"),
    avatar: "/assets/imgs/blog/blog-grid/avatar6.png",
    author: "Demo editorial",
  },
  {
    id: "newsGrid-7",
    image: "/assets/imgs/blog/blog-grid/img-9.png",
    category: "Car Review",
    categoryLabel: newsCategoryLabels["Car Review"],
    title: message("editorial.title.budgetTravelHacks"),
    titleLabel: message("editorial.title.budgetTravelHacks"),
    avatar: "/assets/imgs/blog/blog-grid/avatar7.png",
    author: "Demo editorial",
  },
  {
    id: "newsGrid-8",
    image: "/assets/imgs/blog/blog-grid/img-10.png",
    category: "Car Review",
    categoryLabel: newsCategoryLabels["Car Review"],
    title: message("editorial.title.budgetTravelHacks"),
    titleLabel: message("editorial.title.budgetTravelHacks"),
    avatar: "/assets/imgs/blog/blog-grid/avatar3.png",
    author: "Demo editorial",
  },
  {
    id: "newsGrid-9",
    image: "/assets/imgs/blog/blog-grid/img-11.png",
    category: "Discovery",
    categoryLabel: newsCategoryLabels["Discovery"],
    title: message("editorial.title.deliveryRideShareGrowth"),
    titleLabel: message("editorial.title.deliveryRideShareGrowth"),
    avatar: "/assets/imgs/blog/blog-grid/avatar5.png",
    author: "Demo editorial",
  },
  {
    id: "newsGrid-10",
    image: "/assets/imgs/blog/blog-grid/img-12.png",
    category: "Industry News",
    categoryLabel: newsCategoryLabels["Industry News"],
    title: message("editorial.title.deliveryRideShareGrowth"),
    titleLabel: message("editorial.title.deliveryRideShareGrowth"),
    avatar: "/assets/imgs/blog/blog-grid/avatar3.png",
    author: "Demo editorial",
  },
  {
    id: "newsGrid-11",
    image: "/assets/imgs/blog/blog-grid/img-13.png",
    category: "Industry News",
    categoryLabel: newsCategoryLabels["Industry News"],
    title: message("editorial.title.deliveryRideShareGrowth"),
    titleLabel: message("editorial.title.deliveryRideShareGrowth"),
    avatar: "/assets/imgs/blog/blog-grid/avatar2.png",
    author: "Demo editorial",
  },
  {
    id: "newsGrid-12",
    image: "/assets/imgs/blog/blog-grid/img-14.png",
    category: "Industry News",
    categoryLabel: newsCategoryLabels["Industry News"],
    title: message("editorial.title.deliveryRideShareGrowth"),
    titleLabel: message("editorial.title.deliveryRideShareGrowth"),
    avatar: "/assets/imgs/blog/blog-grid/avatar8.png",
    author: "Demo editorial",
  },
] as const satisfies readonly NewsGridItem[];

export const newsList = [
  {
    id: "newsList-1",
    image: "/assets/imgs/blog/blog-list/news.png",
    category: "Adventure",
    categoryLabel: message("editorial.category.adventure"),
    categoryClass: "btn btn-label-tag background-3",
    title: message("editorial.title.familyRoadTrips"),
    titleLabel: message("editorial.title.familyRoadTrips"),
  },
  {
    id: "newsList-2",
    image: "/assets/imgs/blog/blog-list/news2.png",
    category: "Luxury",
    categoryLabel: message("editorial.category.luxury"),
    categoryClass: "btn btn-label-tag background-1",
    title: message("editorial.title.hiddenRentalFees"),
    titleLabel: message("editorial.title.hiddenRentalFees"),
  },
  {
    id: "newsList-3",
    image: "/assets/imgs/blog/blog-list/news3.png",
    category: "Wanderlust",
    categoryLabel: message("editorial.category.wanderlust"),
    categoryClass: "btn btn-label-tag background-2",
    title: message("editorial.title.peakTravelRental"),
    titleLabel: message("editorial.title.peakTravelRental"),
  },
  {
    id: "newsList-4",
    image: "/assets/imgs/blog/blog-list/news4.png",
    category: "Heritage",
    categoryLabel: message("editorial.category.heritage"),
    categoryClass: "btn btn-label-tag background-4",
    title: message("editorial.title.rentalInsurance"),
    titleLabel: message("editorial.title.rentalInsurance"),
  },
] as const satisfies readonly NewsListItem[];

export const importSources: readonly ImportSourceItem[] = [];

export const teamMembers: readonly AgentItem[] = [];

export const teamMembersCompact1: readonly AgentItem[] = [];

export const teamMembersCompact2: readonly AgentItem[] = [];
