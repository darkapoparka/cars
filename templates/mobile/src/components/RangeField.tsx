'use client';
import { useRef, type PointerEvent } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { number } from '@/lib/search';
const s = stylex.create({
  root: { minWidth: 0, paddingInline: 4 },
  head: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    minHeight: 24,
    flexWrap: 'wrap',
  },
  title: { fontSize: 16, lineHeight: '24px', fontWeight: 500 },
  summary: { fontSize: 14, textAlign: 'right' },
  rail: { height: 68, position: 'relative', marginInline: 0, touchAction: 'none' },
  track: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 26,
    height: 4,
    backgroundColor: colors.line,
    borderRadius: 4,
  },
  fill: (left: number, right: number) => ({
    left: `calc(12px + (100% - 24px) * ${left / 100})`,
    right: `calc(12px + (100% - 24px) * ${right / 100})`,
    backgroundColor: colors.deepPurple,
  }),
  slider: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: 56,
    appearance: 'none',
    backgroundColor: 'transparent',
    pointerEvents: 'none',
    margin: 0,
    '::-webkit-slider-thumb': {
      appearance: 'none',
      pointerEvents: 'auto',
      width: 24,
      height: 24,
      borderRadius: '50%',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#dedee1',
      backgroundColor: '#fff',
      boxShadow: '0 1px 2px #0004',
      cursor: 'grab',
    },
    '::-moz-range-thumb': {
      pointerEvents: 'auto',
      width: 24,
      height: 24,
      borderRadius: '50%',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#dedee1',
      backgroundColor: '#fff',
      boxShadow: '0 1px 2px #0004',
      cursor: 'grab',
    },
  },
  inputs: { display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12 },
  field: {
    display: 'flex',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#818592',
    borderRadius: 8,
    minHeight: 44,
    paddingBlock: 10,
    backgroundColor: colors.background,
    color: colors.muted,
    paddingInline: 12,
    gap: 8,
  },
  input: {
    width: '100%',
    minWidth: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.text,
    fontSize: 14,
    outlineOffset: 3,
    '::-webkit-inner-spin-button': { appearance: 'none' },
  },
  unit: { fontSize: 14, flexShrink: 0 },
});
type Props = {
  label: string;
  min?: string;
  max?: string;
  floor: number;
  ceiling: number;
  step?: number;
  unit?: string;
  onChange: (min: string, max: string) => void;
};
export function RangeField({
  label,
  min = '',
  max = '',
  floor,
  ceiling,
  step = 1,
  unit = '',
  onChange,
}: Props) {
  const drag = useRef<{ id: number; side: 'from' | 'to' } | null>(null);
  const low = min ? Math.max(floor, Math.min(ceiling, Number(min))) : floor;
  const high = max ? Math.max(low, Math.min(ceiling, Number(max))) : ceiling;
  const summary =
    !min && !max
      ? 'Any'
      : `${min ? number(low) : 'Any'} – ${max ? number(high) : 'Any'}${unit ? ' ' + unit : ''}`;
  const from = (value: string) => {
    if (value === '' || /^\d+$/.test(value))
      onChange(value, max && value && Number(value) > Number(max) ? value : max);
  };
  const to = (value: string) => {
    if (value === '' || /^\d+$/.test(value))
      onChange(min && value && Number(value) < Number(min) ? value : min, value);
  };
  function point(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (event.clientX - rect.left - 12) / Math.max(1, rect.width - 24)),
    );
    return Math.max(
      floor,
      Math.min(ceiling, floor + Math.round((ratio * (ceiling - floor)) / step) * step),
    );
  }
  function trackMove(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.id !== event.pointerId) return;
    const value = point(event);
    if (drag.current.side === 'from') from(value === floor ? '' : String(Math.min(value, high)));
    else to(value === ceiling ? '' : String(Math.max(value, low)));
  }
  return (
    <div {...stylex.props(s.root)}>
      <div {...stylex.props(s.head)}>
        <h3 {...stylex.props(s.title)}>{label}</h3>
        <output {...stylex.props(s.summary)}>{summary}</output>
      </div>
      <div
        data-range-track={label}
        {...stylex.props(s.rail)}
        onPointerDown={(event) => {
          if (event.target instanceof HTMLInputElement) return;
          const value = point(event);
          drag.current = {
            id: event.pointerId,
            side: Math.abs(value - low) <= Math.abs(value - high) ? 'from' : 'to',
          };
          event.currentTarget.setPointerCapture(event.pointerId);
          trackMove(event);
        }}
        onPointerMove={trackMove}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <div {...stylex.props(s.track)} />
        <div
          {...stylex.props(
            s.track,
            s.fill(
              ((low - floor) / (ceiling - floor)) * 100,
              ((ceiling - high) / (ceiling - floor)) * 100,
            ),
          )}
        />
        <input
          type="range"
          aria-label={label + ' minimum slider'}
          min={floor}
          max={ceiling}
          step={step}
          value={low}
          onChange={(e) =>
            from(
              Number(e.target.value) === floor
                ? ''
                : String(Math.min(Number(e.target.value), high)),
            )
          }
          {...stylex.props(s.slider)}
        />
        <input
          type="range"
          aria-label={label + ' maximum slider'}
          min={floor}
          max={ceiling}
          step={step}
          value={high}
          onChange={(e) =>
            to(
              Number(e.target.value) === ceiling
                ? ''
                : String(Math.max(Number(e.target.value), low)),
            )
          }
          {...stylex.props(s.slider)}
        />
      </div>
      <div {...stylex.props(s.inputs)}>
        <label {...stylex.props(s.field)}>
          <input
            aria-label={label + ' from'}
            inputMode="numeric"
            type="text"
            maxLength={9}
            value={min}
            onChange={(e) => from(e.target.value)}
            placeholder="from"
            {...stylex.props(s.input)}
          />
          {unit && <span {...stylex.props(s.unit)}>{unit}</span>}
        </label>
        <label {...stylex.props(s.field)}>
          <input
            aria-label={label + ' to'}
            inputMode="numeric"
            type="text"
            maxLength={9}
            value={max}
            onChange={(e) => to(e.target.value)}
            placeholder="to"
            {...stylex.props(s.input)}
          />
          {unit && <span {...stylex.props(s.unit)}>{unit}</span>}
        </label>
      </div>
    </div>
  );
}
