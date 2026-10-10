import { message, type CatalogText } from "#lib/i18n/text.ts";
/** Preserved demonstration stories, never real dealer reviews or news. */
export interface Testimonial {
  readonly id: string;
  readonly title: CatalogText;
  readonly quote: CatalogText;
  readonly author: string;
  readonly location: string;
  readonly avatar: string;
  readonly rating: number;
}

export interface CarReview {
  readonly id: string;
  readonly title: CatalogText;
  readonly description: CatalogText;
  readonly image: string;
  readonly href: string;
}

export interface NewsStory {
  readonly id: string;
  readonly title: CatalogText;
  readonly image: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
  readonly category: CatalogText;
  readonly categoryHref: string;
  readonly href: string;
  readonly author: string;
  readonly avatar: string;
  readonly date: string;
  readonly readTime: CatalogText;
}

export const referenceTestimonials: readonly Testimonial[] = [];

export const referenceBookingTestimonials: readonly Testimonial[] = [];

export const referenceCarReviews = [
  {
    id: "tucson",
    title: message("referenceHome.reviews.tucson"),
    description: message("referenceHome.reviews.description"),
    image: "/assets/imgs/blog/blog-grid/img-1.png",
    href: "#!",
  },
  {
    id: "mazda",
    title: message("referenceHome.reviews.mazda"),
    description: message("referenceHome.reviews.description"),
    image: "/assets/imgs/blog/blog-grid/img-1-1.png",
    href: "#!",
  },
] as const satisfies readonly CarReview[];

export const referenceUpcomingNews = [
  {
    id: "escalade",
    title: message("referenceHome.news.escalade"),
    image: "/assets/imgs/blog/blog-1/img-1.png",
    imageWidth: 400,
    imageHeight: 249,
    category: message("referenceHome.news.news"),
    categoryHref: "/news",
    href: "/news/article",
    author: "Jimmy Dave",
    avatar: "/assets/imgs/blog/blog-1/avatar-1.png",
    date: "18 Sep 2024",
    readTime: message("referenceHome.news.readTime"),
  },
  {
    id: "bmw",
    title: message("referenceHome.news.bmw"),
    image: "/assets/imgs/blog/blog-1/img-2.png",
    imageWidth: 400,
    imageHeight: 249,
    category: message("referenceHome.news.trend"),
    categoryHref: "/news",
    href: "/news/article",
    author: "Steven Job",
    avatar: "/assets/imgs/blog/blog-1/avatar-2.png",
    date: "18 Sep 2024",
    readTime: message("referenceHome.news.readTime"),
  },
  {
    id: "rodeo",
    title: message("referenceHome.news.rodeo"),
    image: "/assets/imgs/blog/blog-1/img-3.png",
    imageWidth: 400,
    imageHeight: 249,
    category: message("referenceHome.news.discovery"),
    categoryHref: "/news",
    href: "/news/article",
    author: "David Jame",
    avatar: "/assets/imgs/blog/blog-1/avatar-3.png",
    date: "18 Sep 2024",
    readTime: message("referenceHome.news.readTime"),
  },
] as const satisfies readonly NewsStory[];
