'use client';

import {useLayoutEffect, useId, useState} from 'react';
import {createPortal} from 'react-dom';
import {ArrowRight, X} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import SearchClient, {type SearchChoice} from '@/components/SearchClient';
import {useModal} from '@/components/useModal';
import {useCopy} from '@/lib/locale';
import {dealer} from '@/lib/dealer-config';
import {media, tokens as $} from '@/app/tokens.stylex';

export default function ShowroomSearchSheet({onClose, initialQuery = '', onSearch, history = true}: {onClose: () => void; initialQuery?: string; onSearch?: (choice: SearchChoice) => void; history?: boolean}) {
  const tx = useCopy();
  const panel = useModal(true, onClose, {history});
  const titleId = useId();
  const formId = useId();
  const [visibleViewport, setVisibleViewport] = useState<{top: number; height: number} | null>(null);
  useLayoutEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    let frame = 0;
    function update() {
      frame = 0;
      // Keyboard/browser chrome can shrink the visible screen without resizing dvh.
      // Leave pinch zoom to the browser rather than chasing its magnified viewport.
      if (Math.abs(viewport!.scale - 1) > .01 || viewport!.height <= 0) {setVisibleViewport(null); return;}
      const next = {top: Math.max(0, viewport!.offsetTop), height: viewport!.height};
      setVisibleViewport(current => current?.top === next.top && current.height === next.height ? current : next);
    }
    function schedule() {cancelAnimationFrame(frame); frame = requestAnimationFrame(update);}
    update();
    viewport.addEventListener('resize', schedule);
    viewport.addEventListener('scroll', schedule);
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener('resize', schedule);
      viewport.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);
  useLayoutEffect(() => {
    panel.current?.querySelector<HTMLInputElement>('[data-search-input]')?.focus({preventScroll: true});
  }, [panel]);

  return createPortal(<div {...stylex.props(s.backdrop, visibleViewport && s.visibleBackdrop(visibleViewport.top, visibleViewport.height))} onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} data-showroom-search-sheet {...stylex.props(s.sheet, visibleViewport && s.visibleSheet(visibleViewport.height, Math.max(0, Math.floor(visibleViewport.height - 8))))}>
      <header {...stylex.props(s.header)}><div><p {...stylex.props(s.eyebrow)}>{dealer.name}</p><h2 id={titleId} {...stylex.props(s.title)}>{tx('Search')}</h2></div><button type="button" aria-label={tx('Close search')} onClick={onClose} {...stylex.props(s.close)}><X size={21} aria-hidden="true"/></button></header>
      <div {...stylex.props(s.body)}><SearchClient overlay initialQuery={initialQuery} formId={formId} onDismiss={onClose} onSearch={onSearch}/></div>
      <footer {...stylex.props(s.footer)}><button type="submit" form={formId} {...stylex.props(s.action)}>{tx('Search')}<ArrowRight size={18} aria-hidden="true"/></button></footer>
    </section>
  </div>, document.body);
}

const s = stylex.create({
  backdrop: {position: 'fixed', inset: 0, zIndex: 250, display: 'flex', alignItems: {[media.mobile]: 'flex-start', default: 'center'}, justifyContent: 'center', padding: {[media.mobile]: 0, default: 24}, backgroundColor: 'rgba(12,12,16,.5)'},
  visibleBackdrop: (top: number, height: number) => ({top, bottom: 'auto', height}),
  sheet: {display: 'flex', flexDirection: 'column', width: '100%', height: {[media.mobile]: '100%', default: 'auto'}, maxWidth: {[media.mobile]: 'none', default: 640}, maxHeight: {[media.mobile]: '100dvh', default: '92dvh'}, overflow: 'hidden', color: $.ink, fontFamily: $.fontSans, borderRadius: {[media.mobile]: 0, default: 24}, backgroundColor: $.surface, boxShadow: $.shadowStrong, outlineStyle: 'none'},
  visibleSheet: (height: number, dialogHeight: number) => ({height: {[media.mobile]: height, default: 'auto'}, maxHeight: {[media.mobile]: height, default: `min(92dvh, ${dialogHeight}px)`}}),
  header: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, gap: 12, paddingTop: {[media.mobile]: 'calc(18px + env(safe-area-inset-top))', default: 18}, paddingBottom: 16, paddingInline: 20},
  eyebrow: {margin: 0, color: $.muted, fontSize: 12, lineHeight: '18px'},
  title: {margin: '3px 0 0', fontSize: 21, fontWeight: 600, lineHeight: '27px', whiteSpace: 'nowrap'},
  close: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 44, height: 44, padding: 0, color: $.ink, borderWidth: 0, borderRadius: '50%', backgroundColor: {default: $.surfaceAlt, ':hover': $.line}, cursor: 'pointer'},
  body: {flexGrow: 1, minHeight: 0, overflowY: 'auto', overscrollBehaviorY: 'contain', scrollPaddingTop: 68},
  footer: {flexShrink: 0, padding: '0 20px calc(20px + env(safe-area-inset-bottom))'},
  action: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', minHeight: 48, padding: '12px 16px', color: $.surface, fontFamily: $.fontSans, fontSize: 15, fontWeight: 500, lineHeight: '22px', borderWidth: 0, borderRadius: $.radiusPill, backgroundColor: {default: $.ink, ':hover': $.violetDark}, cursor: 'pointer'},
});
