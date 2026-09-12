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

export const demoTeamIntro = 'Не са предоставени потвърдени профили на екипа.';

export const demoPartnerIntro = 'Не са публикувани потвърдени партньорства за това демо.';

export const demoTeamMembers: DemoTeamMember[] = [];

export const demoPartners: DemoPartner[] = [];
