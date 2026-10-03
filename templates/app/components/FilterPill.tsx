'use client';

import {useCopy} from '@/lib/locale';
import Link from '@/components/AppLink';
import {ArrowUpDown, SlidersHorizontal} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {pillStyles as pill} from '@/components/pill.stylex';

type Props = {
  label: string;
  icon?: 'filter' | 'sort';
  selected?: boolean;
  pressed?: boolean;
} & ({href: string; onClick?: never} | {href?: never; onClick: () => void});

/** One compact treatment for drawer actions and inline quick filters. */
export default function FilterPill({label, icon, selected = false, pressed, href, onClick}: Props) {
  const tx = useCopy();

  const content = <span {...stylex.props(pill.surface, (pressed ?? selected) && pill.selected)}>
    {icon === 'filter' ? <SlidersHorizontal size={16} strokeWidth={1.8} aria-hidden="true" {...stylex.props(s.icon)}/> : icon === 'sort' ? <ArrowUpDown size={16} strokeWidth={1.8} aria-hidden="true" {...stylex.props(s.icon)}/> : null}
    <span>{tx(label)}</span>
  </span>;
  const props = stylex.props(pill.control, (pressed ?? selected) && pill.selectedControl);
  return href
    ? <Link href={href} aria-label={selected ? `${tx(label)}: ${tx('Applied')}` : tx(label)} {...props}>{content}</Link>
    : <button type="button" onClick={onClick} aria-label={selected ? `${tx(label)}: ${tx('Applied')}` : tx(label)} aria-pressed={pressed} aria-haspopup={pressed === undefined ? 'dialog' : undefined} {...props}>{content}</button>;
}

const s = stylex.create({
  icon: {flexShrink: 0},
});
