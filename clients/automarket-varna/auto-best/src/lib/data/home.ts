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
  {
    "label": "Ford",
    "image": "/assets/automarket/make-ford.svg"
  },
  {
    "label": "Opel",
    "image": "/assets/automarket/make-opel.svg"
  },
  {
    "label": "Honda",
    "image": "/assets/automarket/make-honda.svg"
  },
  {
    "label": "VW",
    "image": "/assets/automarket/make-volkswagen.svg"
  },
  {
    "label": "Mazda",
    "image": "/assets/automarket/make-mazda.svg"
  },
  {
    "label": "BMW",
    "image": "/assets/automarket/make-bmw.svg"
  },
  {
    "label": "Audi",
    "image": "/assets/automarket/make-audi.svg"
  },
  {
    "label": "Mercedes-Benz",
    "image": "/assets/images/partner/parner8.png"
  }
] as const;

export const editorial = [
  {
    title: `Има ли офис в ${brand.city} и как се посещава?`,
    text: `Да — офисът е в ${brand.city}. Свържете се с нас предварително, за да потвърдим удобен час за посещение.`,
    image: '/assets/images/lead/day-night-guide-inspection.webp',
    href: '/blog',
    meta: 'Полезно',
    category: 'Ръководство'
  },
  {
    title: 'Какво можем да проверим преди покупка?',
    text: 'Можем да съдействаме с проверка на история, документи и техническо състояние преди финално решение.',
    image: '/assets/images/lead/day-night-guide-import.webp',
    href: '/blog',
    meta: 'Полезно',
    category: 'Ръководство'
  },
  {
    title: 'Може ли автомобил да се внесе по поръчка?',
    text: 'Да — можем да обсъдим внос по поръчка според критерии за модел, бюджет и оборудване.',
    image: '/assets/images/lead/day-night-guide-leasing.webp',
    href: '/blog',
    meta: 'Полезно',
    category: 'Ръководство'
  }
] as const;
