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

export const demoContentLabel = 'Демо съдържание';

export const demoTeamIntro =
  'За въпроси и оглед се свържете с Аутомаркет Варна на 0886 424 400.';

export const demoPartnerIntro =
  'Примерни автомобилни марки за визуален преглед. Те не представят потвърдени партньорства.';

export const demoTeamMembers: DemoTeamMember[] = [];

export const demoPartners: DemoPartner[] = [
  { id: 'carlogo', name: 'CARLOGO', image: '/assets/images/partner/par1.png' },
  { id: 'topcars', name: 'TOPCARS', image: '/assets/images/partner/par2.png' },
  { id: 'vehicle-store', name: 'VEHICLE STORE', image: '/assets/images/partner/par3.png' },
  { id: 'speedcare', name: 'SPEEDCARE', image: '/assets/images/partner/par4.png' },
  { id: 'carservice', name: 'CARSERVICE', image: '/assets/images/partner/par5.png' },
  { id: 'cartrade', name: 'CARTRADE', image: '/assets/images/partner/par6.png' }
];
