'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import {useEffect, useRef, useState} from 'react';
import {useRouter} from '@/lib/navigation';
import * as stylex from '@stylexjs/stylex';
import {showroom} from '@/lib/showroom';
import PageHeader from '@/components/PageHeader';
import {Check, ChevronRight, CircleX, Info, Search} from 'lucide-react';
import LoginSheet from '@/components/DealerEnquirySheet';
import {vehicles} from '@/lib/data';
import { tokens as $} from '@/app/tokens.stylex';

type Stage = 'brand' | 'model' | 'year' | 'body' | 'variant' | 'gcc' | 'mileage' | 'timing' | 'exchange';
type Details = Partial<Record<Stage, string>>;
const stages: Stage[] = ['brand', 'model', 'year', 'body', 'variant', 'gcc', 'mileage', 'timing', 'exchange'];
const stepLabels = ['Brand', 'Model', 'Year', 'Variant', 'GCC', 'Kms driven', 'Other information', 'Exchange'];
const stepIndex = (stage: Stage) => stage === 'body' ? 3 : Math.max(0, stages.indexOf(stage) - (stages.indexOf(stage) > 3 ? 1 : 0));
const headings: Record<Stage, string> = {brand: 'Select brand', model: 'Select model', year: 'Select manufacturing year', body: 'Select Body Type', variant: 'Select Variant', gcc: 'Select if your car has GCC specifications', mileage: 'Select kilometres driven', timing: 'Select when you are planning to sell', exchange: 'Are you planning to buy a car as well'};
const brands = ['Toyota', 'Nissan', 'BMW', 'Ford', 'Hyundai', 'Honda', 'Mercedes-Benz', 'Audi', 'Kia', 'Renault', 'Abarth', 'Acura', 'Alfa Romeo', 'Aston Martin', 'Bentley', 'Chevrolet', 'Dodge', 'GMC', 'Haval', 'Infiniti', 'Jaguar', 'Jeep', 'JAC', 'Land Rover', 'Lexus', 'Mazda', 'MG', 'Mini', 'Mitsubishi', 'Peugeot', 'Porsche', 'Suzuki', 'Tesla', 'Volkswagen', 'Volvo'];
const toyotaModels = ['4Runner', '86', 'Aurion', 'Avalon', 'Avanza', 'C-HR', 'C-HR Hybrid', 'Camry', 'Camry Hybrid', 'Corolla', 'Corolla Cross', 'Corolla Cross Hybrid', 'FJ Cruiser', 'Fortuner', 'Hiace', 'Highlander', 'Hilux', 'Innova', 'Land Cruiser', 'Land Cruiser Prado', 'Prado', 'RAV4', 'Rush', 'Sequoia', 'Sienna', 'Supra', 'Tundra', 'Veloz', 'Yaris'];
const fortunerVariants = [['Std', '2024 - 2026'], ['60th Anniversary', '2014 - 2025'], ['SR5 Plus', '2014 - 2026'], ['TRD', '2014 - 2026'], ['TRD Sportivo', '2014 - 2026'], ['VXR', '2014 - 2026'], ['Xtreme', '2014 - 2026'], ['EXR', '2024 - 2024'], ['GXR', '2024 - 2024'], ['SR5', '2024 - 2025']];
const mileageOptions = ['Less than 20,000 km', '20,000 km - 40,000 km', '40,000 km - 60,000 km', '60,000 km - 90,000 km', '90,000 km - 120,000 km', '120,000 km - 150,000 km', '150,000 km - 180,000 km', '180,000 km - 220,000 km', '220,000 km - 250,000 km', '250,000 km - 300,000 km', '300,000+ kms'];
const brandAssets: Record<string, string> = {Toyota:'continuation/sell-logo-0',Nissan:'continuation/sell-logo-1',BMW:'continuation/sell-logo-2',Ford:'continuation/sell-logo-3',Hyundai:'continuation/sell-logo-4',Honda:'continuation/sell-logo-5','Mercedes-Benz':'continuation/sell-logo-6',Audi:'continuation/sell-logo-7',Kia:'continuation/sell-logo-8',Renault:'continuation/sell-logo-9',Abarth:'continuation/sell-logo-10',Acura:'continuation/sell-logo-11',Mitsubishi:'search-brand-2',MG:'search-brand-3'};

function fromQuery(): {stage: Stage; details: Details} {
  const query = new URLSearchParams(location.search);
  const details: Details = {};
  for (const key of stages) {const value = query.get(key); if (value) details[key] = value;}
  const requested = query.get('step') as Stage | null;
  return {stage: requested && stages.includes(requested) ? requested : details.brand ? 'model' : 'brand', details};
}

