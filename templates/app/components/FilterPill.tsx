'use client';

import {useCopy} from '@/lib/locale';
import Link from '@/components/AppLink';
import {ChevronDown} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import NativeIcon from '@/components/NativeIcon';
import {media, tokens as $} from '@/app/tokens.stylex';

type Props = {
  label: string;
  icon?: 'filter' | 'sort';
  selected?: boolean;
  mobileIconOnly?: boolean;
} & ({href: string; onClick?: never} | {href?: never; onClick: () => void});

/** One compact control treatment for Home shortcuts and inventory actions. */
export default function FilterPill({label, icon, selected = false, mobileIconOnly = false, href, onClick}: Props) {
  const tx = useCopy();

  const content = <>
    {icon ? <span {...stylex.props(s.icon, mobileIconOnly && s.centeredIcon)}><NativeIcon name={icon} size={15}/></span> : null}
    <span {...stylex.props(mobileIconOnly && s.mobileHidden)}>{tx(label)}</span>
    {selected ? <span aria-label={tx("Applied")} {...stylex.props(s.dot, mobileIconOnly && s.mobileHidden)}/> : null}
    <span {...stylex.props(mobileIconOnly && s.mobileHidden)}><ChevronDown size={13} strokeWidth={1.8} aria-hidden="true"/></span>
  </>;
  const props = stylex.props(s.pill, mobileIconOnly && s.mobileIconOnly, selected && s.selected);
  return href
    ? <Link href={href} aria-label={tx(label)} {...props}>{tx(content)}</Link>
    : <button type="button" onClick={onClick} aria-label={tx(label)} aria-haspopup="dialog" {...props}>{tx(content)}</button>;
}

const s = stylex.create({
  pill: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, gap: 5, minHeight: {[media.mobile]:44,default:36}, paddingInline: 10, color: $.ink, fontSize: 13, fontWeight: 400, lineHeight: 1, whiteSpace: 'nowrap', borderWidth: 1, borderStyle: 'solid', borderColor: '#d8d8de', borderRadius: 30, backgroundColor: '#fff', cursor: 'pointer'},
  mobileIconOnly: {width: {[media.mobile]:44,default:'auto'}, paddingInline: {[media.mobile]:0,default:10}},
  mobileHidden: {display: {[media.mobile]:'none',default:'inline-flex'}},
  selected: {borderColor: $.ink, backgroundColor: '#f4f4f5'},
  icon: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 22, height: 22, marginLeft: -5, color: '#fff', borderRadius: '50%', backgroundColor: $.ink},
  centeredIcon: {marginLeft: {[media.mobile]:0,default:-5}},
  dot: {width: 5, height: 5, borderRadius: '50%', backgroundColor: $.ink},
});
