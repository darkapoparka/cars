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
    display: { default: 'flex', '@media (min-width: 1024px)': 'grid' },
    gridTemplateColumns: {
      default: 'none',
      '@media (min-width: 1024px)': 'repeat(4,minmax(0,1fr))',
    },
    gap: { default: 8, '@media (min-width: 1024px)': 14 },
    overflowX: { default: 'auto', '@media (min-width: 1024px)': 'visible' },
    paddingTop: { default: 4, '@media (max-width: 699px)': 12, '@media (min-width: 1024px)': 0 },
    paddingBottom: { default: 4, '@media (min-width: 1024px)': 0 },
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
    width: { default: 'auto', '@media (min-width: 1024px)': '100%' },
    outlineColor: { default: colors.accent, '@media (min-width: 1024px)': colors.text },
  },
  desktopFace: {
    width: { default: 'auto', '@media (min-width: 1024px)': '100%' },
    justifyContent: { default: 'center', '@media (min-width: 1024px)': 'flex-start' },
    gap: { default: 6, '@media (min-width: 1024px)': 10 },
    minHeight: { default: 40, '@media (min-width: 1024px)': 44 },
    paddingInline: { default: 14, '@media (min-width: 1024px)': 16 },
    borderRadius: { default: 20, '@media (min-width: 1024px)': 22 },
    borderColor: {
      default: 'transparent',
      '@media (min-width: 1024px)': { default: colors.line, ':hover': colors.muted },
    },
    fontSize: 15,
  },
  desktopActive: {
    borderColor: {
      default: colors.text,
      '@media (min-width: 1024px)': { default: colors.text, ':hover': colors.text },
    },
    backgroundColor: { default: colors.text, '@media (min-width: 1024px)': colors.background },
    color: { default: colors.background, '@media (min-width: 1024px)': colors.text },
  },
});

export function ShowroomQuickPills({
  label,
  children,
  inset = true,
  fillDesktop = false,
}: {
  label: string;
  children: ReactNode;
  inset?: boolean;
  fillDesktop?: boolean;
}) {
  const { t } = useLocale();
  return (
    <div
      role="group"
      aria-label={t(label)}
      {...stylex.props(s.row, fillDesktop && s.desktopRow, inset && s.backdrop, !inset && s.flush)}
    >
      {children}
    </div>
  );
}

export function ShowroomQuickPill({
  children,
  active = false,
  fillDesktop = false,
  ...props
}: Omit<ComponentPropsWithRef<'button'>, 'children' | 'className' | 'style'> & {
  children: ReactNode;
  active?: boolean;
  fillDesktop?: boolean;
}) {
  const { t } = useLocale();
  return (
    <button
      type="button"
      {...props}
      aria-label={props['aria-label'] ? t(props['aria-label']) : undefined}
      {...stylex.props(s.button, fillDesktop && s.desktopButton)}
    >
      <span
        data-pill-surface
        {...stylex.props(
          s.face,
          fillDesktop && s.desktopFace,
          active && s.active,
          fillDesktop && active && s.desktopActive,
        )}
      >
        {typeof children === 'string' ? t(children) : children}
      </span>
    </button>
  );
}
