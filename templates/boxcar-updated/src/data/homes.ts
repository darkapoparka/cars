import { brand } from "./brand";

export type SectionKind =
  | "brands"
  | "types"
  | "vehicles"
  | "pricing"
  | "benefits"
  | "testimonials"
  | "blog"
  | "cta"
  | "stats"
  | "finance"
  | "inspiration"
  | "team"
  | "app"
  | "newsletter"
  | "dealership"
  | "contact";
export interface HomeSection {
  kind: SectionKind;
  title?: string;
  style?: string;
  image?: string;
  group?: string;
}
export interface HomeDesign {
  id: number;
  name: string;
  route: string;
  hero: string;
  sections: HomeSection[];
}
export const homes: HomeDesign[] = [
  {
    id: 1,
    name: "Mountain",
    route: "/",
    hero: "mountain",
    sections: [
      { kind: "brands" },
      { kind: "vehicles", title: "Explore All Vehicles" },
      { kind: "pricing", image: "pricing1-1.jpg" },
      { kind: "stats" },
      { kind: "benefits" },
      {
        kind: "vehicles",
        title: "Popular Makes",
        group: "make",
        style: "rows",
      },
      { kind: "inspiration", title: `Shop ${brand.name} Your Way` },
      { kind: "testimonials", style: "portrait" },
      { kind: "blog" },
      { kind: "cta" },
    ],
  },
  {
    id: 2,
    name: "Featured",
    route: "/home-2/",
    hero: "featured",
    sections: [
      { kind: "types" },
      { kind: "vehicles", title: "Explore All Vehicles", style: "pale" },
      {
        kind: "pricing",
        title: "Online, in-person, everywhere",
        image: "pricing2-1.jpg",
        style: "reversed",
      },
      { kind: "benefits" },
      { kind: "vehicles", title: "Specials", style: "specials", group: "none" },
      { kind: "testimonials", style: "cards" },
      { kind: "team" },
      { kind: "inspiration" },
      { kind: "app" },
      { kind: "brands" },
      {
        kind: "contact",
        title: "We make finding the right car simple",
        style: "banner",
      },
    ],
  },
  {
    id: 3,
    name: "City",
    route: "/home-3/",
    hero: "city",
    sections: [
      {
        kind: "vehicles",
        title: "The Most Searched Cars",
        group: "body",
        style: "searched",
      },
      { kind: "cta" },
      { kind: "benefits", title: "We're BIG on what matters to you" },
      { kind: "vehicles", title: "Explore All Vehicles", style: "dark" },
      { kind: "testimonials", style: "cards" },
      { kind: "brands" },
      {
        kind: "pricing",
        title: "Flexible finance for added shine",
        image: "pricing1-1.jpg",
        style: "pale",
      },
      { kind: "stats" },
      { kind: "blog" },
    ],
  },
  {
    id: 4,
    name: "Luxury",
    route: "/home-4/",
    hero: "luxury",
    sections: [
      {
        kind: "vehicles",
        title: "Popular Makes",
        group: "make",
        style: "large",
      },
      { kind: "benefits", style: "pale" },
      { kind: "types", style: "gallery" },
      { kind: "inspiration", title: `Shop ${brand.name} Your Way` },
      { kind: "brands" },
      { kind: "finance" },
      { kind: "testimonials", style: "cards" },
      { kind: "team" },
      { kind: "app", style: "pale" },
      { kind: "blog" },
    ],
  },
  {
    id: 5,
    name: "Minimal",
    route: "/home-5/",
    hero: "minimal",
    sections: [
      { kind: "types", style: "center" },
      { kind: "cta" },
      { kind: "vehicles", title: "The Most Searched Cars", group: "make" },
      { kind: "benefits", style: "compact" },
      { kind: "vehicles", title: "Latest Cars", style: "rows", group: "none" },
      { kind: "inspiration" },
      { kind: "testimonials", title: `Meet ${brand.name}`, style: "portrait" },
      { kind: "team" },
      { kind: "blog" },
      { kind: "brands", style: "strip" },
    ],
  },
  {
    id: 6,
    name: "Showroom",
    route: "/home-6/",
    hero: "showroom",
    sections: [
      { kind: "brands" },
      { kind: "dealership" },
      { kind: "pricing", image: "pricing4-1.jpg", style: "pale" },
      { kind: "stats" },
      { kind: "vehicles", title: "Explore All Vehicles" },
      { kind: "inspiration", title: "Find a car that fits your life" },
      { kind: "benefits", title: "Shop, Finance and Find Your Car" },
      { kind: "testimonials", style: "cards" },
      { kind: "team" },
      { kind: "contact", title: "Get in Touch" },
    ],
  },
  {
    id: 7,
    name: "Classic",
    route: "/home-7/",
    hero: "classic",
    sections: [
      { kind: "types", style: "photos" },
      { kind: "benefits", style: "pale" },
      {
        kind: "vehicles",
        title: "Featured Listings",
        group: "body",
        style: "rows",
      },
      { kind: "pricing", image: "pricing7-1.jpg", style: "collage" },
      { kind: "stats" },
      { kind: "testimonials", style: "cards" },
      { kind: "finance" },
      { kind: "app" },
      { kind: "brands" },
      { kind: "blog" },
    ],
  },
  {
    id: 8,
    name: "Electric",
    route: "/home-8/",
    hero: "electric",
    sections: [
      { kind: "types" },
      { kind: "brands", style: "compact" },
      {
        kind: "vehicles",
        title: "Recently Added",
        group: "none",
        style: "rows",
      },
      { kind: "benefits", title: "We're BIG on what matters to you" },
      { kind: "stats", style: "dark" },
      { kind: "vehicles", title: "Featured Cars", group: "make" },
      { kind: "testimonials", style: "cards" },
      { kind: "blog" },
      { kind: "newsletter" },
    ],
  },
  {
    id: 9,
    name: "Lifestyle",
    route: "/home-9/",
    hero: "lifestyle",
    sections: [
      {
        kind: "types",
        title: "A Vehicle For Every Lifestyle",
        style: "cutouts",
      },
      { kind: "pricing", image: "pricing9-1.jpg", style: "collage" },
      { kind: "stats" },
      { kind: "cta", style: "photos" },
      { kind: "vehicles", title: "Explore All Vehicles" },
      { kind: "benefits", style: "dark" },
      { kind: "team" },
      { kind: "testimonials", style: "cards" },
      { kind: "blog" },
      { kind: "finance", style: "pale" },
    ],
  },
  {
    id: 10,
    name: "Touring",
    route: "/home-10/",
    hero: "touring",
    sections: [
      {
        kind: "types",
        title: "A Vehicle For Every Lifestyle",
        style: "cutouts",
      },
      {
        kind: "benefits",
        title: "We're BIG on what matters to you",
        style: "pale",
      },
      { kind: "vehicles", title: "Explore All Vehicles" },
      { kind: "cta" },
      {
        kind: "vehicles",
        title: "Recommended Cars For You",
        style: "rows",
        group: "none",
      },
      {
        kind: "pricing",
        title: "Online, in-person, everywhere",
        image: "pricing5-1.jpg",
        style: "pale",
      },
      { kind: "stats" },
      { kind: "testimonials", style: "cards" },
      { kind: "blog" },
      { kind: "brands" },
      {
        kind: "contact",
        title: "Have more questions? Get in touch.",
        style: "pale",
      },
    ],
  },
];
export function homeForPath(path: string): HomeDesign | undefined {
  if (["/", "/index.html", "/home-1/", "/home-1"].includes(path))
    return homes[0];
  const match = path.match(/^\/(?:home-|index-)(\d+)(?:\/|\.html)?$/);
  return match ? homes.find((h) => h.id === Number(match[1])) : undefined;
}
