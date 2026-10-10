'use client';
import { useState } from 'react';
import { PickerWheel } from './PickerWheel';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { controls } from '@/styles/controls.stylex';
import { Modal, ui } from './ui';

const s = stylex.create({
  list: { overflowY: 'auto', overscrollBehavior: 'contain', minHeight: 0, flexShrink: 1 },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    width: '100%',
    minHeight: 65,
    paddingInline: 16,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
    backgroundColor: colors.background,
    color: colors.text,
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 500,
  },
  single: {
    minHeight: 65,
    fontWeight: 500,
    color: colors.muted,
    paddingLeft: 24,
    paddingRight: 50,
  },
  lastRow: { borderBottomWidth: 0 },
  framedActions: {
    padding: 16,
    paddingRight: 24,
    paddingBlock: 14,
    flexShrink: 0,
    minHeight: 76,
    gap: 0,
  },
  powerHeader: { minHeight: 48 },
  choiceText: { display: 'flex', gap: 8, alignItems: 'center', flex: '1' },
  swatch: (color: string) => ({
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: color,
    flexShrink: 0,
  }),
  radio: { width: 22, height: 22, accentColor: colors.deepPurple, flexShrink: 0 },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: 12,
    paddingRight: 8,
    gap: 0,
    flexShrink: 0,
  },
  action: {
    minWidth: 88,
    height: 48,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.accent,
    fontWeight: 500,
    fontSize: 14,
  },
  wheels: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  label: { fontSize: 14, fontWeight: 500, display: 'flex', flexDirection: 'column', gap: 4 },
  input: { height: 44, fontSize: 14 },
  rangeHeading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 32,
  },
  headingTitle: { marginBottom: 0 },
  unitLabel: { display: 'flex', alignItems: 'center', gap: 16, fontSize: 14, whiteSpace: 'nowrap' },
  title: {
    fontSize: 20,
    fontFamily: 'var(--font-base)',
    fontWeight: 700,
    lineHeight: '28px',
    marginBottom: 24,
  },
});
export function DialogActions({
  onCancel,
  onApply,
  framed = false,
}: {
  framed?: boolean;
  onCancel: () => void;
  onApply?: () => void;
}) {
  return (
    <div {...stylex.props(s.actions, framed && s.framedActions)}>
      <button type="button" onClick={onCancel} {...stylex.props(s.action)}>
        Cancel
      </button>
      {onApply && (
        <button type="button" onClick={onApply} {...stylex.props(s.action)}>
          OK
        </button>
      )}
    </div>
  );
}
type RangeProps = {
  title: string;
  unit?: string;
  min: string;
  max: string;
  ceiling: number;
  choices?: string[];
  powerKwChoices?: string[];
  onApply: (min: string, max: string) => void;
  onClose: () => void;
};
export function RangeDialog({
  title,
  unit = '',
  min,
  max,
  ceiling,
  choices,
  powerKwChoices,
  onApply,
  onClose,
}: RangeProps) {
  const [powerUnit, setPowerUnit] = useState<'hp' | 'kW'>('hp');
  const [from, setFrom] = useState(min);
  const [to, setTo] = useState(max);
  const base =
    ceiling === 2026
      ? Array.from({ length: 67 }, (_, i) => String(1960 + i))
      : Array.from({ length: 20 }, (_, i) => String(Math.round(((i + 1) * ceiling) / 20)));
  const effectiveChoices = powerKwChoices && powerUnit === 'kW' ? powerKwChoices : choices;
  const options = ['', ...new Set(effectiveChoices || base)].sort((a, b) => Number(a) - Number(b));
  const vals = (v: string) =>
    options.includes(v)
      ? options
      : ['', ...options.filter(Boolean), v].sort((a, b) => Number(a) - Number(b));
  const columns: [string, string, (value: string) => void][] = [
    ['From', from, setFrom],
    ['To', to, setTo],
  ];
  function changePowerUnit(next: 'hp' | 'kW') {
    if (next === powerUnit) return;
    const ratio = next === 'kW' ? 1 / 1.3596216173 : 1.3596216173;
    setFrom((value) => (value ? String(Math.round(Number(value) * ratio)) : ''));
    setTo((value) => (value ? String(Math.round(Number(value) * ratio)) : ''));
    setPowerUnit(next);
  }
  return (
    <Modal range label={title} open onClose={onClose}>
      <div {...stylex.props(s.rangeHeading, Boolean(powerKwChoices) && s.powerHeader)}>
        <h2 {...stylex.props(s.title, s.headingTitle)}>
          {title}
          {unit ? ' (' + (powerKwChoices ? powerUnit : unit) + ')' : ''}
        </h2>
        {powerKwChoices && (
          <div role="radiogroup" aria-label="Power unit" {...stylex.props(ui.row)}>
            {(['hp', 'kW'] as const).map((value) => (
              <label key={value} {...stylex.props(s.unitLabel)}>
                <input
                  type="radio"
                  name="power-unit"
                  {...stylex.props(controls.radio)}
                  checked={powerUnit === value}
                  onChange={() => changePowerUnit(value)}
                />
                {value === 'hp' ? 'HP' : value}
              </label>
            ))}
          </div>
        )}
      </div>
      <div {...stylex.props(s.wheels)}>
        {columns.map(([name, value, change]) => (
          <div key={name}>
            <label {...stylex.props(s.label)}>
              {name}
              <input
                inputMode="numeric"
                aria-label={title + ' ' + name.toLowerCase()}
                value={value}
                placeholder="Any"
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) change(e.target.value);
                }}
                {...stylex.props(ui.input, s.input)}
              />
            </label>
            <PickerWheel
              label={title + ' ' + name.toLowerCase() + ' picker'}
              values={name === 'To' ? [...vals(value).filter(Boolean), ''] : vals(value)}
              value={value}
              onChange={change}
            />
          </div>
        ))}
      </div>
      <DialogActions
        onCancel={onClose}
        onApply={() => {
          const convert = (value: string) =>
            value && powerKwChoices && powerUnit === 'kW'
              ? String(Math.round(Number(value) * 1.3596216173))
              : value;
          onApply(convert(from && to && Number(from) > Number(to) ? to : from), convert(to));
          onClose();
        }}
      />
    </Modal>
  );
}
export function SelectionDialog({
  title,
  options,
  values,
  single = false,
  includeAny = true,
  onApply,
  onClose,
}: {
  title: string;
  options: string[];
  values: string[];
  single?: boolean;
  includeAny?: boolean;
  onApply: (values: string[]) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState(values);
  function select(value: string) {
    const next = value
      ? single
        ? [value]
        : selected.includes(value)
          ? selected.filter((x) => x !== value)
          : [...selected, value]
      : [];
    setSelected(next);
    if (single) {
      onApply(next);
      onClose();
    }
  }
  return (
    <Modal selection open onClose={onClose} title={title}>
      <div {...stylex.props(s.list)}>
        {(includeAny ? ['', ...options] : options).map((value, index, rows) => (
          <label
            key={value || 'any'}
            {...stylex.props(s.row, single && s.single, index === rows.length - 1 && s.lastRow)}
          >
            <span {...stylex.props(s.choiceText)}>
              {/colour|color/i.test(title) && value && (
                <span
                  {...stylex.props(
                    s.swatch(
                      (
                        {
                          beige: '#ffe8a3',
                          blue: '#2841b6',
                          brown: '#806000',
                          yellow: '#ffe500',
                          gold: '#e0b800',
                          green: '#49a500',
                          grey: '#777777',
                          orange: '#ff6a00',
                          red: '#df0000',
                          black: '#343434',
                          silver: '#d5dae0',
                          purple: '#7b3094',
                          white: '#f5f5f5',
                        } as Record<string, string>
                      )[value.toLowerCase()] || '#ddd',
                    ),
                  )}
                />
              )}{' '}
              {value || 'Any'}
            </span>
            <input
              type={single ? 'radio' : 'checkbox'}
              name={title}
              checked={value ? selected.includes(value) : selected.length === 0}
              onChange={() => select(value)}
              {...stylex.props(s.radio, single ? controls.radio : controls.checkbox)}
            />
          </label>
        ))}
      </div>
      <DialogActions
        framed
        onCancel={onClose}
        onApply={
          single
            ? undefined
            : () => {
                onApply(selected);
                onClose();
              }
        }
      />
    </Modal>
  );
}
