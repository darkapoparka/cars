'use client';
import {useCopy} from '@/lib/locale';
import Image from '@/components/AppImage';
import * as stylex from '@stylexjs/stylex';
import {ArrowLeftRight, ArrowRight, ClipboardCheck, FileText, Search, ShieldCheck} from 'lucide-react';
import BrandCampaign from '@/components/BrandCampaign';
import SellingProcess from '@/components/SellingProcess';
import ServiceCatalogue from '@/components/ServiceCatalogue';
import type {ServiceSearchState} from '@/components/ServiceSearchField';
import type {SellIntent} from '@/components/SellEnquirySheet';
import {showroom} from '@/lib/showroom';
import {media, tokens as $} from '@/app/tokens.stylex';
import {campaignTokens as campaign} from '@/app/campaign-theme.stylex';
import {typography as t} from '@/app/typography.stylex';

type Kind = 'sell' | 'finance' | 'service';
const sellingMethods = [
  {intent: 'sale', title: 'Sell your car to us', mobileTitle: 'Sell your car to us', image: showroom.artwork.selling.direct, points: ['Car valuation', 'Condition review', 'Guided paperwork'], mobilePoints: ['Valuation', 'Car check', 'Documents'], icons: [ClipboardCheck, ShieldCheck, FileText], action: 'Request a valuation'},
  {intent: 'exchange', title: 'Part-exchange', mobileTitle: 'Exchange', image: showroom.artwork.selling.exchange, points: ['Value your car', 'Find your next car', 'Plan your upgrade'], mobilePoints: ['Valuation', 'Choice', 'Upgrade'], icons: [ClipboardCheck, Search, ArrowLeftRight], action: 'Request a trade-in'},
] as const;

function ResponsiveCopy({full, short}: {full: string; short: string}) {
  const tx = useCopy();
  return <><span {...stylex.props(s.desktopCopy)}>{tx(full)}</span><span {...stylex.props(s.mobileCopy)}>{tx(short)}</span></>;
}

export default function FeatureContent({kind, onStart, serviceSearch}: {kind: Kind; onStart: (intent?: SellIntent) => void; serviceSearch?: ServiceSearchState}) {
  const tx = useCopy();

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
    {kind === 'sell' ? <SellingProcess/> : null}
    {kind === 'service' && serviceSearch ? <ServiceCatalogue searchState={serviceSearch}/> : null}
  </>;
}
const s = stylex.create({
  heading: {color: '#202024', textWrap: 'pretty'},
  methods: {display: 'grid', gridTemplateColumns: {[media.mobile]: '1fr', [media.tablet]: '1fr', default: 'repeat(2,minmax(0,1fr))'}, gap: {[media.mobile]: $.mobileSectionGap, default: 16}, marginTop: {[media.mobile]: $.mobileSectionGap, default: 20}},
  method: {position: 'relative', isolation: 'isolate', overflow: 'hidden', width: '100%', borderRadius: 20, backgroundColor: campaign.lightSurface},
  methodMedia: {position: 'absolute', inset: 0},
  methodArtwork: {position: 'absolute', right: 0, bottom: 0, width: '65%', height: '100%', objectFit: 'cover', objectPosition: 'right bottom', maskImage: 'linear-gradient(to right,transparent,#000 28%),linear-gradient(to bottom,transparent,#000 32%)', maskComposite: 'intersect', pointerEvents: 'none'},
  methodCopy: {position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', padding: {[media.mobile]: '20px 20px 68px', default: '26px 26px 74px'}, pointerEvents: 'none'},
  methodTitle: {maxWidth: '100%'},
  methodPoints: {display: 'grid', maxWidth: '65%', gap: 8, padding: 0, margin: '14px 0 0', listStyle: 'none'},
  methodPoint: {display: 'flex', alignItems: 'center', gap: 8, color: '#414147'},
  benefitIcon: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 32, height: 32, color: campaign.lightInk, borderRadius: 10, backgroundColor: '#e8e8eb'},
  methodAction: {position: 'absolute', inset: 0, zIndex: 2, width: '100%', height: '100%', padding: 0, color: campaign.lightInk, borderWidth: 0, borderRadius: 20, backgroundColor: {default: 'transparent', ':hover': 'rgba(38,38,41,.025)'}, cursor: 'pointer', outline: {default: 'none', ':focus-visible': '2px solid #262629'}, outlineOffset: -3},
  methodActionLabel: {position: 'absolute', left: {[media.mobile]: 20, default: 26}, bottom: {[media.mobile]: 18, default: 24}, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 36, padding: '8px 14px', fontWeight: 500, borderRadius: 30, backgroundColor: '#fff'},
  desktopCopy: {display: {[media.mobile]: 'none', default: 'inline'}},
  mobileCopy: {display: {[media.mobile]: 'inline', default: 'none'}},
});
