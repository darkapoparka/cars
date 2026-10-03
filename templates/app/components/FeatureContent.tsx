'use client';
import {useCopy} from '@/lib/locale';
import {Suspense, useState} from 'react';
import Image from '@/components/AppImage';
import * as stylex from '@stylexjs/stylex';
import {ArrowLeftRight, ArrowRight, Camera, ClipboardCheck, FileText, Search, ShieldCheck} from 'lucide-react';
import BrandCampaign from '@/components/BrandCampaign';
import ReferenceInfoSheet from '@/components/ReferenceInfoSheet';
import ServiceCatalogue from '@/components/ServiceCatalogue';
import type {SellIntent} from '@/components/SellEnquirySheet';
import {showroom} from '@/lib/showroom';
import {media} from '@/app/tokens.stylex';
import {campaignTokens as campaign} from '@/app/campaign-theme.stylex';
import {typography as t} from '@/app/typography.stylex';

type Kind = 'sell' | 'finance' | 'service';
const sellingMethods = [
  {intent: 'sale', title: 'Sell your car to us', mobileTitle: 'Sell your car to us', image: showroom.artwork.selling.direct, points: ['Car valuation', 'Condition review', 'Guided paperwork'], mobilePoints: ['Valuation', 'Car check', 'Documents'], icons: [ClipboardCheck, ShieldCheck, FileText], action: 'Request a valuation'},
  {intent: 'exchange', title: 'Part-exchange', mobileTitle: 'Exchange', image: showroom.artwork.selling.exchange, points: ['Value your car', 'Find your next car', 'Plan your upgrade'], mobilePoints: ['Valuation', 'Choice', 'Upgrade'], icons: [ClipboardCheck, Search, ArrowLeftRight], action: 'Request a trade-in'},
] as const;
const sellingSteps = [
  {label: 'Details', title: 'Your car details', description: 'Share make, model, year and mileage.'},
  {label: 'Valuation', title: 'Review and valuation', description: 'The dealer reviews the condition and confirms the price.'},
  {label: 'Terms', title: 'Sale or trade-in', description: 'Agree the terms and paperwork with the dealer.'},
];
const sellingGuides = [
  {title: 'Car valuation', mobileTitle: 'Valuation', icon: ClipboardCheck, summary: 'Details and condition', description: 'Have your mileage, registration details and service records ready. The showroom will review your car’s condition and discuss a valuation before you decide.'},
  {title: 'Service history', mobileTitle: 'Service history', icon: FileText, summary: 'Records and both keys', description: 'Gather your service book, maintenance invoices and any warranty documents. Include both keys if you have them, and tell the showroom about any outstanding finance or known faults.'},
  {title: 'Photo checklist', mobileTitle: 'Photos', icon: Camera, summary: 'Exterior, interior and mileage', description: 'Photograph your car in daylight: front, rear, both sides, wheels, interior and dashboard mileage. Include clear photos of any damage so the showroom can understand its condition.'},
];

function ResponsiveCopy({full, short}: {full: string; short: string}) {
  const tx = useCopy();
  return <><span {...stylex.props(s.desktopCopy)}>{tx(full)}</span><span {...stylex.props(s.mobileCopy)}>{tx(short)}</span></>;
}

