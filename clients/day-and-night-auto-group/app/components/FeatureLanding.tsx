'use client';
import {Suspense, useState} from 'react';
import {ClipboardCheck, Heart, Search} from 'lucide-react';
import {useRouter} from '@/lib/navigation';
import {useCopy} from '@/lib/locale';
import * as stylex from '@stylexjs/stylex';
import PageHeader from '@/components/PageHeader';
import IconButton from '@/components/IconButton';
import ShowroomBanner, {ShowroomBannerSkeleton} from '@/components/ShowroomBanner';
import DealerMobileBanner, {DealerBannerAction} from '@/components/DealerMobileBanner';
import LandingContentFrame, {landingContent} from '@/components/LandingContentFrame';
import ServiceSearchField, {useServiceSearch, type ServiceSearchState} from '@/components/ServiceSearchField';
import FeatureContent from '@/components/FeatureContent';
import FinanceCalculatorLauncher, {type FinanceView} from '@/components/FinanceCalculatorLauncher';
import FinanceQuoteHero from '@/components/FinanceQuoteHero';
import {ServiceHeroControls} from '@/components/ServiceCatalogue';
import DealerEnquirySheet from '@/components/DealerEnquirySheet';
import SellEnquirySheet, {type SellCarDetails, type SellIntent} from '@/components/SellEnquirySheet';
import SellCarEntry from '@/components/SellCarEntry';
import SellQuoteHero from '@/components/SellQuoteHero';
import {useHomeAlternative} from '@/lib/home-alternative';
import {media, tokens as $} from '@/app/tokens.stylex';

export type FeatureKind = 'sell' | 'finance' | 'service';
const config = {
  sell: {mobileTitle: 'Sell your car.', title: 'Sell your car.', mobileCopy: 'Sell or part-exchange.'},
  finance: {mobileTitle: 'Leasing', title: 'Car finance.', mobileCopy: 'Explore your monthly payment.'},
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
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [financeView, setFinanceView] = useState<FinanceView>(null);
  const [sellIntent, setSellIntent] = useState<SellIntent | null>(null);
  const [sellCar, setSellCar] = useState<SellCarDetails>({make: '', model: '', year: '', mileage: '', notes: ''});
  function start(intent: SellIntent = 'sale') {
    if (kind === 'sell') {setSellIntent(intent); return;}
    if (kind === 'finance') {setEnquiryOpen(true); return;}
    router.push(`/${kind}/details`);
  }
  const desktopControl = kind === 'finance'
    ? <FinanceQuoteHero pickerOpen={financeView !== null} onChooseCar={() => setFinanceView('cars')}/>
    : kind === 'sell'
      ? <SellQuoteHero car={sellCar} onCarChange={setSellCar} onStart={() => start()} expanded={sellIntent !== null}/>
      : serviceSearch ? <><ServiceSearchField state={serviceSearch} onDark desktopHero/><ServiceHeroControls searchState={serviceSearch}/></> : null;
  return <div {...stylex.props(s.screen, !alternative && s.serviceScreen)}>
    <div {...stylex.props(s.mobileHeader)}><PageHeader compact onRail={!alternative} title={tx(current.mobileTitle).replace(/\.$/, '')} backHref="/services" backLabel="Back to services" action={<IconButton href="/saved" label={tx('Saved cars')} icon={Heart} tone={!alternative ? 'rail' : 'neutral'}/>}/></div>
    <div {...stylex.props(kind !== 'service' && !alternative && s.hideMobile)}><DealerMobileBanner mobileCard={alternative} controlOnly onRail={!alternative} title={current.mobileTitle} description={current.mobileCopy}>
      {kind === 'service' && serviceSearch ? <ServiceSearchField state={serviceSearch} onDark plainOnMobile/> : kind === 'finance' ? <DealerBannerAction label="Choose your car" icon={<Search size={20} aria-hidden="true"/>} searchEntry plainOnMobile={alternative} expanded={financeView !== null} onClick={() => setFinanceView('cars')}/> : alternative ? <SellCarEntry expanded={sellIntent !== null} onClick={() => start()}/> : <DealerBannerAction label="Value my car" icon={<ClipboardCheck size={20} aria-hidden="true"/>} expanded={sellIntent !== null} onClick={() => start()}/>}
    </DealerMobileBanner></div>
    <ShowroomBanner title={current.title} control={desktopControl}/>
    <LandingContentFrame><main data-landing-content {...stylex.props(landingContent.panel, s.content, alternative && s.alternativeContent, !alternative && s.serviceContent)}>
      {kind === 'finance' ? <FinanceCalculatorLauncher view={financeView} onViewChange={setFinanceView} backNavigation/> : null}
      <FeatureContent kind={kind} onStart={start} onCalculate={() => setFinanceView('calculator')} serviceSearch={serviceSearch} compactMobile={!alternative}/>
    </main></LandingContentFrame>
    <DealerEnquirySheet open={enquiryOpen} onClose={() => setEnquiryOpen(false)} vehicleTitle={kind === 'finance' ? tx('Leasing').toLocaleLowerCase() : undefined}/>
    {kind === 'sell' ? <SellEnquirySheet car={sellCar} onCarChange={setSellCar} intent={sellIntent} onIntentChange={setSellIntent} onClose={() => setSellIntent(null)}/> : null}
  </div>;
}
const s = stylex.create({
  screen: {minHeight: '100vh', paddingBottom: 'calc(84px + env(safe-area-inset-bottom))', backgroundColor: '#fff'},
  mobileHeader: {display: {[media.mobile]: 'contents', default: 'none'}},
  hideMobile: {display: {[media.mobile]: 'none', default: 'contents'}},
  serviceScreen: {backgroundColor: $.surface},
  serviceContent: {paddingTop: {[media.mobile]: 0, default: 8}, borderTopLeftRadius: {[media.mobile]: 0, [media.desktop]: 0, default: 32}, borderTopRightRadius: {[media.mobile]: 0, [media.desktop]: 0, default: 32}, backgroundColor: $.surface},
  alternativeContent: {paddingTop: {[media.mobile]: 0, default: 8}, borderTopLeftRadius: {[media.mobile]: 0, default: 32}, borderTopRightRadius: {[media.mobile]: 0, default: 32}},
  // Keep the first row's margin inside every mobile landing panel.
  content: {maxWidth: $.content, marginInline: 'auto', paddingInline: {[media.mobile]: 12, default: 28}, paddingTop: {[media.mobile]: 0, default: 8}, display: {[media.mobile]: 'flow-root', default: 'block'}},
});
