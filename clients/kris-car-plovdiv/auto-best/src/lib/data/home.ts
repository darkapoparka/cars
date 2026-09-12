import { featuredVehicles } from './inventory';
import { bodyLabel } from './listing';
import { brand } from '$config/brand';

const bodyArtwork = [
  { label: 'Седан', query: 'Sedan', image: '/assets/images/icon-box/car-list1.png', width: 150, height: 80 },
  { label: 'Хечбек', query: 'Hatchback', image: '/assets/images/icon-box/car-list2.png', width: 140, height: 80 },
  { label: 'Пикап', query: 'Pickup Truck', image: '/assets/images/icon-box/car-list3.png', width: 140, height: 80 },
  { label: 'SUV', query: 'SUV', image: '/assets/images/icon-box/car-list4.png', width: 166, height: 96 },
  { label: 'Кросоувър', query: 'Crossover', image: '/assets/images/icon-box/car-list5.png', width: 206, height: 95 },
  { label: 'Миниван', query: 'Minivan', image: '/assets/images/icon-box/car-list6.png', width: 140, height: 80 },
  { label: 'Комби', query: 'Wagon', image: '/assets/images/icon-box/car-list7.png', width: 140, height: 80 },
  { label: 'Кабриолет', query: 'Convertible', image: '/assets/images/icon-box/car-list8.png', width: 152, height: 92 },
  { label: 'Купе', query: 'Coupe', image: '/dealer/stock/21788856265448667-1.webp', width: 1000, height: 667 },
  { label: 'Спортбек', query: 'Sportback', image: '/dealer/stock/21781080017250424-1.webp', width: 1000, height: 667 }
] as const;

const brandArtwork = [
  { label: 'Land Rover', image: '/assets/images/partner/partner1.png' },
  { label: 'Kia', image: '/assets/images/partner/partner2.png' },
  { label: 'Toyota', image: '/assets/images/partner/partner3.png' },
  { label: 'Jeep', image: '/assets/images/partner/partner4.png' },
  { label: 'Nissan', image: '/assets/images/partner/partner5.png' },
  { label: 'Ford', image: '/assets/images/partner/partner6.png' },
  { label: 'Foton', image: '/assets/images/partner/parner7.png' },
  { label: 'Mercedes-Benz', image: '/assets/images/partner/parner8.png' },
  { label: 'Dongfeng', image: '/assets/images/partner/parner9.png' },
  { label: 'Isuzu', image: '/assets/images/partner/parner10.png' },
  { label: 'Audi', image: '/assets/images/partner/parner11.png' },
  { label: 'BMW', image: '/assets/images/partner/parner12.png' }
] as const;

export const bodyTypes = [...new Set(featuredVehicles.map(vehicle => vehicle.body))].map(query => {
  const artwork = bodyArtwork.find(item => item.query === query) ?? bodyArtwork[0];
  return { ...artwork, query, label: bodyLabel(query), count: featuredVehicles.filter(vehicle => vehicle.body === query).length };
});
export const brands = brandArtwork.filter(item => featuredVehicles.some(vehicle => vehicle.make === item.label))
  .map(item => ({ ...item, count: featuredVehicles.filter(vehicle => vehicle.make === item.label).length }));

export const editorial = [
  {
    "title": "Къде е автокъщата?",
    "text": "Цариградско шосе, до бензиностанция Алпи, Индустриална зона - Изток, Пловдив",
    "image": "/dealer/stock/11788863173361582-1.webp",
    "href": "/contact",
    "meta": "Контакти",
    "category": "Полезно"
  },
  {
    "title": "Какво да проверите преди покупка?",
    "text": "Поискайте документи, история на обслужването и независим оглед за избрания автомобил.",
    "image": "/dealer/stock/21788856265448667-1.webp",
    "href": "/blog-detail/1",
    "meta": "Ръководство",
    "category": "Полезно"
  },
  {
    "title": "Какво означава лизинг по запитване?",
    "text": "Илюстративна сметка не е финансираща оферта. Поискайте актуални писмени условия.",
    "image": "/dealer/stock/21781080017250424-1.webp",
    "href": "/blog-detail/3",
    "meta": "Ръководство",
    "category": "Полезно"
  }
] as const;
