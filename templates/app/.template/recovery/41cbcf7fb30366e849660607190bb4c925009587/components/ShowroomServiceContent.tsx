'use client';
import {useCopy} from '@/lib/locale';
import Link from '@/components/AppLink';
import {ArrowUpRight, ChevronDown} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import FinanceCalculator from '@/components/FinanceCalculator';
import {showroom} from '@/lib/showroom';
import {media, tokens as $} from '@/app/tokens.stylex';

const steps = {
  sell: [['Tell us about your car', 'Share its make, model, mileage and condition.'], ['Arrange a valuation', 'The showroom reviews your car and discusses an offer.'], ['Choose your next step', 'Sell your car or explore a part-exchange.']],
  finance: [['Choose your car', 'Find a car and a budget that works for you.'], ['Explore your options', 'Discuss deposits, payment terms and eligibility.'], ['Review the details', 'Check lender terms before making a decision.']],
  service: [['Select your car', 'Tell us the make and model you drive.'], ['Choose the care you need', 'Discuss maintenance, repairs or an inspection.'], ['Arrange your visit', 'Confirm availability and pricing with the showroom.']],
};
export default function ShowroomServiceContent({kind}: {kind: keyof typeof steps}) {
  const tx = useCopy();

  return <>
    {kind === 'finance' ? <FinanceCalculator/> : null}
    <section {...stylex.props(s.section)}><h2 {...stylex.props(s.heading)}>{tx("How it works")}</h2><div {...stylex.props(s.steps)}>{steps[kind].map(([title, copy], i) => <article key={title} {...stylex.props(s.step)}><span {...stylex.props(s.number)}>{tx("0")}{tx(i + 1)}</span><div><h3 {...stylex.props(s.title)}>{tx(title)}</h3><p {...stylex.props(s.copy)}>{tx(copy)}</p></div></article>)}</div></section>
    <section {...stylex.props(s.section)}><h2 {...stylex.props(s.heading)}>{tx("A little more detail")}</h2><details {...stylex.props(s.faq)}><summary {...stylex.props(s.summary)}>{tx("What happens next?")}<ChevronDown size={18}/></summary><p {...stylex.props(s.copy)}>{tx("Share what you need with the showroom. Availability, pricing and any terms are confirmed before you commit.")}</p></details><details {...stylex.props(s.faq)}><summary {...stylex.props(s.summary)}>{tx("Can I visit in person?")}<ChevronDown size={18}/></summary><p {...stylex.props(s.copy)}>{tx("Explore the showroom information and arrange a suitable time to discuss your car.")}</p></details></section>
    <Link href={showroom.locationHref} {...stylex.props(s.visit)}><div><h2 {...stylex.props(s.heading)}>{tx("Let’s talk cars.")}</h2><p {...stylex.props(s.copy)}>{tx("Visit the ")}{tx(showroom.name)} {tx(" showroom.")}</p></div><ArrowUpRight size={24}/></Link>
  </>;
}
const s = stylex.create({
  section: {marginTop: 32}, heading: {fontSize: {[media.mobile]: 20, default: 26}, fontWeight: 600, letterSpacing: '-.025em'},
  steps: {display: 'grid', gridTemplateColumns: {[media.mobile]: '1fr', default: 'repeat(3,1fr)'}, gap: 12, marginTop: 16},
  step: {display: 'flex', gap: 14, padding: 18, borderRadius: 18, backgroundColor: '#f5f5f6'},
  number: {fontSize: 13, color: $.muted, lineHeight: '22px'}, title: {fontSize: 16, fontWeight: 600, lineHeight: 1.35}, copy: {marginTop: 6, color: $.muted, fontSize: 14, lineHeight: 1.5},
  faq: {paddingBlock: 16,}, summary: {display: 'flex', justifyContent: 'space-between', gap: 16, cursor: 'pointer', fontSize: 14, fontWeight: 500},
  visit: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginTop: 32, padding: 24, borderRadius: 20, backgroundColor: '#f4f4f5'},
});
