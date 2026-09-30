'use client';

import {useCopy} from '@/lib/locale';
import Link from '@/components/AppLink';
import {ArrowUpDown, SlidersHorizontal} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {tokens as $} from '@/app/tokens.stylex';

type Props = {
  label: string;
  icon?: 'filter' | 'sort';
  selected?: boolean;
} & ({href: string; onClick?: never} | {href?: never; onClick: () => void});

/** One compact control treatment for Home shortcuts and inventory actions. */
export default function FilterPill({label, icon, selected = false, href, onClick}: Props) {
  const tx = useCopy();

  const content = <span {...stylex.props(s.surface, selected && s.selected)}>
    {icon === 'filter' ? <SlidersHorizontal size={16} strokeWidth={1.8} aria-hidden="true" {...stylex.props(s.icon)}/> : icon === 'sort' ? <ArrowUpDown size={16} strokeWidth={1.8} aria-hidden="true" {...stylex.props(s.icon)}/> : null}
    <span>{tx(label)}</span>
  </span>;
  const props = stylex.props(s.pill);
  return href
    ? <Link href={href} aria-label={selected ? `${tx(label)}: ${tx('Applied')}` : tx(label)} {...props}>{content}</Link>
    : <button type="button" onClick={onClick} aria-label={selected ? `${tx(label)}: ${tx('Applied')}` : tx(label)} aria-haspopup="dialog" {...props}>{content}</button>;
}

const s = stylex.create({
  pill: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, minHeight: 44, padding: 0, color: $.ink, fontFamily: $.fontSans, fontSize: 15, fontWeight: 500, lineHeight: '20px', whiteSpace: 'nowrap', borderWidth: 0, borderRadius: 9999, backgroundColor: 'transparent', cursor: 'pointer'},
  surface: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5, minHeight: 36, paddingInline: 8, borderWidth: 1, borderStyle: 'solid', borderColor: '#e6e6e9', borderRadius: 9999, backgroundColor: {default: '#fff', ':hover': '#f4f4f5'}},
  selected: {color: '#fff', borderColor: $.ink, backgroundColor: {default: $.ink, ':hover': $.violetDark}},
  icon: {flexShrink: 0},
});
