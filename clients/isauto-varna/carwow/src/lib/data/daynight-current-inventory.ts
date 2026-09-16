// Public IS AUTO Varna listing snapshot captured from the official site on 2026-09-16.
// Images are localized from the same listing pages to prevent hotlink failures.
export type CurrentDayNightListing = {
  id: string; title: string; sourceUrl: string; priceEur: string; priceBgn: string; status: string; date: string; mileage: string;
  color: string; fuel: string; power: string; transmission: string; body: string; features: string[]; image: string;
};
export const currentDayNightListings: CurrentDayNightListing[] = [
  {
    id: 'is-1001', title: 'Audi R8 Performance V10 Performance V10 · B&O · Ceramic · Carbon', sourceUrl: 'https://www.isauto.net/avtomobili-i-djipove/audi-r8-perfomance-v10-bang-olufsen-audi-keramik-carbon-10',
    priceEur: '148 224 €', priceBgn: '289 900.95 лв.', status: 'Наличен',
    date: '2021 г.', mileage: '75 000 км', color: '—', fuel: 'Бензинов', power: '—',
    transmission: 'Автоматична', body: 'Купе', features: ["Bang & Olufsen","Керамични спирачки","Carbon пакет"], image: '/assets/isauto/inventory-1.webp'
  },
  {
    id: 'is-1002', title: 'Audi Q7 50 TDI 50 TDI · Virtual · 4-zone · Camera 360', sourceUrl: 'https://www.isauto.net/avtomobili-i-djipove/audi-q7-50tdi-virtual-podgrev-4-zoni-kamera360-9',
    priceEur: '67 439 €', priceBgn: '131 899.22 лв.', status: 'Наличен',
    date: '2022 г.', mileage: '57 500 км', color: '—', fuel: 'Дизелов', power: '—',
    transmission: 'Автоматична', body: 'Джип', features: ["Virtual cockpit","Подгряване на седалки","4-зонов климатроник","360° камера"], image: '/assets/isauto/inventory-2.webp'
  },
  {
    id: 'is-1003', title: 'BMW M5 xDrive · Ceramic · Bowers & Wilkins · Adaptive LED', sourceUrl: 'https://www.isauto.net/avtomobili-i-djipove/bmw-m5-keramika-xdrive-m-sport-bowers-wilk-adaptiveled-8',
    priceEur: '71 530 €', priceBgn: '139 900.52 лв.', status: 'Наличен',
    date: '2018 г.', mileage: '61 000 км', color: '—', fuel: 'Бензинов', power: '—',
    transmission: 'Автоматична', body: 'Лимузина', features: ["xDrive","Керамични спирачки","Bowers & Wilkins","Adaptive LED"], image: '/assets/isauto/inventory-3.webp'
  },
  {
    id: 'is-1004', title: 'BMW X5 xDrive xDrive · Sport · Panoramic roof', sourceUrl: 'https://www.isauto.net/avtomobili-i-djipove/bmw-x5-xdrive-sport-podgrev-panorama-6-1-7',
    priceEur: '24 491 €', priceBgn: '47 900.23 лв.', status: 'Наличен',
    date: '2014 г.', mileage: '196 000 км', color: '—', fuel: 'Дизелов', power: '—',
    transmission: 'Автоматична', body: 'Джип', features: ["xDrive","Sport пакет","Подгряване на седалки","Панорамен покрив"], image: '/assets/isauto/inventory-4.webp'
  },
  {
    id: 'is-1005', title: 'BMW 750 M Performance 750 · M Performance · Laser · Harman Kardon', sourceUrl: 'https://www.isauto.net/avtomobili-i-djipove/bmw-750-m-perfomance-laser-alkantar-virtual-harman-kardon-3',
    priceEur: '61 304 €', priceBgn: '119 900.20 лв.', status: 'Наличен',
    date: '2019 г.', mileage: '167 000 км', color: '—', fuel: 'Дизелов', power: '—',
    transmission: 'Автоматична', body: 'Лимузина', features: ["M Performance","Laser светлини","Alcantara","Virtual cockpit","Harman Kardon"], image: '/assets/isauto/inventory-5.webp'
  },
  {
    id: 'is-1006', title: 'Audi A5 Sportback 2.0 TDI Sportback · S line · Virtual · Ambient', sourceUrl: 'https://www.isauto.net/avtomobili-i-djipove/audi-a5-sportback-2-0tdi-sline-ambient-virtual-podgrev-pdc-f1-745',
    priceEur: '19 900 €', priceBgn: '38 921.02 лв.', status: 'Наличен',
    date: '2018 г.', mileage: '175 000 км', color: '—', fuel: 'Дизелов', power: '—',
    transmission: 'Автоматична', body: 'Купе', features: ["S line","Ambient осветление","Virtual cockpit","Подгряване на седалки","Парктроник","F1 пера"], image: '/assets/isauto/inventory-6.webp'
  }
];
