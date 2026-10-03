'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';

const s = stylex.create({
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    overflowX: 'auto',
    scrollbarWidth: 'none',
    paddingInline: 16,
    paddingBlock: 4,
    minWidth: 0,
  },
  backdrop: { backgroundColor: colors.stripe },
  flush: { paddingInline: 0, paddingBlock: 0 },
  button: {
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
    borderColor: colors.line,
    borderRadius: 20,
    backgroundColor: colors.background,
    color: colors.muted,
    fontSize: 15,
    fontWeight: 500,
    lineHeight: '20px',
    whiteSpace: 'nowrap',
  },
  active: {
    borderColor: colors.muted,
    color: colors.text,
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
  return (
    <div
      role="group"
      aria-label={label}
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
  return (
    <button type="button" {...props} {...stylex.props(s.button)}>
      <span data-pill-surface {...stylex.props(s.face, active && s.active)}>
        {children}
      </span>
    </button>
  );
}
