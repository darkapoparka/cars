import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';

// Applied only by the desktop editor; phone and native picker styles stay independent.
export const desktopModelOptions = stylex.create({
  group: { borderBottomWidth: 0, marginBottom: 0 },
  choice: {
    minHeight: 48,
    paddingInline: 8,
    gap: 4,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: '24px',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.stripe,
      ':active': colors.controlSurface,
    },
  },
  selected: {
    backgroundColor: { default: colors.controlSurface, ':hover': colors.controlSurface },
  },
  childChoice: { paddingLeft: 24 },
  checkTarget: { order: -1, width: 32, minHeight: 48 },
  checkbox: {
    borderColor: { default: colors.muted, ':checked': colors.text },
    backgroundColor: { default: colors.background, ':checked': colors.text },
  },
  mixed: { borderColor: colors.text, backgroundColor: colors.text },
  familyRow: {
    paddingInline: 8,
    gap: 4,
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: { default: 'transparent', ':hover': colors.stripe },
  },
  familyButton: {
    minHeight: 48,
    paddingLeft: 0,
    paddingRight: 8,
    fontSize: 16,
    lineHeight: '24px',
  },
  extras: { marginTop: 8, borderTopWidth: 0, maxHeight: '72%' },
  summary: {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    minHeight: 48,
    fontSize: 16,
    lineHeight: '24px',
    borderRadius: 10,
    backgroundColor: { default: colors.stripe, ':active': colors.controlSurface },
  },
  optionFields: { paddingTop: 12 },
  excludeRow: { fontSize: 16, lineHeight: '24px' },
});
