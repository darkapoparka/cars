export type CurrentDayNightListing = {
  id: string;
  title: string;
  sourceUrl: string;
  priceEur: string;
  priceBgn: string;
  status: string;
  date: string;
  mileage: string;
  color: string;
  fuel: string;
  power: string;
  transmission: string;
  body: string;
  features: string[];
  image: string;
  gallery: string[];
  notes: string;
  engine: string;
  canonicalSlug: string;
  shortTitle: string;
  brand: string;
  model: string;
};

export const currentDayNightListings: CurrentDayNightListing[] = [{
  id: '55965789',
  title: 'Mercedes-Benz CLA 180',
  shortTitle: 'Mercedes-Benz CLA 180',
  brand: 'Mercedes-Benz',
  model: 'CLA 180',
  canonicalSlug: 'mercedes-benz-cla-180-2013-55965789',
  sourceUrl: 'https://bazar.bg/obiava-55965789/mercedes-benz-cla-180-96000km',
  priceEur: '12 500 €',
  priceBgn: '',
  status: 'Обновена 09.09.2026',
  date: '2013 г.',
  mileage: '96 000 км',
  color: 'Midnight gray',
  fuel: 'Бензин',
  power: '121 к.с.',
  transmission: 'Ръчна',
  body: 'Седан',
  features: ['Навигация', 'Камера', 'Климатроник', 'Мултифункционален волан'],
  image: '/dealer/stock/cla-demo.svg',
  gallery: ['/dealer/stock/cla-demo.svg'],
  notes: 'Текуща публична обява на GoldenDreams AUTO. Наличността и точният адрес се потвърждават по телефона. Илюстрацията в демото не е снимка на автомобила.',
  engine: '—'
}];
