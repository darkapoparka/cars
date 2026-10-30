// Dealer personalization boundary. Everything dealer-specific that is not
// inventory lives here; inventory comes from src/lib/data/vehicles.json.

export type Locale = "en" | "bg";

export const site = {
  name: "Day & Night Auto Group",
  wordmark: ["Day", "Night"] as const,
  defaultLocale: "bg" as Locale,
  locales: ["bg", "en"] as Locale[],
  defaultTheme: "night" as "night" | "day",
  accent: "#c40101",
  phone: "+359877733110",
  phoneDisplay: "0877 733 110",
  email: null as string | null,
  address: {
    en: "18 Atanas Manchev St., Studentski grad, Sofia",
    bg: "ул. „Атанас Манчев“ 18, Студентски град, София",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("ул. Атанас Манчев 18, Студентски град, София"),
  listingsUrl: "https://daynight.mobile.bg/",
  /** Shown in the footer; the enquiry forms in this template never send data. */
  demo: true,
};
