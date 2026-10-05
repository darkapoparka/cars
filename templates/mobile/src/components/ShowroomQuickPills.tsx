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
});

export function ShowroomQuickPills({
  label,
  children,
  inset = true,
}: {
  label: string;
  children: ReactNode;
  inset?: boolean;
}) {
  const { t } = useLocale();
  return (
    <div
      role="group"
      aria-label={t(label)}
      {...stylex.props(s.row, inset && s.backdrop, !inset && s.flush)}
    >
      {children}
    </div>
  );
}

export function ShowroomQuickPill({
  children,
  active = false,
  ...props
}: Omit<ComponentPropsWithRef<'button'>, 'children' | 'className' | 'style'> & {
  children: ReactNode;
  active?: boolean;
}) {
  const { t } = useLocale();
  return (
    <button
      type="button"
      {...props}
      aria-label={props['aria-label'] ? t(props['aria-label']) : undefined}
      {...stylex.props(s.button)}
    >
      <span data-pill-surface {...stylex.props(s.face, active && s.active)}>
        {typeof children === 'string' ? t(children) : children}
      </span>
    </button>
  );
}
