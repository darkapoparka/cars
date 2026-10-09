'use client';

import {useEffect, useId, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import * as stylex from '@stylexjs/stylex';
import {Copy, MoreHorizontal, Share2, X} from 'lucide-react';
import {useModal} from '@/components/useModal';
import {dealer} from '@/lib/dealer-config';
import {useCopy} from '@/lib/locale';
import {media, tokens as $} from '@/app/tokens.stylex';

type ShareRequest = {url: string; nativeShare: boolean};

export default function ContactShareMenu() {
  const tx = useCopy();
  const id = useId();
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const item = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [share, setShare] = useState<ShareRequest | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    item.current?.focus({preventScroll: true});
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !container.current?.contains(event.target)) setMenuOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setMenuOpen(false);
      trigger.current?.focus({preventScroll: true});
    }
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [menuOpen]);

  function openShare() {
    setMenuOpen(false);
    trigger.current?.focus({preventScroll: true});
    setShare({url: location.href, nativeShare: typeof navigator.share === 'function'});
  }

  return <div ref={container} data-contact-options onBlur={event => {
    if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false);
  }} {...stylex.props(s.options)}>
    <button ref={trigger} type="button" aria-label={tx('Contact options')} aria-haspopup="menu" aria-expanded={menuOpen} aria-controls={menuOpen ? id : undefined} onClick={() => setMenuOpen(open => !open)} onKeyDown={event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {event.preventDefault(); setMenuOpen(true);}
    }} {...stylex.props(s.trigger)}><MoreHorizontal size={20} aria-hidden="true"/></button>
    {menuOpen ? <div id={id} role="menu" aria-label={tx('Contact options')} {...stylex.props(s.menu)}><button ref={item} type="button" role="menuitem" onClick={openShare} onKeyDown={event => {
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) event.preventDefault();
    }} {...stylex.props(s.menuItem)}><Share2 size={17} aria-hidden="true"/>{tx('Share')}</button></div> : null}
    {share ? <ShowroomShareSheet {...share} onClose={() => setShare(null)}/> : null}
  </div>;
}

function ShowroomShareSheet({url, nativeShare, onClose}: ShareRequest & {onClose: () => void}) {
  const tx = useCopy();
  const titleId = useId();
  const panel = useModal(true, onClose);
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [sharing, setSharing] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setMessage('Link copied');
    } catch {
      input.current?.focus();
      input.current?.select();
      setMessage('Select and copy the link.');
    }
  }
  async function shareLink() {
    setSharing(true);
    try {await navigator.share({title: dealer.name, url});}
    catch (error) {if (!(error instanceof DOMException && error.name === 'AbortError')) setMessage('Sharing is unavailable in this browser.');}
    finally {setSharing(false);}
  }

  return createPortal(<div data-showroom-share-backdrop onMouseDown={event => {if (event.currentTarget === event.target) onClose();}} {...stylex.props(s.backdrop)}>
    <section ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId} {...stylex.props(s.sheet)}>
      <header {...stylex.props(s.sheetHeading)}><h2 id={titleId} {...stylex.props(s.title)}>{tx('Share showroom')}</h2><button type="button" aria-label={tx('Close')} onClick={onClose} {...stylex.props(s.close)}><X size={20} aria-hidden="true"/></button></header>
      <p {...stylex.props(s.dealer)}>{dealer.name}</p>
      <input ref={input} type="text" readOnly value={url} aria-label={tx('Showroom link')} onFocus={event => event.currentTarget.select()} {...stylex.props(s.url)}/>
      <div {...stylex.props(s.shareActions)}><button type="button" onClick={copyLink} {...stylex.props(s.copy)}><Copy size={17} aria-hidden="true"/>{tx('Copy link')}</button>{nativeShare ? <button type="button" disabled={sharing} onClick={shareLink} {...stylex.props(s.nativeShare)}><Share2 size={17} aria-hidden="true"/>{tx('Share')}</button> : null}</div>
      {message ? <p role="status" {...stylex.props(s.message)}>{tx(message)}</p> : null}
    </section>
  </div>, document.body);
}

const s = stylex.create({
  options: {position: 'relative', flexShrink: 0, width: 28, height: 28},
  trigger: {position: 'absolute', top: -8, right: -8, display: 'grid', placeItems: 'center', width: 44, height: 44, padding: 0, color: $.ink, borderWidth: 0, borderRadius: $.radiusPill, backgroundColor: {default: 'transparent', ':hover': $.line}, cursor: 'pointer'},
  menu: {position: 'absolute', top: 34, right: 0, zIndex: 100, minWidth: 160, padding: 6, borderWidth: 1, borderStyle: 'solid', borderColor: $.line, borderRadius: 12, backgroundColor: $.surface, boxShadow: '0 8px 24px rgba(0,0,0,.08)'},
  menuItem: {display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 44, padding: '10px 12px', color: $.ink, fontFamily: $.fontSans, fontSize: 14, lineHeight: '20px', borderWidth: 0, borderRadius: 8, backgroundColor: {default: $.surface, ':hover': $.surfaceAlt}, cursor: 'pointer'},
  backdrop: {position: 'fixed', inset: 0, zIndex: 215, display: 'flex', alignItems: {[media.mobile]: 'flex-end', default: 'center'}, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,.48)'},
  sheet: {width: '100%', maxWidth: 440, maxHeight: 'calc(100dvh - 48px)', overflowY: 'auto', overscrollBehaviorY: 'contain', padding: '20px 20px calc(24px + env(safe-area-inset-bottom))', color: $.ink, fontFamily: $.fontSans, borderRadius: {[media.mobile]: '24px 24px 0 0', default: 24}, outlineStyle: 'none', backgroundColor: $.surface},
  sheetHeading: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12},
  title: {fontSize: 18, fontWeight: 600, lineHeight: '24px'},
  close: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 44, height: 44, padding: 0, color: $.ink, borderWidth: 0, borderRadius: $.radiusPill, backgroundColor: {default: $.surfaceAlt, ':hover': $.line}, cursor: 'pointer'},
  dealer: {marginTop: 4, color: $.muted, fontSize: 14, lineHeight: '22px'},
  url: {width: '100%', minWidth: 0, minHeight: 44, marginTop: 16, padding: '12px 14px', color: $.ink, fontFamily: $.fontSans, fontSize: 13, lineHeight: '20px', borderWidth: 0, borderRadius: 12, backgroundColor: $.surfaceAlt},
  shareActions: {display: 'flex', gap: 8, marginTop: 16},
  copy: {display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, gap: 8, minHeight: 44, padding: '12px 16px', color: '#fff', fontFamily: $.fontSans, fontSize: 14, lineHeight: '20px', borderWidth: 0, borderRadius: $.radiusPill, backgroundColor: {default: $.ink, ':hover': $.violetDark}, cursor: 'pointer'},
  nativeShare: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, padding: '12px 16px', color: $.ink, fontFamily: $.fontSans, fontSize: 14, lineHeight: '20px', borderWidth: 0, borderRadius: $.radiusPill, backgroundColor: {default: $.surfaceAlt, ':hover': $.line}, cursor: 'pointer'},
  message: {marginTop: 12, color: $.muted, fontSize: 13, lineHeight: '20px'},
});
