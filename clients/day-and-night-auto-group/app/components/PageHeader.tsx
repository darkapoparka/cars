'use client';
import {useCopy} from '@/lib/locale';
import {useId, type ReactNode} from 'react';
import BackButton from '@/components/BackButton';
import {pageHeaderLayout} from '@/components/page-header.stylex';
import * as stylex from '@stylexjs/stylex';
import {media, tokens as $} from '@/app/tokens.stylex';

/** One header geometry for secondary screens and their back actions. */
export default function PageHeader({title, backHref = '/', backLabel = 'Back home', onBack, action, subtitle, compact = false, wrapTitle = false, showBack = true, onRail = false}: {title: string; backHref?: string; backLabel?: string; onBack?: () => void; action?: ReactNode; subtitle?: string; compact?: boolean; wrapTitle?: boolean; showBack?: boolean; onRail?: boolean}) {
  const tx = useCopy();
  const titleId = useId();

  return <section data-page-header aria-labelledby={titleId} {...stylex.props(s.header, onRail && s.onRail)}><div {...stylex.props(pageHeaderLayout.row, compact && pageHeaderLayout.compact, wrapTitle && s.wrappingInner)}>
    {showBack ? (onBack ? <BackButton label={backLabel} tone={onRail ? 'rail' : 'neutral'} onClick={onBack}/> : <BackButton label={backLabel} tone={onRail ? 'rail' : 'neutral'} href={backHref}/>) : null}
    <div {...stylex.props(s.copy)}><h1 id={titleId} {...stylex.props(s.title, wrapTitle && s.wrappingTitle)}>{tx(title)}</h1>{subtitle ? <p {...stylex.props(s.subtitle)}>{tx(subtitle)}</p> : null}</div>
    {action != null ? <div {...stylex.props(s.action)}>{tx(action)}</div> : null}
  </div></section>;
}
const s = stylex.create({
  onRail: {backgroundColor: $.surface},
  header: {position: 'sticky', top: {[media.desktop]: 69, default: 0}, zIndex: 65, paddingTop: 'env(safe-area-inset-top)', fontFamily: $.fontSans, color: $.ink, backgroundColor: $.surface},
  wrappingInner: {paddingBlock: 6},
  wrappingTitle: {overflow: 'visible', whiteSpace: 'normal', overflowWrap: 'anywhere', lineHeight: 1.35},
  copy: {flexGrow: 1, minWidth: 0}, title: {overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 18, fontWeight: 600, lineHeight: '24px', letterSpacing: '-.025em'},
  subtitle: {color: $.muted, fontSize: 12, lineHeight: '16px'},
  action: {display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexShrink: 0},
});
