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

const name = "Х CAR";
const shortName = "Х CAR";
const city = "Варна";
const addressLine = "Север, бул. Владислав Варненчик";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0988975522",
  phoneHref: "tel:+359988975522",
  addressLine,
  address: "Север, бул. Владислав Варненчик, Варна, България",
  appointment: "Понеделник 08:30 - 18:00 ч. Вторник 08:30 - 18:00 ч. Сряда 08:30 - 18:00 ч. Четвъртък 08:30 - 18:00 ч. Петък 08:30 - 18:00 ч. Събота 09:00 - 17:00 ч. Неделя Почивен ден",
  logo: "/dealer-brand/v2-0acceb939b679c7d/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-0acceb939b679c7d/logo-on-dark.webp"
} as const satisfies BrandConfig;
