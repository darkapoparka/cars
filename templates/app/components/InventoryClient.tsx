'use client';
import {useCopy} from '@/lib/locale';
import {useEffect,useMemo,useRef,useState} from 'react';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import {Heart,Search,X} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import FilterPill from '@/components/FilterPill';
import InventoryPromotion from '@/components/InventoryPromotion';
import VehicleCard from '@/components/VehicleCard';
import LoginSheet from '@/components/DealerEnquirySheet';
import {BrandRow} from '@/components/ReferenceUI';
import {useModal} from '@/components/useModal';
import {vehicles,type Vehicle} from '@/lib/data';
import NativeFilterPane from '@/components/NativeFilterPane';
import {useInventoryHistory} from '@/components/useInventoryHistory';
import {filterTabs as tabs,quickFilterTabs,filterMakes as makes,emptyFilters,hasActiveFilters,matchesInventory as matches,type Filters,type FilterTab as Tab} from '@/lib/inventory-filters';
import {media,tokens as $} from '@/app/tokens.stylex';

const sortGroups=[{title:'',items:[['BEST MATCH','default'],['RECENTLY ADDED','recent']]},{title:'DISCOUNT',items:[['HIGH TO LOW','discount']]},{title:'PRICE',items:[['LOW TO HIGH','price-asc'],['HIGH TO LOW','price-desc']]},{title:'KMS DRIVEN',items:[['LOW TO HIGH','kms-asc'],['HIGH TO LOW','kms-desc']]},{title:"CAR'S AGE",items:[['OLD TO NEW','age-asc'],['NEW TO OLD','age-desc']]}];
type Props={initialEmiMax?:number;initialQuery?:string;initialBrand?:string;initialBody?:string;initialOverlay?:'filters'|'sort'|null;initialOpen?:string|null;variant?:'standard'|'luxe'};

