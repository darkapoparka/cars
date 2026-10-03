import { featuredVehicles } from './inventory';

// Visual examples only: these selections are not records of completed transactions.
export const demoWorkflowShowcases = {
  'trade-in': {
    title: 'Наскоро продадени',
    vehicles: [featuredVehicles[0], featuredVehicles[3], featuredVehicles[5]]
  },
  import: {
    title: 'Последно внесени',
    vehicles: [featuredVehicles[1], featuredVehicles[2], featuredVehicles[4]]
  }
};

type DemoTeamMember = {
  id: string;
  name: string;
  role: 'company.team.sales' | 'company.team.import' | 'company.team.finance' | 'company.team.support';
  image: string;
};

type DemoPartner = {
  id: string;
  name: string;
  image: string;
};

export const demoContentLabel = 'Демо съдържание';

export const demoTeamIntro =
  'Примерни профили за визуален преглед. Имената и снимките ще бъдат заменени с реалния екип.';

export const demoPartnerIntro =
  'Примерни автомобилни марки за визуален преглед. Те не представят потвърдени партньорства.';

export const demoTeamMembers: DemoTeamMember[] = [
  {
    id: 'arlene-mccoy',
    name: 'Arlene McCoy',
    role: 'company.team.sales',
    image: '/assets/images/img-box/team1.jpg'
  },
  {
    id: 'ronald-richards',
    name: 'Ronald Richards',
    role: 'company.team.import',
    image: '/assets/images/img-box/team2.jpg'
  },
  {
    id: 'leslie-alexander',
    name: 'Leslie Alexander',
    role: 'company.team.finance',
    image: '/assets/images/img-box/team3.jpg'
  },
  {
    id: 'cody-fisher',
    name: 'Cody Fisher',
    role: 'company.team.support',
    image: '/assets/images/img-box/team4.jpg'
  }
];

export const demoPartners: DemoPartner[] = [
  { id: 'carlogo', name: 'CARLOGO', image: '/assets/images/partner/par1.png' },
  { id: 'topcars', name: 'TOPCARS', image: '/assets/images/partner/par2.png' },
  { id: 'vehicle-store', name: 'VEHICLE STORE', image: '/assets/images/partner/par3.png' },
  { id: 'speedcare', name: 'SPEEDCARE', image: '/assets/images/partner/par4.png' },
  { id: 'carservice', name: 'CARSERVICE', image: '/assets/images/partner/par5.png' },
  { id: 'cartrade', name: 'CARTRADE', image: '/assets/images/partner/par6.png' }
];
