'use client';
import {Suspense, useState} from 'react';
import {ClipboardCheck, Heart, Search} from 'lucide-react';
import {useRouter} from '@/lib/navigation';
import {useCopy} from '@/lib/locale';
import * as stylex from '@stylexjs/stylex';
import DiscoveryHeader from '@/components/DiscoveryHeader';
import PageHeader from '@/components/PageHeader';
import IconButton from '@/components/IconButton';
import ShowroomBanner, {ShowroomBannerSkeleton} from '@/components/ShowroomBanner';
import DealerMobileBanner, {DealerBannerAction} from '@/components/DealerMobileBanner';
import LandingContentFrame, {landingContent} from '@/components/LandingContentFrame';
import ServiceSearchField, {useServiceSearch, type ServiceSearchState} from '@/components/ServiceSearchField';
import FeatureContent from '@/components/FeatureContent';
import FinanceCalculatorLauncher, {type FinanceView} from '@/components/FinanceCalculatorLauncher';
import FinanceQuoteHero, {type QuoteSelection} from '@/components/FinanceQuoteHero';
import ImportCountryPicker from '@/components/ImportCountryPicker';
import LoginSheet from '@/components/DealerEnquirySheet';
import SellEnquirySheet, {type SellCarDetails, type SellIntent} from '@/components/SellEnquirySheet';
import SellCarEntry from '@/components/SellCarEntry';
import SellQuoteHero from '@/components/SellQuoteHero';
import {useHomeAlternative} from '@/lib/home-alternative';
import {media, tokens as $} from '@/app/tokens.stylex';

export type FeatureKind = 'sell' | 'finance' | 'service';
const config = {
  sell: {mobileTitle: 'Sell your car.', title: 'Sell your car.', mobileCopy: 'Sell or part-exchange.'},
  finance: {mobileTitle: 'Finance calculator', title: 'Finance calculator', mobileCopy: 'Monthly payment'},
  service: {mobileTitle: 'Car services.', title: 'Care for your car.', mobileCopy: 'Servicing and diagnostics.'},
} as const;

export default function FeatureLanding({kind}: {kind: FeatureKind}) {
  return kind === 'service'
    ? <Suspense fallback={<ShowroomBannerSkeleton title={config.service.title}/>}><ServiceLanding/></Suspense>
    : <FeatureLandingContent kind={kind}/>;
}

function ServiceLanding() {
  const serviceSearch = useServiceSearch();
  return <FeatureLandingContent kind="service" serviceSearch={serviceSearch}/>;
}

function FeatureLandingContent({kind, serviceSearch}: {kind: FeatureKind; serviceSearch?: ServiceSearchState}) {
  const router = useRouter();
  const tx = useCopy();
  const alternative = useHomeAlternative();
  const current = config[kind];
  const [loginOpen, setLoginOpen] = useState(false);
  const [financeView, setFinanceView] = useState<FinanceView>(null);
  const [quotePicker, setQuotePicker] = useState(false);
  const [quoteSelection, setQuoteSelection] = useState<QuoteSelection>({car: null, custom: false});
  const [sellIntent, setSellIntent] = useState<SellIntent | null>(null);
  const [sellCar, setSellCar] = useState<SellCarDetails>({make: '', model: '', year: '', mileage: '', notes: ''});
  function start(intent: SellIntent = 'sale') {
    if (kind === 'sell') {setSellIntent(intent); return;}
    if (kind === 'finance') {setLoginOpen(true); return;}
    router.push(`/${kind}/details`);
  }
  const desktopControl = kind === 'finance'
    ? <FinanceQuoteHero selection={quoteSelection} pickerOpen={quotePicker && financeView === 'cars'} onChooseCar={() => {setQuotePicker(true); setFinanceView('cars');}}/>
    : kind === 'sell'
      ? <SellQuoteHero car={sellCar} onCarChange={setSellCar} onStart={() => start()} expanded={sellIntent !== null}/>
      : serviceSearch ? <ServiceSearchField state={serviceSearch} onDark desktopHero/> : null;
  return <div {...stylex.props(s.screen)}>
    {alternative ? <div {...stylex.props(s.alternativeHeader)}><PageHeader compact title={tx(current.mobileTitle).replace(/\.$/, '')} backHref="/services" backLabel="Back to services" action={<IconButton href="/saved" label={tx('Saved cars')} icon={Heart}/>}/></div> : null}
    <div {...stylex.props(s.discovery, alternative && s.alternativeDiscovery)}><DiscoveryHeader active={kind} hideMobileIdentity /></div>
    <DealerMobileBanner mobileCard={alternative} controlOnly={alternative} title={current.mobileTitle} description={current.mobileCopy}>
      {kind === 'service' && serviceSearch ? <ServiceSearchField state={serviceSearch} onDark plainOnMobile={alternative}/> : kind === 'finance' ? <DealerBannerAction label="Choose your car" icon={<Search size={20} aria-hidden="true"/>} searchEntry plainOnMobile={alternative} expanded={financeView !== null} onClick={() => setFinanceView('cars')}/> : alternative ? <SellCarEntry expanded={sellIntent !== null} onClick={() => start()}/> : <DealerBannerAction label="Value my car" icon={<ClipboardCheck size={20} aria-hidden="true"/>} expanded={sellIntent !== null} onClick={() => start()}/>}
    </DealerMobileBanner>
    <ShowroomBanner title={current.title} control={desktopControl}/>
    <LandingContentFrame><main data-landing-content {...stylex.props(landingContent.panel, s.content, alternative && s.alternativeContent)}>
      {kind === 'finance' ? <><ImportCountryPicker/><FinanceCalculatorLauncher view={financeView} onViewChange={view => {setFinanceView(view); if (!view) setQuotePicker(false);}} backNavigation={alternative} onChooseCar={quotePicker ? car => setQuoteSelection({car, custom: !car}) : undefined}/></> : null}
      <FeatureContent kind={kind} onStart={start} serviceSearch={serviceSearch}/>
    </main></LandingContentFrame>
    <LoginSheet open={loginOpen} onClose={() => setLoginOpen(false)} />
    {kind === 'sell' ? <SellEnquirySheet car={sellCar} onCarChange={setSellCar} intent={sellIntent} onIntentChange={setSellIntent} onClose={() => setSellIntent(null)}/> : null}
  </div>;
}
const s = stylex.create({
  screen: {minHeight: '100vh', paddingBottom: 'calc(84px + env(safe-area-inset-bottom))', backgroundColor: '#fff'},
  alternativeHeader: {display: {[media.mobile]: 'contents', default: 'none'}},
  discovery: {display: 'contents'},
  alternativeDiscovery: {display: {[media.mobile]: 'none', default: 'contents'}},
  alternativeContent: {paddingTop: {[media.mobile]: 0, default: 8}, borderTopLeftRadius: {[media.mobile]: 0, default: 32}, borderTopRightRadius: {[media.mobile]: 0, default: 32}},
  content: {maxWidth: $.content, marginInline: 'auto', paddingInline: {[media.mobile]: 12, default: 28}},
});
