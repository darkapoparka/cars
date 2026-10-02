'use client';
import { useEffect, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { Icon } from './Icon';

const s = stylex.create({
  search: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 12,
    minHeight: 44,
    backgroundColor: colors.controlSurface,
    borderRadius: 12,
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
    outlineColor: colors.accent,
    outlineOffset: 3,
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
    borderRadius: 12,
    backgroundColor: 'transparent',
    color: colors.muted,
    outlineColor: colors.accent,
  },
});

export function ShowroomSearch({
  label,
  value,
  onOpen,
}: {
  label: string;
  value: string;
  onOpen: (button: HTMLButtonElement) => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-haspopup="dialog"
      title={value || undefined}
      onClick={(event) => onOpen(event.currentTarget)}
      {...stylex.props(s.search, s.trigger)}
    >
      <Icon name="search" size={20} />
      <span {...stylex.props(s.text, Boolean(value) && s.value)}>{value || label}</span>
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
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!autoFocus) return;
    const frame = requestAnimationFrame(() => input.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [autoFocus]);
  return (
    <div {...stylex.props(s.search)}>
      <Icon name="search" size={20} />
      <input
        ref={input}
        data-showroom-search-input
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        aria-label={label}
        placeholder={label}
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
          aria-label="Clear search"
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
