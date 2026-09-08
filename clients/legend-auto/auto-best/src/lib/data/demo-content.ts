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

export const demoContentLabel = 'LEGEND AUTO';

export const demoTeamIntro = 'За наличност, оглед и подробности: 0899 877 305.';

export const demoPartnerIntro =
  'Примерни автомобилни марки за визуален преглед. Те не представят потвърдени партньорства.';

export const demoTeamMembers: DemoTeamMember[] = [
  {
    "id": "contact-0",
    "name": "Налични автомобили",
    "role": "LEGEND AUTO · 0899 877 305",
    "image": "/assets/legend-auto/vehicle-01-1.webp"
  },
  {
    "id": "contact-1",
    "name": "Оглед във Варна",
    "role": "LEGEND AUTO · 0899 877 305",
    "image": "/assets/legend-auto/vehicle-02-1.webp"
  },
  {
    "id": "contact-2",
    "name": "Транспорт в страната",
    "role": "LEGEND AUTO · 0899 877 305",
    "image": "/assets/legend-auto/vehicle-03-1.webp"
  },
  {
    "id": "contact-3",
    "name": "Контакт с автокъщата",
    "role": "LEGEND AUTO · 0899 877 305",
    "image": "/assets/legend-auto/vehicle-04-1.webp"
  }
];

export const demoPartners: DemoPartner[] = [];
