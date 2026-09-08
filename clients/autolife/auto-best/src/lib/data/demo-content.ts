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
  'Няма публикувани потвърдени профили на екипа.';

export const demoPartnerIntro =
  'Няма публикувани потвърдени партньорства.';

export const demoTeamMembers: DemoTeamMember[] = [];

export const demoPartners: DemoPartner[] = [];
