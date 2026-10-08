'use client';
import { useLocale } from '@/lib/use-locale';
import { useRef, type PointerEvent } from 'react';
import * as stylex from '@stylexjs/stylex';
import { controlShape } from '@/styles/control-tokens.stylex';
import { colors } from '@/styles/tokens.stylex';
import { controls } from '@/styles/controls.stylex';
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
    color: colors.text,
    outlineWidth: 0,
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
    borderRadius: controlShape.field,
    minHeight: 44,
    paddingBlock: 10,
    backgroundColor: colors.controlSurface,
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
    outlineWidth: 0,
    '::-webkit-inner-spin-button': { appearance: 'none' },
  },
  unit: { fontSize: 14, flexShrink: 0 },
  groupedRail: { height: 48 },
  groupedInputs: {
    gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
    gap: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: controlShape.field,
    backgroundColor: colors.background,
  },
  groupedField: {
    minHeight: 52,
    borderWidth: 0,
    borderRadius: controlShape.field,
    backgroundColor: 'transparent',
  },
  groupedEnd: {
    borderInlineStartWidth: 1,
    borderInlineStartStyle: 'solid',
    borderInlineStartColor: colors.cardLine,
  },
  comfortableRoot: {
    fontSize: 16,
    paddingInline: { default: 4, '@media (max-width: 699px)': 0 },
  },
  comfortableTitle: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '26px',
  },
  comfortableSummary: { fontSize: 15 },
  comfortableInputs: { gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,8em),1fr))' },
  comfortableField: {
    minHeight: 64,
    borderRadius: controlShape.field,
    borderColor: colors.line,
    backgroundColor: {
      default: colors.controlSurface,
      '@media (min-width: 1024px)': colors.background,
    },
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 2,
    paddingBlock: 8,
  },
  fieldLabel: {
    fontSize: { default: 13, '@media (max-width: 699px)': 14 },
    lineHeight: '18px',
    fontWeight: 500,
    color: colors.muted,
  },
  valueRow: { display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 },
  comfortableText: { fontSize: 16, lineHeight: '24px' },
  comfortableFill: { backgroundColor: colors.accent },
});
type Props = {
  label: string;
  min?: string;
  max?: string;
  floor: number;
  ceiling: number;
  step?: number;
  unit?: string;
  comfortable?: boolean;
  hideHeading?: boolean;
  grouped?: boolean;
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
  comfortable = false,
  hideHeading = false,
  grouped = false,
  onChange,
}: Props) {
  const { t, number } = useLocale();
  const drag = useRef<{ id: number; side: 'from' | 'to' } | null>(null);
  const low = min ? Math.max(floor, Math.min(ceiling, Number(min))) : floor;
  const high = max ? Math.max(low, Math.min(ceiling, Number(max))) : ceiling;
  const summary =
    !min && !max
      ? t('Any')
      : `${min ? number(low) : t('Any')} – ${max ? number(high) : t('Any')}${unit ? ' ' + t(unit) : ''}`;
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
  function numericInput(side: 'from' | 'to') {
    return (
      <>
        <input
          aria-label={t(label) + ' ' + t(side)}
          inputMode="numeric"
          type="text"
          maxLength={9}
          value={side === 'from' ? min : max}
          onChange={(event) => (side === 'from' ? from : to)(event.target.value)}
          placeholder={comfortable ? t('Any') : t(side)}
          {...stylex.props(s.input, comfortable && s.comfortableText)}
        />
        {unit && <span {...stylex.props(s.unit, comfortable && s.comfortableText)}>{t(unit)}</span>}
      </>
    );
  }
  return (
    <div {...stylex.props(s.root, comfortable && s.comfortableRoot)}>
      {!hideHeading && (
        <div {...stylex.props(s.head)}>
          <h3 {...stylex.props(s.title, comfortable && s.comfortableTitle)}>{t(label)}</h3>
          <output {...stylex.props(s.summary, comfortable && s.comfortableSummary)}>
            {summary}
          </output>
        </div>
      )}
      <div
        data-range-track={label}
        {...stylex.props(s.rail, grouped && s.groupedRail)}
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
            comfortable && s.comfortableFill,
          )}
        />
        <input
          type="range"
          aria-label={t(label) + ' · ' + t('From')}
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
          aria-label={t(label) + ' · ' + t('To')}
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
      <div
        {...stylex.props(s.inputs, comfortable && s.comfortableInputs, grouped && s.groupedInputs)}
      >
        <label
          {...stylex.props(
            s.field,
            comfortable && s.comfortableField,
            grouped && s.groupedField,
            controls.fieldFocus,
          )}
        >
          {comfortable ? (
            <>
              <span {...stylex.props(s.fieldLabel)}>{t('From')}</span>
              <span {...stylex.props(s.valueRow)}>{numericInput('from')}</span>
            </>
          ) : (
            numericInput('from')
          )}
        </label>
        <label
          {...stylex.props(
            s.field,
            comfortable && s.comfortableField,
            grouped && s.groupedField,
            grouped && s.groupedEnd,
            controls.fieldFocus,
          )}
        >
          {comfortable ? (
            <>
              <span {...stylex.props(s.fieldLabel)}>{t('To')}</span>
              <span {...stylex.props(s.valueRow)}>{numericInput('to')}</span>
            </>
          ) : (
            numericInput('to')
          )}
        </label>
      </div>
    </div>
  );
}
