'use client';

import {useEffect, useSyncExternalStore} from 'react';
import {X} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {dealer} from '@/lib/dealer-config';
import {useCopy, useLocale} from '@/lib/locale';
import {basePath, browserPath} from '@/lib/paths';
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

/** Optional welcome and locale utility row in the homepage's normal flow. */
export default function WelcomeBanner() {
  const tx = useCopy();
  const locale = useLocale();
  const alternateLocale = dealer.enabledLocales.find(language => language !== locale);
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

  return <div {...stylex.props(s.wrap)}><div data-welcome-banner role="region" aria-labelledby="welcome-title" {...stylex.props(s.banner)}>
    <p id="welcome-title" {...stylex.props(s.title)}>{tx('Welcome to {dealerName}').replace('{dealerName}', dealer.name)}</p>
    {alternateLocale ? <a href={browserPath('/', alternateLocale) + (previewRequested() ? '?welcome=1' : '')} lang={alternateLocale} hrefLang={alternateLocale} aria-label={alternateLocale === 'bg' ? 'Български' : 'English'} {...stylex.props(s.language)}><span {...stylex.props(s.languageLabel)}>{alternateLocale === 'bg' ? 'БГ' : 'EN'}</span></a> : null}
    <button type="button" onClick={dismissWelcome} aria-label={tx('Close welcome')} {...stylex.props(s.close)}><X size={15} aria-hidden="true"/></button>
  </div></div>;
}

const s = stylex.create({
  wrap: {width: '100%', maxWidth: $.content, marginInline: 'auto', marginTop: 4, marginBottom: 8, paddingInline: {[media.mobile]: 12, default: 28}},
  banner: {display: 'flex', alignItems: 'center', gap: 0, minHeight: 44, paddingInlineStart: 12, color: $.muted, fontFamily: $.fontSans, borderRadius: $.radiusSm, backgroundColor: $.surfaceAlt},
  title: {flexGrow: 1, minWidth: 0, margin: 0, paddingBlock: 8, fontSize: 14, fontWeight: 400, lineHeight: '20px', overflowWrap: 'anywhere'},
  language: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 44, height: 44, color: $.ink, borderRadius: $.radiusPill, outlineOffset: -4, outlineWidth: 2, outlineStyle: {default: 'none', ':focus-visible': 'solid'}, outlineColor: $.ink},
  languageLabel: {display: 'grid', placeItems: 'center', minWidth: 30, minHeight: 26, paddingInline: 6, fontSize: 12, fontWeight: 400, lineHeight: '16px', borderRadius: $.radiusPill, backgroundColor: {default: $.surface, ':hover': $.line}},
  close: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 44, height: 44, padding: 0, color: $.muted, borderWidth: 0, borderRadius: $.radiusPill, backgroundColor: {default: 'transparent', ':hover': $.line}, cursor: 'pointer', outlineOffset: -4, outlineWidth: 2, outlineStyle: {default: 'none', ':focus-visible': 'solid'}, outlineColor: $.ink},
});
