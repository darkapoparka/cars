'use client';
import {useCopy} from '@/lib/locale';
import {useState} from 'react';
import {useRouter} from '@/lib/navigation';
import * as stylex from '@stylexjs/stylex';
import {CarFront, ChevronLeft, Check, Info, Music2, Search, ShieldCheck, Sparkles, X} from 'lucide-react';
import {isDealer} from '@/lib/dealer-config';
import {type Vehicle} from '@/lib/data';
import ReferenceInfoSheet from '@/components/ReferenceInfoSheet';
import type {ReferenceFeatureGroup,ReferenceFeature} from '@/lib/reference-types';
import {tokens as $} from '@/app/tokens.stylex';

export const capturedFortunerFeatures = [
  {name: 'Exteriors', icon: CarFront, items: ['Fog Light Front', 'Roof Rails', 'Running Lights', 'Rear Bumper Spoiler']},
  {name: 'Comfort & Convenience', icon: Sparkles, items: ['Cruise Control', 'Power Window front - Drivers Side', 'Power Window front - Passenger Side', 'Power Windows Rear']},
  {name: 'Safety & Security', icon: ShieldCheck, items: ['Parking Sensors Rear', 'Airbag Knees', 'Airbag Driver Front', 'Airbag Passenger Front', 'ABS']},
  {name:'Entertainment',icon:Music2,items:['Bluetooth Player','Apple Play','Android Auto Play']},
];
export default function VehicleFeatures({vehicle,featureGroups}: {vehicle: Vehicle;featureGroups?:ReferenceFeatureGroup[]}) {
  const tx = useCopy();

  const router = useRouter();
  const [query, setQuery] = useState('');
  const [information,setInformation]=useState<ReferenceFeature|null>(null);
  const descriptions=new Map(featureGroups?.flatMap(group=>group.items).map(feature=>[feature.name,feature]));
  const icons:Record<string,typeof CarFront>={exteriors:CarFront,comfortAndConvenience:Sparkles,safetyAndSecurity:ShieldCheck,entertainment:Music2};
  const fortuner = !isDealer && vehicle.slug === '2024-toyota-fortuner-exr';
  const groups = featureGroups?.length?featureGroups.map(group=>({name:group.name,icon:icons[group.key]??CarFront,items:group.items.map(item=>item.name)})):fortuner ? capturedFortunerFeatures : [{name: 'Captured features', icon: CarFront, items: vehicle.highlights}];
  const filtered = groups.map(group => ({...group, items: group.items.filter(item => item.toLowerCase().includes(query.toLowerCase()))})).filter(group => group.items.length);
  return <main {...stylex.props(s.page)}>
    <header {...stylex.props(s.header)}><button type="button" aria-label={tx("Back to vehicle")} onClick={() => history.length > 1 ? router.back() : router.push(`/cars/${vehicle.slug}`)} {...stylex.props(s.back)}><ChevronLeft size={27} /></button><h1 {...stylex.props(s.heading)}>{tx("Features &amp; Specifications")}</h1></header>
    <div {...stylex.props(s.content)}><label {...stylex.props(s.search)}><Search size={17} /><input type="search" aria-label={tx("Search for a feature")} placeholder={tx("Search for a feature")} value={query} onChange={event => setQuery(event.target.value)} {...stylex.props(s.input)} /><button type="button" aria-label={tx("Clear feature search")} onClick={() => setQuery('')} {...stylex.props(s.clear)}><X size={16} /></button></label>
      {filtered.map(({name, icon: Icon, items}) => <section key={name} {...stylex.props(s.section)}><h2 {...stylex.props(s.sectionTitle)}><span {...stylex.props(s.icon)}><Icon size={18} /></span>{tx(name)}</h2><ul {...stylex.props(s.list)}>{items.map(item => <li key={item} {...stylex.props(s.item)}><span>{tx(item)}{descriptions.get(item)?.description?<button type="button" aria-label={tx(`About ${item}`)} onClick={()=>setInformation(descriptions.get(item)!)} {...stylex.props(s.information)}><Info size={13} fill="#202024" color="#fff"/></button>:null}</span><span {...stylex.props(s.check)}><Check size={11} strokeWidth={2.5} /></span></li>)}</ul></section>)}
      {!filtered.length ? <p {...stylex.props(s.empty)}>{tx("No features match “")}{tx(query)}{tx("”.")}</p> : null}
    </div>
    {information?.description?<ReferenceInfoSheet title={tx(information.name)} description={tx(information.description)} onClose={()=>setInformation(null)}/>:null}
  </main>;
}
const s = stylex.create({
  page: {minHeight: '100dvh', paddingTop: 170, paddingBottom: 32, color: '#202024', fontFamily: $.fontDisplay, backgroundColor: '#fff'},
  header: {position: 'fixed', top: 0, right: 0, left: 0, zIndex: 100, height: 170, paddingTop: 51, backgroundColor: '#fff', boxShadow: '0 4px 7px #e8e8e8'},
  back: {display: 'grid', placeItems: 'center', width: 32, height: 61, marginLeft: 20, padding: 0, color: '#f17100', borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  heading: {display: 'flex', alignItems: 'center', height: 58, paddingInline: 20, fontSize: 16, fontWeight: 600, lineHeight: '24px', borderTopColor: '#f2f2f2', borderTopStyle: 'solid', borderTopWidth: 1},
  content: {maxWidth: 760, marginInline: 'auto', padding: '20px 20px 0'},
  search: {display: 'flex', alignItems: 'center', gap: 11, minHeight: 48, paddingInline: 13, color: '#535353', borderColor: '#c6c6c6', borderStyle: 'solid', borderWidth: 1, borderRadius: 8},
  input: {width: '100%', minWidth: 0, padding: 0, color: '#535353', fontSize: 12, borderWidth: 0, outlineStyle: 'none', backgroundColor: 'transparent'},
  clear: {display: 'grid', placeItems: 'center', width: 20, height: 30, padding: 0, color: '#202024', borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  section: {marginTop: 28},
  sectionTitle: {display: 'flex', alignItems: 'center', gap: 12, minHeight: 32, fontSize: 14, fontWeight: 600, lineHeight: '21px'},
  icon: {display: 'grid', placeItems: 'center', width: 32, height: 32, color: '#202024', borderRadius: 4, backgroundColor: '#f8f8f8'},
  list: {margin: '9px 0 0', padding: 0, listStyle: 'none'},
  item: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 15, minHeight: 41, color: '#535353', fontSize: 12, lineHeight: '20px', borderBottomColor: '#fbfbfb', borderBottomStyle: 'solid', borderBottomWidth: 1},
  information:{display:'inline-flex',alignItems:'center',justifyContent:'center',width:21,height:21,marginLeft:2,padding:0,verticalAlign:'middle',borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
  check: {display: 'grid', placeItems: 'center', width: 16, height: 16, color: '#00714c', borderRadius: '50%', backgroundColor: '#e4f1e9'},
  empty: {paddingBlock: 30, color: '#535353', fontSize: 14, lineHeight: '22px'},
});
