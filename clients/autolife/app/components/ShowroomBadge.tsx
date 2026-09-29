'use client';

import {useCopy} from '@/lib/locale';
import * as stylex from '@stylexjs/stylex';
import {showroom} from '@/lib/showroom';

export default function ShowroomBadge({premium = false}: {premium?: boolean}) {
  const tx = useCopy();

  return <span {...stylex.props(s.badge)}>{tx(showroom.name)}{premium ? <span {...stylex.props(s.premium)}>{tx("Select")}</span> : null}</span>;
}
const s = stylex.create({badge: {display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0, fontSize: 10, fontWeight: 650, color: '#262629', whiteSpace: 'nowrap'}, premium: {fontSize: 9, fontWeight: 500, color: '#66666d'}});
