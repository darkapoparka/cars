'use client';
import {useState} from 'react';
import {useRouter} from '@/lib/navigation';
import * as stylex from '@stylexjs/stylex';
import DiscoveryHeader from '@/components/DiscoveryHeader';
import ShowroomBanner from '@/components/ShowroomBanner';
import FeatureContent from '@/components/FeatureContent';
import FinanceCalculatorLauncher, {type FinanceView} from '@/components/FinanceCalculatorLauncher';
import ImportCountryPicker from '@/components/ImportCountryPicker';
import LoginSheet from '@/components/DealerEnquirySheet';
import SellEnquirySheet, {type SellIntent} from '@/components/SellEnquirySheet';
import {showroom} from '@/lib/showroom';
import {useCopy} from '@/lib/locale';
import {media, tokens as $} from '@/app/tokens.stylex';

export type FeatureKind = 'sell' | 'finance' | 'service';
const config = {
  sell: {mobileTitle: 'Sell your car.', title: 'Sell your car.', copy: 'Sell or part-exchange.', mobileCopy: 'Sell or part-exchange.', cta: 'Request a valuation', mobileCta: 'Request a valuation'},
  finance: {mobileTitle: 'Finance calculator', title: 'Finance calculator', copy: 'Explore your monthly payment.', mobileCopy: 'Monthly payment', cta: 'Calculate', mobileCta: 'Calculate'},
  service: {mobileTitle: 'Car services.', title: 'Care for your car.', copy: 'Find the right service for your car.', mobileCopy: 'Servicing and diagnostics.', cta: 'Book a service', mobileCta: 'Choose a service'},
} as const;

export default function FeatureLanding({kind}: {kind: FeatureKind}) {
  const tx = useCopy();
  const router = useRouter();
  const current = config[kind];
  const [loginOpen, setLoginOpen] = useState(false);
  const [financeView, setFinanceView] = useState<FinanceView>(null);
  const [sellIntent, setSellIntent] = useState<SellIntent | null>(null);
  const banner = {title: current.title, mobileTitle: current.mobileTitle, description: current.copy, mobileDescription: current.mobileCopy, image: kind === 'finance' ? showroom.artwork.campaigns.finance : showroom.artwork.heroes[kind], colourful: true, containArtwork: kind === 'finance'};
  function start(intent: SellIntent = 'sale') {
    if (kind === 'sell') {setSellIntent(intent); return;}
    if (kind === 'finance') {setLoginOpen(true); return;}
    router.push(`/${kind}/details`);
  }
  return <div {...stylex.props(s.screen)}>
    <DiscoveryHeader active={kind} hideMobileIdentity />
    {kind !== 'sell' ? <ShowroomBanner {...banner} compactCopy={kind === 'service'} action={current.cta} mobileAction={current.mobileCta} opensDialog={kind === 'finance'} onClick={() => kind === 'finance' ? setFinanceView('calculator') : start()}/> : null}
    <main {...stylex.props(s.content)}>
      {kind === 'sell' ? <h1 {...stylex.props(s.srOnly)}>{tx(current.title)}</h1> : null}
      {kind === 'finance' ? <><ImportCountryPicker/><FinanceCalculatorLauncher view={financeView} onViewChange={setFinanceView}/></> : null}
      <FeatureContent kind={kind} onStart={start} />
    </main>
    <LoginSheet open={loginOpen} onClose={() => setLoginOpen(false)} />
    {kind === 'sell' ? <SellEnquirySheet intent={sellIntent} onIntentChange={setSellIntent} onClose={() => setSellIntent(null)}/> : null}
  </div>;
}
const s = stylex.create({
  screen: {minHeight: '100vh', paddingBottom: 'calc(84px + env(safe-area-inset-bottom))', backgroundColor: '#fff'},
  content: {maxWidth: $.content, marginInline: 'auto', paddingInline: {[media.mobile]: 12, default: 28}},
  srOnly: {position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0},
});
