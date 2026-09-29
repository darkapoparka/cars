'use client';
import {useCopy} from '@/lib/locale';
import type {ReactNode} from 'react';
import Link from '@/components/AppLink';
import {ArrowLeft} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {media, tokens as $} from '@/app/tokens.stylex';

/** One header geometry for secondary screens and their back actions. */
export default function PageHeader({title, backHref = '/', backLabel = 'Back home', onBack, action, subtitle}: {title: string; backHref?: string; backLabel?: string; onBack?: () => void; action?: ReactNode; subtitle?: string}) {
  const tx = useCopy();

  return <header data-page-header {...stylex.props(s.header)}><div {...stylex.props(s.inner)}>
    {onBack ? <button type="button" aria-label={tx(backLabel)} onClick={onBack} {...stylex.props(s.back)}><ArrowLeft size={21}/></button> : <Link href={backHref} aria-label={tx(backLabel)} {...stylex.props(s.back)}><ArrowLeft size={21}/></Link>}
    <div {...stylex.props(s.copy)}><h1 {...stylex.props(s.title)}>{tx(title)}</h1>{subtitle ? <p {...stylex.props(s.subtitle)}>{tx(subtitle)}</p> : null}</div>
    <div {...stylex.props(s.action)}>{tx(action)}</div>
  </div></header>;
}
const s = stylex.create({
  header: {position: 'sticky', top: {[media.desktop]: 73, default: 0}, zIndex: 65, paddingTop: 'env(safe-area-inset-top)', fontFamily: $.fontSans, color: $.ink, backgroundColor: $.surface},
  inner: {display: 'grid', gridTemplateColumns: '44px minmax(0,1fr) auto', alignItems: 'center', gap: 12, minHeight: 68, maxWidth: $.content, marginInline: 'auto', paddingInline: {[media.mobile]: 12, default: 28}},
  back: {display: 'grid', placeItems: 'center', width: 44, height: 44, padding: 0, color: $.ink, borderWidth: 0, borderRadius: '50%', backgroundColor: $.surfaceAlt, cursor: 'pointer'},
  copy: {minWidth: 0}, title: {overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 18, fontWeight: 600, lineHeight: '24px', letterSpacing: '-.025em'},
  subtitle: {color: $.muted, fontSize: 12, lineHeight: '16px'},
  action: {display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minWidth: 32},
});
