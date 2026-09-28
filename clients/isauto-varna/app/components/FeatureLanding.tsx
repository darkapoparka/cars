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
  sell: {title: 'Sell your car.', copy: 'A simple way to sell or part-exchange.', cta: 'Sell your car'},
  finance: {title: 'Finance your next car.', copy: 'Payment options for your next car.', cta: 'Get assistance'},
  service: {title: 'Care for your car.', copy: 'Find the right service for your car.', cta: 'Book a service'},
} as const;
const sellBrands = [['Toyota', 'sell-brand-1'], ['Honda', 'sell-brand-2'], ['Nissan', 'sell-brand-3'], ['Mercedes', 'sell-brand-4'], ['BMW', 'sell-brand-5'], ['Audi', 'sell-brand-6'], ['Ford', 'sell-brand-7'], ['Kia', 'sell-brand-8'], ['Hyundai', 'brand-hyundai']] as const;
const serviceBrands = [['Toyota', 'sell-brand-1'], ['Honda', 'sell-brand-2'], ['Nissan', 'sell-brand-3'], ['Hyundai', 'brand-hyundai'], ['BMW', 'sell-brand-5'], ['Chevrolet', 'brand-chevrolet'], ['Ford', 'sell-brand-7'], ['Kia', 'sell-brand-8'], ['Mercedes', 'sell-brand-4']] as const;
const benefits = ['Explore deposit\noptions', 'Choose your\npayment term', 'Understand\neligibility', 'Discuss rates\nand repayments'];

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
    <ShowroomBanner title={tx(current.title)} description={tx(current.copy)} action={current.cta} image={showroom.artwork.heroes[kind]} colourful onClick={() => start()} />
    <main {...stylex.props(s.content)}>
      <section aria-label={tx(kind === 'finance' ? 'Finance options' : 'Choose your brand')} {...stylex.props(s.firstSection)}>{kind !== 'finance' ? <h2 {...stylex.props(s.heading)}>{tx("Choose your brand")}</h2> : null}
        {kind === 'finance' ? <div {...stylex.props(s.benefits)}>{benefits.map((title, index) => <button type="button" key={title} onClick={() => start()} {...stylex.props(s.benefit)}><Image sizes="(max-width: 767px) 50vw, 600px" src={showroom.artwork.financeBenefits[index]} width={486} height={324} alt={tx("")} {...stylex.props(s.benefitArt)} /><h3 {...stylex.props(s.benefitTitle)}>{tx(title)}</h3></button>)}</div> : <div {...stylex.props(s.brands)}>{brands.map(([name, asset]) => <button type="button" key={name} onClick={() => start(name)} {...stylex.props(s.brand)}><img src={assetPath(`/reference-assets/${asset}.png`)} alt={tx("")} width={83} height={76} {...stylex.props(s.brandImage)} /><span {...stylex.props(s.brandName)}>{tx(name)}</span></button>)}</div>}
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
  brands: {display: 'grid', gridAutoFlow: 'column', gridTemplateRows: 'repeat(2,auto)', gridAutoColumns: {[media.mobile]: 83, default: 110}, columnGap: 14, rowGap: 18, overflowX: 'auto', marginTop: 14, marginRight: {[media.mobile]: -12, default: 0}, scrollbarWidth: 'none'},
  brand: {display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 0, color: $.text, fontSize: 14, fontWeight: 500, borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  brandImage: {width: '100%', height: 68, objectFit: 'contain'},
  brandName: {minHeight: 20, lineHeight: '20px'},
  benefits: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12},
  benefit: {position: 'relative', aspectRatio: '1.5', padding: 0, overflow: 'hidden', textAlign: 'left', color: $.text, borderWidth: 0, borderRadius: 20, backgroundColor: '#f9f9f9', cursor: 'pointer'},
  benefitArt: {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill'},
  benefitTitle: {position: 'absolute', top: 0, left: 0, zIndex: 1, padding: {[media.mobile]: 14, default: 24}, fontSize: {[media.mobile]: 16, default: 25}, fontWeight: 600, lineHeight: 1.18, whiteSpace: 'pre-line', letterSpacing: '-.015em'},
});