export default function InventoryClient({initialEmiMax,initialQuery='',initialBrand='',initialBody='',initialOverlay=null,initialOpen=null,variant='standard'}:Props){
  const tx = useCopy();

 const luxe=variant==='luxe';
 const [query,setQuery]=useState(initialQuery);
 const [emiMax,setEmiMax]=useState(initialEmiMax);
 const [filters,setFilters]=useState<Filters>(()=>({...emptyFilters(),brands:initialBrand?[initialBrand]:[],bodies:initialBody?[initialBody.toUpperCase()]:[]}));
 const [sort,setSort]=useState('default');
 const [overlay,setOverlay]=useState<'filters'|'sort'|null>(initialOpen?'filters':initialOverlay);
 const [active,setActive]=useState<Tab>(tabs.includes(initialOpen?.toUpperCase() as Tab)?initialOpen!.toUpperCase() as Tab:'BRAND');
 const [login,setLogin]=useState(false);
 const [brandSearch,setBrandSearch]=useState('');
 const railRef=useRef<HTMLElement>(null);
 useInventoryHistory({query,filters,sort,emiMax},{setQuery,setFilters,setSort,setEmiMax});
 useEffect(()=>{const pop=()=>setOverlay(null);window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop);},[]);
 const results=useMemo(()=>{
  const items=vehicles.filter(car=>(!luxe||car.tier==='Luxe'||car.slug==='2024-toyota-fortuner-exr')&&(emiMax===undefined||car.monthly<=emiMax)&&matches(car,filters,query));
  return [...items].sort((a,b)=>sort==='price-asc'?a.price-b.price:sort==='price-desc'?b.price-a.price:sort==='kms-asc'?a.mileage-b.mileage:sort==='kms-desc'?b.mileage-a.mileage:sort==='discount'?discount(b)-discount(a):sort==='age-asc'?a.year-b.year:sort==='age-desc'||sort==='recent'?b.year-a.year:0);
 },[filters,query,sort,luxe,emiMax]);
 const filtered=Boolean(emiMax!==undefined||query.trim()||hasActiveFilters(filters));
 // Counts always reflect the inventory actually shown.
 const count=results.length;
 const defaults=emptyFilters();
 const quickSelection={BRAND:filters.brands.length>0,MODEL:filters.models.length>0,BUDGET:filters.budget.length>0||filters.minimum!==defaults.minimum||filters.maximum!==defaults.maximum,DISCOUNTS:Boolean(filters.extra.DISCOUNTS?.length),YEAR:Boolean(filters.year)||filters.yearMinimum!==defaults.yearMinimum||filters.yearMaximum!==defaults.yearMaximum,MILEAGE:Boolean(filters.mileage)||filters.mileageMinimum!==defaults.mileageMinimum||filters.mileageMaximum!==defaults.mileageMaximum,'BODY TYPE':filters.bodies.length>0,'FUEL TYPE':filters.fuel.length>0};
 useEffect(()=>{if(overlay!=='filters')return;const rail=railRef.current;const selected=rail?.querySelector<HTMLElement>('[aria-pressed="true"]');if(rail&&selected&&window.innerWidth<768)rail.scrollTo({left:Math.max(0,selected.offsetLeft-rail.offsetLeft-12),behavior:'smooth'});},[active,overlay]);
 function open(kind:'filters'|'sort',tab?:Tab){if(tab)setActive(tab);window.history.pushState({...window.history.state,cars24Overlay:kind},'');setOverlay(kind);}
 function close(){if(window.history.state?.cars24Overlay)window.history.back();setOverlay(null);}
 function reset(){setFilters(emptyFilters());setQuery('');setEmiMax(undefined);}
 const modal=useModal(overlay!==null,close,{history:false});
 return <div {...stylex.props(s.screen)}>
  <PageHeader title={tx(luxe?'Select collection':'Our cars')} action={<Link href="/saved" aria-label={tx("Saved cars")} {...stylex.props(s.roundButton)}><Heart size={21}/></Link>}/>
  <div {...stylex.props(s.topInner)}><label {...stylex.props(s.search)}><Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={tx("Search make or model")} aria-label={tx("Search cars")} {...stylex.props(s.input)}/>{query?<button type="button" aria-label={tx("Clear search")} onClick={()=>setQuery('')} {...stylex.props(s.clearSearch)}><X size={18}/></button>:null}</label></div>
  <InventoryPromotion/>
  <nav aria-label={tx("Inventory filters")} {...stylex.props(s.toolbar)}>
    <FilterPill label={tx("Filter")} icon="filter" mobileIconOnly selected={filtered} onClick={()=>open('filters')}/>
    <FilterPill label={tx("Sort")} icon="sort" mobileIconOnly selected={sort!=='default'} onClick={()=>open('sort')}/>
    {quickFilterTabs.map(tab=><FilterPill key={tab} label={tx(titleCase(tab))} selected={quickSelection[tab]} onClick={()=>open('filters',tab)}/>)}
  </nav>
  <main {...stylex.props(s.content)}><aside {...stylex.props(s.sidebar)}><h2 {...stylex.props(s.sideTitle)}>{tx("Filter cars")}</h2><label {...stylex.props(s.brandSearch)}><Search size={18}/><input aria-label={tx("Search sidebar brands")} placeholder={tx("Search brand")} value={brandSearch} onChange={e=>setBrandSearch(e.target.value)} {...stylex.props(s.input)}/></label>{makes.filter(make=>make.toLowerCase().includes(brandSearch.toLowerCase())).map(make=><CheckRow key={make} label={tx(make)} checked={filters.brands.includes(make)} onChange={()=>setFilters({...filters,brands:toggle(filters.brands,make)})}/>)}<button type="button" onClick={reset} {...stylex.props(s.reset)}>{tx("Clear all filters")}</button></aside>
   <section {...stylex.props(s.results)}>{luxe?<div {...stylex.props(s.luxeBrands)}><BrandRow compact title={tx("Explore by brand")} onSelect={brand=>setFilters({...filters,brands:[brand]})}/></div>:null}<div {...stylex.props(s.resultHeading)}><h2 {...stylex.props(s.resultTitle)}>{tx(count)} {tx(count===1?'car':'cars')}</h2><span {...stylex.props(s.sample)}>{tx("Demo inventory")}</span></div>{results.length?<div {...stylex.props(s.grid)}>{results.map(vehicle=><VehicleCard key={vehicle.slug} vehicle={vehicle} luxe={luxe}/>)}</div>:<div {...stylex.props(s.empty)}><Search size={32}/><h3>{tx("No cars match these filters")}</h3><p>{tx("Reset the filters or try a broader search.")}</p><button type="button" onClick={reset} {...stylex.props(s.reset)}>{tx("Reset filters")}</button></div>}</section>
  </main>
  {overlay==='filters'?<div ref={modal} tabIndex={-1} role="dialog" aria-modal="true" aria-label={tx("Car filters")} {...stylex.props(s.filterOverlay)}><header {...stylex.props(s.filterHeader)}><button type="button" aria-label={tx("Close filters")} onClick={close} {...stylex.props(s.close)}><X size={29} strokeWidth={1.8}/></button><h2 {...stylex.props(s.filterTitle)}>{tx("FILTERS")}</h2></header><div {...stylex.props(s.filterBody)}><nav ref={railRef} aria-label={tx("Filter categories")} {...stylex.props(s.rail)}>{tabs.map(tab=><button type="button" key={tab} aria-pressed={tab===active} onClick={()=>setActive(tab)} {...stylex.props(s.railButton,tab===active&&s.railActive)}>{tx(tab)}</button>)}</nav><section {...stylex.props(s.pane)}><NativeFilterPane key={active} active={active} filters={filters} update={setFilters}/></section></div><footer {...stylex.props(s.filterFooter)}><button type="button" onClick={reset} aria-label={tx("CLEAR ALL")} {...stylex.props(s.clear)}><span {...stylex.props(s.desktopFilterLabel)}>{tx("CLEAR ALL")}</span><span {...stylex.props(s.mobileFilterLabel)}>{tx("Clear")}</span></button><button type="button" onClick={close} aria-label={`${tx("Show")} ${count} ${tx(count===1?'car':'cars')}`} {...stylex.props(s.show)}><span {...stylex.props(s.desktopFilterLabel)}>{tx("SHOW ")}{tx(count)} {tx(" CARS")}</span><span {...stylex.props(s.mobileFilterLabel)}>{tx("Show")} {count} {tx(count===1?'car':'cars')}</span></button></footer></div>:null}
  {overlay==='sort'?<div {...stylex.props(s.sortBackdrop)} onMouseDown={e=>e.target===e.currentTarget&&close()}><div ref={modal} tabIndex={-1} role="dialog" aria-modal="true" aria-label={tx("Sort cars")} {...stylex.props(s.sortSheet)}><i {...stylex.props(s.handle)}/>{sortGroups.map(group=><section key={group.title||'default'} {...stylex.props(s.sortGroup)}>{group.title?<h3 {...stylex.props(s.sortCaption)}>{tx(group.title)}</h3>:null}{group.items.map(([label,value])=><label key={value} {...stylex.props(s.sortRow)}><input type="radio" name="sort" aria-label={tx(group.title?`${group.title}: ${label}`:label)} checked={sort===value} onChange={()=>{setSort(value);close();}}/><span>{tx(label)}{value==='default'?<span {...stylex.props(s.muted)}> {tx(" (DEFAULT)")}</span>:null}</span></label>)}</section>)}</div></div>:null}
  <LoginSheet open={login} onClose={()=>setLogin(false)}/>
 </div>;
}

