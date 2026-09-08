type DemoTeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
};

type DemoPartner = {
  id: string;
  name: string;
  image: string;
};

export const demoContentLabel = 'Астракар';

export const demoTeamIntro = 'Продажба, бартер, лизинг и сервизно обслужване. Уточнете условията с екипа.';

export const demoPartnerIntro = 'Марки в подбраните обяви. Наличността се потвърждава с Астракар.';

export const demoTeamMembers = [
  {
    "id": "service-0",
    "name": "Продажба на автомобили",
    "role": "Уточнете условията по телефона",
    "image": "/assets/astracar/vehicle-01-1.webp"
  },
  {
    "id": "service-1",
    "name": "Бартер",
    "role": "Уточнете условията по телефона",
    "image": "/assets/astracar/vehicle-02-1.webp"
  },
  {
    "id": "service-2",
    "name": "Лизинг по запитване",
    "role": "Уточнете условията по телефона",
    "image": "/assets/astracar/vehicle-03-1.webp"
  },
  {
    "id": "service-3",
    "name": "Сервизно обслужване",
    "role": "Уточнете условията по телефона",
    "image": "/assets/astracar/vehicle-04-1.webp"
  }
];

export const demoPartners: DemoPartner[] = [{id:'bmw',name:'BMW',image:'/assets/images/partner/parner12.png'},{id:'audi',name:'Audi',image:'/assets/images/partner/parner11.png'},{id:'mercedes',name:'Mercedes-Benz',image:'/assets/images/partner/parner8.png'}];
