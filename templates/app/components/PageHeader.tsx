'use client';
import {useCopy} from '@/lib/locale';
import type {ReactNode} from 'react';
import BackButton from '@/components/BackButton';
import * as stylex from '@stylexjs/stylex';
import {media, tokens as $} from '@/app/tokens.stylex';

/** One header geometry for secondary screens and their back actions. */
export default function PageHeader({title, backHref = '/', backLabel = 'Back home', onBack, action, subtitle, compact = false}: {title: string; backHref?: string; backLabel?: string; onBack?: () => void; action?: ReactNode; subtitle?: string; compact?: boolean}) {
  const tx = useCopy();

  return <header data-page-header {...stylex.props(s.header)}><div {...stylex.props(s.inner, compact && s.compact)}>
    {onBack ? <BackButton label={backLabel} onClick={onBack}/> : <BackButton label={backLabel} href={backHref}/>}
    <div {...stylex.props(s.copy)}><h1 {...stylex.props(s.title)}>{tx(title)}</h1>{subtitle ? <p {...stylex.props(s.subtitle)}>{tx(subtitle)}</p> : null}</div>
    {action != null ? <div {...stylex.props(s.action)}>{tx(action)}</div> : null}
  </div></header>;
}
const s = stylex.create({
  header: {position: 'sticky', top: {[media.desktop]: 73, default: 0}, zIndex: 65, paddingTop: 'env(safe-area-inset-top)', fontFamily: $.fontSans, color: $.ink, backgroundColor: $.surface},
  inner: {display: 'flex', alignItems: 'center', gap: 12, minHeight: 68, maxWidth: $.content, marginInline: 'auto', paddingInline: {[media.mobile]: 12, default: 28}},
  compact: {minHeight: {[media.mobile]: 56, default: 68}},
  copy: {flexGrow: 1, minWidth: 0}, title: {overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 18, fontWeight: 600, lineHeight: '24px', letterSpacing: '-.025em'},
  subtitle: {color: $.muted, fontSize: 12, lineHeight: '16px'},
  action: {display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexShrink: 0},
});
