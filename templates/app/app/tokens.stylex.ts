import * as stylex from '@stylexjs/stylex';

export const tokens = stylex.defineVars({
  fontSans: 'Geist, Roboto, Arial, sans-serif',
  fontDisplay: 'Geist, Roboto, Arial, sans-serif',
  // Keep legacy names compatible; all shared brand accents use the charcoal palette.
  violet: '#202024',
  violetDark: '#111113',
  violetSoft: '#f0f0f2',
  blue: '#202024',
  blueDark: '#111113',
  ink: '#202024',
  text: '#202024',
  muted: '#626269',
  subtle: '#66666e',
  surface: '#ffffff',
  bannerSurface: '#e3e3e3',
  bannerMuted: '#606065',
  surfaceAlt: '#f6f6f7',
  rail: '#f5f5f6',
  line: '#e6e6e9',
  surfaceBorder: '#d7d7dc',
  controlBorder: '#86868e',
  green: '#08a64f',
  pink: '#f32689',
  orange: '#ef7000',
  shadowSoft: '0 2px 8px rgba(0,0,0,.065)',
  shadow: '0 8px 20px rgba(10, 29, 72, 0.08)',
  shadowStrong: '0 18px 46px rgba(13, 24, 62, 0.18)',
  radiusSm: '12px',
  radiusXs: '8px',
  radiusMd: '18px',
  radiusLg: '24px',
  radiusXl: '32px',
  radiusPill: '999px',
  content: '1364px',
  // Fixed desktop page bars align with the borderless shell.
  desktopShellInset: 'max(0px, calc((100% - 1364px) / 2))',
  desktopLabelSize: '12px',
  desktopSupportSize: '14px',
  // One desktop filter type scale: regular controls, medium emphasis, distinct headings.
  desktopTextSize: '16px',
  desktopTextWeight: '400',
  desktopTextLineHeight: '24px',
  desktopEmphasisWeight: '500',
  desktopTitleSize: '20px',
  desktopTitleWeight: '600',
  desktopTitleLineHeight: '26px',
  desktopSupportLineHeight: '20px',
  desktopLabelLineHeight: '18px',
  controlHeight: '44px',
  controlCompactHeight: '36px',
  controlIconSize: '18px',
  controlFontSize: '14px',
  controlLineHeight: '20px',
  bannerPadding: '20px',
  bannerTitleSize: '24px',
  bannerTitleLineHeight: '28px',
  bannerCopySize: '15px',
  bannerCopyLineHeight: '21px',
  // Visible 12px gaps account for 2px pill hit padding and 4px brand focus padding.
  mobileSectionGap: '12px',
  mobilePillGap: '10px',
  mobileBrandGap: '8px',
});

// The retained Geist subset has no Cyrillic. Use one complete family
// for Bulgarian text, numbers and controls instead of per-glyph fallbacks.
export const bulgarianTypography = stylex.createTheme(tokens, {
  fontSans: 'Roboto, Arial, sans-serif',
  fontDisplay: 'Roboto, Arial, sans-serif',
});

export const media = stylex.defineConsts({
  mobile: '@media (max-width: 767px)',
  tablet: '@media (min-width: 768px) and (max-width: 1099px)',
  desktop: '@media (min-width: 1100px)',
});
