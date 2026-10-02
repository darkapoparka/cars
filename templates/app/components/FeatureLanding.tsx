'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';

import {useState} from 'react';
import {useRouter} from '@/lib/navigation';
import * as stylex from '@stylexjs/stylex';
import DiscoveryHeader from '@/components/DiscoveryHeader';
import ShowroomBanner from '@/components/ShowroomBanner';
import FeatureContent from '@/components/FeatureContent';
import FinanceCalculatorLauncher, {type FinanceView} from '@/components/FinanceCalculatorLauncher';
import LoginSheet from '@/components/DealerEnquirySheet';
import {showroom} from '@/lib/showroom';
import {media, tokens as $} from '@/app/tokens.stylex';
import {typography as t} from '@/app/typography.stylex';

export type FeatureKind = 'sell' | 'finance' | 'service';
const config = {
  sell: {mobileTitle: 'Sell to us.', title: 'Sell your car.', copy: 'A simple way to sell or part-exchange.', mobileCopy: 'Sell or part-exchange.', cta: 'Get a valuation', mobileCta: 'Valuation'},
  finance: {mobileTitle: 'Finance calculator', title: 'Finance calculator', copy: 'Explore your monthly payment.', mobileCopy: 'Monthly payment', cta: 'Calculate', mobileCta: 'Calculate'},
  service: {mobileTitle: 'Car services.', title: 'Care for your car.', copy: 'Find the right service for your car.', mobileCopy: 'Servicing and diagnostics.', cta: 'Book a service', mobileCta: 'Choose a service'},
} as const;
const sellBrands = [['Toyota', 'sell-brand-1'], ['Honda', 'sell-brand-2'], ['Nissan', 'sell-brand-3'], ['Mercedes', 'sell-brand-4'], ['BMW', 'sell-brand-5'], ['Audi', 'sell-brand-6'], ['Ford', 'sell-brand-7'], ['Kia', 'sell-brand-8'], ['Hyundai', 'brand-hyundai']] as const;

export default function FeatureLanding({kind}: {kind: FeatureKind}) {
  const tx = useCopy();

  const router = useRouter();
  const current = config[kind];
  const [loginOpen, setLoginOpen] = useState(false);
  const [financeView, setFinanceView] = useState<FinanceView>(null);
  function start(brand?: string) {
    if (kind === 'finance') {setLoginOpen(true); return;}
    const params = brand ? `?brand=${encodeURIComponent(brand === 'Mercedes' ? 'Mercedes-Benz' : brand)}` : '';
    router.push(`/${kind}/details${params}`);
  }
  return <div {...stylex.props(s.screen, kind !== 'sell' && s.compactScreen)}>
    <DiscoveryHeader active={kind} hideMobileIdentity />
    <ShowroomBanner title={tx(current.title)} mobileTitle={current.mobileTitle} description={tx(current.copy)} mobileDescription={current.mobileCopy} action={current.cta} mobileAction={current.mobileCta} image={kind === 'finance' ? showroom.artwork.campaigns.finance : showroom.artwork.heroes[kind]} colourful containArtwork={kind === 'finance'} opensDialog={kind === 'finance'} onClick={() => kind === 'finance' ? setFinanceView('calculator') : start()} />
    <main {...stylex.props(s.content)}>
      {kind === 'finance' ? <FinanceCalculatorLauncher view={financeView} onViewChange={setFinanceView}/> : null}
      {kind === 'sell' ? <section aria-label={tx('Choose your brand')} {...stylex.props(s.firstSection)}><h2 {...stylex.props(s.heading, t.control)}>{tx("Choose your brand")}</h2>
        <div {...stylex.props(s.brands, t.caption)}>{sellBrands.map(([name, asset]) => <button type="button" key={name} onClick={() => start(name)} {...stylex.props(s.brand, t.caption)}><img src={assetPath(`/reference-assets/${asset}.png`)} alt={tx("")} width={83} height={76} {...stylex.props(s.brandImage)} /><span {...stylex.props(s.brandName)}>{tx(name)}</span></button>)}</div>
      </section> : null}
      <FeatureContent kind={kind} onStart={() => start()} />
    </main>
    <LoginSheet open={loginOpen} onClose={() => setLoginOpen(false)} />
  </div>;
}
const s = stylex.create({
  screen: {minHeight: '100vh', paddingBottom: 170, backgroundColor: '#fff'},
  compactScreen: {paddingBottom: 'calc(84px + env(safe-area-inset-bottom))'},
  content: {maxWidth: $.content, marginInline: 'auto', paddingInline: {[media.mobile]: 12, default: 28}},
  firstSection: {paddingTop: 20},
  heading: {color: $.text},
  brands: {display: 'grid', gridAutoFlow: 'column', gridTemplateRows: 'repeat(2,auto)', gridAutoColumns: {[media.mobile]: 'max(83px,6em)', default: 110}, columnGap: 14, rowGap: 18, overflowX: 'auto', marginTop: 14, marginRight: {[media.mobile]: -12, default: 0}, scrollbarWidth: 'none'},
  brand: {display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 0, color: $.text, borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  brandImage: {width: '100%', height: 68, objectFit: 'contain'},
  brandName: {minHeight: 20},
});
