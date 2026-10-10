'use client';
import {useCopy} from '@/lib/locale';
import {useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {CarFront, Check, Info, Music2, Search, ShieldCheck, Sparkles, X} from 'lucide-react';
import {isDealer} from '@/lib/dealer-config';
import {type Vehicle} from '@/lib/data';
import PageHeader from '@/components/PageHeader';
import ReferenceInfoSheet from '@/components/ReferenceInfoSheet';
import type {ReferenceFeatureGroup,ReferenceFeature} from '@/lib/reference-types';
import {tokens as $} from '@/app/tokens.stylex';
import {searchField} from '@/components/search-field.stylex';

export const capturedFortunerFeatures = [
  {name: 'Exteriors', icon: CarFront, items: ['Fog Light Front', 'Roof Rails', 'Running Lights', 'Rear Bumper Spoiler']},
  {name: 'Comfort & Convenience', icon: Sparkles, items: ['Cruise Control', 'Power Window front - Drivers Side', 'Power Window front - Passenger Side', 'Power Windows Rear']},
  {name: 'Safety & Security', icon: ShieldCheck, items: ['Parking Sensors Rear', 'Airbag Knees', 'Airbag Driver Front', 'Airbag Passenger Front', 'ABS']},
  {name:'Entertainment',icon:Music2,items:['Bluetooth Player','Apple Play','Android Auto Play']},
];
export default function VehicleFeatures({vehicle,featureGroups}: {vehicle: Vehicle;featureGroups?:ReferenceFeatureGroup[]}) {
  const tx = useCopy();

  const [query, setQuery] = useState('');
  const [information,setInformation]=useState<ReferenceFeature|null>(null);
  const descriptions=new Map(featureGroups?.flatMap(group=>group.items).map(feature=>[feature.name,feature]));
  const icons:Record<string,typeof CarFront>={exteriors:CarFront,comfortAndConvenience:Sparkles,safetyAndSecurity:ShieldCheck,entertainment:Music2};
  const fortuner = !isDealer && vehicle.slug === '2024-toyota-fortuner-exr';
  const groups = featureGroups?.length?featureGroups.map(group=>({name:group.name,icon:icons[group.key]??CarFront,items:group.items.map(item=>item.name)})):fortuner ? capturedFortunerFeatures : [{name: 'Captured features', icon: CarFront, items: vehicle.highlights}];
  const filtered = groups.map(group => ({...group, items: group.items.filter(item => `${item} ${tx(item)}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()))})).filter(group => group.items.length);
  return <main {...stylex.props(s.page)}>
    <PageHeader title={tx("Features")} backHref={`/cars/${vehicle.slug}`} backLabel={tx("Back to vehicle")}/>
    <div {...stylex.props(s.content)}><div data-search-field role="search" {...stylex.props(searchField.field)}><Search size={20} aria-hidden="true" {...stylex.props(searchField.icon)} /><input data-search-input type="search" aria-label={tx("Search for a feature")} placeholder={tx("Search for a feature")} autoComplete="off" autoCapitalize="none" spellCheck={false} value={query} onChange={event => setQuery(event.target.value)} {...stylex.props(searchField.input)} />{query ? <button type="button" aria-label={tx("Clear feature search")} onClick={() => setQuery('')} {...stylex.props(searchField.clear)}><X size={18} aria-hidden="true" /></button> : null}</div>
      {filtered.map(({name, icon: Icon, items}) => <section key={name} {...stylex.props(s.section)}><h2 {...stylex.props(s.sectionTitle)}><span {...stylex.props(s.icon)}><Icon size={18} /></span>{tx(name)}</h2><ul {...stylex.props(s.list)}>{items.map(item => <li key={item} {...stylex.props(s.item)}><span>{tx(item)}{descriptions.get(item)?.description?<button type="button" aria-label={tx(`About ${item}`)} onClick={()=>setInformation(descriptions.get(item)!)} {...stylex.props(s.information)}><Info size={13} fill="#202024" color="#fff"/></button>:null}</span><span {...stylex.props(s.check)}><Check size={11} strokeWidth={2.5} /></span></li>)}</ul></section>)}
      {!filtered.length ? <p {...stylex.props(s.empty)}>{tx("No features match “")}{tx(query)}{tx("”.")}</p> : null}
    </div>
    {information?.description?<ReferenceInfoSheet title={tx(information.name)} description={tx(information.description)} onClose={()=>setInformation(null)}/>:null}
  </main>;
}
const s = stylex.create({
  page: {minHeight: '100dvh', paddingTop: 0, paddingBottom: 32, color: '#202024', fontFamily: $.fontSans, backgroundColor: '#fff'},
  content: {maxWidth: 760, marginInline: 'auto', padding: '12px 16px 0'},
  section: {marginTop: 28},
  sectionTitle: {display: 'flex', alignItems: 'center', gap: 12, minHeight: 32, fontSize: 14, fontWeight: 600, lineHeight: '21px'},
  icon: {display: 'grid', placeItems: 'center', width: 32, height: 32, color: '#202024', borderRadius: 4, backgroundColor: '#f8f8f8'},
  list: {margin: '9px 0 0', padding: 0, listStyle: 'none'},
  item: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 15, minHeight: 41, color: '#535353', fontSize: 14, lineHeight: '21px',},
  information:{display:'inline-flex',alignItems:'center',justifyContent:'center',width:44,height:44,marginLeft:2,padding:0,verticalAlign:'middle',borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
  check: {display: 'grid', placeItems: 'center', width: 16, height: 16, color: '#00714c', borderRadius: '50%', backgroundColor: '#e4f1e9'},
  empty: {paddingBlock: 30, color: '#535353', fontSize: 14, lineHeight: '22px'},
});
