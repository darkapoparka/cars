'use client';

import {useSyncExternalStore} from 'react';
import {createPortal} from 'react-dom';
import {ArrowRight, Check, X} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import Link from '@/components/AppLink';
import DealerBrand from '@/components/DealerBrand';
import {useModal} from '@/components/useModal';
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

const languageNames = {bg: 'Български', en: 'English'};

/** Optional welcome sheet: portal presentation never participates in page layout. */
export default function WelcomeBanner() {
  const tx = useCopy();
  const locale = useLocale();
  const pending = useSyncExternalStore(subscribe, pendingWelcome, serverSnapshot);
  const open = Boolean(dealer.welcomeEnabled && pending);
  const showLanguages = dealer.enabledLocales.length > 1;
  const panel = useModal(open, dismissWelcome, {history: false});
  if (!open) return null;

  return createPortal(<div data-welcome-overlay {...stylex.props(s.overlay)} onMouseDown={event => event.target === event.currentTarget && dismissWelcome()}>
    <div data-welcome-sheet ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="welcome-title" aria-describedby={showLanguages ? 'welcome-description' : undefined} {...stylex.props(s.sheet)}>
      <div aria-hidden="true" {...stylex.props(s.handle)}/>
      <button type="button" onClick={dismissWelcome} aria-label={tx('Close welcome')} {...stylex.props(s.close)}><X size={18} aria-hidden="true"/></button>
      <div {...stylex.props(s.brand)}><DealerBrand compact/></div>
      <h2 id="welcome-title" {...stylex.props(s.title)}>{tx('Welcome to {dealerName}').replace('{dealerName}', dealer.name)}</h2>
      {showLanguages ? <><p id="welcome-description" {...stylex.props(s.description)}>{tx('Choose your language.')}</p><div role="group" aria-label={tx('Language')} {...stylex.props(s.languages)}>
        {dealer.enabledLocales.map(language => <a key={language} href={browserPath('/', language) + (previewRequested() ? '?welcome=1' : '')} lang={language} hrefLang={language} aria-current={locale === language ? 'true' : undefined} {...stylex.props(s.language)}><span {...stylex.props(s.languageLabel, locale === language && s.languageSelected)}>{locale === language ? <Check size={12} aria-hidden="true"/> : null}{languageNames[language]}</span></a>)}
      </div></> : null}
      <Link href="/cars" onClick={dismissWelcome} {...stylex.props(s.primary)}>{tx('Start browsing')}<ArrowRight size={16} aria-hidden="true"/></Link>
    </div>
  </div>, document.body);
}

const rise = stylex.keyframes({from: {opacity: 0, transform: 'translateY(10px)'}, to: {opacity: 1, transform: 'translateY(0)'}});
const fade = stylex.keyframes({from: {opacity: 0}, to: {opacity: 1}});

const s = stylex.create({
  overlay: {position: 'fixed', inset: 0, width: '100vw', zIndex: 250, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: {[media.mobile]: 0, default: 24}, backgroundColor: 'rgba(12,12,16,.3)', animationName: {default: fade, '@media (prefers-reduced-motion: reduce)': 'none'}, animationDuration: '160ms'},
  sheet: {position: 'relative', width: '100%', maxWidth: 440, maxHeight: '85dvh', overflowY: 'auto', padding: '12px 24px calc(24px + env(safe-area-inset-bottom))', color: $.ink, fontFamily: $.fontSans, textAlign: 'center', borderRadius: {[media.mobile]: '24px 24px 0 0', default: 24}, backgroundColor: $.surface, boxShadow: '0 -8px 32px rgba(12,12,16,.12)', outlineStyle: 'none', animationName: {default: rise, '@media (prefers-reduced-motion: reduce)': 'none'}, animationDuration: '160ms', animationTimingFunction: 'cubic-bezier(.22,1,.36,1)'},
  handle: {width: 32, height: 4, margin: '0 auto 16px', borderRadius: 4, backgroundColor: $.line},
  close: {position: 'absolute', top: 10, right: 6, display: 'grid', placeItems: 'center', width: 44, height: 44, padding: 0, color: $.muted, borderWidth: 0, borderRadius: $.radiusPill, backgroundColor: {default: 'transparent', ':hover': $.surfaceAlt}, cursor: 'pointer', outlineOffset: -3},
  brand: {display: 'flex', alignItems: 'center', justifyContent: 'center', paddingInline: 24},
  title: {marginTop: 16, fontSize: 22, fontWeight: 600, lineHeight: '28px', overflowWrap: 'anywhere'},
  description: {marginTop: 6, color: $.muted, fontSize: 14, fontWeight: 400, lineHeight: '20px'},
  languages: {display: 'flex', justifyContent: 'center', width: 'max-content', maxWidth: '100%', margin: '16px auto 0', paddingInline: 2, borderRadius: $.radiusPill, backgroundColor: $.surfaceAlt},
  language: {display: 'grid', placeItems: 'center', minHeight: 44, paddingInline: 2, color: $.muted, fontSize: 13, fontWeight: 400, lineHeight: '18px', borderRadius: $.radiusPill, outlineOffset: -2, outlineWidth: 2, outlineStyle: {default: 'none', ':focus-visible': 'solid'}, outlineColor: $.ink},
  languageLabel: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, minHeight: 32, paddingInline: 12, borderRadius: $.radiusPill, backgroundColor: {default: 'transparent', ':hover': $.line}},
  languageSelected: {color: $.surface, backgroundColor: {default: $.ink, ':hover': $.violetDark}},
  primary: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, marginTop: 16, padding: '10px 16px', color: $.surface, fontSize: 15, fontWeight: 500, lineHeight: '20px', borderRadius: $.radiusPill, backgroundColor: {default: $.ink, ':hover': $.violetDark}, outlineOffset: 3},
});
