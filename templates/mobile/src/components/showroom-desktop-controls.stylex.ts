import * as stylex from '@stylexjs/stylex';
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
    borderRadius: 10,
    backgroundColor: { default: 'transparent', ':hover': colors.stripe },
    color: colors.text,
    textAlign: 'left',
    outlineColor: colors.accent,
    outlineWidth: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineOffset: -2,
  },
  open: { backgroundColor: colors.activeSurface },
  divided: {
    '::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 12,
      bottom: 12,
      width: 1,
      backgroundColor: colors.line,
    },
  },
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
