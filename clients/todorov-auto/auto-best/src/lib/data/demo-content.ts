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
  "В този преглед не са включени персонални профили на служители.";

export const demoPartnerIntro =
  "В този преглед не се заявяват партньорства.";

export const demoTeamMembers: DemoTeamMember[] = [];

export const demoPartners: DemoPartner[] = [];
