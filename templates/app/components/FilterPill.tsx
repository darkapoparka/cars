'use client';

import {useCopy} from '@/lib/locale';
import {assetPath} from '@/lib/paths';
import Link from '@/components/AppLink';
import {ArrowUpDown, SlidersHorizontal} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {pillStyles as pill} from '@/components/pill.stylex';
import {media} from '@/app/tokens.stylex';

type Props = {
  label: string;
  mobileLabel?: string;
  icon?: 'filter' | 'sort';
  flagSrc?: string;
  selected?: boolean;
  pressed?: boolean;
  tone?: 'default' | 'soft';
} & ({href: string; onClick?: never} | {href?: never; onClick: () => void});

/** One compact treatment for drawer actions and inline quick filters. */
export default function FilterPill({label, mobileLabel, icon, flagSrc, selected = false, pressed, tone = 'default', href, onClick}: Props) {
  const tx = useCopy();

  const content = <span {...stylex.props(pill.surface, tone === 'soft' && pill.soft, (pressed ?? selected) && pill.selected)}>
    {flagSrc ? <img src={assetPath(flagSrc)} width={20} height={15} alt="" aria-hidden="true" draggable={false} {...stylex.props(s.flag)}/> : null}
    {icon === 'filter' ? <SlidersHorizontal size={16} strokeWidth={1.8} aria-hidden="true" {...stylex.props(s.icon)}/> : icon === 'sort' ? <ArrowUpDown size={16} strokeWidth={1.8} aria-hidden="true" {...stylex.props(s.icon)}/> : null}
    {mobileLabel ? <><span {...stylex.props(s.wideLabel)}>{tx(label)}</span><span {...stylex.props(s.mobileLabel)}>{tx(mobileLabel)}</span></> : <span>{tx(label)}</span>}
  </span>;
  const props = stylex.props(pill.control, (pressed ?? selected) && pill.selectedControl);
  const accessibleLabel = mobileLabel ? `${tx(label)}: ${tx(mobileLabel)}` : selected ? `${tx(label)}: ${tx('Applied')}` : tx(label);
  return href
    ? <Link href={href} aria-label={accessibleLabel} {...props}>{content}</Link>
    : <button type="button" onClick={onClick} aria-label={accessibleLabel} aria-pressed={pressed} aria-haspopup={pressed === undefined ? 'dialog' : undefined} {...props}>{content}</button>;
}

const s = stylex.create({
  wideLabel: {display: {[media.mobile]: 'none', default: 'inline'}},
  mobileLabel: {display: {[media.mobile]: 'inline', default: 'none'}},
  icon: {flexShrink: 0},
  flag: {display: 'block', flexShrink: 0, width: 20, height: 15, objectFit: 'cover', borderRadius: 2, boxShadow: '0 0 0 1px rgba(0,0,0,.08)'},
});
