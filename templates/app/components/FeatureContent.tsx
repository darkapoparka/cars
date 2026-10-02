'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import {useState} from 'react';
import Link from '@/components/AppLink';
import Image from '@/components/AppImage';
import * as stylex from '@stylexjs/stylex';
import {ArrowRight, BadgePercent, Check, ChevronDown, FileText, ListChecks, Mail, MapPin, Phone} from 'lucide-react';
import BrandCampaign from '@/components/BrandCampaign';
import ReferenceInfoSheet from '@/components/ReferenceInfoSheet';
import {dealer} from '@/lib/dealer-config';
import {showroom} from '@/lib/showroom';
import {media, tokens as $} from '@/app/tokens.stylex';
import {campaignTokens as campaign} from '@/app/campaign-theme.stylex';
import {typography as t} from '@/app/typography.stylex';

type Kind = 'sell' | 'finance' | 'service';
const steps = {
  sell: [
    ['sell-car-to-us', 'Car details', 'Make, mileage and photos.'],
    ['quick-vehicle-inspection', 'Inspection', 'Condition and service history.'],
    ['no-hidden-fees', 'Valuation', 'Discuss the price and terms.'],
    ['hassle-free-paperwork', 'Documents', 'Agree the paperwork and handover.'],
  ],
  service: [
    ['enter-car-details', 'Car details', 'Choose the make and model.'],
    ['select-car-service-package', 'Service selection', 'Servicing, diagnostics or an inspection.'],
    ['schedule-appointment', 'Visit time', 'Confirm the time and price.'],
    ['car-service-at-fingertips', 'Before the repair', 'Discuss the work with the workshop.'],
    ['delivery-and-payment', 'After the repair', 'Review the work and costs.'],
    ['happy-driving', 'Service record', 'Keep your workshop documents.'],
  ],
};
const financeSteps = [
  [0, 'Choose your car', 'Browse the available cars.'],
  [2, 'Estimate payment', 'Adjust the deposit, term and rate.'],
  [5, 'Confirm with the dealer', 'Confirm availability, documents and terms.'],
] as const;
const packages = [
  {name: 'Routine service', mobileName: 'Servicing', copy: 'Oil, filters and routine checks.', checks: ['Oil and filter requirements', 'Fluid levels and safety checks', 'Tyres, brakes and lighting'], mobileChecks: ['Oil and filters', 'Safety checks', 'Tyres and brakes']},
  {name: 'Inspection and diagnostics', mobileName: 'Diagnostics', copy: 'Check your car and plan any work.', checks: ['Diagnostic and condition checks', 'Suspension and braking system', 'Maintenance recommendations'], mobileChecks: ['Computer check', 'Suspension and brakes', 'Recommendations']},
];
const sellingMethods = [
  {title: 'Sell your car to us', mobileTitle: 'Sell your car to us', image: showroom.artwork.selling.direct, points: ['Car valuation', 'Condition review', 'Guided paperwork'], mobilePoints: ['Valuation', 'Car check', 'Documents'], action: 'Get a valuation', mobileAction: 'Valuation'},
  {title: 'Part-exchange', mobileTitle: 'Exchange', image: showroom.artwork.selling.exchange, points: ['Value your car', 'Find your next car', 'Plan your upgrade'], mobilePoints: ['Valuation', 'Choice', 'Upgrade'], action: 'Explore trade-in', mobileAction: 'Exchange'},
];
const sellingGuides = [
  {title: 'Car valuation', mobileTitle: 'Valuation', image: showroom.artwork.selling.valuation, description: 'Have your mileage, registration details and service records ready. The showroom will review your car’s condition and discuss a valuation before you decide.'},
  {title: 'Service history', mobileTitle: 'Service history', image: showroom.artwork.selling.history, description: 'Gather your service book, maintenance invoices and any warranty documents. Include both keys if you have them, and tell the showroom about any outstanding finance or known faults.'},
  {title: 'Photo checklist', mobileTitle: 'Photos', image: showroom.artwork.selling.photos, description: 'Photograph your car in daylight: front, rear, both sides, wheels, interior and dashboard mileage. Include clear photos of any damage so the showroom can understand its condition.'},
];

