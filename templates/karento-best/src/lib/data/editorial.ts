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
    author: "Jimmy Dave",
  },
  {
    id: "newsGrid-2",
    image: "/assets/imgs/blog/blog-grid/img-4.png",
    category: "Travel Tips",
    categoryLabel: newsCategoryLabels["Travel Tips"],
    title: message("editorial.title.deliveryRideShareGrowth"),
    titleLabel: message("editorial.title.deliveryRideShareGrowth"),
    avatar: "/assets/imgs/blog/blog-grid/avatar2.png",
    author: "Jimmy Dave",
  },
  {
    id: "newsGrid-3",
    image: "/assets/imgs/blog/blog-grid/img-5.png",
    category: "Industry News",
    categoryLabel: newsCategoryLabels["Industry News"],
    title: message("editorial.title.deliveryRideShareGrowth"),
    titleLabel: message("editorial.title.deliveryRideShareGrowth"),
    avatar: "/assets/imgs/blog/blog-grid/avatar3.png",
    author: "Jimmy Dave",
  },
  {
    id: "newsGrid-4",
    image: "/assets/imgs/blog/blog-grid/img-6.png",
    category: "Car Updates",
    categoryLabel: newsCategoryLabels["Car Updates"],
    title: message("editorial.title.deliveryRideShareGrowth"),
    titleLabel: message("editorial.title.deliveryRideShareGrowth"),
    avatar: "/assets/imgs/blog/blog-grid/avatar4.png",
    author: "Jimmy Dave",
  },
  {
    id: "newsGrid-5",
    image: "/assets/imgs/blog/blog-grid/img-7.png",
    category: "Rental Advice",
    categoryLabel: newsCategoryLabels["Rental Advice"],
    title: message("editorial.title.budgetTravelHacks"),
    titleLabel: message("editorial.title.budgetTravelHacks"),
    avatar: "/assets/imgs/blog/blog-grid/avatar5.png",
    author: "Jimmy Dave",
  },
  {
    id: "newsGrid-6",
    image: "/assets/imgs/blog/blog-grid/img-8.png",
    category: "Road Trips",
    categoryLabel: newsCategoryLabels["Road Trips"],
    title: message("editorial.title.budgetTravelHacks"),
    titleLabel: message("editorial.title.budgetTravelHacks"),
    avatar: "/assets/imgs/blog/blog-grid/avatar6.png",
    author: "Jimmy Dave",
  },
  {
    id: "newsGrid-7",
    image: "/assets/imgs/blog/blog-grid/img-9.png",
    category: "Car Review",
    categoryLabel: newsCategoryLabels["Car Review"],
    title: message("editorial.title.budgetTravelHacks"),
    titleLabel: message("editorial.title.budgetTravelHacks"),
    avatar: "/assets/imgs/blog/blog-grid/avatar7.png",
    author: "Jimmy Dave",
  },
  {
    id: "newsGrid-8",
    image: "/assets/imgs/blog/blog-grid/img-10.png",
    category: "Car Review",
    categoryLabel: newsCategoryLabels["Car Review"],
    title: message("editorial.title.budgetTravelHacks"),
    titleLabel: message("editorial.title.budgetTravelHacks"),
    avatar: "/assets/imgs/blog/blog-grid/avatar3.png",
    author: "Jimmy Dave",
  },
  {
    id: "newsGrid-9",
    image: "/assets/imgs/blog/blog-grid/img-11.png",
    category: "Discovery",
    categoryLabel: newsCategoryLabels["Discovery"],
    title: message("editorial.title.deliveryRideShareGrowth"),
    titleLabel: message("editorial.title.deliveryRideShareGrowth"),
    avatar: "/assets/imgs/blog/blog-grid/avatar5.png",
    author: "Jimmy Dave",
  },
  {
    id: "newsGrid-10",
    image: "/assets/imgs/blog/blog-grid/img-12.png",
    category: "Industry News",
    categoryLabel: newsCategoryLabels["Industry News"],
    title: message("editorial.title.deliveryRideShareGrowth"),
    titleLabel: message("editorial.title.deliveryRideShareGrowth"),
    avatar: "/assets/imgs/blog/blog-grid/avatar3.png",
    author: "Jimmy Dave",
  },
  {
    id: "newsGrid-11",
    image: "/assets/imgs/blog/blog-grid/img-13.png",
    category: "Industry News",
    categoryLabel: newsCategoryLabels["Industry News"],
    title: message("editorial.title.deliveryRideShareGrowth"),
    titleLabel: message("editorial.title.deliveryRideShareGrowth"),
    avatar: "/assets/imgs/blog/blog-grid/avatar2.png",
    author: "Jimmy Dave",
  },
  {
    id: "newsGrid-12",
    image: "/assets/imgs/blog/blog-grid/img-14.png",
    category: "Industry News",
    categoryLabel: newsCategoryLabels["Industry News"],
    title: message("editorial.title.deliveryRideShareGrowth"),
    titleLabel: message("editorial.title.deliveryRideShareGrowth"),
    avatar: "/assets/imgs/blog/blog-grid/avatar8.png",
    author: "Jimmy Dave",
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

export const importSources = [
  {
    id: "importSources-1",
    image: "/assets/imgs/dealer/dealer-listing/icon-1.svg",
    name: "Opel Manchester",
    nameLabel: "Opel Manchester",
    address: "123 Kingsway Strandeif, Manchester, M19 2XS",
    countryCode: "GB",
    sample: true,
  },
  {
    id: "importSources-2",
    image: "/assets/imgs/dealer/dealer-listing/icon-2.svg",
    name: "BMW Birmingham",
    nameLabel: "BMW Birmingham",
    address: "45 Solihull Road, Birmingham, B91 2DA",
    countryCode: "GB",
    sample: true,
  },
  {
    id: "importSources-3",
    image: "/assets/imgs/dealer/dealer-listing/icon-3.svg",
    name: "Toyota London",
    nameLabel: "Toyota London",
    address: "78 High Street Nomawal, London, E1 6RL",
    countryCode: "GB",
    sample: true,
  },
  {
    id: "importSources-4",
    image: "/assets/imgs/dealer/dealer-listing/icon-4.svg",
    name: "Ford Glasgow",
    nameLabel: "Ford Glasgow",
    address: "15 Buchanan Street, Glasgow, G1 3HL",
    countryCode: "GB",
    sample: true,
  },
  {
    id: "importSources-5",
    image: "/assets/imgs/dealer/dealer-listing/icon-5.svg",
    name: "Volkswagen Leeds",
    nameLabel: "Volkswagen Leeds",
    address: "230 block 90 Kirkstall Road, Leeds, LS3 1HS",
    countryCode: "GB",
    sample: true,
  },
  {
    id: "importSources-6",
    image: "/assets/imgs/dealer/dealer-listing/icon-6.svg",
    name: "Honda Edinburgh",
    nameLabel: "Honda Edinburgh",
    address: "62 Princes Street, Edinburgh, EH2 4AD",
    countryCode: "GB",
    sample: true,
  },
  {
    id: "importSources-7",
    image: "/assets/imgs/dealer/dealer-listing/icon-7.svg",
    name: "Nissan Bristol",
    nameLabel: "Nissan Bristol",
    address: "11 Clifton Down Road, Bristol, BS8 4AB",
    countryCode: "GB",
    sample: true,
  },
  {
    id: "importSources-8",
    image: "/assets/imgs/dealer/dealer-listing/icon-8.svg",
    name: "Kia Liverpool",
    nameLabel: "Kia Liverpool",
    address: "29 Hope Street, Liverpool, L1 9BX",
    countryCode: "GB",
    sample: true,
  },
  {
    id: "importSources-9",
    image: "/assets/imgs/dealer/dealer-listing/icon-9.svg",
    name: "Peugeot Sheffield",
    nameLabel: "Peugeot Sheffield",
    address: "Block 123 / 90 Kirkstall Road, Leeds, LS3 1HS",
    countryCode: "GB",
    sample: true,
  },
  {
    id: "importSources-10",
    image: "/assets/imgs/dealer/dealer-listing/icon-10.svg",
    name: "Volvo Oxford",
    nameLabel: "Volvo Oxford",
    address: "45 Solihull Road, Birmingham, B91 2DA",
    countryCode: "GB",
    sample: true,
  },
  {
    id: "importSources-11",
    image: "/assets/imgs/dealer/dealer-listing/icon-11.svg",
    name: "Mazda Southampton",
    nameLabel: "Mazda Southampton",
    address: "123 Kingsway Strandeif, Manchester, M19 2XS",
    countryCode: "GB",
    sample: true,
  },
  {
    id: "importSources-12",
    image: "/assets/imgs/dealer/dealer-listing/icon-12.svg",
    name: "Land Rover Norwich",
    nameLabel: "Land Rover Norwich",
    address: "45 Solihull Road, Birmingham, B91 2DA",
    countryCode: "GB",
    sample: true,
  },
  {
    id: "importSources-13",
    image: "/assets/imgs/dealer/dealer-listing/icon-13.svg",
    name: "Jeep Nottingham",
    nameLabel: "Jeep Nottingham",
    address: "123 Kingsway Strandeif, Manchester, M19 2XS",
    countryCode: "GB",
    sample: true,
  },
  {
    id: "importSources-14",
    image: "/assets/imgs/dealer/dealer-listing/icon-2.svg",
    name: "BMW Manchester",
    nameLabel: "BMW Manchester",
    address: "11 Clifton Down Road, Bristol, BS8 4AB",
    countryCode: "GB",
    sample: true,
  },
  {
    id: "importSources-15",
    image: "/assets/imgs/dealer/dealer-listing/icon-4.svg",
    name: "Ford Manchester",
    nameLabel: "Ford Manchester",
    address: "123 Kingsway Strandeif, Manchester, M19 2XS",
    countryCode: "GB",
    sample: true,
  },
] as const satisfies readonly ImportSourceItem[];

export const teamMembers = [
  {
    id: "teamMembers-1",
    image: "/assets/imgs/team/team-1/portrait-1.png",
    name: "Cody Fisher",
    role: message("editorial.role.cfo"),
    cardClass: "card-news background-card shadow-2 mb-50",
  },
  {
    id: "teamMembers-2",
    image: "/assets/imgs/team/team-1/portrait-2.png",
    name: "Darrell Steward",
    role: message("editorial.role.ceo"),
    cardClass: "card-news background-card shadow-2 mb-50",
  },
  {
    id: "teamMembers-3",
    image: "/assets/imgs/team/team-1/portrait-3.png",
    name: "Ronald Richards",
    role: message("editorial.role.coo"),
    cardClass: "card-news background-card shadow-2 mb-50",
  },
  {
    id: "teamMembers-4",
    image: "/assets/imgs/team/team-1/portrait-4.png",
    name: "Jerome Bell",
    role: message("editorial.role.cmo"),
    cardClass: "card-news background-card shadow-2 mb-50",
  },
  {
    id: "teamMembers-5",
    image: "/assets/imgs/team/team-1/portrait-5.png",
    name: "Jerome Bell",
    role: message("editorial.role.cmo"),
    cardClass: "card-news background-card shadow-2 mb-50",
  },
  {
    id: "teamMembers-6",
    image: "/assets/imgs/team/team-1/portrait-6.png",
    name: "Jerome Bell",
    role: message("editorial.role.cmo"),
    cardClass: "card-news background-card shadow-2 mb-50",
  },
  {
    id: "teamMembers-7",
    image: "/assets/imgs/team/team-1/portrait-7.png",
    name: "Cody Fisher",
    role: message("editorial.role.cfo"),
    cardClass: "card-news background-card shadow-2 mb-50",
  },
  {
    id: "teamMembers-8",
    image: "/assets/imgs/team/team-1/portrait-8.png",
    name: "Cody Fisher",
    role: message("editorial.role.cfo"),
    cardClass: "card-news background-card shadow-2 mb-50",
  },
] as const satisfies readonly AgentItem[];

export const teamMembersCompact1 = [
  {
    id: "teamMembersCompact1-1",
    image: "/assets/imgs/team/team-1/portrait-1.png",
    name: "Cody Fisher",
    role: message("editorial.role.cfo"),
    cardClass: "card-news background-card shadow-2 mb-4 mb-lg-0",
  },
  {
    id: "teamMembersCompact1-2",
    image: "/assets/imgs/team/team-1/portrait-2.png",
    name: "Darrell Steward",
    role: message("editorial.role.ceo"),
    cardClass: "card-news background-card shadow-2 mb-4 mb-lg-0",
  },
  {
    id: "teamMembersCompact1-3",
    image: "/assets/imgs/team/team-1/portrait-3.png",
    name: "Ronald Richards",
    role: message("editorial.role.coo"),
    cardClass: "card-news background-card shadow-2 mb-4 mb-lg-0",
  },
  {
    id: "teamMembersCompact1-4",
    image: "/assets/imgs/team/team-1/portrait-4.png",
    name: "Jerome Bell",
    role: message("editorial.role.cmo"),
    cardClass: "card-news background-card shadow-2 mb-4 mb-lg-0",
  },
] as const satisfies readonly AgentItem[];

export const teamMembersCompact2 = [
  {
    id: "teamMembersCompact2-1",
    image: "/assets/imgs/team/team-1/portrait-1.png",
    name: "Cody Fisher",
    role: message("editorial.role.cfo"),
    cardClass: "card-news background-card shadow-2 mb-4 mb-lg-0",
  },
  {
    id: "teamMembersCompact2-2",
    image: "/assets/imgs/team/team-1/portrait-2.png",
    name: "Darrell Steward",
    role: message("editorial.role.ceo"),
    cardClass: "card-news background-card shadow-2 mb-4 mb-lg-0",
  },
  {
    id: "teamMembersCompact2-3",
    image: "/assets/imgs/team/team-1/portrait-3.png",
    name: "Ronald Richards",
    role: message("editorial.role.coo"),
    cardClass: "card-news background-card shadow-2 mb-4 mb-lg-0",
  },
  {
    id: "teamMembersCompact2-4",
    image: "/assets/imgs/team/team-1/portrait-4.png",
    name: "Jerome Bell",
    role: message("editorial.role.cmo"),
    cardClass: "card-news background-card shadow-2 mb-4 mb-lg-0",
  },
] as const satisfies readonly AgentItem[];
