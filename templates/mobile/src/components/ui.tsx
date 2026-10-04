'use client';
import { useLocale } from '@/lib/use-locale';
import { useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { controls } from '@/styles/controls.stylex';
import { lockDocumentScroll } from '@/lib/scroll-lock';
import { Icon, type IconName } from './Icon';
export const ui = stylex.create({
  row: { display: 'flex', alignItems: 'center', gap: 8 },
  between: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  column: { display: 'flex', flexDirection: 'column', gap: 16 },
  grow: { flex: '1', minWidth: 0 },
  wrap: { flexWrap: 'wrap' },
  center: { textAlign: 'center' },
  muted: { color: colors.muted },
  small: { fontSize: 12, lineHeight: '20px' },
  text: { fontSize: 16, lineHeight: '24px' },
  title: { fontFamily: 'var(--font-base)', fontSize: 20, fontWeight: 700, lineHeight: '28px' },
  heading: { fontFamily: 'var(--font-hero)', fontSize: 24, fontWeight: 700, lineHeight: '32px' },
  bold: { fontWeight: 700 },
  pad: { padding: 16 },
  section: { padding: 24 },
  card: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 16,
    padding: 24,
  },
  input: {
    fontWeight: 400,
    width: '100%',
    height: 48,
    paddingInline: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#818592',
    borderRadius: 8,
    backgroundColor: colors.controlSurface,
    color: colors.text,
    fontSize: 16,
    outlineColor: colors.text,
    outlineWidth: 2,
    outlineOffset: 2,
  },
  label: { display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, fontWeight: 500 },
  divider: { height: 1, backgroundColor: colors.line, borderWidth: 0, marginBlock: 16 },
  purple: { color: colors.purple },
  orange: { color: colors.accent },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12 },
  block: { width: '100%' },
  space: { marginTop: 16 },
  bottomSpace: { marginBottom: 16 },
  resetLink: { color: 'inherit', textDecoration: 'none' },
  badge: {
    backgroundColor: '#ff8f66',
    color: '#1b1b21',
    borderRadius: 6,
    paddingBlock: 2,
    paddingInline: 8,
    fontSize: 12,
    fontWeight: 700,
  },
  empty: {
    padding: 32,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
});
const s = stylex.create({
  button: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
    paddingInline: 16,
    paddingBlock: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderStyle: 'solid',
    fontSize: 14,
    fontWeight: 700,
    lineHeight: '20px',
    textDecoration: 'none',
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    transition: 'filter 120ms, transform 120ms',
    filter: { default: 'none', ':hover': 'brightness(.95)' },
    transform: { default: 'none', ':active': 'translateY(1px)' },
    opacity: { default: 1, ':disabled': 0.45 },
  },
  compact: { minHeight: 32, paddingBlock: 4, paddingInline: 8 },
  floating: { minHeight: 48, borderRadius: 24, paddingInline: 24 },
  dense: { minHeight: 36, paddingBlock: 6 },
  disabled: {
    backgroundColor: colors.controlSurface,
    borderColor: '#c7cbd3',
    color: '#b0b6c0',
    opacity: 1,
    filter: 'none',
  },
  primary: { backgroundColor: colors.accent, borderColor: colors.accent, color: '#fff' },
  purple: { backgroundColor: colors.deepPurple, borderColor: colors.deepPurple, color: '#fff' },
  outline: { backgroundColor: 'transparent', borderColor: colors.purpleLine, color: colors.purple },
  ghost: { backgroundColor: 'transparent', borderColor: 'transparent', color: colors.purple },
  icon: {
    width: 48,
    height: 48,
    padding: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: { default: 'transparent', ':hover': colors.surface },
    borderWidth: 0,
    color: 'inherit',
    borderRadius: 24,
    cursor: 'pointer',
    flexShrink: 0,
  },
  dialog: {
    backgroundColor: colors.background,
    color: colors.text,
    borderWidth: 0,
    borderRadius: 16,
    width: 'calc(100% - 68px)',
    maxWidth: 480,
    maxHeight: 'calc(100dvh - 64px)',
    margin: 'auto',
    padding: 24,
    overflow: 'auto',
    boxShadow: '0 16px 60px #0004',
  },
  sheet: {
    width: '100%',
    maxWidth: 620,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 0,
    maxHeight: '90dvh',
  },
  nativeSheet: {
    paddingInline: 16,
    paddingTop: 22,
    paddingBottom: 0,
    '::backdrop': { backgroundColor: 'rgba(0,0,0,.33)' },
  },
  rangeDialog: { padding: 16, transform: 'translateY(-3px)' },
  selectionDialog: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    maxHeight: 'calc(100dvh - 44px)',
    transform: 'translateY(-3px)',
  },
  selectionTitle: {
    marginBottom: 0,
    paddingTop: 16,
    paddingBottom: 14,
    paddingInline: 24,
    flexShrink: 0,
  },
  sortingDialog: { paddingTop: 16, paddingBottom: 8, transform: 'translateY(-3px)' },
  sortingTitle: { marginBottom: 16 },
  fullScreenDialog: {
    width: '100%',
    height: '100dvh',
    maxHeight: '100dvh',
    maxWidth: 1100,
    padding: 0,
    margin: 'auto',
    borderRadius: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  materialDialog: {
    padding: 0,
    maxWidth: 360,
    backgroundColor: colors.background,
    '::backdrop': { backgroundColor: 'rgba(0,0,0,.33)' },
  },
  flowSheet: {
    width: { default: '100%', '@media (min-width: 700px)': 'calc(100% - 48px)' },
    height: {
      default: '100dvh',
      '@media (min-width: 700px)': 'min(760px, calc(100dvh - 48px))',
    },
    maxHeight: { default: '100dvh', '@media (min-width: 700px)': 'calc(100dvh - 48px)' },
    maxWidth: 640,
    padding: 0,
    margin: 'auto',
    borderRadius: { default: 0, '@media (min-width: 700px)': 20 },
    display: { default: 'flex', ':not([open])': 'none' },
    flexDirection: 'column',
    overflow: 'hidden',
    '::backdrop': { backgroundColor: 'rgba(0,0,0,.4)' },
  },
  wideFlowSheet: {
    maxWidth: { default: 640, '@media (min-width: 700px)': 820 },
    // Keep the frame stable across tabs; each panel owns its scrolling content.
    height: {
      default: '100dvh',
      '@media (min-width: 700px)': 'min(680px, calc(100dvh - 48px))',
    },
    maxHeight: {
      default: '100dvh',
      '@media (min-width: 700px)': 'min(680px, calc(100dvh - 48px))',
    },
    '::backdrop': {
      backgroundColor: {
        default: 'rgba(0,0,0,.4)',
        '@media (min-width: 700px)': 'rgba(20,24,32,.22)',
      },
      backdropFilter: { default: 'none', '@media (min-width: 700px)': 'blur(8px)' },
    },
  },
  wideDialog: { width: 'calc(100% - 48px)', padding: 0 },
  pickerHeight: (height: number) => ({ height: `min(${height}px, calc(100dvh - 44px))` }),
  pickerDialog: {
    height: 'calc(100dvh - 44px)',
    maxHeight: 'calc(100dvh - 44px)',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transform: 'translateY(-2px)',
  },
  tableDialog: {
    height: 'calc(100dvh - 44px)',
    maxHeight: 'calc(100dvh - 44px)',
    transform: 'translateY(-3px)',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
  },
  modalTitle: {
    fontFamily: 'var(--font-base)',
    fontSize: 20,
    fontWeight: 700,
    lineHeight: '28px',
    marginBottom: 24,
  },
  checkbox: { width: 22, height: 22, accentColor: colors.accent, flexShrink: 0 },
  checkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
    fontSize: 16,
    cursor: 'pointer',
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    paddingBlock: 6,
    paddingInline: 8,
    backgroundColor: colors.surface,
    borderRadius: 8,
    fontSize: 14,
    lineHeight: '16px',
    whiteSpace: 'nowrap',
  },
});
export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  icon,
  block = false,
  disabled = false,
  type = 'button',
  label,
  compact = false,
  dense = false,
  floating = false,
  xstyle,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'purple' | 'outline' | 'ghost';
  icon?: IconName;
  block?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  label?: string;
  compact?: boolean;
  dense?: boolean;
  floating?: boolean;
  xstyle?: stylex.StyleXStyles;
}) {
  const { t } = useLocale();
  const copy = typeof children === 'string' ? t(children) : children;
  const attrs = stylex.props(
    s.button,
    s[variant],
    block && ui.block,
    compact && s.compact,
    dense && s.dense,
    floating && s.floating,
    disabled && s.disabled,
    xstyle,
  );
  return href && !disabled ? (
    <Link href={href} {...attrs} aria-label={label ? t(label) : undefined}>
      {icon && <Icon name={icon} size={floating ? 24 : 16} />} {copy}
    </Link>
  ) : (
    <button
      {...attrs}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={label ? t(label) : undefined}
    >
      {icon && <Icon name={icon} size={floating ? 24 : 16} />} {copy}
    </button>
  );
}
export function IconButton({
  icon,
  label,
  onClick,
  href,
  filled = false,
}: {
  icon: IconName;
  label: string;
  onClick?: () => void;
  href?: string;
  filled?: boolean;
}) {
  const { t } = useLocale();
  return href ? (
    <Link href={href} {...stylex.props(s.icon)} aria-label={t(label)}>
      <Icon name={icon} filled={filled} />
    </Link>
  ) : (
    <button
      type="button"
      {...stylex.props(s.icon)}
      onClick={onClick}
      aria-label={t(label)}
      aria-pressed={icon === 'heart' ? filled : undefined}
    >
      <Icon name={icon} filled={filled} />
    </button>
  );
}
export function Pill({ children, icon }: { children: ReactNode; icon?: IconName }) {
  return (
    <span {...stylex.props(s.pill)}>
      {icon && <Icon name={icon} size={16} />} {children}
    </span>
  );
}
export function CheckRow({
  children,
  checked,
  onChange,
}: {
  children: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const { t } = useLocale();
  return (
    <label {...stylex.props(s.checkRow)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        {...stylex.props(s.checkbox, controls.checkbox)}
      />
      <span>{typeof children === 'string' ? t(children) : children}</span>
    </label>
  );
}
export function Modal({
  open,
  onClose,
  title,
  children,
  sheet = false,
  nativeSheet = false,
  table = false,
  range = false,
  wide = false,
  sorting = false,
  fullScreen = false,
  flowSheet = false,
  material = false,
  selection = false,
  picker = false,
  pickerHeight,
  label,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  sheet?: boolean;
  nativeSheet?: boolean;
  table?: boolean;
  range?: boolean;
  wide?: boolean;
  sorting?: boolean;
  fullScreen?: boolean;
  flowSheet?: boolean;
  material?: boolean;
  selection?: boolean;
  picker?: boolean;
  pickerHeight?: number;
  label?: string;
}) {
  const { t } = useLocale();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!open) return;
    const dialog = ref.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (dialog && !dialog.open) {
      dialog.showModal();
      if (!dialog.querySelector('[autofocus]')) dialog.focus({ preventScroll: true });
    }
    const release = lockDocumentScroll();
    return () => {
      dialog?.close();
      release();
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open]);
  if (!open) return null;
  return (
    <dialog
      ref={ref}
      tabIndex={-1}
      {...stylex.props(
        s.dialog,
        sheet && s.sheet,
        nativeSheet && s.nativeSheet,
        table && s.tableDialog,
        range && s.rangeDialog,
        wide && s.wideDialog,
        sorting && s.sortingDialog,
        fullScreen && s.fullScreenDialog,
        flowSheet && s.flowSheet,
        flowSheet && wide && s.wideFlowSheet,
        material && s.materialDialog,
        selection && s.selectionDialog,
        picker && s.pickerDialog,
        picker && pickerHeight !== undefined && s.pickerHeight(pickerHeight),
      )}
      aria-label={t(label || title || 'Options')}
      onKeyDown={(event) => {
        // Search inputs consume native Escape to clear their value before a dialog can cancel.
        if (event.key !== 'Escape' || event.nativeEvent.isComposing) return;
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }}
      onCancel={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      {title && (
        <h2
          {...stylex.props(s.modalTitle, sorting && s.sortingTitle, selection && s.selectionTitle)}
        >
          {t(title)}
        </h2>
      )}
      {children}
    </dialog>
  );
}
