'use client';

import {useId, useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {ArrowRight, Calculator, X} from 'lucide-react';
import {useCopy} from '@/lib/locale';
import {media, tokens as $} from '@/app/tokens.stylex';
import {typography as t} from '@/app/typography.stylex';
import FinanceCalculator from './FinanceCalculator';
import {useModal} from './useModal';

export default function FinanceCalculatorLauncher() {
  const tx = useCopy(), id = useId();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const panel = useModal(open, close);

  return <>
    <section data-finance-calculator-feature aria-labelledby={id + '-launcher-title'} {...stylex.props(s.feature)}>
      <div><h2 id={id + '-launcher-title'} {...stylex.props(t.heading)}>{tx('Finance calculator')}</h2><p {...stylex.props(s.description, t.body)}>{tx('Explore your monthly payment.')}</p></div>
      <button type="button" data-finance-calculator-launcher aria-label={tx('Open finance calculator')} aria-haspopup="dialog" aria-expanded={open} aria-controls={id + '-dialog'} onClick={() => setOpen(true)} {...stylex.props(s.launcher, t.control)}>
        <span {...stylex.props(s.launcherLabel)}><Calculator size={28} aria-hidden="true" {...stylex.props(s.icon)}/>{tx('Calculate')}</span><ArrowRight size={22} aria-hidden="true" {...stylex.props(s.icon)}/>
      </button>
    </section>
    <div hidden={!open} {...stylex.props(s.backdrop, !open && s.hidden)} onClick={event => {if (event.currentTarget === event.target) close();}}>
      <section id={id + '-dialog'} ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={id + '-title'} {...stylex.props(s.sheet)}>
        <header {...stylex.props(s.header)}><h2 id={id + '-title'} {...stylex.props(t.heading)}>{tx('Finance calculator')}</h2><button type="button" aria-label={tx('Close calculator')} onClick={close} {...stylex.props(s.close)}><X size={23} aria-hidden="true"/></button></header>
        <div {...stylex.props(s.body)}><FinanceCalculator presentation="dialog"/></div>
      </section>
    </div>
  </>;
}

const s = stylex.create({
  feature: {display: 'grid', gridTemplateColumns: {[media.mobile]: 'minmax(0,1fr)', default: 'minmax(0,1fr) minmax(240px,320px)'}, alignItems: 'center', gap: {[media.mobile]: 16, default: 28}, marginTop: 28, color: $.ink},
  description: {marginTop: 6, color: $.muted},
  launcher: {display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, width: '100%', minHeight: 68, padding: '16px 20px', color: $.ink, borderWidth: 0, borderRadius: 16, backgroundColor: {default: '#eeedff', ':hover': '#e3e0fa'}, cursor: 'pointer', outlineColor: $.ink, outlineOffset: 3},
  launcherLabel: {display: 'inline-flex', alignItems: 'center', gap: 12},
  icon: {flexShrink: 0},
  backdrop: {position: 'fixed', inset: 0, zIndex: 250, display: 'flex', alignItems: {[media.mobile]: 'flex-end', default: 'center'}, justifyContent: 'center', padding: {[media.mobile]: 0, default: 24}, backgroundColor: 'rgba(0,0,0,.58)'},
  hidden: {display: 'none'},
  sheet: {display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 560, maxHeight: 'calc(100dvh - 24px)', color: $.ink, fontFamily: $.fontSans, borderRadius: {[media.mobile]: '24px 24px 0 0', default: 24}, backgroundColor: '#fff', outlineStyle: 'none', overflow: 'hidden'},
  header: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, gap: 12, padding: '16px 20px 0'},
  close: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 44, height: 44, padding: 0, color: $.ink, borderWidth: 0, borderRadius: '50%', backgroundColor: '#f2f2f3', cursor: 'pointer'},
  body: {minHeight: 0, overflowY: 'auto', overscrollBehaviorY: 'contain', padding: '0 20px calc(20px + env(safe-area-inset-bottom))'},
});
