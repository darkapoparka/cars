import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';

const s = stylex.create({
  logo: {
    display: { default: 'none', '@media (min-width: 1024px)': 'inline-flex' },
    alignItems: 'center',
    width: 176,
    height: 44,
    flexShrink: 0,
    color: colors.text,
  },
  light: { color: '#fff' },
  artwork: {
    width: 176,
    height: 43,
    backgroundColor: 'currentColor',
    // The generated master supplies one compact silhouette on either header surface.
    maskImage: {
      default: 'none',
      '@media (min-width: 1024px)': 'url("/branding/showroom-compact-20261005.png")',
    },
    maskSize: '194.28px 86.35px',
    maskPosition: '-9.4px -21.9px',
    maskRepeat: 'no-repeat',
    maskMode: 'alpha',
  },
});

/** Generated neutral demo identity. Real dealer logos continue through Header's image boundary. */
export function ShowroomBrandLogo({ light, label }: { light: boolean; label: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      data-showroom-desktop-logo={light ? 'light' : 'dark'}
      {...stylex.props(s.logo, light && s.light)}
    >
      <span aria-hidden="true" {...stylex.props(s.artwork)} />
    </span>
  );
}
