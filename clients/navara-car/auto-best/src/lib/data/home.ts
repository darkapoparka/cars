import { featuredVehicles } from './inventory';
import { bodyLabel } from './listing';
import { brand } from '$config/brand';
import source from './navara-data.json';

const bodyArtwork = [
  { label: 'Седан', query: 'Sedan', image: '/assets/images/icon-box/car-list1.png', width: 150, height: 80 },
  { label: 'Хечбек', query: 'Hatchback', image: '/assets/images/icon-box/car-list2.png', width: 140, height: 80 },
  { label: 'Пикап', query: 'Pickup Truck', image: '/assets/images/icon-box/car-list3.png', width: 140, height: 80 },
  { label: 'SUV', query: 'SUV', image: '/assets/images/icon-box/car-list4.png', width: 166, height: 96 },
  { label: 'Кросоувър', query: 'Crossover', image: '/assets/images/icon-box/car-list5.png', width: 206, height: 95 },
  { label: 'Миниван', query: 'Minivan', image: '/assets/images/icon-box/car-list6.png', width: 140, height: 80 },
  { label: 'Комби', query: 'Wagon', image: '/assets/images/icon-box/car-list7.png', width: 140, height: 80 },
  { label: 'Кабриолет', query: 'Convertible', image: '/assets/images/icon-box/car-list8.png', width: 152, height: 92 }
] as const;

// Generic manufacturer marks belong to the retained template, not to another dealer.
const brandArtwork = [
  { label: 'Nissan', image: '/assets/images/partner/partner5.png' },
  { label: 'Mercedes-Benz', image: '/assets/images/partner/parner8.png' },
  { label: 'Audi', image: '/assets/images/partner/parner11.png' }
] as const;

export const bodyTypes = [...new Set(featuredVehicles.map(vehicle => vehicle.body))].map(query => {
  const artwork = bodyArtwork.find(item => item.query === query) ?? bodyArtwork[0];
  return { ...artwork, query, label: bodyLabel(query), count: featuredVehicles.filter(vehicle => vehicle.body === query).length };
});
export const brands = brandArtwork.filter(item => featuredVehicles.some(vehicle => vehicle.make === item.label))
  .map(item => ({ ...item, count: featuredVehicles.filter(vehicle => vehicle.make === item.label).length }));

export const editorial = [
  { title: `Къде е ${brand.name}?`, text: 'Варна, Кайсиева градина, бул. „Цар Освободител“. Потвърдете точния вход и часа за посещение по телефона.', image: source.vehicles[3].images[1], href: '/contact', meta: '08.09.2026', category: 'Контакти' },
  { title: 'Как да използвате тази селекция?', text: 'Сравнете обявените цени, пробег и оборудване. Данните са от публикации към посочената дата, а не от система за текуща наличност.', image: source.vehicles[0].images[0], href: '/blog-detail/1', meta: '08.09.2026', category: 'Каталог' },
  { title: 'Регистрация и лизинг: какво да уточните?', text: 'Продавачът посочва съдействие за регистрация и означение „Лизинг“ в част от обявите. Конкретните разходи и условия се потвърждават отделно.', image: source.vehicles[4].images[0], href: '/blog-detail/2', meta: '08.09.2026', category: 'Въпроси' }
] as const;
