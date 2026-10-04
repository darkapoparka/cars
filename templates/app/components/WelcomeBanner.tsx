'use client';

import {useEffect, useSyncExternalStore} from 'react';
import {createPortal} from 'react-dom';
import {ArrowRight, X} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import Link from '@/components/AppLink';
import {dealer} from '@/lib/dealer-config';
import {useCopy} from '@/lib/locale';
import {basePath} from '@/lib/paths';
import {media, tokens as $} from '@/app/tokens.stylex';

const dismissalKey = `cars-app:welcome:v1:${dealer.id}:${basePath || '/'}`;
const changeEvent = 'cars-app:welcome-change';
let memoryDismissed = false;

function previewRequested() {
  return new URLSearchParams(window.location.search).get('welcome') === '1';
}

function subscribe(notify: () => void) {
  window.addEventListener(changeEvent, notify);
  window.addEventListener('storage', notify);
  window.addEventListener('popstate', notify);
  return () => {
    window.removeEventListener(changeEvent, notify);
    window.removeEventListener('storage', notify);
    window.removeEventListener('popstate', notify);
  };
}

function pendingWelcome() {
  if (previewRequested()) return true;
  if (memoryDismissed) return false;
  try {return localStorage.getItem(dismissalKey) !== '1';} catch {return true;}
}

function dismissWelcome() {
  memoryDismissed = true;
  try {localStorage.setItem(dismissalKey, '1');} catch { /* Keep dismissal for this page when storage is unavailable. */ }
  if (previewRequested()) {
    const url = new URL(window.location.href);
    url.searchParams.delete('welcome');
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
  }
  window.dispatchEvent(new Event(changeEvent));
}

const serverSnapshot = () => false;

/** Optional first-visit greeting that leaves browsing and focus uninterrupted. */
export default function WelcomeBanner() {
  const tx = useCopy();
  const pending = useSyncExternalStore(subscribe, pendingWelcome, serverSnapshot);
  const open = Boolean(dealer.welcomeEnabled && pending);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented && !document.querySelector('[aria-modal="true"]')) dismissWelcome();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);
  if (!open) return null;

  return createPortal(<div data-welcome-banner role="region" aria-labelledby="welcome-title" {...stylex.props(s.banner)}>
    <button type="button" onClick={dismissWelcome} aria-label={tx('Close welcome')} {...stylex.props(s.close)}><span {...stylex.props(s.closeSurface)}><X size={16} aria-hidden="true"/></span></button>
    <h2 id="welcome-title" {...stylex.props(s.title)}>{tx('Welcome to {dealerName}').replace('{dealerName}', dealer.name)}</h2>
    <Link href="/cars" onClick={dismissWelcome} {...stylex.props(s.browse)}>{tx('Start browsing')}<ArrowRight size={15} aria-hidden="true"/></Link>
  </div>, document.body);
}

const s = stylex.create({
  banner: {position: 'fixed', zIndex: 90, right: {[media.mobile]: 12, default: 24}, left: {[media.mobile]: 12, default: 'auto'}, bottom: {[media.desktop]: 24, default: 'calc(84px + env(safe-area-inset-bottom))'}, width: {[media.mobile]: 'auto', default: 360}, maxWidth: 'calc(100vw - 24px)', padding: '14px 16px 10px', color: $.ink, fontFamily: $.fontSans, borderWidth: 1, borderStyle: 'solid', borderColor: $.line, borderRadius: $.radiusMd, backgroundColor: $.surface, boxShadow: '0 4px 24px rgba(12,12,16,.1)'},
  close: {position: 'absolute', top: 4, right: 4, display: 'grid', placeItems: 'center', width: 44, height: 44, padding: 0, color: $.muted, borderWidth: 0, borderRadius: $.radiusPill, backgroundColor: 'transparent', cursor: 'pointer', outlineOffset: -3, outlineWidth: 2, outlineStyle: {default: 'none', ':focus-visible': 'solid'}, outlineColor: $.ink},
  closeSurface: {display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: $.radiusPill, backgroundColor: {default: $.surfaceAlt, ':hover': $.line}},
  title: {paddingInlineEnd: 36, fontSize: 16, fontWeight: 600, lineHeight: '22px', overflowWrap: 'anywhere'},
  browse: {display: 'inline-flex', alignItems: 'center', gap: 7, minHeight: 44, color: $.muted, fontSize: 14, fontWeight: 400, lineHeight: '20px', textDecorationLine: {default: 'none', ':hover': 'underline'}, textUnderlineOffset: 4, borderRadius: $.radiusXs, outlineOffset: 2, outlineWidth: 2, outlineStyle: {default: 'none', ':focus-visible': 'solid'}, outlineColor: $.ink},
});
