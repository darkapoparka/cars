export type BrandConfig = {
  name: string;
  shortName: string;
  city: string;
  showroomCoordinates: { latitude: number; longitude: number } | null;
  addressLine: string;
  address: string;
  phone: string;
  phoneHref: `tel:${string}`;
  appointment: string;
  logo: `/${string}`;
  logoOnDark: `/${string}`;
  youtubeUrl: `https://${string}` | '';
  instagramUrl: `https://${string}` | '';
  facebookUrl: `https://${string}` | '';
};

const name = "Ц Е Н Т Р А Л-АВТОСАЛОН";
const shortName = "ЦЕНТРАЛ АВТОСАЛОН";
const city = "Варна";
const addressLine = "бул. 'Ян Хуняди' 23 /под музей 'Вл. Варненчик'/";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0888602290",
  phoneHref: "tel:+359888602290",
  addressLine,
  address: "бул. 'Ян Хуняди' 23 /под музей 'Вл. Варненчик'/, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-0e9c59ba68488896/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-0e9c59ba68488896/logo-on-dark.webp"
} as const satisfies BrandConfig;
