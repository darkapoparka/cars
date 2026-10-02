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
  location: "Demo showroom",
  hours: "Monday–Saturday, 9am–6pm",
  // Add verified dealer details during personalization. Empty fields stay hidden.
  showroomMap: null as ShowroomMap | null,
  socialLinks: [] as SocialLink[],
};
