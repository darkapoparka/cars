'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import {useState} from 'react';
import Link from '@/components/AppLink';
import Image from '@/components/AppImage';
import * as stylex from '@stylexjs/stylex';
import {ArrowRight, Check, ChevronDown, Mail, MapPin, Phone} from 'lucide-react';
import FinanceCalculator from '@/components/FinanceCalculator';
import BrandCampaign from '@/components/BrandCampaign';
import ReferenceInfoSheet from '@/components/ReferenceInfoSheet';
import {dealer} from '@/lib/dealer-config';
import {showroom} from '@/lib/showroom';
import {media, tokens as $} from '@/app/tokens.stylex';
import {campaignTokens as campaign} from '@/app/campaign-theme.stylex';

type Kind = 'sell' | 'finance' | 'service';
const steps = {
  sell: [
    ['sell-car-to-us', 'Sell to the showroom', 'Tell us about your car and arrange a valuation.'],
    ['quick-vehicle-inspection', 'A closer look', 'Review the condition, mileage and service history together.'],
    ['no-hidden-fees', 'Understand your offer', 'Discuss the valuation and any costs before deciding.'],
    ['hassle-free-paperwork', 'Plan the handover', 'Get guidance on the documents and next steps.'],
  ],
  service: [
    ['enter-car-details', 'Tell us about your car', 'Choose the make and model you drive.'],
    ['select-car-service-package', 'Choose the care you need', 'Explore routine servicing, diagnostics or an inspection.'],
    ['schedule-appointment', 'Arrange a suitable time', 'Confirm availability and pricing with the showroom.'],
    ['car-service-at-fingertips', 'Stay in the loop', 'Discuss the work before it goes ahead.'],
    ['delivery-and-payment', 'Review the work', 'Check the service details and final costs.'],
    ['happy-driving', 'Back on the road', 'Keep your service records ready for your next visit.'],
  ],
  finance: [
    ['item1', 'Find your next car', 'Choose from the showroom collection.'],
    ['item2', 'Prepare your documents', 'Ask which documents are needed for your circumstances.'],
    ['item3', 'Explore your options', 'Discuss eligibility, deposit and payment terms.'],
    ['item4', 'Review the details', 'Compare the total cost and the proposed monthly payments.'],
    ['item5', 'Confirm the next steps', 'Any finance offer is subject to lender approval and terms.'],
    ['keys', 'Plan your collection', 'Arrange a handover once the details are confirmed.'],
  ],
};
const packages = [
  {name: 'Routine service', label: 'Everyday care', image: showroom.artwork.servicePackages.routine, copy: 'Keep on top of the essentials.', checks: ['Oil and filter requirements', 'Fluid levels and safety checks', 'Tyres, brakes and lighting']},
  {name: 'Comprehensive care', label: 'A closer look', image: showroom.artwork.servicePackages.comprehensive, copy: 'Discuss a more detailed inspection.', checks: ['Diagnostic and condition checks', 'Suspension and braking system', 'Maintenance recommendations']},
];
const sellingMethods = [
  {title: 'Sell to us', image: showroom.artwork.selling.direct, points: ['Car valuation', 'Condition review', 'Guided paperwork'], action: 'Get a valuation'},
  {title: 'Part-exchange', image: showroom.artwork.selling.exchange, points: ['Value your car', 'Find your next car', 'Plan your upgrade'], action: 'Explore trade-in'},
];
const sellingGuides = [
  {title: 'Car valuation', image: showroom.artwork.selling.valuation, description: 'Have your mileage, registration details and service records ready. The showroom will review your car’s condition and discuss a valuation before you decide.'},
  {title: 'Service history', image: showroom.artwork.selling.history, description: 'Gather your service book, maintenance invoices and any warranty documents. Include both keys if you have them, and tell the showroom about any outstanding finance or known faults.'},
  {title: 'Photo checklist', image: showroom.artwork.selling.photos, description: 'Photograph your car in daylight: front, rear, both sides, wheels, interior and dashboard mileage. Include clear photos of any damage so the showroom can understand its condition.'},
];
export default function FeatureContent({kind, onStart}: {kind: Kind; onStart: () => void}) {
  const tx = useCopy();

  const [information, setInformation] = useState<{title: string; description: string} | null>(null);
  return <>
    {kind === 'sell' ? <section {...stylex.props(s.methods)} aria-label={tx("Ways to sell your car")}>
      {sellingMethods.map(({title, image, points, action}) => <article key={title} {...stylex.props(s.method)}>
        <Image src={image} fill sizes="(max-width: 767px) 100vw, 50vw" alt={tx("")} {...stylex.props(s.methodArtwork)}/>
        <div {...stylex.props(s.methodCopy)}><h2 {...stylex.props(s.heading)}>{tx(title)}</h2>
          <ul {...stylex.props(s.methodPoints)}>{points.map(point => <li key={point} {...stylex.props(s.methodPoint)}><Check size={15} {...stylex.props(s.pointIcon)}/>{tx(point)}</li>)}</ul>
          <button type="button" onClick={onStart} {...stylex.props(s.methodAction)}>{tx(action)}<ArrowRight size={15}/></button>
        </div>
      </article>)}
    </section> : null}
    {kind === 'sell' ? <section {...stylex.props(s.section)} aria-label={tx("Selling guides")}><h2 {...stylex.props(s.heading)}>{tx("Get ready to sell")}</h2><div {...stylex.props(s.toolsRail)}>{sellingGuides.map(({title, image, description}) => <button key={title} type="button" onClick={() => setInformation({title, description})} {...stylex.props(s.tool)}><Image src={image} width={600} height={450} sizes="238px" alt={tx("")} {...stylex.props(s.toolImage)}/><span {...stylex.props(s.toolLabel)}>{tx(title)}<ArrowRight size={17}/></span></button>)}</div></section> : null}
    {kind === 'service' ? <section aria-label={tx("Service options")} {...stylex.props(s.plans)}>{packages.map(({name, label, image, copy, checks}) => <article key={name} {...stylex.props(s.plan)}><header {...stylex.props(s.planHeader)}><Image src={image} fill sizes="(max-width: 767px) 100vw, 600px" alt={tx("")} {...stylex.props(s.planArtwork)}/><div {...stylex.props(s.planCopy)}><h2 {...stylex.props(s.planTitle)}>{tx(name)}</h2><span {...stylex.props(s.pill)}>{tx(label)}</span><p {...stylex.props(s.planDescription)}>{tx(copy)}</p></div></header><ul {...stylex.props(s.checks)}>{checks.map(check => <li key={check} {...stylex.props(s.check)}><Check size={16}/>{tx(check)}</li>)}</ul><button type="button" onClick={() => setInformation({title: name, description: `${copy} ${checks.join(', ')}. Available work, intervals and pricing depend on your car. Confirm the package with the showroom before booking.`})} {...stylex.props(s.outline)}>{tx("Learn more")}<ArrowRight size={17}/></button></article>)}</section> : null}
    {kind === 'finance' ? <><FinanceCalculator/><BrandCampaign kind="finance" onAction={onStart}/></> : null}
    <section {...stylex.props(s.section)}><h2 {...stylex.props(s.heading)}>{tx(kind === 'sell' ? `Selling with ${showroom.name}` : kind === 'finance' ? 'Your finance journey, step by step' : 'Car care, step by step')}</h2><div {...stylex.props(s.steps)}>{steps[kind].map(([asset, title, copy]) => <article key={asset} {...stylex.props(s.step)}><img src={assetPath(`/reference-assets/continuation/${kind}-${asset}.png`)} width={100} height={100} alt={tx("")} loading="lazy" {...stylex.props(s.stepImage)}/><div {...stylex.props(s.stepCopy)}><h3 {...stylex.props(s.stepTitle)}>{tx(title)}</h3><p {...stylex.props(s.stepDescription)}>{tx(copy)}</p></div></article>)}</div></section>
    {kind === 'sell' ? <BrandCampaign kind="sell" onAction={onStart}/> : kind === 'service' ? <BrandCampaign kind="care" onAction={onStart}/> : null}
    <section {...stylex.props(s.section)}><h2 {...stylex.props(s.heading)}>{tx(kind === 'finance' ? 'Before you apply' : 'A little more detail')}</h2>{(kind === 'finance' ? [['Which documents will I need?', 'Requirements vary by lender. Ask about proof of identity, income and any other documents before applying.'], ['Is this an approved finance offer?', 'No. The calculator is illustrative. Eligibility, rates and terms must be confirmed by the lender.']] : [['What happens next?', 'Tell the showroom what you need. Availability, pricing and any terms are confirmed before you commit.'], ['Can I visit in person?', 'Yes, explore the showroom information and arrange a suitable time to discuss your car.']]).map(([title, copy]) => <details key={title} {...stylex.props(s.faq)}><summary {...stylex.props(s.summary)}>{tx(title)}<ChevronDown size={18}/></summary><p {...stylex.props(s.faqCopy)}>{tx(copy)}</p></details>)}</section>
    <section {...stylex.props(s.section)}><h2 {...stylex.props(s.heading)}>{tx("Let’s talk about your car")}</h2><div {...stylex.props(s.contactGrid)}>{[['Call us', Phone], ['Email us', Mail], ['Visit us', MapPin]].map(([label, Icon]) => {const Symbol = Icon as typeof Phone; return label === 'Call us' && dealer.phoneE164 ? <a key={String(label)} href={'tel:' + dealer.phoneE164} {...stylex.props(s.contact)}><Symbol size={25}/><span>{tx(String(label))}</span></a> : label === 'Email us' && dealer.email ? <a key={String(label)} href={'mailto:' + dealer.email} {...stylex.props(s.contact)}><Symbol size={25}/><span>{tx(String(label))}</span></a> : label === 'Visit us' ? <Link key={String(label)} href="/stores" {...stylex.props(s.contact)}><Symbol size={25}/><span>{tx(String(label))}</span></Link> : <button type="button" key={String(label)} onClick={() => setInformation({title: String(label), description: dealer.phoneDisplay || dealer.email || 'Contact details are not configured for this template.'})} {...stylex.props(s.contact)}><Symbol size={25}/><span>{tx(String(label))}</span></button>;})}</div></section>
    {information ? <ReferenceInfoSheet {...information} onClose={() => setInformation(null)}/> : null}
  </>;
}
const s = stylex.create({
  heading: {color: '#202024', fontSize: {[media.mobile]: 19, default: 26}, fontWeight: 600, lineHeight: 1.25},
  section: {marginTop: 28},
  methods: {display: 'grid', gridTemplateColumns: {[media.mobile]: '1fr', default: 'repeat(2,minmax(0,1fr))'}, gap: 16, marginTop: 30},
  method: {position: 'relative', overflow: 'hidden', width: '100%', minHeight: {[media.mobile]: 230, default: 270}, borderRadius: 20, backgroundColor: '#fff'},
  methodArtwork: {objectFit: 'contain', objectPosition: 'right bottom', maskImage: {'@media (max-width: 359px)': 'linear-gradient(to bottom,transparent 18%,#000 36%)', default: 'none'}},
  methodCopy: {position: 'relative', zIndex: 1, width: '60%', padding: {[media.mobile]: '20px 0 20px 16px', default: '26px 0 26px 22px'}},
  methodPoints: {display: 'grid', gap: 12, padding: 0, margin: '18px 0', listStyle: 'none'},
  methodPoint: {display: 'flex', alignItems: 'center', gap: 6, color: campaign.lightMuted, fontSize: {[media.mobile]: 12, default: 14}, lineHeight: '18px'},
  pointIcon: {flexShrink: 0, color: campaign.lightInk},
  methodAction: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5, minHeight: 44, padding: '8px 10px', color: campaign.lightInk, fontSize: {[media.mobile]: 12, default: 14}, fontWeight: 600, borderWidth: 1, borderStyle: 'solid', borderColor: campaign.lightInk, borderRadius: 10, backgroundColor: '#fff', cursor: 'pointer'},
  toolsRail: {display: 'flex', gap: 12, overflowX: 'auto', marginTop: 14, paddingBottom: 8, scrollSnapType: 'x mandatory', scrollbarWidth: 'none'},
  tool: {display: 'flex', flexDirection: 'column', gap: 10, flex: '0 0 238px', padding: 0, borderWidth: 0, backgroundColor: 'transparent', textAlign: 'left', cursor: 'pointer', scrollSnapAlign: 'start'},
  toolImage: {display: 'block', width: '100%', height: 'auto', aspectRatio: '4 / 3', borderRadius: 15},
  toolLabel: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', color: '#202024', fontSize: 16, fontWeight: 500},
  plans: {display: 'grid', gridTemplateColumns: {[media.mobile]: '1fr', default: 'repeat(2,minmax(0,1fr))'}, gap: 16, marginTop: 32},
  plan: {overflow: 'hidden', paddingBottom: 16, borderWidth: 1, borderStyle: 'solid', borderColor: campaign.lightBorder, borderRadius: 20, backgroundColor: '#fff'},
  planHeader: {position: 'relative', isolation: 'isolate', overflow: 'hidden', height: {default: 'clamp(180px, 20vw, 240px)', [media.mobile]: 'clamp(160px, 46.15vw, 180px)'}, color: '#fff', backgroundColor: '#171719'},
  planArtwork: {objectFit: 'cover', objectPosition: 'center'},
  planCopy: {position: 'relative', zIndex: 1, padding: {[media.mobile]: 16, default: 24}},
  pill: {display: 'inline-block', marginTop: 10, padding: '4px 8px', color: '#fff', fontSize: 11, fontWeight: 500, lineHeight: '16px', borderRadius: 9, backgroundColor: 'rgba(255,255,255,.12)'},
  planTitle: {margin: 0, color: '#fff', fontSize: {[media.mobile]: 20, default: 'clamp(20px, 1.8vw, 26px)'}, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-.02em', textShadow: '0 1px 8px rgba(0,0,0,.2)'},
  planDescription: {maxWidth: '52%', marginTop: 8, color: '#dedee3', fontSize: {[media.mobile]: 12, default: 14}, lineHeight: 1.5},
  checks: {display: 'grid', gap: 14, margin: 0, padding: 20, listStyle: 'none'},
  check: {display: 'flex', alignItems: 'center', gap: 10, color: campaign.lightMuted, fontSize: 14},
  outline: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, width: 'calc(100% - 32px)', margin: '12px 16px 0', padding: '8px 10px', color: campaign.lightInk, fontSize: 14, fontWeight: 600, borderWidth: 1, borderStyle: 'solid', borderColor: campaign.lightInk, borderRadius: 13, backgroundColor: '#fff', cursor: 'pointer'},
  steps: {display: 'grid', gridTemplateColumns: {[media.mobile]: '1fr', default: 'repeat(2,minmax(0,1fr))'}, gap: 12, marginTop: 14},
  step: {display: 'grid', gridTemplateColumns: '100px minmax(0,1fr)', alignItems: 'center', minHeight: 102, overflow: 'hidden', borderColor: campaign.lightBorder, borderStyle: 'solid', borderWidth: 1, borderRadius: 13, backgroundColor: '#fff'},
  stepImage: {width: 100, height: 100, objectFit: 'cover'},
  stepCopy: {padding: 12},
  stepTitle: {fontSize: 15, fontWeight: 600, lineHeight: '20px'},
  stepDescription: {marginTop: 4, color: $.muted, fontSize: 13, lineHeight: '18px'},
  faq: {marginTop: 12, borderColor: campaign.lightBorder, borderStyle: 'solid', borderWidth: 1, borderRadius: 12, backgroundColor: '#fff'},
  summary: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 56, padding: '12px 15px', color: '#202024', fontSize: 14, fontWeight: 500, cursor: 'pointer', listStyle: 'none'},
  faqCopy: {padding: '0 15px 15px', color: $.muted, fontSize: 13, lineHeight: '20px'},
  contactGrid: {display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 12, marginTop: 14},
  contact: {display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, minHeight: 100, padding: 12, color: campaign.lightInk, fontSize: 14, borderWidth: 0, borderRadius: 18, backgroundColor: campaign.lightSurface, cursor: 'pointer'},
});
