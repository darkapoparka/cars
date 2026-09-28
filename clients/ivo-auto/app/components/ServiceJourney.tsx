'use client';
import {useCopy} from '@/lib/locale';
import PageHeader from '@/components/PageHeader';
import {currency} from '@/lib/currency';
import ShowroomBadge from '@/components/ShowroomBadge';

import {useEffect, useState, type FormEvent} from 'react';
import {useRouter} from '@/lib/navigation';
import * as stylex from '@stylexjs/stylex';
import {Check, ChevronDown, ChevronRight, Info, Phone, ShieldCheck, X} from 'lucide-react';
import {useModal} from '@/components/useModal';
import {vehicles, formatPrice} from '@/lib/data';
import { tokens as $} from '@/app/tokens.stylex';

type Stage = 'brand' | 'model' | 'contract' | 'login';
type PlanId = 'minor' | 'major' | 'recommended';
const brands = ['Toyota', 'Nissan', 'BMW', 'Ford', 'Mercedes-Benz', 'Mitsubishi', 'Honda', 'Hyundai', 'Chevrolet', 'Kia', 'Audi', 'Lexus', 'Land Rover', 'Volkswagen', 'Jeep', 'Abarth', 'Acura', 'Alfa Romeo', 'Bentley', 'Dodge', 'GMC', 'Infiniti', 'Jaguar', 'Mazda', 'MG', 'Mini', 'Porsche', 'Renault', 'Suzuki', 'Tesla', 'Volvo'];
const knownModels: Record<string, string[]> = {Toyota: ['Camry', 'Corolla', 'Fortuner', 'Land Cruiser', 'Prado', 'RAV4', 'Yaris', 'Veloz'], Kia: ['Cerato', 'Sportage', 'Seltos', 'Sorento', 'Picanto', 'Optima', 'K5', 'K8'], Ford: ['Escape', 'Expedition', 'Escort', 'Explorer', 'Edge', 'Ranger', 'Fusion', 'Fiesta', 'Focus', 'Figo', 'EcoSport', 'Mustang', 'Transit', 'F-150']};
const planDetails: Record<PlanId, {title: string; price: number; old: number; points: string[]}> = {
  minor: {title: '10,000 KM SERVICE', price: 649, old: 849, points: ['Free pick-up & drop', '28-point detailed inspection and diagnostic check', 'Includes Engine Oil & Oil Filter Replacement and free car wash', 'Same day delivery available for morning pick-up slots']},
  major: {title: '20,000 KM SERVICE', price: 1199, old: 1499, points: ['Free pick-up & drop', '45-point comprehensive inspection and diagnostic check', 'Includes Engine Oil & Oil Filter Replacement', 'Free wheel balancing, brake pads & disc cleaning, and car wash', 'Next day delivery']},
  recommended: {title: 'RECOMMENDED CARE', price: 2349, old: 3049, points: ['2 minor 1 major service', 'Covers 18 months or 30000 kms, whichever is earlier', 'Enjoy 5% Bundle Savings', 'Best choice for users with 18 months overall warranty', 'One complimentary wheel balancing at 20,000 KM', 'Free pick-up & drop and car wash with each service']},
};
const engineChecks = [['Inspect', 'Exhaust pipe & mounting'], ['Inspect', 'Drive Belts'], ['Inspect', 'Cooling System Hoses'], ['Inspect', 'PCV Valve, Hoses & Connections'], ['Replace', 'Engine Oil'], ['Replace', 'Engine Oil filter'], ['Inspect/ Clean', 'Air Filter Condition'], ['Inspect/ Top-up', 'Engine Coolant Condition'], ['Perform', 'Service Reminder Reset']];

