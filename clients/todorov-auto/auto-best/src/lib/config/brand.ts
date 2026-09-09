export type BrandConfig = {
  name: string;
  shortName: string;
  city: string;
  addressLine: string;
  address: string;
  phone: string;
  phoneHref: `tel:${string}`;
  appointment: string;
  logo: `/${string}`;
  youtubeUrl: string;
  instagramUrl: string;
  facebookUrl: string;
};


export const brand: BrandConfig = {
  "name": "Автосалон Тодоров",
  "shortName": "Тодоров",
  "city": "Бургас",
  "addressLine": "Изгрев, ул. Транспортна, 5-ти километър",
  "address": "Изгрев, ул. Транспортна, 5-ти километър, Бургас",
  "phone": "0888 417 282",
  "phoneHref": "tel:+359888417282",
  "appointment": "Пон.–Пет. 09:00–18:00 · Съб. 10:00–16:30 · Нед. почивен ден",
  "logo": "/dealer/logo-light.png",
  "youtubeUrl": "",
  "instagramUrl": "",
  "facebookUrl": ""
};
