import { featuredVehicles } from './inventory';
import { bodyLabel } from './listing';
import { brand } from '$config/brand';
import { dealer } from './dealer';

const bodyArtwork=[
  {label:'Седан',query:'Sedan',image:'/assets/images/icon-box/car-list1.png',width:150,height:80},
  {label:'Хечбек',query:'Hatchback',image:'/assets/images/icon-box/car-list2.png',width:140,height:80},
  {label:'Пикап',query:'Pickup Truck',image:'/assets/images/icon-box/car-list3.png',width:140,height:80},
  {label:'SUV',query:'SUV',image:'/assets/images/icon-box/car-list4.png',width:166,height:96},
  {label:'Кросоувър',query:'Crossover',image:'/assets/images/icon-box/car-list5.png',width:206,height:95},
  {label:'Миниван',query:'Minivan',image:'/assets/images/icon-box/car-list6.png',width:140,height:80},
  {label:'Комби',query:'Wagon',image:'/assets/images/icon-box/car-list7.png',width:140,height:80},
  {label:'Кабриолет',query:'Convertible',image:'/assets/images/icon-box/car-list8.png',width:152,height:92},
  {label:'Купе',query:'Coupe',image:'/assets/images/icon-box/car-list1.png',width:150,height:80},
  {label:'Ван',query:'Van',image:'/assets/images/icon-box/car-list6.png',width:140,height:80}
] as const;
const brandArtwork=[
  {label:'Land Rover',image:'/assets/images/partner/partner1.png'},
  {label:'Kia',image:'/assets/images/partner/partner2.png'},
  {label:'Toyota',image:'/assets/images/partner/partner3.png'},
  {label:'Jeep',image:'/assets/images/partner/partner4.png'},
  {label:'Nissan',image:'/assets/images/partner/partner5.png'},
  {label:'Ford',image:'/assets/images/partner/partner6.png'},
  {label:'Foton',image:'/assets/images/partner/parner7.png'},
  {label:'Mercedes-Benz',image:'/assets/images/partner/parner8.png'},
  {label:'Dongfeng',image:'/assets/images/partner/parner9.png'},
  {label:'Isuzu',image:'/assets/images/partner/parner10.png'},
  {label:'Audi',image:'/assets/images/partner/parner11.png'},
  {label:'BMW',image:'/assets/images/partner/parner12.png'}
] as const;
export const bodyTypes=[...new Set(featuredVehicles.map(vehicle=>vehicle.body))].map(query=>{
  const artwork=bodyArtwork.find(item=>item.query===query)??bodyArtwork[0];
  return {...artwork,query,label:bodyLabel(query),count:featuredVehicles.filter(vehicle=>vehicle.body===query).length};
});
// Where no manufacturer artwork is supplied, retain a neutral car illustration,
// never borrow another manufacturer's badge or mislabel dealer branding.
export const brands=[...new Set(featuredVehicles.map(vehicle=>vehicle.make))].map(label=>({
  label,image:brandArtwork.find(item=>item.label===label)?.image??'/assets/images/icon-box/car-list2.png',
  count:featuredVehicles.filter(vehicle=>vehicle.make===label).length
}));
export const editorial=[
  {title:`Как да посетите ${brand.name}?`,text:'Проверете публикувания адрес и се обадете предварително за наличност и удобен час.',image:dealer.hero,href:'/contact',meta:'Полезно',category:'Ръководство'},
  {title:'Какво да попитате преди покупка?',text:'Уточнете пробега, произхода, документите и възможностите за независим технически преглед.',image:dealer.hero,href:'/blog-detail/1',meta:'Полезно',category:'Ръководство'},
  {title:'Как да сравните обявите?',text:'Сравнявайте конкретните данни и пълната обявена цена. Потвърдете всички условия с продавача.',image:dealer.hero,href:'/blog-detail/2',meta:'Полезно',category:'Ръководство'}
] as const;
