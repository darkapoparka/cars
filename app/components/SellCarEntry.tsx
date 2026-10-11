'use client';

import {CarFront, ClipboardCheck, Plus} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {DealerBannerAction} from '@/components/DealerMobileBanner';
import {useCopy} from '@/lib/locale';
import {media, tokens as $} from '@/app/tokens.stylex';

/** Start the owner's car-details draft from the alternative phone layout. */
export default function SellCarEntry({onClick, expanded}: {onClick: () => void; expanded: boolean}) {
  const tx = useCopy();
  return <>
    <div {...stylex.props(s.phone)}>
      <button type="button" data-sell-car-entry aria-label={tx('Add your car')} aria-haspopup="dialog" aria-expanded={expanded} onClick={onClick} {...stylex.props(s.entry)}>
        <CarFront size={24} strokeWidth={1.7} aria-hidden="true" {...stylex.props(s.car)}/>
        <span {...stylex.props(s.copy)}><span {...stylex.props(s.title)}>{tx('Add your car')}</span><span {...stylex.props(s.subtitle)}>{tx('Valuation or part-exchange')}</span></span>
        <span {...stylex.props(s.plus)}><Plus size={20} aria-hidden="true"/></span>
      </button>
    </div>
    <div {...stylex.props(s.wider)}><DealerBannerAction label="Value my car" icon={<ClipboardCheck size={20} aria-hidden="true"/>} expanded={expanded} onClick={onClick}/></div>
  </>;
}

const s = stylex.create({
  phone: {display: {[media.mobile]: 'block', default: 'none'}},
  wider: {display: {[media.mobile]: 'none', default: 'block'}},
  entry: {display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 76, padding: 12, color: $.ink, fontFamily: $.fontSans, textAlign: 'left', borderWidth: 0, borderRadius: 18, backgroundColor: {default: '#f4f4f5', ':hover': '#eaeaed'}, cursor: 'pointer', outline: {default: 'none', ':focus-visible': '2px solid #242428'}, outlineOffset: -4},
  car: {flexShrink: 0, width: 32, color: $.muted},
  copy: {display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 2, minWidth: 0},
  title: {fontSize: 16, fontWeight: 500, lineHeight: '22px'},
  subtitle: {color: $.muted, fontSize: 13, fontWeight: 400, lineHeight: '18px'},
  plus: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 40, height: 40, color: '#fff', borderRadius: '50%', backgroundColor: $.ink},
});
