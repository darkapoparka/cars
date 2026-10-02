'use client';

import {useId, useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {ArrowRight, Calculator, X} from 'lucide-react';
import {useCopy} from '@/lib/locale';
import {campaignTokens as campaign} from '@/app/campaign-theme.stylex';
import {media, tokens as $} from '@/app/tokens.stylex';
import FinanceCalculator from './FinanceCalculator';
import {useModal} from './useModal';

export default function FinanceCalculatorLauncher() {
  const tx = useCopy(), id = useId();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const panel = useModal(open, close);

  return <>
    <button type="button" data-finance-calculator-launcher aria-label={tx('Open finance calculator')} aria-haspopup="dialog" aria-expanded={open} aria-controls={id + '-dialog'} onClick={() => setOpen(true)} {...stylex.props(s.launcher)}>
      <span {...stylex.props(s.copy)}><span {...stylex.props(s.title)}><Calculator size={25} aria-hidden="true" {...stylex.props(s.icon)}/>{tx('Finance calculator')}</span><span {...stylex.props(s.description)}>{tx('Explore your monthly payment.')}</span></span>
      <span {...stylex.props(s.action)}>{tx('Calculate')}<ArrowRight size={18} aria-hidden="true" {...stylex.props(s.icon)}/></span>
    </button>
    <div hidden={!open} {...stylex.props(s.backdrop, !open && s.hidden)} onClick={event => {if (event.currentTarget === event.target) close();}}>
      <section id={id + '-dialog'} ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={id + '-title'} {...stylex.props(s.sheet)}>
        <header {...stylex.props(s.header)}><h2 id={id + '-title'} {...stylex.props(s.dialogTitle)}>{tx('Finance calculator')}</h2><button type="button" aria-label={tx('Close calculator')} onClick={close} {...stylex.props(s.close)}><X size={23} aria-hidden="true"/></button></header>
        <div {...stylex.props(s.body)}><FinanceCalculator presentation="dialog"/></div>
      </section>
    </div>
  </>;
}

const s = stylex.create({
  launcher: {display: 'grid', gridTemplateColumns: {[media.mobile]: 'minmax(0,1fr)', default: 'minmax(0,1fr) auto'}, alignItems: 'center', gap: {[media.mobile]: 18, default: 28}, width: '100%', marginTop: 24, padding: {[media.mobile]: 20, default: 28}, color: '#fff', fontFamily: $.fontSans, textAlign: 'left', borderWidth: 0, borderRadius: 20, backgroundColor: campaign.surface, cursor: 'pointer', outlineColor: '#55555c', outlineOffset: 4},
  copy: {display: 'grid', gap: 8, minWidth: 0},
  title: {display: 'flex', alignItems: 'center', gap: 10, fontSize: {[media.mobile]: 23, default: 26}, fontWeight: 600, lineHeight: 1.25},
  icon: {flexShrink: 0},
  description: {color: campaign.muted, fontSize: 15, lineHeight: 1.45},
  action: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', justifySelf: 'start', gap: 8, minHeight: 44, padding: '10px 18px', color: campaign.actionText, fontSize: 16, fontWeight: 500, lineHeight: 1.4, borderRadius: 30, backgroundColor: '#fff'},
  backdrop: {position: 'fixed', inset: 0, zIndex: 250, display: 'flex', alignItems: {[media.mobile]: 'flex-end', default: 'center'}, justifyContent: 'center', padding: {[media.mobile]: 0, default: 24}, backgroundColor: 'rgba(0,0,0,.58)'},
  hidden: {display: 'none'},
  sheet: {display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 560, maxHeight: 'calc(100dvh - 24px)', color: $.ink, fontFamily: $.fontSans, borderRadius: {[media.mobile]: '24px 24px 0 0', default: 24}, backgroundColor: '#fff', outlineStyle: 'none', overflow: 'hidden'},
  header: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, gap: 12, padding: '16px 20px 0'},
  dialogTitle: {fontSize: 24, fontWeight: 600, lineHeight: 1.25},
  close: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 44, height: 44, padding: 0, color: $.ink, borderWidth: 0, borderRadius: '50%', backgroundColor: '#f2f2f3', cursor: 'pointer'},
  body: {minHeight: 0, overflowY: 'auto', overscrollBehaviorY: 'contain', padding: '0 20px calc(20px + env(safe-area-inset-bottom))'},
});