export default function FeatureContent({kind, onStart}: {kind: Kind; onStart: (intent?: SellIntent) => void}) {
  const tx = useCopy();

  const [information, setInformation] = useState<{title: string; description: string; steps?: typeof sellingSteps} | null>(null);
  if (kind === 'finance') return <BrandCampaign kind="finance" image={showroom.artwork.heroes.finance} onAction={onStart}/>;
  return <>
    {kind === 'sell' ? <section {...stylex.props(s.methods)} aria-label={tx("Ways to sell your car")}>
      {sellingMethods.map(({intent, title, mobileTitle, image, points, mobilePoints, icons, action}) => <article key={title} data-selling-method {...stylex.props(s.method)}>
        <div {...stylex.props(s.methodMedia)}><Image src={image} width={1536} height={1024} sizes="(max-width: 767px) 100vw, 50vw" priority={intent === 'sale'} alt="" {...stylex.props(s.methodArtwork)}/></div>
        <div {...stylex.props(s.methodCopy)}><h2 {...stylex.props(s.heading, t.title, s.methodTitle)}><ResponsiveCopy full={title} short={mobileTitle}/></h2>
          <ul {...stylex.props(s.methodPoints)}>{points.map((point, index) => {const Icon = icons[index]; return <li key={point} {...stylex.props(s.methodPoint, t.body)}><span {...stylex.props(s.benefitIcon)}><Icon size={18} strokeWidth={1.6} aria-hidden="true"/></span><ResponsiveCopy full={point} short={mobilePoints[index]}/></li>;})}</ul>
        </div>
        <button type="button" onClick={() => onStart(intent)} aria-label={tx(action)} aria-haspopup="dialog" {...stylex.props(s.methodAction)}><span {...stylex.props(s.methodActionLabel, t.caption)}>{tx(action)}<ArrowRight size={16} aria-hidden="true"/></span></button>
      </article>)}
    </section> : null}
    {kind === 'sell' ? <>
      <section data-selling-process {...stylex.props(s.process)} aria-labelledby="selling-steps-title">
        <div {...stylex.props(s.processHeader)}><h2 id="selling-steps-title" {...stylex.props(s.heading, t.title)}>{tx('How it works')}</h2>
          <button type="button" aria-haspopup="dialog" onClick={() => setInformation({title: 'How it works', description: 'Sell or part-exchange.', steps: sellingSteps})} {...stylex.props(s.processDetails, t.caption)}>{tx('View steps')}<ArrowRight size={14} aria-hidden="true"/></button>
        </div>
        <ol {...stylex.props(s.steps)}>{sellingSteps.map(({label, title}, index) => <li key={title} {...stylex.props(s.step)}>
          <span aria-hidden="true" {...stylex.props(s.stepNumber, t.caption)}>{String(index + 1).padStart(2, '0')}</span>
          <h3 {...stylex.props(s.stepTitle, t.caption)}>{tx(label)}</h3>
          {index < sellingSteps.length - 1 ? <ArrowRight size={14} aria-hidden="true" {...stylex.props(s.stepConnector)}/> : null}
        </li>)}</ol>
      </section>
      <section {...stylex.props(s.section)} aria-label={tx('Selling guides')}><h2 {...stylex.props(s.heading, t.title)}>{tx('Before you sell')}</h2>
        <ul {...stylex.props(s.tools)}>{sellingGuides.map(({title, mobileTitle, icon: Icon, summary, description}) => <li key={title} {...stylex.props(s.guide)}><button type="button" aria-haspopup="dialog" onClick={() => setInformation({title, description})} {...stylex.props(s.tool)}>
          <span {...stylex.props(s.guideIcon)}><Icon size={20} strokeWidth={1.6} aria-hidden="true"/></span>
          <span {...stylex.props(s.toolCopy)}><span {...stylex.props(s.toolLabel, t.body)}><ResponsiveCopy full={title} short={mobileTitle}/></span><span {...stylex.props(s.toolSummary, t.caption)}>{tx(summary)}</span></span>
          <ArrowRight size={17} aria-hidden="true" {...stylex.props(s.pointIcon)}/>
        </button></li>)}</ul>
      </section>
    </> : null}
    {kind === 'service' ? <Suspense fallback={null}><ServiceCatalogue/></Suspense> : null}
    {kind === 'service' ? <BrandCampaign kind="care" onAction={onStart}/> : null}
    {information ? <ReferenceInfoSheet {...information} onClose={() => setInformation(null)}/> : null}
  </>;
}
const s = stylex.create({
  heading: {color: '#202024', textWrap: 'pretty'},
  section: {marginTop: 28},
  methods: {display: 'grid', gridTemplateColumns: {[media.mobile]: '1fr', [media.tablet]: '1fr', default: 'repeat(2,minmax(0,1fr))'}, gap: 16, marginTop: {[media.mobile]: 14, default: 20}},
  method: {position: 'relative', isolation: 'isolate', overflow: 'hidden', width: '100%', borderRadius: 20, backgroundColor: campaign.lightSurface},
  methodMedia: {position: 'absolute', inset: 0},
  methodArtwork: {position: 'absolute', right: 0, bottom: 0, width: '65%', height: '100%', objectFit: 'cover', objectPosition: 'right bottom', maskImage: 'linear-gradient(to right,transparent,#000 28%),linear-gradient(to bottom,transparent,#000 32%)', maskComposite: 'intersect', pointerEvents: 'none'},
  methodCopy: {position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', padding: {[media.mobile]: '20px 20px 68px', default: '26px 26px 74px'}, pointerEvents: 'none'},
  methodTitle: {maxWidth: '100%'},
  methodPoints: {display: 'grid', maxWidth: '65%', gap: 8, padding: 0, margin: '14px 0 0', listStyle: 'none'},
  methodPoint: {display: 'flex', alignItems: 'center', gap: 8, color: '#414147'},
  benefitIcon: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 32, height: 32, color: campaign.lightInk, borderRadius: 10, backgroundColor: '#e8e8eb'},
  pointIcon: {flexShrink: 0, color: campaign.lightInk},
  methodAction: {position: 'absolute', inset: 0, zIndex: 2, width: '100%', height: '100%', padding: 0, color: campaign.lightInk, borderWidth: 0, borderRadius: 20, backgroundColor: {default: 'transparent', ':hover': 'rgba(38,38,41,.025)'}, cursor: 'pointer', outline: {default: 'none', ':focus-visible': '2px solid #262629'}, outlineOffset: -3},
  methodActionLabel: {position: 'absolute', left: {[media.mobile]: 20, default: 26}, bottom: {[media.mobile]: 18, default: 24}, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 36, padding: '8px 14px', fontWeight: 500, borderRadius: 30, backgroundColor: '#fff'},
  process: {marginTop: 24, padding: '12px 18px 18px', borderRadius: 20, backgroundColor: campaign.lightSurface},
  processHeader: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12},
  processDetails: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, gap: 6, minHeight: 44, padding: 0, color: campaign.lightInk, borderWidth: 0, borderRadius: 4, backgroundColor: 'transparent', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer', outline: {default: 'none', ':focus-visible': '2px solid #262629'}, outlineOffset: 3},
  steps: {display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 16, padding: 0, margin: '12px 0 0', listStyle: 'none'},
  step: {position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, minWidth: 0},
  stepNumber: {color: campaign.lightMuted},
  stepTitle: {color: '#202024', fontWeight: 500},
  stepConnector: {position: 'absolute', top: 16, right: -12, color: campaign.lightMuted},
  tools: {display: 'grid', gridTemplateColumns: {[media.mobile]: '1fr', default: 'repeat(3,minmax(0,1fr))'}, gap: {[media.mobile]: 0, default: 28}, padding: 0, margin: '14px 0 0', listStyle: 'none'},
  guide: {borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: campaign.lightBorder},
  tool: {display: 'flex', alignItems: 'center', gap: 12, width: '100%', minWidth: 0, minHeight: 72, padding: '12px 0', borderWidth: 0, borderRadius: 3, backgroundColor: 'transparent', textAlign: 'left', cursor: 'pointer', outline: {default: 'none', ':focus-visible': '2px solid #262629'}, outlineOffset: 3},
  guideIcon: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 28, height: 28, color: campaign.lightInk},
  toolCopy: {display: 'grid', flex: '1 1 0', minWidth: 0, gap: 3},
  toolLabel: {color: '#202024', fontWeight: 500},
  toolSummary: {color: campaign.lightMuted},
  desktopCopy: {display: {[media.mobile]: 'none', default: 'inline'}},
  mobileCopy: {display: {[media.mobile]: 'inline', default: 'none'}},
});
