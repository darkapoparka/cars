'use client';

import {useState} from 'react';
import {createPortal} from 'react-dom';
import {ArrowRight, Info} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import ReferenceInfoSheet from '@/components/ReferenceInfoSheet';
import {desktopHero} from '@/components/desktop-hero.stylex';
import {useCopy} from '@/lib/locale';
import {media} from '@/app/tokens.stylex';
import {campaignTokens as campaign} from '@/app/campaign-theme.stylex';
import {typography as t} from '@/app/typography.stylex';

const steps = [
  {title: 'Your car details', description: 'Share make, model, year and mileage.'},
  {title: 'Review and valuation', description: 'The dealer reviews the condition and confirms the price.'},
  {title: 'Sale or trade-in', description: 'Agree the terms and paperwork with the dealer.'},
];
const guides = [
  {title: 'Car valuation', description: 'Have your mileage, registration details and service records ready. The showroom will review your car’s condition and discuss a valuation before you decide.'},
  {title: 'Service history', description: 'Gather your service book, maintenance invoices and any warranty documents. Include both keys if you have them, and tell the showroom about any outstanding finance or known faults.'},
  {title: 'Photo checklist', description: 'Photograph your car in daylight: front, rear, both sides, wheels, interior and dashboard mileage. Include clear photos of any damage so the showroom can understand its condition.'},
];

/** The same guidance stays below the mobile cards and beneath the desktop form. */
export default function SellingProcess({hero = false}: {hero?: boolean}) {
  const tx = useCopy();
  const [open, setOpen] = useState(false);
  const sheet = open ? <ReferenceInfoSheet title="How it works" description="Sell or part-exchange." steps={steps} guidance={{title: 'Before you sell', items: guides}} onClose={() => setOpen(false)}/> : null;
  const label = <><Info size={20} strokeWidth={1.6} aria-hidden="true" {...stylex.props(!hero && s.icon)}/>{tx('How it works')}<ArrowRight size={16} aria-hidden="true" {...stylex.props(!hero && s.icon)}/></>;
  return <>
    <div data-selling-process {...stylex.props(hero ? desktopHero.secondary : s.process)}>
      <button type="button" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)} {...stylex.props(t.control, hero ? desktopHero.action : s.details)}>{hero ? <span {...stylex.props(desktopHero.actionSurface)}>{label}</span> : label}</button>
    </div>
    {sheet && hero ? createPortal(sheet, document.body) : sheet}
  </>;
}

const s = stylex.create({
  process: {display: {[media.desktop]: 'none', default: 'flex'}, justifyContent: 'center', marginTop: 24},
  details: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, minWidth: 220, maxWidth: '100%', minHeight: 48, padding: '0 22px', color: campaign.lightInk, fontWeight: 400, whiteSpace: 'nowrap', borderWidth: 1, borderStyle: 'solid', borderColor: {default: campaign.lightBorder, ':hover': '#bdbdc4'}, borderRadius: 24, backgroundColor: {default: '#fff', ':hover': '#f7f7f8'}, cursor: 'pointer', outline: {default: 'none', ':focus-visible': '2px solid #262629'}, outlineOffset: 2},
  icon: {flexShrink: 0, color: '#808087'},
});
