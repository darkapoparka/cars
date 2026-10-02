// Dealer identity lives here. Keep fixture content and form mode explicit.
export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "youtube"
  | "tiktok"
  | "linkedin";
export type SocialLink = { platform: SocialPlatform; url: string };
export type ShowroomMap = {
  address: string;
  embedUrl: string;
  directionsUrl: string;
};
export type CityMap = { name: string; embedUrl: string; mapUrl: string };
export type ShowroomBanner = { src: string; alt: string };

export const brand = {
  name: "Boxcars",
  logoLight: "/media/logo.svg",
  logoDark: "/media/logo2.svg",
  accent: "#405ff2",
  tagline: "Find your perfect car",
  inventoryMode: "sample" as const,
  formMode: "preview" as const,
  contactEmail: "hello@example.com",
  phone: "",
  location: "",
  hours: "Monday–Saturday, 9am–6pm",
  // Generated demo concept. Replace with a permitted dealer photo or set null.
  showroomBanner: {
    src: "/media/showroom/boxcars-showroom-v1.webp",
    alt: "Illustrative showroom concept with a white estate and a slate-blue SUV",
  } as ShowroomBanner | null,
  // Add verified dealer details during personalization. Empty fields stay hidden.
  showroomMap: null as ShowroomMap | null,
  // City preview only; a verified showroomMap takes priority during personalization.
  previewCityMap: {
    name: "Varna",
    embedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=27.87%2C43.18%2C27.95%2C43.22&layer=mapnik",
    mapUrl: "https://www.openstreetmap.org/#map=13/43.20/27.91",
  } as CityMap | null,
  socialLinks: [] as SocialLink[],
};
