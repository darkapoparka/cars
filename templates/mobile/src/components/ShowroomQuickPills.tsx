'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { controlShape } from '@/styles/control-tokens.stylex';
import { colors } from '@/styles/tokens.stylex';
import { useLocale } from '@/lib/use-locale';
import { Icon } from './Icon';

const s = stylex.create({
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    overflowX: 'auto',
    scrollbarWidth: 'none',
    paddingInline: 16,
    paddingBlock: { default: 4, '@media (max-width: 699px)': 12 },
    minWidth: 0,
  },
  backdrop: {
    backgroundColor: { default: colors.stripe, '@media (min-width: 1024px)': colors.background },
  },
  flush: { paddingInline: 0, paddingTop: 0, paddingBottom: 0 },
  desktopRow: {
    flex: '0 1 auto',
    flexWrap: { default: 'nowrap', '@media (min-width: 1024px)': 'wrap' },
    justifyContent: { default: 'flex-start', '@media (min-width: 1024px)': 'center' },
    gap: 8,
    overflowX: { default: 'auto', '@media (min-width: 1024px)': 'visible' },
    paddingInline: 0,
    paddingBlock: { default: 4, '@media (max-width: 699px)': 8, '@media (min-width: 1024px)': 0 },
    marginInline: 0,
    borderRadius: 0,
    backgroundColor: {
      default: colors.background,
      '@media (min-width: 1024px)': 'transparent',
    },
  },
  compactPhoneRow: {
    paddingBlock: { default: 4, '@media (max-width: 699px)': 6, '@media (min-width: 1024px)': 0 },
  },
  button: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    minWidth: 44,
    minHeight: {
      default: 44,
      '@media (max-width: 699px)': 48,
      '@media (min-width: 1024px)': 48,
    },
    flexShrink: 0,
    padding: 0,
    borderWidth: 0,
    borderRadius: controlShape.pill,
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
    minHeight: {
      default: 36,
      '@media (max-width: 699px)': 40,
      '@media (min-width: 1024px)': 40,
    },
    paddingInline: { default: 12, '@media (min-width: 1024px)': 14 },
    paddingBlock: {
      default: 6,
      '@media (max-width: 699px)': 8,
      '@media (min-width: 1024px)': 8,
    },
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: { default: colors.cardLine, '@media (min-width: 1024px)': colors.line },
    borderRadius: controlShape.pill,
    backgroundColor: {
      default: colors.background,
      '@media (min-width: 1024px)': { default: colors.background, ':hover': colors.stripe },
    },
    color: colors.text,
    fontSize: { default: 14, '@media (max-width: 699px)': 16, '@media (min-width: 1024px)': 16 },
    fontWeight: 500,
    lineHeight: {
      default: '20px',
      '@media (max-width: 699px)': '22px',
      '@media (min-width: 1024px)': '22px',
    },
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
    minHeight: { default: 44, '@media (max-width: 699px)': 48 },
    borderRadius: controlShape.pill,
  },
  desktopFace: {
    minHeight: {
      default: 36,
      '@media (max-width: 699px)': 40,
      '@media (min-width: 1024px)': 38,
    },
    paddingInline: 12,
    paddingBlock: {
      default: 6,
      '@media (max-width: 699px)': 8,
      '@media (min-width: 1024px)': 8,
    },
    borderRadius: controlShape.pill,
    borderColor: {
      default: colors.cardLine,
      '@media (min-width: 1024px)': { default: colors.cardLine, ':hover': colors.line },
    },
  },
  desktopEmphasis: {
    borderColor: {
      default: 'transparent',
      '@media (min-width: 1024px)': { default: colors.cardLine, ':hover': colors.line },
    },
    fontWeight: 500,
  },
  desktopActive: {
    borderColor: colors.text,
    backgroundColor: colors.text,
    color: colors.background,
    fontWeight: { default: 600, '@media (min-width: 1024px)': 500 },
  },
  secondaryFace: {
    minHeight: { default: 36, '@media (min-width: 1024px)': 38 },
    paddingBlock: 6,
    fontSize: { default: 14, '@media (min-width: 1024px)': 16 },
    lineHeight: { default: '20px', '@media (min-width: 1024px)': '22px' },
  },
  secondaryPhoneFace: {
    minHeight: { default: 36, '@media (min-width: 1024px)': 38 },
    paddingBlock: { default: 6, '@media (min-width: 1024px)': 8 },
    fontSize: { default: 14, '@media (min-width: 1024px)': 16 },
    lineHeight: { default: '20px', '@media (min-width: 1024px)': '22px' },
  },
  secondarySurface: {
    borderColor: {
      default: colors.cardLine,
      '@media (max-width: 699px)': colors.line,
      '@media (min-width: 1024px)': colors.line,
    },
    backgroundColor: {
      default: colors.background,
      '@media (min-width: 1024px)': { default: colors.stripe, ':hover': colors.controlSurface },
    },
  },
  desktopTrailing: { marginInlineStart: { default: 0, '@media (min-width: 1024px)': 'auto' } },
  iconOnlyButton: { width: 44, justifyContent: 'center' },
  iconOnlyFace: {
    width: { default: 36, '@media (min-width: 1024px)': 38 },
    paddingInline: 0,
    borderRadius: controlShape.circle,
  },
  removable: {
    display: { default: 'contents', '@media (min-width: 1024px)': 'inline-flex' },
    position: 'relative',
    flexShrink: 0,
  },
  removableFace: { paddingInline: { default: 12, '@media (min-width: 1024px)': 18 } },
  removableActiveFace: {
    paddingInlineStart: { default: 12, '@media (min-width: 1024px)': 9 },
    paddingInlineEnd: { default: 12, '@media (min-width: 1024px)': 27 },
  },
  removeButton: {
    display: { default: 'none', '@media (min-width: 1024px)': 'inline-flex' },
    position: 'absolute',
    insetInlineEnd: 2,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    minHeight: 44,
    padding: 0,
    borderWidth: 0,
    borderRadius: controlShape.pill,
    backgroundColor: { default: 'transparent', ':hover': 'rgba(255,255,255,.16)' },
    color: colors.background,
    outlineColor: colors.accent,
    outlineOffset: -2,
  },
  rail: {
    display: { default: 'block', '@media (min-width: 1024px)': 'flex' },
    alignItems: 'center',
    flex: '0 1 auto',
    minWidth: 0,
  },
  railInset: { paddingInline: { default: 16, '@media (min-width: 1024px)': 0 } },
});

