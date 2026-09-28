'use client';

import {useCopy} from '@/lib/locale';
import Link from '@/components/AppLink';
import {ChevronDown} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import NativeIcon from '@/components/NativeIcon';
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
    {icon ? <span {...stylex.props(s.icon)}><NativeIcon name={icon} size={15}/></span> : null}
    <span>{tx(label)}</span>
    {selected ? <span aria-label={tx("Applied")} {...stylex.props(s.dot)}/> : null}
    <ChevronDown size={13} strokeWidth={1.8} aria-hidden="true"/>
  </>;
  const props = stylex.props(s.pill, selected && s.selected);
  return href
    ? <Link href={href} {...props}>{tx(content)}</Link>
    : <button type="button" onClick={onClick} aria-haspopup="dialog" {...props}>{tx(content)}</button>;
}

const s = stylex.create({
  pill: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, gap: 5, minHeight: 36, paddingInline: 10, color: $.ink, fontSize: 13, fontWeight: 400, lineHeight: 1, whiteSpace: 'nowrap', borderWidth: 1, borderStyle: 'solid', borderColor: '#d8d8de', borderRadius: 30, backgroundColor: '#fff', cursor: 'pointer'},
  selected: {borderColor: $.ink, backgroundColor: '#f4f4f5'},
  icon: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 22, height: 22, marginLeft: -5, color: '#fff', borderRadius: '50%', backgroundColor: $.ink},
  dot: {width: 5, height: 5, borderRadius: '50%', backgroundColor: $.ink},
});
