'use client';

import {useEffect, useId, useRef, useState, type KeyboardEvent} from 'react';
import {createPortal} from 'react-dom';
import * as stylex from '@stylexjs/stylex';
import {Check, ChevronDown} from 'lucide-react';
import {useCopy} from '@/lib/locale';
import {tokens as $} from '@/app/tokens.stylex';

type Group = {readonly title: string; readonly items: readonly (readonly [string, string])[]};
type Props = {value: string; groups: readonly Group[]; onChange: (value: string) => void; onOpen: () => void};

/** An anchored, non-modal list with the same choices as the phone sort sheet. */
export default function DesktopSortMenu({value, groups, onChange, onOpen}: Props) {
  const tx = useCopy();
  const id = useId();
  const options = groups.flatMap(group => group.items.map(([label, option]) => ({value: option, label: group.title ? `${tx(group.title)}: ${tx(label)}` : tx(label)})));
  const selected = Math.max(0, options.findIndex(option => option.value === value));
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(selected);
  const [position, setPosition] = useState({left: 0, top: 0, maxHeight: 372});
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const choices = useRef<(HTMLButtonElement | null)[]>([]);
  const initialFocus = useRef(0);
  const typeahead = useRef({text: '', time: 0});

  function close(restoreFocus = false) {
    setOpen(false);
    if (restoreFocus) trigger.current?.focus({preventScroll: true});
  }
  function show() {
    const button = trigger.current;
    if (!button) return;
    const anchor = button.getBoundingClientRect();
    const shell = button.closest('[data-desktop-shell]')?.getBoundingClientRect();
    const leftEdge = (shell?.left ?? 0) + 16;
    const rightEdge = (shell?.right ?? window.innerWidth) - 16;
    const top = window.innerHeight - anchor.bottom < 240 && anchor.top > 240 ? Math.max(16, anchor.top - 380) : anchor.bottom + 8;
    setPosition({left: Math.max(leftEdge, Math.min(anchor.right - 300, rightEdge - 300)), top, maxHeight: Math.min(372, window.innerHeight - top - 16)});
    initialFocus.current = selected;
    setFocused(selected);
    typeahead.current = {text: '', time: 0};
    onOpen();
    setOpen(true);
  }
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => choices.current[initialFocus.current]?.focus({preventScroll: true}));
    function outside(event: PointerEvent | FocusEvent) {
      if (event.target instanceof Node && !panel.current?.contains(event.target) && !trigger.current?.contains(event.target)) setOpen(false);
    }
    function escape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {event.preventDefault(); setOpen(false); trigger.current?.focus({preventScroll: true});}
    }
    const dismiss = () => setOpen(false);
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    document.addEventListener('keydown', escape);
    window.addEventListener('scroll', dismiss, {passive: true});
    window.addEventListener('resize', dismiss);
    window.addEventListener('popstate', dismiss);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', outside);
      document.removeEventListener('keydown', escape);
      window.removeEventListener('scroll', dismiss);
      window.removeEventListener('resize', dismiss);
      window.removeEventListener('popstate', dismiss);
    };
  }, [open]);
  function move(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Tab') {close(true); return;}
    const current = choices.current.findIndex(choice => choice === document.activeElement);
    let next = current;
    if (event.key === 'ArrowDown') next = (current + 1) % options.length;
    else if (event.key === 'ArrowUp') next = (current - 1 + options.length) % options.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = options.length - 1;
    else if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = event.timeStamp;
      const text = (now - typeahead.current.time < 700 ? typeahead.current.text : '') + event.key.toLocaleLowerCase();
      typeahead.current = {text, time: now};
      const ordered = options.map((_, index) => (current + 1 + index) % options.length);
      next = ordered.find(index => options[index].label.toLocaleLowerCase().startsWith(text)) ?? current;
    } else return;
    event.preventDefault();
    choices.current[next]?.focus();
  }

  return <>
    <button ref={trigger} type="button" data-desktop-sort aria-label={`${tx('Sort cars')}: ${options[selected].label}`} title={`${tx('Sort cars')}: ${options[selected].label}`} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => open ? close() : show()} onKeyDown={event => {if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {event.preventDefault(); if (!open) show();}}} {...stylex.props(s.trigger)}><span {...stylex.props(s.label)}>{options[selected].label}</span><ChevronDown size={14} aria-hidden="true"/></button>
    {open ? createPortal(<div ref={panel} id={id} role="listbox" aria-label={tx('Sort cars')} aria-orientation="vertical" data-desktop-sort-menu style={position} onKeyDown={move} {...stylex.props(s.panel)}>{options.map((option, index) => <button ref={element => {choices.current[index] = element;}} key={option.value} type="button" role="option" tabIndex={index === focused ? 0 : -1} aria-selected={option.value === value} onFocus={() => setFocused(index)} onClick={() => {onChange(option.value); close(true);}} {...stylex.props(s.option, option.value === value && s.selected)}><span>{option.label}</span>{option.value === value ? <Check size={16} aria-hidden="true"/> : null}</button>)}</div>, document.body) : null}
  </>;
}

const s = stylex.create({
  trigger: {display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0, minHeight: 44, paddingInline: 12, color: $.ink, fontFamily: $.fontSans, fontSize: 14, fontWeight: 400, borderWidth: 0, borderRadius: 8, backgroundColor: {default: $.surfaceAlt, ':hover': $.line}, outline: {default: 'none', ':focus-visible': '2px solid #202024'}, outlineOffset: 2, cursor: 'pointer'},
  label: {maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
  panel: {position: 'fixed', zIndex: 135, width: 300, overflowY: 'auto', overscrollBehaviorY: 'contain', padding: 6, color: $.ink, fontFamily: $.fontSans, borderRadius: 14, backgroundColor: '#fff', boxShadow: $.shadowStrong, scrollbarWidth: 'thin'},
  option: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%', minHeight: 40, padding: '8px 10px', color: $.ink, fontFamily: $.fontSans, fontSize: 14, fontWeight: 400, lineHeight: '20px', textAlign: 'left', borderWidth: 0, borderRadius: 8, backgroundColor: {default: 'transparent', ':hover': $.surfaceAlt, ':focus': $.surfaceAlt}, outline: {default: 'none', ':focus-visible': '2px solid #202024'}, outlineOffset: -2, cursor: 'pointer'},
  selected: {backgroundColor: $.surfaceAlt},
});
