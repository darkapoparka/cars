'use client';
import { useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { Icon } from './Icon';
import { IconButton, ui } from './ui';

const s = stylex.create({
  search: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginInline: 16,
    paddingLeft: 16,
    minHeight: 52,
    backgroundColor: colors.surface,
    borderRadius: 16,
    color: colors.muted,
  },
  input: {
    minWidth: 0,
    width: '100%',
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.text,
    fontSize: 16,
    paddingBlock: 14,
    outlineOffset: 3,
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
      <Icon name="search" size={22} />
      <input
        ref={input}
        type="search"
        aria-label={label}
        placeholder={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...stylex.props(s.input)}
      />
      {value ? (
        <IconButton
          icon="close"
          label="Clear search"
          onClick={() => {
            onChange('');
            input.current?.focus();
          }}
        />
      ) : (
        <span {...stylex.props(ui.pad)} />
      )}
    </div>
  );
}
