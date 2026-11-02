'use client';
import {useId} from 'react';
import {useCopy} from '@/lib/locale';
import Image from '@/components/AppImage';
import * as stylex from '@stylexjs/stylex';
import {ArrowLeftRight, ArrowRight, ClipboardCheck, FileText, Search, ShieldCheck} from 'lucide-react';
import BrandCampaign from '@/components/BrandCampaign';
import SellingProcess from '@/components/SellingProcess';
import ServiceCatalogue from '@/components/ServiceCatalogue';
import {surfaceStyles} from '@/components/surface.stylex';
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

export default function FeatureContent({kind, onStart, onCalculate, serviceSearch, compactMobile = false}: {kind: Kind; onStart: (intent?: SellIntent) => void; onCalculate?: () => void; serviceSearch?: ServiceSearchState; compactMobile?: boolean}) {
  const tx = useCopy();
  const methodId = useId();

  if (kind === 'finance') return <>
    {compactMobile && onCalculate ? <section aria-label={tx('Leasing')} {...stylex.props(s.financeActions)}>{[
      {title: 'Finance calculator', copy: 'Explore your monthly payment.', image: showroom.services[2].mobileImage, onClick: onCalculate, contain: true},
      {title: 'Ask us', copy: 'Help with your car and finance options.', image: showroom.artwork.heroes.finance, onClick: () => onStart(), contain: false},
    ].map(action => <button key={action.title} type="button" aria-haspopup="dialog" aria-label={tx(action.title)} onClick={action.onClick} {...stylex.props(s.financeAction, surfaceStyles.card)}><Image src={action.image} width={64} height={64} sizes="64px" alt="" {...stylex.props(s.financeImage, action.contain && s.financeIcon)}/><span {...stylex.props(s.financeCopy)}><span {...stylex.props(s.financeTitle)}>{tx(action.title)}</span><span {...stylex.props(s.financeDescription)}>{tx(action.copy)}</span></span><ArrowRight size={16} aria-hidden="true"/></button>)}</section> : null}
    <div {...stylex.props(compactMobile && onCalculate && s.financeWideOnly)}><BrandCampaign kind="finance" image={showroom.artwork.heroes.finance} onAction={onStart}/></div>
  </>;
  return <>
    {kind === 'sell' ? <section {...stylex.props(s.methods)} aria-label={tx("Ways to sell your car")}>
      {sellingMethods.map(({intent, title, mobileTitle, image, points, mobilePoints, icons, action}) => <article key={title} data-selling-method {...stylex.props(s.method, compactMobile && surfaceStyles.card, compactMobile && s.mobileMethod)}>
        <div {...stylex.props(s.methodMedia, compactMobile && s.mobileMethodMedia)}><Image src={image} width={1536} height={1024} sizes={compactMobile ? '(max-width: 767px) 64px, 50vw' : '(max-width: 767px) 100vw, 50vw'} priority={intent === 'sale'} alt="" {...stylex.props(s.methodArtwork, compactMobile && s.mobileMethodArtwork)}/></div>
        <div {...stylex.props(s.methodCopy, compactMobile && s.mobileMethodCopy)}><h2 id={`${methodId}-${intent}-title`} {...stylex.props(s.heading, t.title, s.methodTitle, compactMobile && s.mobileMethodTitle)}><ResponsiveCopy full={title} short={mobileTitle}/></h2>
          {compactMobile ? <p {...stylex.props(s.mobileMethodDescription)}>{tx(intent === 'sale' ? 'Value your car' : 'Find your next car')}</p> : null}
          <ul {...stylex.props(s.methodPoints, compactMobile && s.mobileMethodPoints)}>{points.map((point, index) => {const Icon = icons[index]; return <li key={point} {...stylex.props(s.methodPoint, t.body)}><span {...stylex.props(s.benefitIcon)}><Icon size={18} strokeWidth={1.6} aria-hidden="true"/></span><ResponsiveCopy full={point} short={mobilePoints[index]}/></li>;})}</ul>
        </div>
        {compactMobile ? <ArrowRight size={16} aria-hidden="true" {...stylex.props(s.mobileMethodArrow)}/> : null}
        <button type="button" onClick={() => onStart(intent)} aria-label={tx(action)} aria-labelledby={compactMobile ? `${methodId}-${intent}-title ${methodId}-${intent}-action` : undefined} aria-haspopup="dialog" {...stylex.props(s.methodAction)}><span id={`${methodId}-${intent}-action`} {...stylex.props(s.methodActionLabel, t.caption, compactMobile && s.mobileMethodActionLabel)}>{tx(action)}<ArrowRight size={16} aria-hidden="true"/></span></button>
      </article>)}
    </section> : null}
    {kind === 'sell' ? <SellingProcess/> : null}
    {kind === 'service' && serviceSearch ? <ServiceCatalogue searchState={serviceSearch} compactMobile={compactMobile}/> : null}
  </>;
}
const s = stylex.create({
  financeActions: {display: {[media.mobile]: 'grid', default: 'none'}, gap: 12, marginTop: 12},
  financeWideOnly: {display: {[media.mobile]: 'none', default: 'contents'}},
  financeAction: {display: 'grid', gridTemplateColumns: '64px minmax(0,1fr) 16px', alignItems: 'center', gap: 12, width: '100%', minHeight: 88, padding: 12, color: $.ink, fontFamily: $.fontSans, textAlign: 'left', borderWidth: 0, borderRadius: 20, backgroundColor: $.surface, outline: {default: 'none', ':focus-visible': '2px solid #242428'}, outlineOffset: -3, cursor: 'pointer'},
  financeImage: {display: 'block', width: 64, height: 64, objectFit: 'cover', borderRadius: 12},
  financeIcon: {objectFit: 'contain'},
  financeCopy: {display: 'grid', gap: 4, minWidth: 0},
  financeTitle: {fontSize: 16, fontWeight: 500, lineHeight: '22px'},
  financeDescription: {color: $.muted, fontSize: 13, lineHeight: '18px'},
  mobileMethod: {display: {[media.mobile]: 'grid', default: 'block'}, gridTemplateColumns: {[media.mobile]: '64px minmax(0,1fr) 16px', default: 'none'}, alignItems: {[media.mobile]: 'center', default: 'normal'}, gap: {[media.mobile]: 12, default: 'normal'}, minHeight: {[media.mobile]: 88, default: 0}, padding: {[media.mobile]: 12, default: 0}, backgroundColor: {[media.mobile]: $.surfaceAlt, default: campaign.lightSurface}},
  mobileMethodMedia: {position: {[media.mobile]: 'relative', default: 'absolute'}, inset: {[media.mobile]: 'auto', default: 0}, width: {[media.mobile]: 64, default: 'auto'}, height: {[media.mobile]: 64, default: 'auto'}, overflow: {[media.mobile]: 'hidden', default: 'visible'}, borderRadius: {[media.mobile]: 12, default: 0}},
  mobileMethodArtwork: {position: {[media.mobile]: 'static', default: 'absolute'}, width: {[media.mobile]: '100%', default: '65%'}, height: '100%', objectPosition: {[media.mobile]: 'center', default: 'right bottom'}, maskImage: {[media.mobile]: 'none', default: 'linear-gradient(to right,transparent,#000 28%),linear-gradient(to bottom,transparent,#000 32%)'}},
  mobileMethodCopy: {minWidth: {[media.mobile]: 0, default: 'auto'}, gap: {[media.mobile]: 4, default: 0}, padding: {[media.mobile]: 0, default: '26px 26px 74px'}},
  mobileMethodTitle: {fontSize: {[media.mobile]: 16, default: 18}, fontWeight: {[media.mobile]: 500, default: 600}, lineHeight: {[media.mobile]: '22px', default: '24px'}},
  mobileMethodDescription: {display: {[media.mobile]: 'block', default: 'none'}, margin: 0, color: $.muted, fontSize: 13, lineHeight: '18px'},
  mobileMethodPoints: {display: {[media.mobile]: 'none', default: 'grid'}},
  mobileMethodArrow: {display: {[media.mobile]: 'block', default: 'none'}},
  mobileMethodActionLabel: {display: {[media.mobile]: 'none', default: 'inline-flex'}},
  heading: {color: '#202024', textWrap: 'pretty'},
  methods: {display: 'grid', gridTemplateColumns: {[media.mobile]: '1fr', [media.tablet]: '1fr', default: 'repeat(2,minmax(0,1fr))'}, gap: {[media.mobile]: $.mobileSectionGap, default: 16}, marginTop: {[media.mobile]: $.mobileSectionGap, default: 20}},
  method: {position: 'relative', isolation: 'isolate', overflow: 'hidden', width: '100%', borderRadius: 20, backgroundColor: campaign.lightSurface},
  methodMedia: {position: 'absolute', inset: 0},
  methodArtwork: {position: 'absolute', right: 0, bottom: 0, width: '65%', height: '100%', objectFit: 'cover', objectPosition: 'right bottom', maskImage: 'linear-gradient(to right,transparent,#000 28%),linear-gradient(to bottom,transparent,#000 32%)', maskComposite: 'intersect', pointerEvents: 'none'},
  methodCopy: {position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', padding: {[media.mobile]: '20px 20px 68px', default: '26px 26px 74px'}, pointerEvents: 'none'},
  methodTitle: {maxWidth: '100%'},
  methodPoints: {display: 'grid', maxWidth: '65%', gap: 8, padding: 0, margin: '14px 0 0', listStyle: 'none'},
  methodPoint: {display: 'flex', alignItems: 'center', gap: 8, color: '#414147'},
  benefitIcon: {display: 'grid', placeItems: 'center', flexShrink: 0, width: {[media.mobile]: 18, default: 32}, height: 32, color: campaign.lightInk, borderRadius: 10, backgroundColor: {[media.mobile]: 'transparent', default: '#e8e8eb'}},
  methodAction: {position: 'absolute', inset: 0, zIndex: 2, width: '100%', height: '100%', padding: 0, color: campaign.lightInk, borderWidth: 0, borderRadius: 20, backgroundColor: {default: 'transparent', ':hover': 'rgba(38,38,41,.025)'}, cursor: 'pointer', outline: {default: 'none', ':focus-visible': '2px solid #262629'}, outlineOffset: -3},
  methodActionLabel: {position: 'absolute', left: {[media.mobile]: 20, default: 26}, bottom: {[media.mobile]: 18, default: 24}, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 36, padding: '8px 14px', fontWeight: 500, borderRadius: 30, backgroundColor: '#fff'},
  desktopCopy: {display: {[media.mobile]: 'none', default: 'inline'}},
  mobileCopy: {display: {[media.mobile]: 'inline', default: 'none'}},
});
