'use client';
import { useEffect, useId, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
const ROW = 60;
const s = stylex.create({
  track: { position: 'relative', marginTop: 4 },
  wheel: {
    height: 180,
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    scrollSnapType: 'y mandatory',
    scrollbarWidth: 'none',
    touchAction: 'pan-y',
    outlineOffset: 2,
  },
  spacer: { height: 60, flexShrink: 0, pointerEvents: 'none' },
  item: {
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    scrollSnapAlign: 'center',
    fontFamily: 'AndroidReference, sans-serif',
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '20px',
    color: '#9d9da1',
    userSelect: 'none',
    cursor: 'pointer',
  },
  active: { color: colors.text },
  window: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    height: 52,
    marginTop: 4,
    borderBlockWidth: 2,
    borderBlockStyle: 'solid',
    borderBlockColor: '#ff3b00',
    pointerEvents: 'none',
  },
});
type Props = { label: string; values: string[]; value: string; onChange: (value: string) => void };
export function PickerWheel({ label, values, value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const index = Math.max(0, values.indexOf(value));
  const [visual, setVisual] = useState(index);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = useRef({ values, onChange, index });
  const cancel = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };
  useEffect(() => {
    current.current = { values, onChange, index };
  }, [values, onChange, index]);
  useEffect(() => {
    cancel();
    const frame = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      if (Math.abs(el.scrollTop - index * ROW) > 1) el.scrollTop = index * ROW;
      setVisual(index);
    });
    return () => {
      cancelAnimationFrame(frame);
      cancel();
    };
  }, [index, value]);
  function choose(next: number) {
    cancel();
    const { values, onChange } = current.current;
    const i = Math.max(0, Math.min(values.length - 1, next));
    setVisual(i);
    ref.current?.scrollTo({ top: i * ROW, behavior: 'instant' });
    onChange(values[i]);
  }
  function scroll() {
    cancel();
    const i = Math.max(
      0,
      Math.min(current.current.values.length - 1, Math.round((ref.current?.scrollTop || 0) / ROW)),
    );
    setVisual(i);
    timer.current = setTimeout(() => {
      const data = current.current;
      const settled = Math.max(
        0,
        Math.min(data.values.length - 1, Math.round((ref.current?.scrollTop || 0) / ROW)),
      );
      if (settled !== data.index) data.onChange(data.values[settled]);
    }, 160);
  }
  return (
    <div {...stylex.props(s.track)}>
      <div
        ref={ref}
        role="listbox"
        tabIndex={0}
        aria-label={label}
        aria-activedescendant={id + '-' + visual}
        onScroll={scroll}
        onKeyDown={(event) => {
          if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          choose(
            event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? values.length - 1
                : visual + (event.key === 'ArrowDown' ? 1 : -1),
          );
        }}
        {...stylex.props(s.wheel)}
      >
        <div {...stylex.props(s.spacer)} />
        {values.map((item, i) => (
          <div
            id={id + '-' + i}
            key={item || 'any'}
            role="option"
            aria-selected={i === visual}
            onClick={() => choose(i)}
            {...stylex.props(s.item, i === visual && s.active)}
          >
            {item || 'Any'}
          </div>
        ))}
        <div {...stylex.props(s.spacer)} />
      </div>
      <div aria-hidden="true" {...stylex.props(s.window)} />
    </div>
  );
}
