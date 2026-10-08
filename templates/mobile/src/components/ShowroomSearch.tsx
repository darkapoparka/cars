'use client';
import { useLocale } from '@/lib/use-locale';
import { useEffect, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { controlShape } from '@/styles/control-tokens.stylex';
import { colors } from '@/styles/tokens.stylex';
import { controls } from '@/styles/controls.stylex';
import { Icon } from './Icon';

const s = stylex.create({
  search: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 12,
    minHeight: 44,
    backgroundColor: colors.controlSurface,
    borderRadius: controlShape.pill,
    color: colors.muted,
  },
  trigger: {
    width: 'calc(100% - 32px)',
    marginInline: 16,
    paddingRight: 12,
    paddingBlock: 10,
    borderWidth: 0,
    textAlign: 'left',
    outlineColor: colors.accent,
    outlineOffset: 3,
    backgroundColor: { default: colors.controlSurface, ':active': colors.surface },
  },
  bannerTrigger: {
    width: { default: 'calc(100% - 32px)', '@media (min-width: 1024px)': '100%' },
    marginInline: { default: 16, '@media (min-width: 1024px)': 0 },
    minHeight: { default: 48, '@media (min-width: 1024px)': 60 },
    paddingLeft: { default: 16, '@media (min-width: 1024px)': 20 },
    paddingRight: { default: 16, '@media (min-width: 1024px)': 20 },
    borderWidth: { default: 1, '@media (min-width: 1024px)': 0 },
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: controlShape.pill,
    backgroundColor: {
      default: colors.background,
      ':active': colors.stripe,
      '@media (min-width: 1024px)': {
        default: colors.background,
        ':hover': colors.stripe,
        ':active': colors.surface,
      },
    },
    boxShadow: {
      default: '0 2px 8px rgba(27,27,33,.10), 0 1px 2px rgba(27,27,33,.04)',
      '@media (min-width: 1024px)': '0 8px 24px rgba(14,25,36,.12)',
    },
  },
  elevatedPhoneTrigger: {
    minHeight: 48,
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: controlShape.pill,
    backgroundColor: { default: colors.background, ':active': colors.stripe },
    boxShadow: '0 2px 8px rgba(27,27,33,.10), 0 1px 2px rgba(27,27,33,.04)',
  },
  text: {
    flex: '1',
    minWidth: 0,
    fontSize: 16,
    lineHeight: '24px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  value: { color: colors.text },
  input: {
    minWidth: 0,
    width: '100%',
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.text,
    fontSize: 16,
    lineHeight: '24px',
    paddingBlock: 10,
    paddingRight: 12,
    outlineWidth: 0,
    '::placeholder': {
      color: { default: null, '@media (max-width: 699px)': colors.muted },
      opacity: { default: null, '@media (max-width: 699px)': 1 },
    },
    '::-webkit-search-cancel-button': { WebkitAppearance: 'none' },
    '::-webkit-search-decoration': { WebkitAppearance: 'none' },
  },
  clear: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    minWidth: 44,
    minHeight: 44,
    padding: 0,
    borderWidth: 0,
    borderRadius: controlShape.circle,
    backgroundColor: 'transparent',
    color: colors.muted,
    outlineColor: colors.text,
    outlineWidth: 2,
    outlineOffset: -3,
  },
});

export function ShowroomSearch({
  label,
  value,
  onOpen,
  inBanner = false,
  elevatedOnPhone = false,
}: {
  label: string;
  value: string;
  onOpen: (button: HTMLButtonElement) => void;
  inBanner?: boolean;
  elevatedOnPhone?: boolean;
}) {
  const { t } = useLocale();
  return (
    <button
      type="button"
      aria-label={t(label)}
      aria-haspopup="dialog"
      title={value || undefined}
      onClick={(event) => onOpen(event.currentTarget)}
      {...stylex.props(
        s.search,
        s.trigger,
        elevatedOnPhone && s.elevatedPhoneTrigger,
        inBanner && s.bannerTrigger,
      )}
    >
      <Icon name="search" size={20} />
      <span {...stylex.props(s.text, Boolean(value) && s.value)}>{value || t(label)}</span>
    </button>
  );
}

export function ShowroomSearchField({
  label,
  value,
  onChange,
  onSubmit,
  autoFocus = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  autoFocus?: boolean;
}) {
  const { t } = useLocale();
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!autoFocus) return;
    const frame = requestAnimationFrame(() => input.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [autoFocus]);
  return (
    <div {...stylex.props(s.search, controls.fieldFocus)}>
      <Icon name="search" size={20} />
      <input
        ref={input}
        data-showroom-search-input
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        aria-label={t(label)}
        placeholder={t(label)}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
            event.preventDefault();
            onSubmit();
          }
        }}
        {...stylex.props(s.input)}
      />
      {value && (
        <button
          type="button"
          aria-label={t('Clear search')}
          onClick={() => {
            onChange('');
            input.current?.focus();
          }}
          {...stylex.props(s.clear)}
        >
          <Icon name="close" size={20} />
        </button>
      )}
    </div>
  );
}
