'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { useLocale } from '@/lib/use-locale';

const s = stylex.create({
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    overflowX: 'auto',
    scrollbarWidth: 'none',
    paddingInline: 16,
    paddingTop: { default: 4, '@media (max-width: 699px)': 12 },
    paddingBottom: 4,
    minWidth: 0,
  },
  backdrop: {
    backgroundColor: { default: colors.stripe, '@media (min-width: 1024px)': colors.background },
  },
  flush: { paddingInline: 0, paddingTop: 0, paddingBottom: 0 },
  desktopRow: {
    flexWrap: { default: 'nowrap', '@media (min-width: 1024px)': 'wrap' },
    gap: 8,
    overflowX: { default: 'auto', '@media (min-width: 1024px)': 'visible' },
    paddingInline: { default: 16, '@media (min-width: 1024px)': 12 },
    paddingTop: { default: 4, '@media (max-width: 699px)': 12, '@media (min-width: 1024px)': 8 },
    paddingBottom: { default: 4, '@media (min-width: 1024px)': 8 },
    marginInline: { default: 0, '@media (min-width: 1024px)': 16 },
    borderRadius: { default: 0, '@media (min-width: 1024px)': 12 },
    backgroundColor: {
      default: colors.stripe,
      '@media (min-width: 1024px)': colors.controlSurface,
    },
  },
  button: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 48,
    flexShrink: 0,
    padding: 0,
    borderWidth: 0,
    borderRadius: 20,
    backgroundColor: 'transparent',
    outlineColor: colors.accent,
    outlineOffset: -2,
    opacity: { default: 1, ':active': 0.75 },
  },
  face: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 40,
    paddingInline: 14,
    paddingBlock: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: { default: 'transparent', '@media (min-width: 1024px)': colors.line },
    borderRadius: 20,
    backgroundColor: {
      default: colors.background,
      '@media (min-width: 1024px)': { default: colors.background, ':hover': colors.stripe },
    },
    boxShadow: {
      default: '0 1px 4px rgba(27, 27, 33, 0.12)',
      '@media (min-width: 1024px)': 'none',
    },
    color: colors.text,
    fontSize: { default: 15, '@media (min-width: 1024px)': 14 },
    fontWeight: 500,
    lineHeight: '20px',
    whiteSpace: 'nowrap',
  },
  active: {
    borderColor: { default: colors.text, '@media (min-width: 1024px)': colors.accent },
    backgroundColor: { default: colors.text, '@media (min-width: 1024px)': colors.activeSurface },
    boxShadow: 'none',
    color: { default: colors.background, '@media (min-width: 1024px)': colors.accent },
    fontWeight: 600,
  },
  desktopButton: {
    minHeight: { default: 48, '@media (min-width: 1024px)': 44 },
  },
  desktopFace: {
    minHeight: { default: 40, '@media (min-width: 1024px)': 36 },
    paddingInline: { default: 14, '@media (min-width: 1024px)': 12 },
    paddingBlock: { default: 8, '@media (min-width: 1024px)': 7 },
    borderRadius: { default: 20, '@media (min-width: 1024px)': 18 },
    borderColor: {
      default: 'transparent',
      '@media (min-width: 1024px)': { default: colors.line, ':hover': colors.muted },
    },
    backgroundColor: {
      default: colors.background,
      '@media (min-width: 1024px)': { default: colors.background, ':hover': colors.panel },
    },
    fontSize: { default: 15, '@media (min-width: 1024px)': 14 },
  },
  desktopEmphasis: {
    borderColor: {
      default: 'transparent',
      '@media (min-width: 1024px)': colors.text,
    },
    backgroundColor: {
      default: colors.background,
      '@media (min-width: 1024px)': { default: colors.text, ':hover': colors.muted },
    },
    color: { default: colors.text, '@media (min-width: 1024px)': colors.background },
    fontWeight: 600,
  },
  desktopTrailing: { marginInlineStart: { default: 0, '@media (min-width: 1024px)': 'auto' } },
});

export function ShowroomQuickPills({
  label,
  children,
  inset = true,
  inventoryDesktop = false,
}: {
  label: string;
  children: ReactNode;
  inset?: boolean;
  inventoryDesktop?: boolean;
}) {
  const { t } = useLocale();
  return (
    <div
      role="group"
      aria-label={t(label)}
      {...stylex.props(
        s.row,
        inset && s.backdrop,
        !inset && s.flush,
        inventoryDesktop && s.desktopRow,
      )}
    >
      {children}
    </div>
  );
}

export function ShowroomQuickPill({
  children,
  active = false,
  inventoryDesktop = false,
  desktopEmphasis = false,
  ...props
}: Omit<ComponentPropsWithRef<'button'>, 'children' | 'className' | 'style'> & {
  children: ReactNode;
  active?: boolean;
  inventoryDesktop?: boolean;
  desktopEmphasis?: boolean;
}) {
  const { t } = useLocale();
  return (
    <button
      type="button"
      {...props}
      aria-label={props['aria-label'] ? t(props['aria-label']) : undefined}
      {...stylex.props(
        s.button,
        inventoryDesktop && s.desktopButton,
        desktopEmphasis && s.desktopTrailing,
      )}
    >
      <span
        data-pill-surface
        {...stylex.props(
          s.face,
          inventoryDesktop && s.desktopFace,
          active && s.active,
          desktopEmphasis && s.desktopEmphasis,
        )}
      >
        {typeof children === 'string' ? t(children) : children}
      </span>
    </button>
  );
}
