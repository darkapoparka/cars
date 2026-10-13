import * as stylex from '@stylexjs/stylex';

export const campaignTokens = stylex.defineVars({
  surface: '#171719',
  muted: '#dedee3',
  actionText: '#171719',
  lightSurface: '#f2f2f3',
  lightGradient: 'linear-gradient(115deg,#f0f0f2,#fafafa)',
  lightInk: '#262629',
  lightMuted: '#5c5c64',
  lightBorder: '#e2e2e6',
  ownershipSurface: '#171719',
  ownershipChip: '#303035',
  ownershipMuted: '#dedee3',
});

export const blueCampaignTheme = stylex.createTheme(campaignTokens, {
  surface: '#4130df',
  muted: '#eeebff',
  actionText: '#24204d',
  lightSurface: '#f0edff',
  lightGradient: 'linear-gradient(115deg,#e0dcff,#f4f8fc)',
  lightInk: '#4736fe',
  lightMuted: '#40547c',
  lightBorder: '#e5e6f3',
  ownershipSurface: '#075f59',
  ownershipChip: '#216f67',
  ownershipMuted: '#c5f3e7',
});