function ResponsiveCopy({full, short}: {full: string; short: string}) {
  const tx = useCopy();
  return <><span {...stylex.props(s.desktopCopy)}>{tx(full)}</span><span {...stylex.props(s.mobileCopy)}>{tx(short)}</span></>;
}

export default function FeatureContent({kind, onStart}: {kind: Kind; onStart: () => void}) {
  const tx = useCopy();

  const [information, setInformation] = useState<{title: string; description: string} | null>(null);
  if (kind === 'finance') return <section data-finance-help {...stylex.props(s.section)} aria-label={tx('Good to know')}>
    <div {...stylex.props(s.helpHeader)}><h2 {...stylex.props(s.heading, t.title)}>{tx('Good to know')}</h2><button type="button" onClick={onStart} {...stylex.props(s.helpAction, t.control)}>{tx('Ask us')}<ArrowRight size={18} aria-hidden="true"/></button></div>
    <div {...stylex.props(s.documentList)}>
      <details {...stylex.props(s.documentDisclosure)}><summary {...stylex.props(s.documentSummary, t.control)}><ListChecks size={22} aria-hidden="true" {...stylex.props(s.documentIcon)}/><span {...stylex.props(s.documentTitle)}>{tx('How it works')}</span><ChevronDown size={20} aria-hidden="true" {...stylex.props(s.documentIcon)}/></summary>
        <ol data-finance-process aria-label={tx('Finance steps')} {...stylex.props(s.financeSteps)}>{financeSteps.map(([index, title, copy]) => <li key={index} {...stylex.props(s.financeStep)}><Image src={showroom.artwork.financeSteps[index]} width={72} height={72} sizes="72px" alt="" {...stylex.props(s.financeImage)}/><div {...stylex.props(s.financeCopy)}><h3 {...stylex.props(s.processTitle, t.control)}>{tx(title)}</h3><p {...stylex.props(s.processDescription, t.body)}>{tx(copy)}</p></div></li>)}</ol>
      </details>
      {[{title: 'Required documents', Icon: FileText, copy: 'Confirm identity and income documents with your lender.'}, {title: 'Rates and approval', Icon: BadgePercent, copy: 'The lender confirms eligibility, rates and terms. Calculator results are estimates.'}].map(({title, Icon, copy}) => <details key={title} {...stylex.props(s.documentDisclosure)}><summary {...stylex.props(s.documentSummary, t.control)}><Icon size={22} aria-hidden="true" {...stylex.props(s.documentIcon)}/><span {...stylex.props(s.documentTitle)}>{tx(title)}</span><ChevronDown size={20} aria-hidden="true" {...stylex.props(s.documentIcon)}/></summary><p {...stylex.props(s.documentCopy, t.body)}>{tx(copy)}</p></details>)}
    </div>
  </section>;
  return <>
    {kind === 'sell' ? <section {...stylex.props(s.methods)} aria-label={tx("Ways to sell your car")}>
      {sellingMethods.map(({title, mobileTitle, image, points, mobilePoints, action, mobileAction}) => <article key={title} data-selling-method {...stylex.props(s.method)}>
        <div {...stylex.props(s.methodMedia)}><Image src={image} width={1536} height={1024} sizes="(max-width: 767px) 100vw, 50vw" alt="" {...stylex.props(s.methodArtwork)}/></div>
        <div {...stylex.props(s.methodCopy)}><h2 {...stylex.props(s.heading, t.heading, s.methodTitle)}><ResponsiveCopy full={title} short={mobileTitle}/></h2>
          <ul {...stylex.props(s.methodPoints)}>{points.map((point, index) => <li key={point} {...stylex.props(s.methodPoint, t.body)}><Check size={18} aria-hidden="true" {...stylex.props(s.pointIcon)}/><ResponsiveCopy full={point} short={mobilePoints[index]}/></li>)}</ul>
          <button type="button" onClick={onStart} aria-label={tx(action)} {...stylex.props(s.methodAction, t.control)}>{tx(mobileAction)}<ArrowRight size={18} aria-hidden="true" {...stylex.props(s.pointIcon)}/></button>
        </div>
      </article>)}
    </section> : null}
    {kind === 'sell' ? <section {...stylex.props(s.section)} aria-label={tx("Selling guides")}><h2 {...stylex.props(s.heading, t.heading)}>{tx("Before you sell")}</h2><div {...stylex.props(s.toolsRail)}>{sellingGuides.map(({title, mobileTitle, image, description}) => <button key={title} type="button" onClick={() => setInformation({title, description})} {...stylex.props(s.tool)}><Image src={image} width={600} height={450} sizes="238px" alt="" {...stylex.props(s.toolImage)}/><span {...stylex.props(s.toolLabel, t.control)}><ResponsiveCopy full={title} short={mobileTitle}/><ArrowRight size={17} {...stylex.props(s.pointIcon)}/></span></button>)}</div></section> : null}
    {kind === 'service' ? <section aria-label={tx("Service options")} {...stylex.props(s.plans)}>{packages.map(({name, mobileName, copy, checks, mobileChecks}) => <article key={name} {...stylex.props(s.plan)}>
      <h2 {...stylex.props(s.planTitle, t.heading)}><ResponsiveCopy full={name} short={mobileName}/></h2>
      <ul {...stylex.props(s.checks)}>{checks.map((check, index) => <li key={check} {...stylex.props(s.check, t.body)}><Check size={18} aria-hidden="true" {...stylex.props(s.pointIcon)}/><ResponsiveCopy full={check} short={mobileChecks[index]}/></li>)}</ul>
      <button type="button" aria-label={`${tx('More details')}: ${tx(name)}`} onClick={() => setInformation({title: name, description: `${tx(copy)} ${checks.map(check => tx(check)).join(', ')}. ${tx('Available work, intervals and pricing depend on your car. Confirm the package with the showroom before booking.')}`})} {...stylex.props(s.packageAction, t.control)}>{tx("View more")}<ArrowRight size={18} aria-hidden="true" {...stylex.props(s.pointIcon)}/></button>
    </article>)}</section> : null}
    <section {...stylex.props(s.section)}>
      <h2 {...stylex.props(s.heading, t.heading)}><span {...stylex.props(s.desktopCopy)}>{tx(kind === 'sell' ? `Selling with ${showroom.name}` : 'Car care, step by step')}</span><span {...stylex.props(s.mobileCopy)}>{tx(kind === 'sell' ? `Selling with ${showroom.name}` : 'Service steps')}</span></h2>
      {kind === 'service' ? <ol data-service-process aria-label={tx('Service steps')} {...stylex.props(s.processSteps)}>{steps.service.map(([asset, title, copy], index) => <li key={asset} {...stylex.props(s.processStep)}><span aria-hidden="true" {...stylex.props(s.processNumber, t.title)}>{String(index + 1).padStart(2, '0')}</span><div><h3 {...stylex.props(s.processTitle, t.title)}>{tx(title)}</h3><p {...stylex.props(s.processDescription, t.body)}>{tx(copy)}</p></div></li>)}</ol> : <div {...stylex.props(s.steps)}>{steps.sell.map(([asset, title, copy]) => <article key={asset} {...stylex.props(s.step)}><img src={assetPath(`/reference-assets/continuation/sell-${asset}.png`)} width={100} height={100} alt={tx("")} loading="lazy" {...stylex.props(s.stepImage)}/><div {...stylex.props(s.stepCopy)}><h3 {...stylex.props(s.stepTitle, t.title)}>{tx(title)}</h3><p {...stylex.props(s.stepDescription, t.caption)}>{tx(copy)}</p></div></article>)}</div>}
    </section>
    {kind === 'sell' ? <BrandCampaign kind="sell" onAction={onStart}/> : kind === 'service' ? <BrandCampaign kind="care" onAction={onStart}/> : null}
    <section {...stylex.props(s.section)}><h2 {...stylex.props(s.heading, t.heading)}>{tx('A little more detail')}</h2>{[['What happens next?', 'Tell the showroom what you need. Availability, pricing and any terms are confirmed before you commit.'], ['Can I visit in person?', 'Yes, explore the showroom information and arrange a suitable time to discuss your car.']].map(([title, copy]) => <details key={title} {...stylex.props(s.faq)}><summary {...stylex.props(s.summary, t.control)}>{tx(title)}<ChevronDown size={18}/></summary><p {...stylex.props(s.faqCopy, t.caption)}>{tx(copy)}</p></details>)}</section>
    <section {...stylex.props(s.section)}><h2 {...stylex.props(s.heading, t.heading)}>{tx("Let’s talk about your car")}</h2><div {...stylex.props(s.contactGrid)}>{[['Call us', Phone], ['Email us', Mail], ['Visit us', MapPin]].map(([label, Icon]) => {const Symbol = Icon as typeof Phone; return label === 'Call us' && dealer.phoneE164 ? <a key={String(label)} href={'tel:' + dealer.phoneE164} {...stylex.props(s.contact, t.control)}><Symbol size={25}/><span>{tx(String(label))}</span></a> : label === 'Email us' && dealer.email ? <a key={String(label)} href={'mailto:' + dealer.email} {...stylex.props(s.contact, t.control)}><Symbol size={25}/><span>{tx(String(label))}</span></a> : label === 'Visit us' ? <Link key={String(label)} href="/stores" {...stylex.props(s.contact, t.control)}><Symbol size={25}/><span>{tx(String(label))}</span></Link> : <button type="button" key={String(label)} onClick={() => setInformation({title: String(label), description: dealer.phoneDisplay || dealer.email || 'Contact details are not configured for this template.'})} {...stylex.props(s.contact, t.control)}><Symbol size={25}/><span>{tx(String(label))}</span></button>;})}</div></section>
    {information ? <ReferenceInfoSheet {...information} onClose={() => setInformation(null)}/> : null}
  </>;
}
const s = stylex.create({
  heading: {color: '#202024', textWrap: 'pretty'},
  section: {marginTop: 28},
  methods: {display: 'grid', gridTemplateColumns: {[media.mobile]: '1fr', [media.tablet]: '1fr', default: 'repeat(2,minmax(0,1fr))'}, gap: 16, marginTop: 30},
  method: {position: 'relative', isolation: 'isolate', overflow: 'hidden', width: '100%', borderRadius: 20, backgroundColor: campaign.lightSurface},
  methodMedia: {position: 'absolute', inset: 0},
  methodArtwork: {position: 'absolute', right: 0, bottom: 0, width: {[media.mobile]: '100%', default: 'auto'}, height: '100%', objectFit: {[media.mobile]: 'cover', default: 'contain'}, objectPosition: 'right bottom', maskImage: 'linear-gradient(to right,transparent,#000 48%)', pointerEvents: 'none'},
  methodCopy: {position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', padding: {[media.mobile]: 20, default: 26}},
  methodTitle: {maxWidth: {[media.mobile]: '85%', default: '70%'}},
  methodPoints: {display: 'grid', maxWidth: {[media.mobile]: '65%', default: '62%'}, gap: 10, padding: 0, margin: '14px 0 0', listStyle: 'none'},
  methodPoint: {display: 'flex', alignItems: 'center', gap: 8, color: '#414147'},
  pointIcon: {flexShrink: 0, color: campaign.lightInk},
  methodAction: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, maxWidth: '100%', marginTop: 18, padding: '10px 18px', color: campaign.lightInk, borderWidth: 0, borderRadius: 30, backgroundColor: {default: '#fff', ':hover': '#fafafa'}, boxShadow: '0 2px 8px rgba(0,0,0,.04)', cursor: 'pointer'},
  toolsRail: {display: 'flex', gap: 12, overflowX: 'auto', marginTop: 14, paddingBottom: 8, scrollSnapType: 'x mandatory', scrollbarWidth: 'none'},
  tool: {display: 'flex', flexDirection: 'column', gap: 10, flex: '0 0 238px', padding: 0, borderWidth: 0, backgroundColor: 'transparent', textAlign: 'left', cursor: 'pointer', scrollSnapAlign: 'start'},
  toolImage: {display: 'block', width: '100%', height: 'auto', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: 15},
  toolLabel: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', color: '#202024'},
  plans: {display: 'grid', gridTemplateColumns: {[media.mobile]: '1fr', default: 'repeat(2,minmax(0,1fr))'}, gap: 16, marginTop: 32},
  plan: {overflow: 'hidden', padding: {[media.mobile]: 20, default: 26}, borderRadius: 20, backgroundColor: campaign.lightSurface},
  planTitle: {margin: 0, color: campaign.lightInk},
  checks: {display: 'grid', gap: 10, margin: '14px 0 0', padding: 0, listStyle: 'none'},
  check: {display: 'flex', alignItems: 'center', gap: 8, color: '#414147'},
  packageAction: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, marginTop: 18, padding: '10px 18px', color: campaign.lightInk, borderWidth: 0, borderRadius: 30, backgroundColor: {default: '#fff', ':hover': '#fafafa'}, cursor: 'pointer'},
  steps: {display: 'grid', gridTemplateColumns: {[media.mobile]: '1fr', default: 'repeat(2,minmax(0,1fr))'}, gap: 12, marginTop: 14},
  step: {display: 'grid', gridTemplateColumns: 'min(100px,30%) minmax(0,1fr)', alignItems: 'center', minHeight: 102, overflow: 'hidden', borderColor: campaign.lightBorder, borderStyle: 'solid', borderWidth: 1, borderRadius: 13, backgroundColor: '#fff'},
  stepImage: {width: '100%', height: 'auto', aspectRatio: '1', objectFit: 'cover'},
  stepCopy: {padding: 12},
  stepTitle: {overflowWrap: 'anywhere'},
  stepDescription: {marginTop: 5, color: $.muted, overflowWrap: 'anywhere'},
  financeSteps: {display: 'grid', gap: 16, margin: 0, padding: '0 16px 20px', listStyle: 'none'},
  financeStep: {display: 'grid', gridTemplateColumns: '72px minmax(0,1fr)', alignItems: 'center', gap: 12, minHeight: 72},
  financeImage: {display: 'block', width: 72, height: 72, objectFit: 'contain'},
  financeCopy: {minWidth: 0},
  processSteps: {display: 'grid', gridTemplateColumns: {[media.mobile]: '1fr', [media.tablet]: 'repeat(2,minmax(0,1fr))', default: 'repeat(3,minmax(0,1fr))'}, gap: 24, margin: '22px 0 0', padding: 0, listStyle: 'none'},
  processStep: {display: 'grid', gridTemplateColumns: '32px minmax(0,1fr)', alignItems: 'start', gap: 12},
  processNumber: {color: '#707079', fontVariantNumeric: 'tabular-nums'},
  processTitle: {textWrap: 'pretty'},
  processDescription: {marginTop: 5, color: $.muted, textWrap: 'pretty'},
  helpHeader: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12},
  helpAction: {display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 44, padding: 0, color: $.ink, borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  documentList: {marginTop: 16, overflow: 'hidden', borderWidth: 1, borderStyle: 'solid', borderColor: campaign.lightBorder, borderRadius: 16},
  documentDisclosure: {borderBottomWidth: {default: 1, ':last-child': 0}, borderBottomStyle: 'solid', borderBottomColor: campaign.lightBorder},
  documentSummary: {display: 'flex', alignItems: 'center', gap: 12, minHeight: 64, padding: '14px 16px', color: $.ink, listStyle: 'none', cursor: 'pointer'},
  documentTitle: {flexGrow: 1, minWidth: 0},
  documentIcon: {flexShrink: 0},
  documentCopy: {padding: '0 16px 18px 50px', color: $.muted},
  faq: {marginTop: 12, borderColor: campaign.lightBorder, borderStyle: 'solid', borderWidth: 1, borderRadius: 12, backgroundColor: '#fff'},
  summary: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 56, padding: '12px 15px', color: '#202024', cursor: 'pointer', listStyle: 'none'},
  faqCopy: {padding: '0 15px 15px', color: $.muted},
  contactGrid: {display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 12, marginTop: 14},
  contact: {display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, minHeight: 100, padding: 12, color: campaign.lightInk, borderWidth: 0, borderRadius: 18, backgroundColor: campaign.lightSurface, cursor: 'pointer'},
  desktopCopy: {display: {[media.mobile]: 'none', default: 'inline'}},
  mobileCopy: {display: {[media.mobile]: 'inline', default: 'none'}},
});