export default function ServiceJourney({initialBrand = '', initialModel = ''}: {initialBrand?: string; initialModel?: string}) {
  const tx = useCopy();

  const router = useRouter();
  const [brand, setBrand] = useState(initialBrand);
  const [model, setModel] = useState(initialModel);
  const [stage, setStage] = useState<Stage>(initialModel ? 'contract' : initialBrand ? 'model' : 'brand');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<PlanId | null>(null);
  const [detail, setDetail] = useState<PlanId | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [help, setHelp] = useState(false);
  const detailRef = useModal(detail !== null, () => setDetail(null));
  const helpRef = useModal(help, () => setHelp(false));
  useEffect(() => {
    function restore() {
      const params = new URLSearchParams(location.search), b = params.get('brand') ?? '', m = params.get('model') ?? '';
      const next = params.get('stage');
      setBrand(b); setModel(m); setStage(next === 'login' ? 'login' : m ? 'contract' : b ? 'model' : 'brand');
      const plan = params.get('plan'); setSelected(plan === 'minor' || plan === 'major' || plan === 'recommended' ? plan : null); setQuery('');
    }
    const frame = requestAnimationFrame(restore); window.addEventListener('popstate', restore);
    return () => {cancelAnimationFrame(frame); window.removeEventListener('popstate', restore);};
  }, []);
  function navigate(next: Stage, b = brand, m = model, plan = selected) {
    const params = new URLSearchParams(); if (b) params.set('brand', b); if (m) params.set('model', m); if (plan) params.set('plan', plan); if (next === 'login') params.set('stage', 'login');
    history.pushState({...history.state, cars24Service: true}, '', `/service/details?${params}`);
    setBrand(b); setModel(m); setStage(next); setSelected(plan); setQuery(''); setStatus(''); setError(''); window.scrollTo({top: 0, behavior: 'instant'});
  }
  function back() {
    if (stage === 'brand') {router.push('/service'); return;}
    if (history.state?.cars24Service) {history.back(); return;}
    if (stage === 'model') navigate('brand', '', '', null);
    else if (stage === 'login') navigate('contract');
    else navigate('model', brand, '', null);
  }
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {if (event.key === 'Escape' && !detail && !help) {event.preventDefault(); router.push('/service');}};
    document.addEventListener('keydown', escape); return () => document.removeEventListener('keydown', escape);
  }, [router, detail, help]);
  const modelList = knownModels[brand] ?? [...new Set(vehicles.filter(vehicle => vehicle.make === brand).map(vehicle => vehicle.model))];
  const choices = (stage === 'brand' ? brands : modelList).filter(value => value.toLowerCase().includes(query.toLowerCase()));
  const priceFor = (id: PlanId) => ({...planDetails[id], price: planDetails[id].price - (brand === 'Kia' ? id === 'recommended' ? 200 : 100 : 0), old: planDetails[id].old - (brand === 'Kia' ? id === 'recommended' ? 300 : 100 : 0)});
  const selectedPlan = selected ? priceFor(selected) : null;
  function add(id: PlanId) {
    const next = selected === id ? null : id;
    setSelected(next); setDetail(null); setStatus(next ? 'Service contract added successfully' : 'Service contract removed');
    const params = new URLSearchParams(location.search); if (next) params.set('plan', next); else params.delete('plan');
    history.replaceState({...history.state}, '', `${location.pathname}?${params}`);
  }
  function verify(event: FormEvent) {
    event.preventDefault(); const digits = phone.replace(/\D/g, '');
    if (!/^5\d{8}$/.test(digits)) {setError('Enter a valid 9-digit UAE mobile number.'); setStatus(''); return;}
    setError(''); setStatus('Authentication is not connected in this reference build. No OTP is sent.');
  }
  return <main {...stylex.props(s.page, (stage === 'brand' || stage === 'model') && s.selectorPage)}>

    {stage === 'brand' || stage === 'model' ? <>
      <PageHeader title={tx("Your car")} onBack={back} backLabel={tx("Back from service search")}/>
      <div {...stylex.props(s.search)}><input aria-label={tx("Search service brand or model")} placeholder={tx("Search by brand or model")} value={query} onChange={event => setQuery(event.target.value)} {...stylex.props(s.input)} /></div>
      {brand ? <button type="button" onClick={() => navigate('brand', '', '', null)} {...stylex.props(s.brandChip)}>{tx(brand)}</button> : null}
      <div {...stylex.props(s.choices, Boolean(brand) && s.modelChoices)}>{choices.map(value => <button type="button" key={value} onClick={() => stage === 'brand' ? navigate('model', value, '', null) : navigate('contract', brand, value, null)} {...stylex.props(s.choice)}>{tx(value)}</button>)}{!choices.length ? <p {...stylex.props(s.noResults)}>{tx("No matching ")}{tx(stage === 'brand' ? 'brands' : 'models')} {tx(" in the captured catalog.")}</p> : null}</div>
    </> : <>
      <PageHeader title={tx(stage === 'login' ? 'Log in' : 'Service contract')} subtitle={tx(stage === 'contract' ? brand + ' ' + model : undefined)} onBack={back} backLabel={tx("Back from service contract")}/>
      {stage === 'contract' ? <>
        <h2 {...stylex.props(s.groupHeading)}>{tx("One time service")}</h2>
        {(['minor', 'major', 'recommended'] as PlanId[]).map(id => {const plan = priceFor(id); return <section key={id}>
          {id === 'recommended' ? <h2 {...stylex.props(s.groupHeading)}>{tx("Service Packages")}</h2> : null}
          <article {...stylex.props(s.plan, selected === id && s.selectedPlan)}>
            <header {...stylex.props(s.planHeader)}><h3 {...stylex.props(s.planTitle)}>{id === 'recommended' ? <span {...stylex.props(s.recommendedIcon)}>{tx("▧")}</span> : <ShowroomBadge/>}{tx(plan.title)}</h3><div {...stylex.props(s.pricing)}><strong>{tx(currency.code)} {tx(formatPrice(plan.price))}</strong><del {...stylex.props(s.oldPrice)}>{tx(currency.code)} {tx(formatPrice(plan.old))}</del></div></header>
            {id === 'recommended' ? <p {...stylex.props(s.contractLength)}>{tx("18 month contract | 3 services")}</p> : null}
            <ul {...stylex.props(s.points)}>{plan.points.map(point => <li key={point}>{tx(point)}</li>)}</ul>
            <div {...stylex.props(s.planActions)}><button type="button" onClick={() => {setDetail(id); setExpanded(false);}} {...stylex.props(s.viewMore)}>{tx("View More ")}<ChevronRight size={18} /></button><button type="button" disabled={selected !== null && selected !== id} onClick={() => add(id)} {...stylex.props(s.add, selected === id && s.added, selected !== null && selected !== id && s.disabled)}>{tx(selected === id ? 'ADDED' : 'ADD')}</button></div>
          </article>
        </section>;})}
        {selectedPlan ? <footer {...stylex.props(s.cart)}><div><p>{tx("1 service added")}</p><strong>{tx(currency.code)} {tx(formatPrice(selectedPlan.price))}</strong></div><button type="button" onClick={() => navigate('login')} {...stylex.props(s.next)}>{tx("NEXT")}</button></footer> : null}
        {status ? <p role="status" {...stylex.props(s.cartStatus)}><Check size={18} />{tx(status)}</p> : null}
      </> : <form onSubmit={verify} {...stylex.props(s.loginForm)}>
        <p {...stylex.props(s.loginNotice)}>{tx("🟡&nbsp; Please login to buy service contract")}</p>
        <label htmlFor="service-phone" {...stylex.props(s.phoneLabel)}>{tx("Enter your mobile number")}</label><div {...stylex.props(s.phoneBox)}><span>{tx("+971")}</span><input id="service-phone" type="tel" inputMode="tel" autoComplete="tel-national" aria-label={tx("Service mobile number")} placeholder={tx("505050505")} value={phone} onChange={event => setPhone(event.target.value)} {...stylex.props(s.phoneInput)} /></div>
        <p {...stylex.props(s.safe)}><ShieldCheck size={19} />{tx("Your information remains 100% safe with us.")}</p>{error ? <p role="alert" {...stylex.props(s.formError)}>{tx(error)}</p> : null}{status ? <p role="status" {...stylex.props(s.formStatus)}>{tx(status)}</p> : null}
        <div {...stylex.props(s.consent)}><label {...stylex.props(s.checkbox)}><input type="checkbox" defaultChecked /><span>{tx("Allow notifications on 🟢 Whatsapp")}</span></label><label {...stylex.props(s.checkbox)}><input type="checkbox" defaultChecked /><span>{tx("I agree to let the showroom check my AECB score for finance eligibility")}</span></label><p {...stylex.props(s.legal)}>{tx("By logging in, you agree to the showroom&apos;s ")}<button type="button" onClick={() => setHelp(true)} {...stylex.props(s.terms)}>{tx("Terms & Conditions")}</button></p><button type="submit" disabled={phone.replace(/\D/g, '').length < 9} {...stylex.props(s.verify, phone.replace(/\D/g, '').length < 9 && s.verifyDisabled)}>{tx("VERIFY")}</button></div>
      </form>}
    </>}
    <button type="button" aria-label={tx("Service support")} onClick={() => setHelp(true)} {...stylex.props(s.call)}><Phone size={22} fill="currentColor" /></button>
    {detail ? <div ref={detailRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={tx("Service inspection details")} {...stylex.props(s.detail)}>
      <header {...stylex.props(s.detailHeader)}><button type="button" aria-label={tx("Close inspection details")} onClick={() => setDetail(null)} {...stylex.props(s.back)}><X size={25} strokeWidth={1.5} /></button><button type="button" onClick={() => setHelp(true)} {...stylex.props(s.help)}>{tx("HELP")}</button></header>
      <div {...stylex.props(s.detailContent)}><h2 {...stylex.props(s.tableTitle)}>{tx(detail === 'minor' ? 'Minor Service (1)' : detail === 'major' ? 'Major Service (1)' : 'Recommended Care')}<Info size={15} /></h2><h3 {...stylex.props(s.tableCategory)}>{tx("Engine")}</h3><table {...stylex.props(s.table)}><tbody>{engineChecks.map(([action, item]) => <tr key={item}><td {...stylex.props(s.actionCell)}>{tx(action)}</td><td {...stylex.props(s.itemCell)}>{tx(item)}</td></tr>)}</tbody></table><button type="button" onClick={() => setExpanded(value => !value)} aria-expanded={expanded} {...stylex.props(s.expand)}>{tx(expanded ? 'Collapse all details' : 'Expand all details')}<ChevronDown size={23} /></button>{expanded ? <><h3 {...stylex.props(s.tableCategory)}>{tx("Inspection and diagnostics")}</h3><table {...stylex.props(s.table)}><tbody>{[['Inspect', 'Air Conditioning performance'], ['Inspect', 'Parking Brake'], ['Inspect', 'Exhaust pipe'], ...(detail !== 'minor' ? [['Inspect', 'Suspension check'], ['Clean', 'Brake pads & discs'], ['Perform', 'Wheel balancing']] : [])].map(([action, item]) => <tr key={item}><td {...stylex.props(s.actionCell)}>{tx(action)}</td><td {...stylex.props(s.itemCell)}>{tx(item)}</td></tr>)}</tbody></table></> : null}
        <section {...stylex.props(s.faqs)}><h2>{tx("FAQs")}</h2><details open><summary {...stylex.props(s.faqTitle)}>{tx("What is the difference between a standalone service and a service contract?")}</summary><p {...stylex.props(s.faqCopy)}>{tx("A standalone service covers one visit. A service contract combines the scheduled services included in your selected package.")}</p></details></section>
      </div><footer {...stylex.props(s.detailFooter)}><button type="button" onClick={() => add(detail)} {...stylex.props(s.verify)}>{tx("ADD")}</button></footer>
    </div> : null}
    {help ? <div {...stylex.props(s.helpBackdrop)}><section ref={helpRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={tx("Service support information")} {...stylex.props(s.helpPanel)}><button type="button" aria-label={tx("Close service support")} onClick={() => setHelp(false)} {...stylex.props(s.helpClose)}><X size={23} /></button><h2>{tx("Service support")}</h2><p>{tx("The local reference build does not submit service orders, send messages, or request credit checks.")}</p><button type="button" onClick={() => setHelp(false)} {...stylex.props(s.verify)}>{tx("Close")}</button></section></div> : null}
  </main>;
}
const s = stylex.create({
  page: {minHeight: '100dvh', maxWidth: 760, marginInline: 'auto', paddingTop: 0, paddingBottom: 130, color: '#202024', fontFamily: $.fontDisplay, backgroundColor: '#fff'},
  selectorPage: {paddingTop: 0, paddingInline: 0, color: '#535353'},
  search: {marginInline: 12, display: 'flex', alignItems: 'center', minHeight: 48, paddingInline: 4, borderColor: '#202024', borderStyle: 'solid', borderWidth: 1, borderRadius: 8},
  back: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 32, height: 42, padding: 0, color: '#f17100', borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  input: {width: '100%', minWidth: 0, padding: 0, color: '#535353', fontSize: 12, borderWidth: 0, outlineStyle: 'none', backgroundColor: 'transparent'},
  choices: {marginTop: 20, paddingInline: 12},
  modelChoices: {marginTop: 12},
  choice: {display: 'block', width: '100%', minHeight: 47, padding: 0, color: '#535353', fontSize: 14, textAlign: 'left', borderWidth: 0, borderBottomColor: '#ececec', borderBottomStyle: 'solid', borderBottomWidth: 1, backgroundColor: '#fff', cursor: 'pointer'},
  brandChip: {minHeight: 35, marginTop: 22, marginLeft: -10, padding: '5px 12px', color: '#202024', fontSize: 14, fontWeight: 600, borderWidth: 0, borderRadius: 20, backgroundColor: '#fff', boxShadow: '0 2px 4px #e9e9e9', cursor: 'pointer'},
  noResults: {marginTop: 20, fontSize: 13},
  groupHeading: {padding: '20px 20px 0', color: '#202024', fontSize: 14, fontWeight: 500, lineHeight: '20px'},
  plan: {padding: '14px 20px 21px', borderBottomColor: '#f1f1f1', borderBottomStyle: 'solid', borderBottomWidth: 2, backgroundColor: '#fff'},
  selectedPlan: {backgroundColor: '#fff5ea'},
  planHeader: {display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12},
  planTitle: {display: 'flex', alignItems: 'center', gap: 7, fontSize: 14, fontWeight: 600, lineHeight: '22px'},
  recommendedIcon: {display: 'grid', placeItems: 'center', width: 24, height: 24, color: '#fff', fontSize: 17, borderRadius: '50%', backgroundColor: '#00b461'},
  pricing: {display: 'flex', alignItems: 'flex-end', flexDirection: 'column', gap: 3, flexShrink: 0, fontSize: 14, fontWeight: 600, lineHeight: '22px'},
  oldPrice: {color: '#a0a0a0', fontSize: 10, fontWeight: 400, lineHeight: '15px'},
  contractLength: {marginTop: 2, color: '#080808', fontSize: 12, fontWeight: 500, lineHeight: '20px'},
  points: {display: 'grid', gap: 6, margin: '1px 0 0', padding: '0 0 0 18px', listStyle: 'none', fontSize: 10, fontWeight: 400, lineHeight: '17px'},
  planActions: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 16},
  viewMore: {display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0, color: '#202024', fontSize: 12, fontWeight: 600, borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  add: {minWidth: 72, minHeight: 44, paddingInline: 14, color: '#fff', fontSize: 12, fontWeight: 600, borderColor: '#202024', borderStyle: 'solid', borderWidth: 1, borderRadius: 4, backgroundColor: '#202024', cursor: 'pointer'},
  added: {color: '#202024', backgroundColor: '#f0f0f0'},
  disabled: {borderColor: '#b5b5b5', backgroundColor: '#b5b5b5', cursor: 'default'},
  cart: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 90, minHeight: 93, padding: '10px 20px 30px', color: '#202024', fontSize: 12, lineHeight: '25px', backgroundColor: '#f9f9f9', borderTopColor: '#d0eddf', borderTopStyle: 'solid', borderTopWidth: 8},
  next: {minWidth: 140, minHeight: 48, color: '#fff', fontSize: 14, fontWeight: 600, borderWidth: 0, borderRadius: 8, backgroundColor: $.violet, cursor: 'pointer'},
  cartStatus: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '12px 20px', color: '#067a4a', fontSize: 12, lineHeight: '20px'},
  call: {position: 'fixed', right: 20, bottom: 140, zIndex: 95, display: 'grid', placeItems: 'center', width: 41, height: 41, padding: 0, color: '#fff', borderWidth: 0, borderRadius: '50%', backgroundColor: '#202024', boxShadow: '0 3px 7px #e4e4e4', cursor: 'pointer'},
  loginForm: {padding: '20px 20px 0'},
  loginNotice: {minHeight: 50, padding: '13px 15px', fontSize: 14, lineHeight: '22px', borderRadius: 8, backgroundImage: 'linear-gradient(#effaf0,#fff)'},
  phoneLabel: {display: 'block', marginTop: 18, fontSize: 14, lineHeight: '22px'},
  phoneBox: {display: 'flex', alignItems: 'center', gap: 13, height: 48, marginTop: 12, paddingInline: 12, color: '#b5b5b5', fontSize: 14, borderColor: '#c6c6c6', borderStyle: 'solid', borderWidth: 1, borderRadius: 8},
  phoneInput: {width: '100%', minWidth: 0, paddingLeft: 12, color: '#202024', fontSize: 14, borderWidth: 0, borderLeftColor: '#dedede', borderLeftStyle: 'solid', borderLeftWidth: 1, outlineStyle: 'none'},
  safe: {display: 'flex', alignItems: 'center', gap: 3, marginTop: 12, color: '#007500', fontSize: 12, lineHeight: '19px'},
  consent: {position: 'fixed', right: 20, bottom: 42, left: 20, zIndex: 91, backgroundColor: '#fff'},
  checkbox: {display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 12, color: '#414141', fontSize: 12, lineHeight: '18px'},
  legal: {marginTop: 10, color: '#414141', fontSize: 10, lineHeight: '15px'},
  terms: {padding: 0, color: '#777777', fontSize: 10, fontWeight: 600, textDecorationLine: 'underline', borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  verify: {display: 'grid', placeItems: 'center', width: '100%', minHeight: 48, marginTop: 16, color: '#fff', fontSize: 16, fontWeight: 600, borderWidth: 0, borderRadius: 12, backgroundColor: $.violet, cursor: 'pointer'},
  verifyDisabled: {backgroundColor: '#ddd', cursor: 'default'},
  formError: {marginTop: 12, color: '#b42318', fontSize: 12, lineHeight: '18px'},
  formStatus: {marginTop: 16, padding: 12, color: '#535353', fontSize: 12, lineHeight: '18px', backgroundColor: '#f5f5f5'},
  detail: {position: 'fixed', inset: 0, zIndex: 210, overflowY: 'auto', paddingTop: 51, paddingBottom: 100, color: '#535353', backgroundColor: '#fff'},
  detailHeader: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 58, paddingInline: 20, boxShadow: '0 3px 6px #eeeeee'},
  help: {padding: 0, color: '#202024', fontSize: 14, fontWeight: 600, borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  detailContent: {maxWidth: 720, marginInline: 'auto', padding: '16px 20px'},
  tableTitle: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 52, paddingInline: 12, color: '#202024', fontSize: 14, fontWeight: 600, backgroundColor: '#f0f0f0'},
  tableCategory: {minHeight: 46, padding: '11px 12px', color: '#202024', fontSize: 12, fontWeight: 500, backgroundColor: '#fafafa'},
  table: {width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', fontSize: 12, lineHeight: '22px'},
  actionCell: {width: '60%', padding: '10px 12px', borderBottomColor: '#e4e4e4', borderBottomStyle: 'solid', borderBottomWidth: 1, verticalAlign: 'middle'},
  itemCell: {width: '40%', padding: '10px 12px', borderLeftColor: '#e4e4e4', borderLeftStyle: 'solid', borderLeftWidth: 1, borderBottomColor: '#e4e4e4', borderBottomStyle: 'solid', borderBottomWidth: 1, verticalAlign: 'middle'},
  expand: {display: 'inline-flex', alignItems: 'center', gap: 9, minHeight: 56, padding: 0, color: '#626262', fontSize: 12, fontWeight: 600, borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  faqs: {marginTop: 35, paddingTop: 22, borderTopColor: '#f5f5f5', borderTopStyle: 'solid', borderTopWidth: 5, fontSize: 14},
  faqTitle: {marginTop: 18, color: '#f07100', fontSize: 14, lineHeight: '21px', cursor: 'pointer'},
  faqCopy: {marginTop: 10, fontSize: 12, lineHeight: '20px'},
  detailFooter: {position: 'fixed', bottom: 0, right: 0, left: 0, padding: '0 20px 34px', backgroundColor: '#fff'},
  helpBackdrop: {position: 'fixed', inset: 0, zIndex: 225, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,.4)'},
  helpPanel: {position: 'relative', width: '100%', maxWidth: 560, padding: '24px 20px 34px', color: '#202024', fontSize: 14, lineHeight: '23px', borderRadius: '24px 24px 0 0', backgroundColor: '#fff'},
  helpClose: {position: 'absolute', top: 10, right: 12, padding: 6, borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
});
