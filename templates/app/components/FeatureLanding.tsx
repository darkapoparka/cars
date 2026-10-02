'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import Image from '@/components/AppImage';

import {useState} from 'react';
import {useRouter} from '@/lib/navigation';
import * as stylex from '@stylexjs/stylex';
import DiscoveryHeader from '@/components/DiscoveryHeader';
import ShowroomBanner from '@/components/ShowroomBanner';
import FeatureContent from '@/components/FeatureContent';
import LoginSheet from '@/components/DealerEnquirySheet';
import {showroom} from '@/lib/showroom';
import {media, tokens as $} from '@/app/tokens.stylex';

export type FeatureKind = 'sell' | 'finance' | 'service';
const config = {
  sell: {mobileTitle: 'Sell your car.', title: 'Sell your car.', copy: 'A simple way to sell or part-exchange.', mobileCopy: 'Sell or part-exchange.', cta: 'Sell your car', mobileCta: 'Ask about selling'},
  finance: {mobileTitle: 'Car finance.', title: 'Finance your next car.', copy: 'Payment options for your next car.', mobileCopy: 'Explore payment options.', cta: 'Get assistance', mobileCta: 'Ask about finance'},
  service: {mobileTitle: 'Car care.', title: 'Care for your car.', copy: 'Find the right service for your car.', mobileCopy: 'Vehicle care options.', cta: 'Book a service', mobileCta: 'Ask about service'},
} as const;
const sellBrands = [['Toyota', 'sell-brand-1'], ['Honda', 'sell-brand-2'], ['Nissan', 'sell-brand-3'], ['Mercedes', 'sell-brand-4'], ['BMW', 'sell-brand-5'], ['Audi', 'sell-brand-6'], ['Ford', 'sell-brand-7'], ['Kia', 'sell-brand-8'], ['Hyundai', 'brand-hyundai']] as const;
const serviceBrands = [['Toyota', 'sell-brand-1'], ['Honda', 'sell-brand-2'], ['Nissan', 'sell-brand-3'], ['Hyundai', 'brand-hyundai'], ['BMW', 'sell-brand-5'], ['Chevrolet', 'brand-chevrolet'], ['Ford', 'sell-brand-7'], ['Kia', 'sell-brand-8'], ['Mercedes', 'sell-brand-4']] as const;
const benefits = ['Explore deposit\noptions', 'Choose your\npayment term', 'Understand\neligibility', 'Discuss rates\nand repayments'];
const mobileBenefits = ['Down payment', 'Term', 'Eligibility', 'Interest rate'];

export default function FeatureLanding({kind}: {kind: FeatureKind}) {
  const tx = useCopy();

  const router = useRouter();
  const current = config[kind];
  const [loginOpen, setLoginOpen] = useState(false);
  const brands = kind === 'service' ? serviceBrands : sellBrands;
  function start(brand?: string) {
    if (kind === 'finance') {setLoginOpen(true); return;}
    const params = brand ? `?brand=${encodeURIComponent(brand === 'Mercedes' ? 'Mercedes-Benz' : brand)}` : '';
    router.push(`/${kind}/details${params}`);
  }
  return <div {...stylex.props(s.screen)}>
    <DiscoveryHeader active={kind} />
    <ShowroomBanner title={tx(current.title)} mobileTitle={current.mobileTitle} description={tx(current.copy)} mobileDescription={current.mobileCopy} action={current.cta} mobileAction={current.mobileCta} image={showroom.artwork.heroes[kind]} colourful onClick={() => start()} />
    <main {...stylex.props(s.content)}>
      <section aria-label={tx(kind === 'finance' ? 'Finance options' : 'Choose your brand')} {...stylex.props(s.firstSection)}>{kind !== 'finance' ? <h2 {...stylex.props(s.heading)}>{tx("Choose your brand")}</h2> : null}
        {kind === 'finance' ? <div {...stylex.props(s.benefits)}>{benefits.map((title, index) => <button type="button" key={title} onClick={() => start()} {...stylex.props(s.benefit)}><Image sizes="(max-width: 767px) 50vw, 600px" src={showroom.artwork.financeBenefits[index]} width={486} height={324} alt={tx("")} {...stylex.props(s.benefitArt)} /><h3 {...stylex.props(s.benefitTitle)}><span {...stylex.props(s.desktopCopy)}>{tx(title)}</span><span {...stylex.props(s.mobileCopy)}>{tx(mobileBenefits[index])}</span></h3></button>)}</div> : <div {...stylex.props(s.brands)}>{brands.map(([name, asset]) => <button type="button" key={name} onClick={() => start(name)} {...stylex.props(s.brand)}><img src={assetPath(`/reference-assets/${asset}.png`)} alt={tx("")} width={83} height={76} {...stylex.props(s.brandImage)} /><span {...stylex.props(s.brandName)}>{tx(name)}</span></button>)}</div>}
      </section>
      <FeatureContent kind={kind} onStart={() => start()} />
    </main>
    <LoginSheet open={loginOpen} onClose={() => setLoginOpen(false)} />
  </div>;
}
const s = stylex.create({
  screen: {minHeight: '100vh', paddingBottom: 170, backgroundColor: '#fff'},
  content: {maxWidth: $.content, marginInline: 'auto', paddingInline: {[media.mobile]: 12, default: 28}},
  firstSection: {paddingTop: 20},
  heading: {fontSize: 14, color: $.muted, fontWeight: 500, lineHeight: 1.4},
  brands: {display: 'grid', gridAutoFlow: 'column', gridTemplateRows: 'repeat(2,auto)', gridAutoColumns: {[media.mobile]: 'max(83px,6em)', default: 110}, columnGap: 14, rowGap: 18, overflowX: 'auto', marginTop: 14, marginRight: {[media.mobile]: -12, default: 0}, fontSize: 14, scrollbarWidth: 'none'},
  brand: {display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 0, color: $.text, fontSize: 14, fontWeight: 500, borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  brandImage: {width: '100%', height: 68, objectFit: 'contain'},
  brandName: {minHeight: 20, lineHeight: '20px'},
  benefits: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12},
  benefit: {position: 'relative', aspectRatio: {[media.mobile]: '1.25', default: '1.5'}, padding: 0, overflow: 'hidden', textAlign: 'left', color: $.text, borderWidth: 0, borderRadius: 16, backgroundColor: '#f9f9f9', cursor: 'pointer'},
  benefitArt: {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill'},
  benefitTitle: {position: 'relative', zIndex: 1, minHeight: '100%', padding: {[media.mobile]: '12px 12px 64px', default: '24px 24px 90px'}, fontSize: {[media.mobile]: 15, default: 25}, fontWeight: 600, lineHeight: 1.3, whiteSpace: 'normal', textWrap: 'balance', letterSpacing: 0, overflowWrap: 'anywhere'},
  desktopCopy: {display: {[media.mobile]: 'none', default: 'inline'}},
  mobileCopy: {display: {[media.mobile]: 'inline', default: 'none'}},
});
