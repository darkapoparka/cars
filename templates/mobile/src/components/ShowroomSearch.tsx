'use client';
import { useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { Icon } from './Icon';

const s = stylex.create({
  search: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginInline: 16,
    paddingLeft: 12,
    minHeight: 44,
    backgroundColor: colors.controlSurface,
    borderRadius: 12,
    color: colors.muted,
  },
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
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div {...stylex.props(s.search)}>
      <Icon name="search" size={20} />
      <input
        ref={input}
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
            event.currentTarget.blur();
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