export function ShowroomQuickPills({
  label,
  children,
  inset = true,
  inventoryDesktop = false,
  compactOnPhone = false,
}: {
  label: string;
  children: ReactNode;
  inset?: boolean;
  inventoryDesktop?: boolean;
  compactOnPhone?: boolean;
}) {
  const { t } = useLocale();
  const content = (
    <div
      role="group"
      aria-label={t(label)}
      {...stylex.props(
        s.row,
        inset && s.backdrop,
        !inset && s.flush,
        inventoryDesktop && s.desktopRow,
        inventoryDesktop && compactOnPhone && s.compactPhoneRow,
      )}
    >
      {children}
    </div>
  );
  if (!inventoryDesktop) return content;
  return (
    <div data-quick-filter-rail {...stylex.props(s.rail, inset && s.railInset)}>
      {content}
    </div>
  );
}

export function ShowroomQuickPill({
  children,
  active = false,
  inventoryDesktop = false,
  trailingDesktop = false,
  secondary = false,
  secondaryOnPhone = false,
  iconOnly = false,
  emphasizedDesktop = false,
  clearDesktop,
  ...props
}: Omit<ComponentPropsWithRef<'button'>, 'children' | 'className' | 'style'> & {
  children: ReactNode;
  active?: boolean;
  inventoryDesktop?: boolean;
  trailingDesktop?: boolean;
  secondary?: boolean;
  secondaryOnPhone?: boolean;
  iconOnly?: boolean;
  emphasizedDesktop?: boolean;
  clearDesktop?: { key: string; label: string; onClear: () => void };
}) {
  const { t } = useLocale();
  const button = (
    <button
      type="button"
      {...props}
      aria-label={props['aria-label'] ? t(props['aria-label']) : undefined}
      {...stylex.props(
        s.button,
        inventoryDesktop && s.desktopButton,
        trailingDesktop && s.desktopTrailing,
        iconOnly && s.iconOnlyButton,
      )}
    >
      <span
        data-pill-surface
        {...stylex.props(
          s.face,
          inventoryDesktop && s.desktopFace,
          emphasizedDesktop && s.desktopEmphasis,
          clearDesktop && s.removableFace,
          active && clearDesktop && s.removableActiveFace,
          (inventoryDesktop || secondaryOnPhone) && s.secondarySurface,
          active && s.active,
          active && inventoryDesktop && s.desktopActive,
          secondary && s.secondaryFace,
          secondaryOnPhone && s.secondaryPhoneFace,
          iconOnly && s.iconOnlyFace,
        )}
      >
        {typeof children === 'string' ? t(children) : children}
      </span>
    </button>
  );
  if (!clearDesktop) return button;
  return (
    <span
      data-selected-filter={active ? clearDesktop.key : undefined}
      {...stylex.props(s.removable)}
    >
      {button}
      {active && (
        <button
          type="button"
          data-remove-selected-filter={clearDesktop.key}
          aria-label={clearDesktop.label}
          title={clearDesktop.label}
          onClick={clearDesktop.onClear}
          {...stylex.props(s.removeButton)}
        >
          <Icon name="close" size={12} />
        </button>
      )}
    </span>
  );
}