function CheckRow({label,checked,onChange,plain=false,radio}: {label:string;checked:boolean;onChange:()=>void;plain?:boolean;radio?:string}){
  const tx = useCopy();
return <label {...stylex.props(s.option,plain&&s.optionPlain)}><input type={radio?'radio':'checkbox'} name={radio} checked={checked} onChange={onChange}/><span>{tx(label)}</span></label>;}
function toggle(values:string[],value:string){return values.includes(value)?values.filter(item=>item!==value):[...values,value];}
function titleCase(value:string){return value.toLowerCase().replace(/(^|\s)\S/g,letter=>letter.toUpperCase());}
function discount(car:Vehicle){return (car.previousPrice??car.price)-car.price;}
const s=stylex.create({
 screen:{minHeight:'100vh',paddingBottom:110,backgroundColor:'#fff'},
 topInner:{maxWidth:$.content,marginInline:'auto',paddingTop:4,paddingInline:{[media.mobile]:12,default:28}},
 roundButton:{display:'grid',placeItems:'center',width:44,height:44,color:$.ink,borderRadius:'50%',backgroundColor:'#f4f4f5'},
 search:{display:'flex',alignItems:'center',gap:10,minHeight:46,marginTop:0,paddingInline:14,color:$.muted,borderRadius:12,backgroundColor:'#f4f4f5'},
 input:{width:'100%',minWidth:0,padding:0,color:$.muted,fontSize:15,fontWeight:400,borderWidth:0,outlineStyle:'none',backgroundColor:'transparent'},
 toolbar:{display:'flex',position:'sticky',top:{[media.desktop]:141,default:'calc(68px + env(safe-area-inset-top))'},zIndex:45,gap:8,overflowX:'auto',overscrollBehaviorX:'contain',maxWidth:$.content,marginInline:'auto',paddingBlock:{[media.mobile]:8,default:12},paddingInline:{[media.mobile]:12,default:28},backgroundColor:'#fff',scrollbarWidth:'none'},
 content:{display:'grid',gridTemplateColumns:{[media.desktop]:'245px minmax(0,1fr)',default:'1fr'},gap:24,maxWidth:$.content,marginInline:'auto',paddingTop:10,paddingInline:{[media.mobile]:12,default:28},paddingBottom:80},
 sidebar:{display:{[media.desktop]:'block',default:'none'},alignSelf:'start',position:'sticky',top:150,padding:18,borderColor:$.line,borderStyle:'solid',borderWidth:1,borderRadius:18},
 sideTitle:{fontSize:20,fontWeight:500},
 results:{minWidth:0},
 luxeBrands:{marginTop:-2,marginBottom:28},
 sample:{fontSize:11,color:$.muted,whiteSpace:'nowrap'},
 clearSearch:{display:'grid',placeItems:'center',flexShrink:0,width:36,height:40,padding:0,color:$.muted,borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
 resultHeading:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:14},
 resultTitle:{fontSize:18,fontWeight:600,color:$.ink,letterSpacing:'-.025em'},
 grid:{display:'grid',gridTemplateColumns:{[media.mobile]:'1fr',default:'repeat(2,minmax(0,1fr))'},gap:13},
 empty:{display:'flex',alignItems:'center',flexDirection:'column',gap:16,padding:'50px 20px',textAlign:'center',color:$.muted},
 reset:{display:'block',width:'100%',minHeight:40,marginTop:20,color:$.violet,fontSize:14,fontWeight:500,borderColor:$.violet,borderWidth:1,borderStyle:'solid',borderRadius:9,backgroundColor:'#fff',cursor:'pointer'},
 filterOverlay:{display:'flex',flexDirection:'column',position:'fixed',inset:0,zIndex:200,color:$.ink,backgroundColor:'#fff',outlineStyle:'none'},
 filterHeader:{display:'flex',alignItems:'center',flexShrink:0,gap:21,height:{[media.mobile]:'calc(68px + env(safe-area-inset-top))',default:114},paddingTop:{[media.mobile]:'env(safe-area-inset-top)',default:45},paddingInline:{[media.mobile]:12,default:22},boxShadow:'0 9px 18px rgba(0,0,0,.08)',zIndex:1},
 close:{display:'grid',placeItems:'center',width:44,height:44,padding:0,color:$.ink,borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
 filterTitle:{fontSize:18,fontWeight:600},
 filterBody:{display:{[media.mobile]:'flex',default:'grid'},flexDirection:{[media.mobile]:'column',default:'row'},gridTemplateColumns:'35.4% minmax(0,1fr)',flexGrow:1,minHeight:0,overflow:'hidden'},
 rail:{display:{[media.mobile]:'flex',default:'block'},flexShrink:0,overflowX:{[media.mobile]:'auto',default:'hidden'},overflowY:{[media.mobile]:'hidden',default:'auto'},backgroundColor:'#f7f7f7',scrollbarWidth:'none'},
 railButton:{display:'block',flexShrink:0,width:{[media.mobile]:'auto',default:'100%'},minHeight:{[media.mobile]:48,default:57},paddingInline:13,textAlign:'left',color:'#535353',fontSize:13,fontWeight:500,whiteSpace:{[media.mobile]:'nowrap',default:'normal'},borderWidth:0,borderBottomColor:'#fff',borderBottomStyle:'solid',borderBottomWidth:1,backgroundColor:'transparent',cursor:'pointer'},
 railActive:{color:'#202024',borderBottomColor:{[media.mobile]:'#202024',default:'#fff'},borderBottomWidth:{[media.mobile]:2,default:1},backgroundColor:'#fff'},
 pane:{minWidth:0,minHeight:0,flexGrow:1,overflowY:'auto',padding:{[media.mobile]:'16px 18px 22px',default:'18px 20px 22px 19px'}},
 brandSearch:{display:'flex',alignItems:'center',gap:9,minHeight:44,paddingInline:11,color:$.ink,borderColor:'#c4c4c4',borderStyle:'solid',borderWidth:1,borderRadius:7},
 option:{display:'flex',alignItems:'center',gap:9,minHeight:43,color:'#535353',fontSize:13,fontWeight:400,lineHeight:1.35,borderBottomColor:'#e9e9e9',borderBottomStyle:'solid',borderBottomWidth:1,cursor:'pointer'},
 optionPlain:{minHeight:38,borderBottomWidth:0},
 filterFooter:{display:'grid',gridTemplateColumns:{[media.mobile]:'88px minmax(0,1fr)',default:'34% minmax(0,1fr)'},flexShrink:0,gap:8,minHeight:{[media.mobile]:60,default:94},paddingTop:{[media.mobile]:8,default:14},paddingBottom:{[media.mobile]:'calc(8px + env(safe-area-inset-bottom))',default:34},paddingInline:{[media.mobile]:12,default:22},borderTopColor:'#f0f0f0',borderTopStyle:'solid',borderTopWidth:1,backgroundColor:'#fff'},
 clear:{minHeight:{[media.mobile]:44,default:'auto'},padding:0,color:'#9d9d9d',fontSize:14,fontWeight:600,borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
 show:{minHeight:{[media.mobile]:44,default:48},paddingInline:10,color:'#fff',fontSize:{[media.mobile]:14,default:16},fontWeight:600,whiteSpace:'nowrap',borderWidth:0,borderRadius:8,backgroundColor:$.violet,cursor:'pointer'},
 desktopFilterLabel:{display:{[media.mobile]:'none',default:'inline'}},
 mobileFilterLabel:{display:{[media.mobile]:'inline',default:'none'}},
 sortBackdrop:{display:'flex',alignItems:'flex-end',justifyContent:'center',position:'fixed',inset:0,zIndex:205,paddingBottom:24,backgroundColor:'rgba(0,0,12,.80)'},
 sortSheet:{width:'100%',maxWidth:650,maxHeight:'calc(100dvh - 100px)',overflowY:'auto',padding:'13px 22px 13px',borderRadius:'23px 23px 10px 10px',color:$.ink,backgroundColor:'#fff',outlineStyle:'none'},
 handle:{display:'block',width:46,height:3,marginInline:'auto',marginBottom:24,backgroundColor:'#9d9d9d'},
 sortGroup:{paddingTop:15,paddingBottom:15,borderBottomColor:'#e7e7e7',borderBottomStyle:'solid',borderBottomWidth:1},
 sortCaption:{marginBottom:15,color:'#9d9d9d',fontSize:13,fontWeight:500,lineHeight:'18px'},
 sortRow:{display:'flex',alignItems:'center',gap:13,minHeight:34,fontSize:16,fontWeight:500,lineHeight:'22px',cursor:'pointer'},
 muted:{color:'#9d9d9d'},
});
