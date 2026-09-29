'use client';

import {useCopy} from '@/lib/locale';
import Link from '@/components/AppLink';
import {ArrowUpDown, ChevronDown, SlidersHorizontal} from 'lucide-react';
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

  const content = <>
    {icon === 'filter' ? <SlidersHorizontal size={18} strokeWidth={1.8} aria-hidden="true" {...stylex.props(s.icon)}/> : icon === 'sort' ? <ArrowUpDown size={18} strokeWidth={1.8} aria-hidden="true" {...stylex.props(s.icon)}/> : null}
    <span>{tx(label)}</span>
    {selected ? <span aria-hidden="true" {...stylex.props(s.dot)}/> : null}
    {!icon ? <ChevronDown size={14} strokeWidth={1.8} aria-hidden="true"/> : null}
  </>;
  const props = stylex.props(s.pill, selected && s.selected);
  return href
    ? <Link href={href} aria-label={selected ? `${tx(label)}: ${tx('Applied')}` : tx(label)} {...props}>{tx(content)}</Link>
    : <button type="button" onClick={onClick} aria-label={selected ? `${tx(label)}: ${tx('Applied')}` : tx(label)} aria-haspopup="dialog" {...props}>{tx(content)}</button>;
}

const s = stylex.create({
  pill: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, gap: 8, minHeight: 44, paddingInline: 14, color: $.ink, fontFamily: $.fontSans, fontSize: 14, fontWeight: 500, lineHeight: 1.25, whiteSpace: 'nowrap', borderWidth: 1, borderStyle: 'solid', borderColor: '#e6e6e9', borderRadius: 9999, backgroundColor: {default: '#fff', ':hover': '#f4f4f5'}, cursor: 'pointer'},
  selected: {color: '#fff', borderColor: $.ink, backgroundColor: {default: $.ink, ':hover': $.violetDark}},
  icon: {flexShrink: 0},
  dot: {width: 5, height: 5, borderRadius: '50%', backgroundColor: 'currentColor'},
});
