import * as stylex from '@stylexjs/stylex';

export const tokens = stylex.defineVars({
  fontSans: 'Geist, Roboto, Arial, sans-serif',
  fontDisplay: 'Poppins, Roboto, Arial, sans-serif',
  // Keep legacy names compatible; all shared brand accents use the charcoal palette.
  violet: '#202024',
  violetDark: '#111113',
  violetSoft: '#f0f0f2',
  blue: '#202024',
  blueDark: '#111113',
  ink: '#202024',
  text: '#202024',
  muted: '#717178',
  subtle: '#9d9d9d',
  surface: '#ffffff',
  bannerSurface: '#e3e3e3',
  bannerMuted: '#606065',
  surfaceAlt: '#f6f6f7',
  rail: '#f5f5f6',
  line: '#e6e6e9',
  green: '#08a64f',
  pink: '#f32689',
  orange: '#ef7000',
  shadow: '0 8px 20px rgba(10, 29, 72, 0.08)',
  shadowStrong: '0 18px 46px rgba(13, 24, 62, 0.18)',
  radiusSm: '12px',
  radiusMd: '18px',
  radiusLg: '24px',
  radiusXl: '32px',
  content: '1240px',
});

export const media = stylex.defineConsts({
  mobile: '@media (max-width: 767px)',
  tablet: '@media (min-width: 768px) and (max-width: 1099px)',
  desktop: '@media (min-width: 1100px)',
});
