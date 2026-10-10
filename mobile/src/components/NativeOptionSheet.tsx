'use client';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { controls } from '@/styles/controls.stylex';
import { Modal } from './ui';
const s = stylex.create({
  handle: {
    width: 32,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.muted,
    marginInline: 'auto',
    marginBottom: 38,
  },
  timeHandle: { marginBottom: 24 },
  heading: { fontSize: 16, lineHeight: '24px', fontWeight: 500, marginBottom: 16 },
  list: { maxHeight: 'min(65dvh, 520px)', overflowY: 'auto', paddingBottom: 16 },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    minHeight: 65,
    paddingInline: 16,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
    fontSize: 14,
    lineHeight: '20px',
    cursor: 'pointer',
  },
  time: { minHeight: 48, paddingInline: 0, borderBottomWidth: 0 },
  empty: { padding: 16, fontSize: 14, lineHeight: '20px', color: colors.muted },
});
export function NativeOptionSheet({
  label,
  options,
  value,
  onSelect,
  onClose,
  times = false,
}: {
  label: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  times?: boolean;
}) {
  return (
    <Modal sheet nativeSheet label={label} open onClose={onClose}>
      <div {...stylex.props(s.handle, times && s.timeHandle)} />
      {times && <h2 {...stylex.props(s.heading)}>{label}</h2>}
      <div {...stylex.props(s.list)}>
        {options.map((option) => (
          <label key={option} {...stylex.props(s.row, times && s.time)}>
            <input
              type="radio"
              name={label}
              checked={value === option}
              onChange={() => onSelect(option)}
              {...stylex.props(controls.radio)}
            />
            <span>{option}</span>
          </label>
        ))}
        {!options.length && (
          <p {...stylex.props(s.empty)}>No options are available in this captured reference.</p>
        )}
      </div>
    </Modal>
  );
}
