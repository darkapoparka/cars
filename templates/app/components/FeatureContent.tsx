'use client';
import {useCopy} from '@/lib/locale';
import {Suspense, useState} from 'react';
import Image from '@/components/AppImage';
import * as stylex from '@stylexjs/stylex';
import {ArrowLeftRight, ArrowRight, ClipboardCheck, FileText, Search, ShieldCheck} from 'lucide-react';
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
  {intent: 'sale', title: 'Sell your car to us', mobileTitle: 'Sell your car to us', image: showroom.artwork.selling.direct, points: ['Car valuation', 'Condition review', 'Guided paperwork'], mobilePoints: ['Valuation', 'Car check', 'Documents'], icons: [ClipboardCheck, ShieldCheck, FileText], action: 'Get a valuation'},
  {intent: 'exchange', title: 'Part-exchange', mobileTitle: 'Exchange', image: showroom.artwork.selling.exchange, points: ['Value your car', 'Find your next car', 'Plan your upgrade'], mobilePoints: ['Valuation', 'Choice', 'Upgrade'], icons: [ClipboardCheck, Search, ArrowLeftRight], action: 'Explore trade-in'},
] as const;
const sellingGuides = [
  {title: 'Car valuation', mobileTitle: 'Valuation', image: showroom.artwork.selling.valuation, description: 'Have your mileage, registration details and service records ready. The showroom will review your car’s condition and discuss a valuation before you decide.'},
  {title: 'Service history', mobileTitle: 'Service history', image: showroom.artwork.selling.history, description: 'Gather your service book, maintenance invoices and any warranty documents. Include both keys if you have them, and tell the showroom about any outstanding finance or known faults.'},
  {title: 'Photo checklist', mobileTitle: 'Photos', image: showroom.artwork.selling.photos, description: 'Photograph your car in daylight: front, rear, both sides, wheels, interior and dashboard mileage. Include clear photos of any damage so the showroom can understand its condition.'},
];

function ResponsiveCopy({full, short}: {full: string; short: string}) {
  const tx = useCopy();
  return <><span {...stylex.props(s.desktopCopy)}>{tx(full)}</span><span {...stylex.props(s.mobileCopy)}>{tx(short)}</span></>;
}

