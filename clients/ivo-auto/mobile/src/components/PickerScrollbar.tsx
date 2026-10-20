'use client';
import { useEffect, useRef, useState, type RefObject } from 'react';
import * as stylex from '@stylexjs/stylex';
const s = stylex.create({
  rail: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 16,
    width: 8,
    backgroundColor: '#d8d7dc',
    touchAction: 'none',
  },
  staticRail: { backgroundColor: 'transparent' },
  thumb: (height: number, top: number) => ({
    position: 'absolute',
    left: 0,
    width: 8,
    height,
    top,
    backgroundColor: '#514c58',
    pointerEvents: 'none',
  }),
});
export function PickerScrollbar({
  target,
  identity,
}: {
  target: RefObject<HTMLDivElement | null>;
  identity: string;
}) {
  const [metrics, setMetrics] = useState({ height: 0, thumb: 48, top: 0, max: 0, scroll: 0 });
  const drag = useRef<{ id: number; offset: number } | null>(null);
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const update = () => {
      const height = el.clientHeight,
        max = Math.max(0, el.scrollHeight - height),
        thumb = Math.min(
          height,
          Math.max(48, max ? (height * height) / Math.max(height, el.scrollHeight) : 48),
        );
      setMetrics({
        height,
        thumb,
        max,
        scroll: el.scrollTop,
        top: max ? ((height - thumb) * el.scrollTop) / max : 0,
      });
    };
    el.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    const frame = requestAnimationFrame(update);
    return () => {
      el.removeEventListener('scroll', update);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, identity]);
  function move(clientY: number, rect: DOMRect, offset: number) {
    if (!target.current) return;
    const travel = Math.max(1, metrics.height - metrics.thumb);
    target.current.scrollTo({
      top: Math.max(0, Math.min(1, (clientY - rect.top - offset) / travel)) * metrics.max,
    });
  }
  if (!metrics.height) return null;
  return (
    <div
      role="scrollbar"
      tabIndex={0}
      aria-label="Scroll makes"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={Math.round(metrics.max)}
      aria-valuenow={Math.round(metrics.scroll)}
      aria-controls="car-make-list"
      {...stylex.props(s.rail, !metrics.max && s.staticRail)}
      onPointerDown={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const offset = event.clientY - rect.top - metrics.top;
        drag.current = {
          id: event.pointerId,
          offset: offset >= 0 && offset <= metrics.thumb ? offset : metrics.thumb / 2,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
        move(event.clientY, rect, drag.current.offset);
      }}
      onPointerMove={(event) => {
        if (drag.current?.id === event.pointerId)
          move(event.clientY, event.currentTarget.getBoundingClientRect(), drag.current.offset);
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
      onKeyDown={(event) => {
        const el = target.current;
        if (!el) return;
        const shifts: Record<string, number> = {
          ArrowDown: 65,
          ArrowUp: -65,
          PageDown: metrics.height,
          PageUp: -metrics.height,
          Home: -metrics.max,
          End: metrics.max,
        };
        if (event.key in shifts) {
          event.preventDefault();
          el.scrollBy({ top: shifts[event.key] });
        }
      }}
    >
      <div {...stylex.props(s.thumb(metrics.thumb, metrics.top))} />
    </div>
  );
}
