import { brand } from '$config/brand';

export const bodyTypes = [
  { label: 'Седан', query: 'Sedan', image: '/assets/images/icon-box/car-list1.png', width: 150, height: 80 },
  { label: 'Хечбек', query: 'Hatchback', image: '/assets/images/icon-box/car-list2.png', width: 140, height: 80 },
  { label: 'Пикап', query: 'Pickup Truck', image: '/assets/images/icon-box/car-list3.png', width: 140, height: 80 },
  { label: 'SUV', query: 'SUV', image: '/assets/images/icon-box/car-list4.png', width: 166, height: 96 },
  { label: 'Кросоувър', query: 'Crossover', image: '/assets/images/icon-box/car-list5.png', width: 206, height: 95 },
  { label: 'Миниван', query: 'Minivan', image: '/assets/images/icon-box/car-list6.png', width: 140, height: 80 },
  { label: 'Комби', query: 'Wagon', image: '/assets/images/icon-box/car-list7.png', width: 140, height: 80 },
  { label: 'Кабриолет', query: 'Convertible', image: '/assets/images/icon-box/car-list8.png', width: 152, height: 92 }
] as const;

export const brands = [
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

export const editorial = [
  {
    title: `Има ли офис в ${brand.city} и как се посещава?`,
    text: `Да — офисът е в ${brand.city}. Свържете се с нас предварително, за да потвърдим удобен час за посещение.`,
    image: '/assets/asko96/asko96-showroom.jpg',
    href: '/blog',
    meta: 'Полезно',
    category: 'Ръководство'
  },
  {
    title: 'Какво можем да проверим преди покупка?',
    text: 'Уточнете с екипа какви данни за история, документи и техническо състояние са налични за избрания автомобил.',
    image: '/assets/asko96/vehicle-03-1.webp',
    href: '/blog',
    meta: 'Полезно',
    category: 'Ръководство'
  },
  {
    title: 'Може ли автомобил да се внесе по поръчка?',
    text: 'Да — можем да обсъдим внос по поръчка според критерии за модел, бюджет и оборудване.',
    image: '/assets/asko96/vehicle-04-1.webp',
    href: '/blog',
    meta: 'Полезно',
    category: 'Ръководство'
  }
] as const;
