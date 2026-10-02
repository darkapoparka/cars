'use client';
import {useCopy} from '@/lib/locale';
import {Suspense, useState} from 'react';
import Image from '@/components/AppImage';
import * as stylex from '@stylexjs/stylex';
import {ArrowRight, Check} from 'lucide-react';
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
  {intent: 'sale', title: 'Sell your car to us', mobileTitle: 'Sell your car to us', image: showroom.artwork.selling.direct, points: ['Car valuation', 'Condition review', 'Guided paperwork'], mobilePoints: ['Valuation', 'Car check', 'Documents'], action: 'Get a valuation', mobileAction: 'Valuation'},
  {intent: 'exchange', title: 'Part-exchange', mobileTitle: 'Exchange', image: showroom.artwork.selling.exchange, points: ['Value your car', 'Find your next car', 'Plan your upgrade'], mobilePoints: ['Valuation', 'Choice', 'Upgrade'], action: 'Explore trade-in', mobileAction: 'Exchange'},
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
      {sellingMethods.map(({intent, title, mobileTitle, image, points, mobilePoints, action, mobileAction}) => <article key={title} data-selling-method {...stylex.props(s.method)}>
        <div {...stylex.props(s.methodMedia)}><Image src={image} width={1536} height={1024} sizes="(max-width: 767px) 100vw, 50vw" alt="" {...stylex.props(s.methodArtwork)}/></div>
        <div {...stylex.props(s.methodCopy)}><h2 {...stylex.props(s.heading, t.heading, s.methodTitle)}><ResponsiveCopy full={title} short={mobileTitle}/></h2>
          <ul {...stylex.props(s.methodPoints)}>{points.map((point, index) => <li key={point} {...stylex.props(s.methodPoint, t.body)}><Check size={18} aria-hidden="true" {...stylex.props(s.pointIcon)}/><ResponsiveCopy full={point} short={mobilePoints[index]}/></li>)}</ul>
          <button type="button" onClick={() => onStart(intent)} aria-label={tx(action)} aria-haspopup="dialog" {...stylex.props(s.methodAction, t.control)}>{tx(mobileAction)}<ArrowRight size={18} aria-hidden="true" {...stylex.props(s.pointIcon)}/></button>
        </div>
      </article>)}
    </section> : null}
    {kind === 'sell' ? <section {...stylex.props(s.section)} aria-label={tx("Selling guides")}><h2 {...stylex.props(s.heading, t.heading)}>{tx("Before you sell")}</h2><div {...stylex.props(s.toolsRail)}>{sellingGuides.map(({title, mobileTitle, image, description}) => <button key={title} type="button" onClick={() => setInformation({title, description})} {...stylex.props(s.tool)}><Image src={image} width={600} height={450} sizes="238px" alt="" {...stylex.props(s.toolImage)}/><span {...stylex.props(s.toolLabel, t.control)}><ResponsiveCopy full={title} short={mobileTitle}/><ArrowRight size={17} {...stylex.props(s.pointIcon)}/></span></button>)}</div></section> : null}
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
  methodArtwork: {position: 'absolute', right: 0, bottom: 0, width: {[media.mobile]: '100%', default: 'auto'}, height: '100%', objectFit: {[media.mobile]: 'cover', default: 'contain'}, objectPosition: 'right bottom', maskImage: 'linear-gradient(to right,transparent,#000 48%)', pointerEvents: 'none'},
  methodCopy: {position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', padding: {[media.mobile]: 20, default: 26}},
  methodTitle: {maxWidth: {[media.mobile]: '85%', default: '70%'}},
  methodPoints: {display: 'grid', maxWidth: {[media.mobile]: '65%', default: '62%'}, gap: 10, padding: 0, margin: '14px 0 0', listStyle: 'none'},
  methodPoint: {display: 'flex', alignItems: 'center', gap: 8, color: '#414147'},
  pointIcon: {flexShrink: 0, color: campaign.lightInk},
  methodAction: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, maxWidth: '100%', marginTop: 18, padding: '10px 18px', color: campaign.lightInk, borderWidth: 0, borderRadius: 30, backgroundColor: {default: '#fff', ':hover': '#fafafa'}, boxShadow: '0 2px 8px rgba(0,0,0,.04)', cursor: 'pointer'},
  toolsRail: {display: 'flex', gap: 12, overflowX: 'auto', marginTop: 14, paddingBottom: 8, scrollSnapType: 'x mandatory', scrollbarWidth: 'none'},
  tool: {display: 'flex', flexDirection: 'column', gap: 10, flex: {[media.mobile]: '0 0 184px', default: '1 1 0'}, minWidth: 0, padding: 0, borderWidth: 0, backgroundColor: 'transparent', textAlign: 'left', cursor: 'pointer', scrollSnapAlign: 'start'},
  toolImage: {display: 'block', width: '100%', height: 'auto', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: 15},
  toolLabel: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', color: '#202024'},
  desktopCopy: {display: {[media.mobile]: 'none', default: 'inline'}},
  mobileCopy: {display: {[media.mobile]: 'inline', default: 'none'}},
});
