// Dealer identity lives here. Keep fixture content and form mode explicit.
export const brand = {
  name: "Boxcars",
  logoLight: "/media/logo.svg",
  logoDark: "/media/logo2.svg",
  accent: "#405ff2",
  tagline: "Find your perfect car",
  inventoryMode: "sample" as const,
  formMode: "preview" as const,
  contactEmail: "hello@example.com",
  location: "Demo showroom",
  hours: "Monday–Saturday, 9am–6pm",
};
