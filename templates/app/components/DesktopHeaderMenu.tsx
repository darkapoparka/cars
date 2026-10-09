'use client';

import {useLayoutEffect, useId, useRef, useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Menu, X} from 'lucide-react';
import ShowroomMenu from '@/components/ShowroomMenu';
import {useCopy} from '@/lib/locale';
import {usePathname} from '@/lib/navigation';
import {media, tokens as $} from '@/app/tokens.stylex';

export default function DesktopHeaderMenu({onDark = false}: {onDark?: boolean}) {
  const tx = useCopy(), pathname = usePathname();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [languagePath, setLanguagePath] = useState(pathname);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  function show() {
    setLanguagePath(pathname + window.location.search + window.location.hash);
    setOpen(true);
  }
  useLayoutEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLAnchorElement>('a[href]')?.focus({preventScroll: true});
    function outside(event: PointerEvent | FocusEvent) {
      if (event.target instanceof Node && !panel.current?.contains(event.target) && !trigger.current?.contains(event.target)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpen(false);
      trigger.current?.focus({preventScroll: true});
    }
    const desktop = window.matchMedia(media.desktop.replace('@media ', ''));
    function resize() { if (!desktop.matches) setOpen(false); }
    const dismiss = () => setOpen(false);
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    document.addEventListener('keydown', escape);
    desktop.addEventListener('change', resize);
    window.addEventListener('popstate', dismiss);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', outside);
      document.removeEventListener('keydown', escape);
      desktop.removeEventListener('change', resize);
      window.removeEventListener('popstate', dismiss);
    };
  }, [open]);

  return <div {...stylex.props(s.anchor)}>
    <button ref={trigger} type="button" data-desktop-menu-trigger aria-label={tx('Open menu')} title={tx('Open menu')} aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => open ? setOpen(false) : show()} onKeyDown={event => {if (event.key === 'ArrowDown') {event.preventDefault(); if (open) panel.current?.querySelector<HTMLAnchorElement>('a[href]')?.focus({preventScroll: true}); else show();}}} {...stylex.props(s.trigger, onDark && s.darkTrigger, open && s.activeTrigger, open && onDark && s.darkActiveTrigger)}>
      {open ? <X size={22} aria-hidden="true"/> : <Menu size={23} aria-hidden="true"/>}
    </button>
    {open ? <div ref={panel} id={id} role="region" aria-label={tx('Menu')} data-desktop-menu {...stylex.props(s.panel)}><ShowroomMenu compact languagePath={languagePath} onNavigate={() => setOpen(false)}/></div> : null}
  </div>;
}

const s = stylex.create({
  anchor: {position: 'relative', display: {[media.desktop]: 'block', default: 'none'}},
  trigger: {display: 'grid', placeItems: 'center', width: 44, height: 44, padding: 0, color: $.ink, borderWidth: 0, borderRadius: 8, backgroundColor: {default: 'transparent', ':hover': $.surfaceAlt}, outline: {default: 'none', ':focus-visible': '2px solid #202024'}, outlineOffset: 2, cursor: 'pointer'},
  darkTrigger: {color: '#fff', backgroundColor: {default: 'transparent', ':hover': '#333337'}, outlineColor: '#fff'},
  activeTrigger: {backgroundColor: $.surfaceAlt},
  darkActiveTrigger: {backgroundColor: '#38383d'},
  panel: {position: 'absolute', top: 'calc(100% + 18px)', right: 0, width: 352, maxWidth: 'calc(100vw - 56px)', maxHeight: 'calc(100dvh - 88px)', overflowY: 'auto', overscrollBehaviorY: 'contain', padding: 12, color: $.ink, fontFamily: $.fontSans, backgroundColor: $.surface, borderWidth: 0, borderRadius: $.radiusMd, boxShadow: $.shadowStrong, scrollbarWidth: 'thin'},
});
