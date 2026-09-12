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

export const demoContentLabel = 'Demo content';

export const demoTeamIntro =
  'Sample profiles for visual review. Names and photos will be replaced with the actual team.';

export const demoPartnerIntro =
  'Sample vehicle brands for visual review. They do not represent confirmed partnerships.';

export const demoTeamMembers: DemoTeamMember[] = [];

export const demoPartners: DemoPartner[] = [];
