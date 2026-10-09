'use client';

import {useLayoutEffect, useId, useRef, useState, type RefObject} from 'react';
import {createPortal} from 'react-dom';
import * as stylex from '@stylexjs/stylex';
import {ChevronDown, Pencil} from 'lucide-react';
import {useCopy} from '@/lib/locale';
import {media, tokens as $} from '@/app/tokens.stylex';

const presets = [0, 5, 10, 20, 30, 50] as const;

/** Common percentages sit beside the editable value, without another modal step. */
export default function DepositPresetMenu({value, onChange, inputRef}: {value: number; onChange: (value: number) => void; inputRef: RefObject<HTMLInputElement | null>}) {
  const tx = useCopy(), id = useId();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({left: 0, top: 0, maxHeight: 240});
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const restoreInputFocus = useRef(false);

  function show() {
    const anchor = trigger.current?.closest('[data-deposit-field]')?.getBoundingClientRect();
    if (!anchor) return;
    const below = Math.max(0, window.innerHeight - anchor.bottom - 24);
    const above = Math.max(0, anchor.top - 24);
    const upwards = below < 200 && above > below;
    const maxHeight = Math.max(44, Math.min(200, upwards ? above : below));
    const top = upwards ? Math.max(16, anchor.top - maxHeight - 8) : anchor.bottom + 8;
    setPosition({left: Math.max(16, Math.min(anchor.left, window.innerWidth - 256)), top, maxHeight});
    setOpen(true);
  }
  function choose(percentage?: number) {
    if (percentage !== undefined) onChange(percentage);
    restoreInputFocus.current = true;
    setOpen(false);
  }
  useLayoutEffect(() => {
    if (!open) {
      if (restoreInputFocus.current) {
        restoreInputFocus.current = false;
        if (inputRef.current?.getClientRects().length) inputRef.current.focus({preventScroll: true});
      }
      return;
    }
    (panel.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]') ?? panel.current?.querySelector('button'))?.focus({preventScroll: true});
    function outside(event: PointerEvent | FocusEvent) {
      if (event.target instanceof Node && !panel.current?.contains(event.target) && !trigger.current?.contains(event.target)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') {event.preventDefault(); event.stopPropagation(); setOpen(false); trigger.current?.focus({preventScroll: true});}
    }
    const dismiss = () => setOpen(false);
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    document.addEventListener('keydown', escape);
    window.addEventListener('scroll', dismiss, {passive: true});
    window.addEventListener('resize', dismiss);
    window.addEventListener('popstate', dismiss);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', outside);
      document.removeEventListener('keydown', escape);
      window.removeEventListener('scroll', dismiss);
      window.removeEventListener('resize', dismiss);
      window.removeEventListener('popstate', dismiss);
    };
  }, [open, inputRef]);

  return <>
    <button ref={trigger} type="button" data-deposit-presets-trigger aria-label={tx('Choose deposit percentage')} aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => open ? setOpen(false) : show()} onKeyDown={event => {if (event.key === 'ArrowDown' && !open) {event.preventDefault(); show();}}} {...stylex.props(s.trigger)}><ChevronDown size={14} aria-hidden="true"/></button>
    {open ? createPortal(<div ref={panel} id={id} role="dialog" aria-label={tx('Down payment')} data-deposit-presets style={position} onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const buttons = event.currentTarget.querySelectorAll('button');
      if (document.activeElement === buttons[event.shiftKey ? 0 : buttons.length - 1]) {setOpen(false); trigger.current?.focus({preventScroll: true});}
    }} {...stylex.props(s.panel)}>
      <p {...stylex.props(s.caption)}>{tx('Down payment')}</p>
      <div {...stylex.props(s.presets)}>{presets.map(percentage => <button key={percentage} type="button" aria-pressed={percentage === value} onClick={() => choose(percentage)} {...stylex.props(s.option, percentage === value && s.selected)}>{percentage}%</button>)}</div>
      <button type="button" onClick={() => choose()} {...stylex.props(s.custom)}><Pencil size={16} aria-hidden="true"/>{tx('Custom percentage')}</button>
    </div>, document.body) : null}
  </>;
}

const s = stylex.create({
  trigger: {position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', display: 'grid', placeItems: 'center', width: 32, height: 44, padding: 0, color: $.ink, borderWidth: 0, borderRadius: 12, backgroundColor: {default: 'transparent', ':hover': '#e4e4e7'}, outlineStyle: 'none', cursor: 'pointer'},
  panel: {position: 'fixed', zIndex: 140, width: 240, overflowY: 'auto', overscrollBehaviorY: 'contain', padding: 12, color: $.ink, fontFamily: $.fontSans, borderRadius: 16, backgroundColor: '#fff', boxShadow: $.shadowStrong},
  caption: {margin: '0 0 8px', paddingInline: 4, fontSize: {[media.desktop]: $.desktopSupportSize, default: 13}, lineHeight: '20px', color: $.muted},
  presets: {display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 6},
  option: {minHeight: 44, padding: 8, color: $.ink, fontFamily: $.fontSans, fontSize: 16, lineHeight: '24px', fontWeight: 400, borderWidth: 0, borderRadius: 12, backgroundColor: {default: '#f4f4f5', ':hover': '#eaeaed'}, outline: {default: 'none', ':focus-visible': '2px solid #202023'}, outlineOffset: -3, cursor: 'pointer'},
  selected: {color: '#fff', backgroundColor: {default: '#202023', ':hover': '#38383d'}, outlineColor: '#fff'},
  custom: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', minHeight: 44, marginTop: 8, padding: 8, color: $.ink, fontFamily: $.fontSans, fontSize: 14, lineHeight: '20px', borderWidth: 0, borderRadius: 10, backgroundColor: {default: 'transparent', ':hover': '#f4f4f5'}, outline: {default: 'none', ':focus-visible': '2px solid #202023'}, outlineOffset: -2, cursor: 'pointer'},
});