export default function SellJourney({initialBrand = ''}: {initialBrand?: string}) {
  const tx = useCopy();

  const router = useRouter();
  const [stage, setStage] = useState<Stage>(initialBrand ? 'model' : 'brand');
  const [details, setDetails] = useState<Details>(initialBrand ? {brand: initialBrand === 'Mercedes' ? 'Mercedes-Benz' : initialBrand} : {});
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [login, setLogin] = useState(false);
  const stepsRail = useRef<HTMLElement>(null);
  const tokensRail = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const restore = () => {const value = fromQuery(); setStage(value.stage); setDetails(value.details); setSearchOpen(false); setQuery(''); setLogin(false);};
    const frame = requestAnimationFrame(restore);
    window.addEventListener('popstate', restore);
    return () => {cancelAnimationFrame(frame); window.removeEventListener('popstate', restore);};
  }, []);
  useEffect(() => {
    const active = stepsRail.current?.querySelector<HTMLElement>('[aria-current="step"]');
    if (active && stepsRail.current) stepsRail.current.scrollTo({left: Math.max(0, active.offsetLeft - 170), behavior: 'smooth'});
    tokensRail.current?.scrollTo({left: tokensRail.current.scrollWidth});
    window.scrollTo({top: 0, behavior: 'instant'});
  }, [stage]);
  useEffect(() => {if (searchOpen) searchInput.current?.focus({preventScroll: true});}, [searchOpen]);
  useEffect(() => {
    function keydown(event: KeyboardEvent) {if (event.key === 'Escape' && !login) {event.preventDefault(); if (searchOpen) {setSearchOpen(false); setQuery('');} else router.push('/sell');}}
    document.addEventListener('keydown', keydown); return () => document.removeEventListener('keydown', keydown);
  }, [searchOpen, login, router]);
  function move(next: Stage, nextDetails = details) {
    const params = new URLSearchParams();
    for (const key of stages) if (nextDetails[key]) params.set(key, nextDetails[key]!);
    params.set('step', next);
    window.history.pushState({...window.history.state, cars24Wizard: true}, '', `/sell/details?${params}`);
    setDetails(nextDetails); setStage(next); setSearchOpen(false); setQuery('');
  }
  function select(value: string) {
    const current = stages.indexOf(stage);
    const nextDetails = Object.fromEntries(Object.entries(details).filter(([key]) => stages.indexOf(key as Stage) < current)) as Details;
    nextDetails[stage] = value;
    if (stage === 'exchange') {setDetails(nextDetails); setSearchOpen(false); setLogin(true); return;}
    move(stages[current + 1], nextDetails);
  }
  function back() {
    if (searchOpen) {setSearchOpen(false); setQuery(''); return;}
    if (stage === 'brand') {router.push('/sell'); return;}
    if (history.state?.cars24Wizard) history.back(); else move(stages[stages.indexOf(stage) - 1]);
  }
  const modelOptions = details.brand === 'Toyota' ? toyotaModels : [...new Set(vehicles.filter(vehicle => vehicle.make === details.brand).map(vehicle => vehicle.model))].sort();
  const variantOptions = details.model?.toLowerCase() === 'fortuner' ? fortunerVariants : [...new Set(vehicles.filter(vehicle => vehicle.make === details.brand && vehicle.model.toLowerCase() === details.model?.toLowerCase()).map(vehicle => vehicle.trim.split(' • ')[0]))].map(value => [value, '']);
  const options: string[] = stage === 'brand' ? brands : stage === 'model' ? modelOptions : stage === 'year' ? Array.from({length: 27}, (_, index) => String(2026 - index)) : stage === 'body' ? ['SUV', 'Sedan'] : stage === 'variant' ? variantOptions.map(value => value[0]) : stage === 'gcc' ? ['Yes', 'No'] : stage === 'mileage' ? mileageOptions : stage === 'timing' ? ['Within this week', 'By next week', 'After 2 weeks', 'Just checking price'] : ['Yes, I am planning to buy a car', 'No, not right now'];
  const filtered = options.filter(value => value.toLowerCase().includes(query.trim().toLowerCase()));
  const activeStep = stepIndex(stage);
  return <main id="journey-title" aria-label={tx("Your car details")} {...stylex.props(s.page)}><PageHeader title={tx("Your car details")} onBack={back} backLabel={tx("Back from car details")}/>
    {searchOpen ? <>
      <header {...stylex.props(s.searchHeader)}><Search size={20}/><input ref={searchInput} aria-label={tx(`Search ${stage}`)} value={query} onChange={event => setQuery(event.target.value)} placeholder={tx("Search")} {...stylex.props(s.searchInput)} /><button type="button" aria-label={tx("Clear search")} onClick={() => setQuery('')} {...stylex.props(s.icon)}><CircleX size={21} /></button></header>
      <div {...stylex.props(s.searchResults)}>{filtered.map(value => <button type="button" key={value} onClick={() => select(value)} {...stylex.props(s.option)}><Search size={20} {...stylex.props(s.muted)} /><span>{tx(value)}</span><ChevronRight size={18} {...stylex.props(s.chevron)} /></button>)}{!filtered.length ? <p {...stylex.props(s.note)}>{tx("No matching ")}{tx(stage === 'brand' ? 'brands' : 'models')} {tx(" in this reference catalog.")}</p> : null}</div>
    </> : <>
      <nav ref={stepsRail} aria-label={tx("Selling steps")} {...stylex.props(s.steps)}>{stepLabels.map((label, index) => <button type="button" key={label} disabled={index > activeStep} aria-current={index === activeStep ? 'step' : undefined} onClick={() => move(stages[index > 3 ? index + 1 : index])} {...stylex.props(s.step, index < activeStep && s.completeStep, index === activeStep && s.activeStep)}><span {...stylex.props(s.stepNumber, index < activeStep && s.completeNumber, index === activeStep && s.activeNumber)}>{index < activeStep ? <Check size={10} /> : index + 1}</span>{tx(label)}</button>)}</nav>
      {Object.keys(details).length ? <div ref={tokensRail} {...stylex.props(s.tokens)}>{stages.filter(key => details[key] && stages.indexOf(key) < stages.indexOf(stage)).map(key => <button type="button" key={key} onClick={() => move(key)} {...stylex.props(s.token)}>{tx(details[key])}</button>)}</div> : null}
      <section {...stylex.props(s.section)}>
        <div {...stylex.props(s.headingRow)}><h2 {...stylex.props(s.heading)}>{tx(headings[stage])}</h2>{stage === 'variant' ? <button type="button" onClick={() => select("I don't remember")} {...stylex.props(s.forgot)}>{tx("I don&apos;t remember")}</button> : null}</div>
        {stage === 'brand' || stage === 'model' ? <button type="button" aria-label={tx(`Search ${stage}`)} onClick={() => setSearchOpen(true)} {...stylex.props(s.searchButton)}><Search size={21} /><span>{tx("Search")}</span></button> : null}
        <div {...stylex.props(s.options)}>{options.map(value => <button type="button" key={value} onClick={() => select(value)} {...stylex.props(s.option)}>
          {stage === 'brand' && brandAssets[value] ? <img src={assetPath(`/reference-assets/${brandAssets[value]}.png`)} alt={tx("")} width={34} height={32} {...stylex.props(s.brandImage)} /> : stage === 'brand' ? <span {...stylex.props(s.brandFallback)}>{tx(value.slice(0, 2))}</span> : stage === 'body' ? <img src={assetPath(`/reference-assets/body-${value.toLowerCase()}.png`)} width={35} height={24} alt={tx("")} /> : null}
          <span {...stylex.props(s.optionCopy)}>{tx(value)}{stage === 'variant' && variantOptions.find(item => item[0] === value)?.[1] ? <small {...stylex.props(s.variantYears)}>{tx(variantOptions.find(item => item[0] === value)?.[1])}</small> : null}</span><ChevronRight size={18} strokeWidth={1.1} {...stylex.props(s.chevron)} />
        </button>)}</div>
        {stage === 'gcc' ? <><img src={assetPath("/reference-assets/continuation/gcc-guide.png")} alt={tx("GCC specifications label on the vehicle door frame")} width={1209} height={603} {...stylex.props(s.guide)} /><p {...stylex.props(s.explanation)}><Info size={15} /><span>{tx("If the information on the vin plate of your car is written in Arabic, select Yes, else No.")}</span></p></> : null}
        {stage === 'exchange' ? <img src={assetPath(showroom.artwork.highlights.exchange)} alt={tx("Explore part-exchange with the showroom")} width={1209} height={603} {...stylex.props(s.guide)} /> : null}
        {!options.length ? <div {...stylex.props(s.unavailable)}><p>{tx("This ")}{tx(stage)} {tx(" is not included in the captured reference catalog.")}</p><button type="button" onClick={() => select('Other')} {...stylex.props(s.forgot)}>{tx("Continue with another ")}{tx(stage)}</button></div> : null}
      </section>
    </>}
    <LoginSheet open={login} onClose={() => setLogin(false)} />
  </main>;
}
const s = stylex.create({
  page: {minHeight: '100dvh', maxWidth: 760, marginInline: 'auto', paddingTop: 0, paddingBottom: 32, color: '#202024', backgroundColor: '#fff'},
  icon: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 31, height: 42, padding: 0, color: '#202024', borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  steps: {display: 'flex', overflowX: 'auto', height: 44, whiteSpace: 'nowrap', scrollbarWidth: 'none', boxShadow: '0 2px 4px #e2e2e2'},
  step: {display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0, paddingInline: 12, color: '#9f9f9f', fontSize: 14, fontWeight: 500, borderWidth: 0, borderBottomColor: 'transparent', borderBottomStyle: 'solid', borderBottomWidth: 2, backgroundColor: '#fff', cursor: 'pointer'},
  activeStep: {color: $.violet, borderBottomColor: $.violet},
  completeStep: {color: '#202024'},
  stepNumber: {display: 'grid', placeItems: 'center', width: 15, height: 15, color: '#fff', fontSize: 10, borderRadius: '50%', backgroundColor: '#9f9f9f'},
  activeNumber: {backgroundColor: $.violet},
  completeNumber: {backgroundColor: '#202024'},
  tokens: {display: 'flex', gap: 8, overflowX: 'auto', minHeight: 36, padding: '9px 12px 3px', scrollbarWidth: 'none', whiteSpace: 'nowrap'},
  token: {flexShrink: 0, minHeight: 24, padding: '2px 6px', color: $.violet, fontSize: 12, fontWeight: 400, lineHeight: '18px', borderWidth: 0, borderRadius: 5, backgroundColor: $.violetSoft, cursor: 'pointer'},
  section: {padding: '20px 12px 0'},
  headingRow: {display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12},
  heading: {fontSize: 18, fontWeight: 500, lineHeight: '25px'},
  forgot: {flexShrink: 0, padding: 0, color: $.violet, fontSize: 14, fontWeight: 500, borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  searchButton: {display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 48, marginTop: 12, paddingInline: 14, color: '#727272', fontSize: 16, borderColor: '#aaaaaa', borderStyle: 'solid', borderWidth: 1, borderRadius: 13, backgroundColor: '#fff', cursor: 'text'},
  options: {marginTop: 12},
  option: {display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 56, padding: 0, color: '#202024', fontSize: 15, fontWeight: 400, textAlign: 'left', borderWidth: 0, borderBottomColor: '#eaeaea', borderBottomStyle: 'solid', borderBottomWidth: 1, backgroundColor: '#fff', cursor: 'pointer'},
  optionCopy: {flexGrow: 1, minWidth: 0},
  chevron: {marginLeft: 'auto', marginRight: 4, color: '#6e6e6e'},
  brandImage: {width: 34, height: 32, objectFit: 'contain'},
  brandFallback: {display: 'grid', placeItems: 'center', width: 34, height: 32, color: '#727272', fontSize: 10},
  variantYears: {display: 'block', marginTop: 3, color: '#6b6b6b', fontSize: 12, lineHeight: '17px'},
  guide: {display: 'block', width: '100%', height: 'auto', marginTop: 34, overflow: 'hidden', borderRadius: 19},
  explanation: {display: 'flex', alignItems: 'center', gap: 7, margin: '25px 4px 0', padding: '8px 9px', color: '#202024', fontSize: 13, lineHeight: '18px', borderRadius: 7, backgroundColor: '#f7f7f7'},
  searchHeader: {display: 'flex', alignItems: 'center', gap: 8, minHeight: 48, margin: '13px 12px 0', paddingInline: 9, borderColor: '#acacac', borderStyle: 'solid', borderWidth: 1, borderRadius: 13},
  searchInput: {width: '100%', minWidth: 0, padding: 0, color: '#202024', fontSize: 15, borderWidth: 0, outlineStyle: 'none', backgroundColor: 'transparent'},
  searchResults: {padding: '12px 12px 0'},
  muted: {color: '#6e6e6e', marginLeft: 8, marginRight: 6},
  note: {paddingBlock: 18, color: '#727272', fontSize: 14},
  unavailable: {display: 'grid', gap: 16, marginTop: 24, color: '#727272', fontSize: 14},
});
