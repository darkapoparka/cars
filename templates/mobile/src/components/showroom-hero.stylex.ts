import * as stylex from '@stylexjs/stylex';
import { controlShape } from '@/styles/control-tokens.stylex';
import { colors } from '@/styles/tokens.stylex';
import { showroomDesktop } from '@/styles/showroom-desktop-tokens.stylex';

// A heading and a 68px base row anchor the desktop journeys consistently.
// Services keeps category navigation in the content drawer below the hero.
// Wrappers dissolve below 1024px to retain each screen's phone composition.
export const showroomHeroStyles = stylex.create({
  layout: {
    display: { default: 'contents', '@media (min-width: 1024px)': 'grid' },
    gridTemplateColumns: 'minmax(0, 1fr)',
    gridTemplateRows: 'auto 68px',
    alignContent: 'center',
    alignItems: 'start',
    justifyItems: 'center',
    justifyContent: { default: 'flex-start', '@media (min-width: 1024px)': 'center' },
    gap: { default: 24, '@media (min-width: 1024px)': showroomDesktop.heroGap },
    minHeight: { default: 280, '@media (min-width: 1024px)': showroomDesktop.heroHeight },
    marginInline: { default: 16, '@media (min-width: 1024px)': 0 },
    marginTop: { default: 8, '@media (min-width: 1024px)': 0 },
    marginBottom: 0,
    paddingTop: { default: 32, '@media (min-width: 1024px)': showroomDesktop.heroPaddingTop },
    paddingBottom: { default: 32, '@media (min-width: 1024px)': showroomDesktop.heroPaddingBottom },
    paddingInline: { default: 24, '@media (min-width: 1200px)': 40 },
    borderRadius: { default: 20, '@media (min-width: 1024px)': 0 },
    color: '#fff',
    backgroundColor: { default: '#263644', '@media (min-width: 1024px)': 'transparent' },
  },
  copy: {
    display: { default: 'contents', '@media (min-width: 1024px)': 'block' },
    position: 'relative',
    textAlign: 'center',
    width: '100%',
    maxWidth: showroomDesktop.heroCopyWidth,
  },
  desktopCopy: { display: { default: 'none', '@media (min-width: 1024px)': 'block' } },
  title: {
    position: { default: 'absolute', '@media (min-width: 1024px)': 'static' },
    width: { default: 1, '@media (min-width: 1024px)': 'auto' },
    height: { default: 1, '@media (min-width: 1024px)': 'auto' },
    margin: { default: -1, '@media (min-width: 1024px)': 0 },
    padding: 0,
    overflow: { default: 'hidden', '@media (min-width: 1024px)': 'visible' },
    clip: { default: 'rect(0,0,0,0)', '@media (min-width: 1024px)': 'auto' },
    whiteSpace: { default: 'nowrap', '@media (min-width: 1024px)': 'normal' },
    borderWidth: 0,
    fontFamily: 'var(--font-base), Arial, sans-serif',
    fontSize: {
      default: 'clamp(32px, 3vw, 40px)',
      '@media (min-width: 1024px)': showroomDesktop.heroTitleSize,
    },
    fontWeight: 700,
    lineHeight: 1.12,
    letterSpacing: '-.02em',
    textWrap: 'balance',
  },
  location: {
    position: 'absolute',
    top: -28,
    insetInline: 0,
    display: { default: 'none', '@media (min-width: 1024px)': 'flex' },
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    color: 'rgba(255, 255, 255, .82)',
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '20px',
  },
  controlSurface: {
    display: { default: 'contents', '@media (min-width: 1024px)': 'block' },
    width: '100%',
    minHeight: 68,
    maxWidth: 1040,
    borderRadius: controlShape.pill,
    color: colors.text,
    backgroundColor: colors.background,
    boxShadow: '0 8px 24px rgba(14, 25, 36, .12)',
  },
  serviceControlSurface: {
    maxWidth: 620,
    backgroundColor: 'transparent',
    borderRadius: 0,
    boxShadow: 'none',
  },
  contactControlSurface: {
    maxWidth: 720,
    backgroundColor: 'transparent',
    borderRadius: 0,
    boxShadow: 'none',
  },
});
