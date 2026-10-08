import * as stylex from '@stylexjs/stylex';
import { controlShape } from '@/styles/control-tokens.stylex';
import { colors } from '@/styles/tokens.stylex';

// These fields are shared by the desktop hero and its vehicle-type selector.
export const desktopSearchStyles = stylex.create({
  field: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    minWidth: 0,
    minHeight: 56,
    paddingInline: 16,
    paddingBlock: 6,
    borderWidth: 0,
    borderRadius: controlShape.pill,
    backgroundColor: {
      default: colors.controlSurface,
      ':hover': colors.surface,
      '@media (min-width: 1024px)': {
        default: colors.background,
        ':hover': colors.controlSurface,
        ':disabled': colors.background,
        ':disabled:hover': colors.background,
      },
    },
    color: colors.text,
    textAlign: 'left',
    outlineColor: colors.accent,
    outlineWidth: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineOffset: -2,
  },
  open: { backgroundColor: colors.controlSurface },
  divider: {
    '::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      right: -3,
      width: 1,
      height: 28,
      transform: 'translateY(-50%)',
      backgroundColor: colors.cardLine,
      pointerEvents: 'none',
      opacity: { default: 1, ':hover': 0, ':focus-visible': 0 },
    },
  },
  hideDivider: { '::after': { opacity: 0 } },
  copy: { flex: '1', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 },
  label: { color: colors.muted, fontSize: 12, lineHeight: '18px' },
  value: {
    fontSize: 15,
    fontWeight: 500,
    lineHeight: '22px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});
