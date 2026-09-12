import { featuredVehicles } from './inventory';
import { bodyLabel } from './listing';

const bodyArtwork = [
  { label: 'Седан', query: 'Sedan', image: '/assets/images/icon-box/car-list1.png', width: 150, height: 80 },
  { label: 'Хечбек', query: 'Hatchback', image: '/assets/images/icon-box/car-list2.png', width: 140, height: 80 },
  { label: 'Пикап', query: 'Pickup Truck', image: '/assets/images/icon-box/car-list3.png', width: 140, height: 80 },
  { label: 'SUV', query: 'SUV', image: '/assets/images/icon-box/car-list4.png', width: 166, height: 96 },
  { label: 'Кросоувър', query: 'Crossover', image: '/assets/images/icon-box/car-list5.png', width: 206, height: 95 },
  { label: 'Миниван', query: 'Minivan', image: '/assets/images/icon-box/car-list6.png', width: 140, height: 80 },
  { label: 'Комби', query: 'Wagon', image: '/assets/images/icon-box/car-list7.png', width: 140, height: 80 },
  { label: 'Кабриолет', query: 'Convertible', image: '/assets/images/icon-box/car-list8.png', width: 152, height: 92 },
  { label: 'Купе', query: 'Coupe', image: '/media/stock/11785220779595617-card.webp', width: 1000, height: 667 },
  { label: 'Спортбек', query: 'Sportback', image: '/media/stock/11785220779595617-card.webp', width: 1000, height: 667 }
] as const;


export const bodyTypes = [...new Set(featuredVehicles.map(vehicle => vehicle.body))].map(query => {
  const artwork = bodyArtwork.find(item => item.query === query) ?? bodyArtwork[0];
  return { ...artwork, query, label: bodyLabel(query), count: featuredVehicles.filter(vehicle => vehicle.body === query).length };
});

export const brands = [...new Set(featuredVehicles.map(vehicle => vehicle.make))].map(label => ({
  label,
  image: featuredVehicles.find(vehicle => vehicle.make === label)!.image,
  isLogo: false,
  count: featuredVehicles.filter(vehicle => vehicle.make === label).length
}));

export const editorial = [
  {
    "title": "Как да потвърдя наличността?",
    "text": "Селекцията е записана по публикувани обяви. Обадете се за актуална наличност и цена.",
    "image": "/media/stock/11785220779595617-card.webp",
    "href": "/contact?topic=inspection",
    "meta": "Преди оглед",
    "category": "Насоки"
  },
  {
    "title": "Какво да уточня за автомобила?",
    "text": "Сравнете документите, пробега, оборудването и състоянието с конкретната обява.",
    "image": "/media/stock/21724767264834325-card.webp",
    "href": "/blog-detail/1",
    "meta": "Преди покупка",
    "category": "Насоки"
  },
  {
    "title": "Къде се намира автокъщата?",
    "text": "гр. София, Горубляне, ул. „Самоковско шосе“ 1. Потвърдете точния вход и часа за посещение.",
    "image": "/media/stock/11768394188936705-card.webp",
    "href": "/contact",
    "meta": "София",
    "category": "Посещение"
  }
] as const;