export default function FeatureContent({kind, onStart}: {kind: Kind; onStart: (intent?: SellIntent) => void}) {
  const tx = useCopy();

  const [information, setInformation] = useState<{title: string; description: string} | null>(null);
  if (kind === 'finance') return <BrandCampaign kind="finance" image={showroom.artwork.heroes.finance} onAction={onStart}/>;
  return <>
    {kind === 'sell' ? <section {...stylex.props(s.methods)} aria-label={tx("Ways to sell your car")}>
      {sellingMethods.map(({intent, title, mobileTitle, image, points, mobilePoints, icons, action}) => <article key={title} data-selling-method {...stylex.props(s.method)}>
        <div {...stylex.props(s.methodMedia)}><Image src={image} width={1536} height={1024} sizes="(max-width: 767px) 100vw, 50vw" alt="" {...stylex.props(s.methodArtwork)}/></div>
        <div {...stylex.props(s.methodCopy)}><h2 {...stylex.props(s.heading, t.title, s.methodTitle)}><ResponsiveCopy full={title} short={mobileTitle}/></h2>
          <ul {...stylex.props(s.methodPoints)}>{points.map((point, index) => {const Icon = icons[index]; return <li key={point} {...stylex.props(s.methodPoint, t.body)}><span {...stylex.props(s.benefitIcon)}><Icon size={18} strokeWidth={1.6} aria-hidden="true"/></span><ResponsiveCopy full={point} short={mobilePoints[index]}/></li>;})}</ul>
        </div>
        <button type="button" onClick={() => onStart(intent)} aria-label={tx(action)} aria-haspopup="dialog" {...stylex.props(s.methodAction)}><span aria-hidden="true" {...stylex.props(s.methodArrow)}><ArrowRight size={18}/></span></button>
      </article>)}
    </section> : null}
    {kind === 'sell' ? <section {...stylex.props(s.section)} aria-label={tx("Selling guides")}><h2 {...stylex.props(s.heading, t.title)}>{tx("Before you sell")}</h2><div {...stylex.props(s.toolsRail)}>{sellingGuides.map(({title, mobileTitle, image, description}) => <button key={title} type="button" onClick={() => setInformation({title, description})} {...stylex.props(s.tool)}><Image src={image} width={600} height={450} sizes="(max-width: 767px) 184px, 33vw" alt="" {...stylex.props(s.toolImage)}/><span {...stylex.props(s.toolLabel, t.caption)}><ResponsiveCopy full={title} short={mobileTitle}/><ArrowRight size={17} {...stylex.props(s.pointIcon)}/></span></button>)}</div></section> : null}
    {kind === 'service' ? <Suspense fallback={null}><ServiceCatalogue/></Suspense> : null}
    {kind === 'service' ? <BrandCampaign kind="care" onAction={onStart}/> : null}
    {information ? <ReferenceInfoSheet {...information} onClose={() => setInformation(null)}/> : null}
  </>;
}
const s = stylex.create({
  heading: {color: '#202024', textWrap: 'pretty'},
  section: {marginTop: 28},
  methods: {display: 'grid', gridTemplateColumns: {[media.mobile]: '1fr', [media.tablet]: '1fr', default: 'repeat(2,minmax(0,1fr))'}, gap: 16, marginTop: 20},
  method: {position: 'relative', isolation: 'isolate', overflow: 'hidden', width: '100%', borderRadius: 20, backgroundColor: campaign.lightSurface},
  methodMedia: {position: 'absolute', inset: 0},
  methodArtwork: {position: 'absolute', right: 0, bottom: 0, width: '65%', height: '100%', objectFit: 'cover', objectPosition: 'right bottom', maskImage: 'linear-gradient(to right,transparent,#000 28%),linear-gradient(to bottom,transparent,#000 32%)', maskComposite: 'intersect', pointerEvents: 'none'},
  methodCopy: {position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', padding: {[media.mobile]: 20, default: 26}, pointerEvents: 'none'},
  methodTitle: {maxWidth: 'calc(100% - 40px)'},
  methodPoints: {display: 'grid', maxWidth: '65%', gap: 10, padding: 0, margin: '20px 0 0', listStyle: 'none'},
  methodPoint: {display: 'flex', alignItems: 'center', gap: 8, color: '#414147'},
  benefitIcon: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 32, height: 32, color: campaign.lightInk, borderRadius: 10, backgroundColor: '#e8e8eb'},
  pointIcon: {flexShrink: 0, color: campaign.lightInk},
  methodAction: {position: 'absolute', inset: 0, zIndex: 2, width: '100%', height: '100%', padding: 0, color: campaign.lightInk, borderWidth: 0, borderRadius: 20, backgroundColor: {default: 'transparent', ':hover': 'rgba(38,38,41,.025)'}, cursor: 'pointer', outline: {default: 'none', ':focus-visible': '2px solid #262629'}, outlineOffset: -3},
  methodArrow: {position: 'absolute', right: {[media.mobile]: 16, default: 22}, top: {[media.mobile]: 14, default: 20}, display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: '50%', backgroundColor: '#fff'},
  toolsRail: {display: 'flex', gap: 12, overflowX: 'auto', marginTop: 14, paddingBottom: 8, scrollSnapType: 'x mandatory', scrollbarWidth: 'none'},
  tool: {display: 'flex', flexDirection: 'column', flex: {[media.mobile]: '0 0 184px', default: '1 1 0'}, minWidth: 0, padding: 0, overflow: 'hidden', borderWidth: 0, borderRadius: 16, backgroundColor: campaign.lightSurface, textAlign: 'left', cursor: 'pointer', scrollSnapAlign: 'start'},
  toolImage: {display: 'block', width: '100%', height: 'auto', aspectRatio: '4 / 3', objectFit: 'cover'},
  toolLabel: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%', minHeight: 44, padding: '10px 12px', color: '#202024'},
  desktopCopy: {display: {[media.mobile]: 'none', default: 'inline'}},
  mobileCopy: {display: {[media.mobile]: 'inline', default: 'none'}},
});
