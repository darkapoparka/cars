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
  "name": "VOIVODOV AUTO & ANTONIO",
  "shortName": "Voivodov",
  "city": "Пловдив",
  "addressLine": "кв. Въстанически — точният адрес се уточнява по телефона",
  "address": "кв. Въстанически — точният адрес се уточнява по телефона, Пловдив",
  "phone": "0899 813 628",
  "phoneHref": "tel:+359899813628",
  "appointment": "Работно време: потвърдете по телефона",
  "logo": "/dealer/logo-light.png",
  "youtubeUrl": "",
  "instagramUrl": "",
  "facebookUrl": ""
};
