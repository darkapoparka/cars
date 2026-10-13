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

const name = "ЕКСТРА КАР-СМ";
const shortName = "ЕКСТРА КАР-СМ";
const city = "Варна";
const addressLine = "бул. Цар Освободител, преди светофара за Джъмбо, район Владислав Варненчик";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0899 968 555",
  phoneHref: "tel:+359899968555",
  addressLine,
  address: "бул. Цар Освободител, преди светофара за Джъмбо, район Владислав Варненчик",
  appointment: "Не е публикувано работно време. Потвърдете часа и точния вход по телефона.",
  logo: "/registered-branding/onLight.png",
  logoOnDark: "/registered-branding/onDark.png"
} as const satisfies BrandConfig;
