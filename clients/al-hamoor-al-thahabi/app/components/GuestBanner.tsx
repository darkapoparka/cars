'use client';
import {useCopy} from '@/lib/locale';
import {useState, useSyncExternalStore} from 'react';
import * as stylex from '@stylexjs/stylex';
import NativeIcon from '@/components/NativeIcon';
import ShowroomBadge from '@/components/ShowroomBadge';
import LoginSheet from '@/components/DealerEnquirySheet';
import {media, tokens as $} from '@/app/tokens.stylex';

const DISMISSED_KEY = 'cars24:guest-dismissed';
const CHANGE_EVENT = 'cars24:guest-banner-change';
let memoryDismissed = false;
function subscribe(notify: () => void) {
  window.addEventListener(CHANGE_EVENT, notify);
  return () => window.removeEventListener(CHANGE_EVENT, notify);
}
function snapshot() {
  try {return memoryDismissed || sessionStorage.getItem(DISMISSED_KEY) === '1';} catch {return memoryDismissed;}
}
const serverSnapshot = () => false;
function dismiss() {
  memoryDismissed = true;
  try {sessionStorage.setItem(DISMISSED_KEY, '1');} catch { /* Keep the in-memory dismissal when storage is blocked. */ }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
export default function GuestBanner({onLogin}: {onLogin?: () => void}) {
  const tx = useCopy();

  const dismissed = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [loginOpen, setLoginOpen] = useState(false);
  return <>
    {!dismissed ? <aside aria-label={tx("Guest login")} {...stylex.props(s.banner)}>
      <span {...stylex.props(s.logo)}><ShowroomBadge/></span>
      <div {...stylex.props(s.copy)}><small {...stylex.props(s.eyebrow)}>{tx("BUY USED CAR")}</small><strong {...stylex.props(s.title)}>{tx("Login for the best deals")}</strong></div>
      <button type="button" onClick={onLogin ?? (() => setLoginOpen(true))} {...stylex.props(s.login)}>{tx("Login")}</button>
      <button type="button" onClick={dismiss} aria-label={tx("Dismiss login banner")} {...stylex.props(s.close)}><NativeIcon name="close" size={18} /></button>
    </aside> : null}
    {!onLogin ? <LoginSheet open={loginOpen} onClose={() => setLoginOpen(false)} /> : null}
  </>;
}
const s = stylex.create({
  banner: {display: 'flex', alignItems: 'center', gap: 8, position: 'fixed', right: {[media.desktop]: 30, default: 10}, left: {[media.desktop]: 'auto', default: 14}, bottom: {[media.desktop]: 24, default: 'calc(94px + env(safe-area-inset-bottom))'}, zIndex: 92, width: {[media.desktop]: 430, default: 'auto'}, height: 60, padding: 4, color: '#fff', borderRadius: 32, backgroundColor: '#202024'},
  logo: {display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1, flexShrink: 0, width: 50, height: 50, color: $.violet, borderColor: '#202024', borderWidth: 1, borderStyle: 'solid', borderRadius: '50%', backgroundColor: '#fff'},
  copy: {display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1, minWidth: 0},
  eyebrow: {fontSize: 9, fontWeight: 400, lineHeight: 1.3},
  title: {overflow: 'hidden', fontSize: 12, fontWeight: 500, lineHeight: 1.25, textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
  login: {flexShrink: 0, minWidth: 72, height: 44, paddingInline: 14, color: '#fff', fontSize: 12, fontWeight: 500, borderWidth: 0, borderRadius: 24, backgroundColor: '#555555', cursor: 'pointer'},
  close: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 30, height: 42, padding: 0, color: '#fff', borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
});
