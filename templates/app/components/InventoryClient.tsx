'use client';
import {useCopy} from '@/lib/locale';
import {useDeferredValue,useEffect,useMemo,useRef,useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Heart,Search,X} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import IconButton from '@/components/IconButton';
import FilterPill from '@/components/FilterPill';
import InventoryPromotion from '@/components/InventoryPromotion';
import VehicleCard from '@/components/VehicleCard';
import LoginSheet from '@/components/DealerEnquirySheet';
import {BrandRow} from '@/components/ReferenceUI';
import {useModal} from '@/components/useModal';
import {vehicles,type Vehicle} from '@/lib/data';
import {dealer} from '@/lib/dealer-config';
import NativeFilterPane from '@/components/NativeFilterPane';
import {useInventoryHistory} from '@/components/useInventoryHistory';
import {filterTabs as tabs,quickFilterTabs,filterMakes as makes,emptyFilters,hasActiveFilters,matchesInventory as matches,type Filters,type FilterTab as Tab} from '@/lib/inventory-filters';
import {media,tokens as $} from '@/app/tokens.stylex';
import {searchField} from '@/components/search-field.stylex';

const sortGroups=[{title:'',items:[['Best match','default'],['Recently added','recent']]},{title:'Discount',items:[['High to low','discount']]},{title:'Price',items:[['Low to high','price-asc'],['High to low','price-desc']]},{title:'Mileage',items:[['Low to high','kms-asc'],['High to low','kms-desc']]},{title:'Car age',items:[['Oldest first','age-asc'],['Newest first','age-desc']]}];
type Props={initialEmiMax?:number;initialQuery?:string;initialBrand?:string;initialBody?:string;initialOverlay?:'filters'|'sort'|null;initialOpen?:string|null;variant?:'standard'|'luxe'};

export default function InventoryClient({initialEmiMax,initialQuery='',initialBrand='',initialBody='',initialOverlay=null,initialOpen=null,variant='standard'}:Props){
  const tx = useCopy();

 const luxe=variant==='luxe';
 const [query,setQuery]=useState(initialQuery);
 const deferredQuery=useDeferredValue(query);
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
  const items=vehicles.filter(car=>(!luxe||car.tier==='Luxe'||car.slug==='2024-toyota-fortuner-exr')&&(emiMax===undefined||car.monthly<=emiMax)&&matches(car,filters,deferredQuery));
  return [...items].sort((a,b)=>sort==='price-asc'?a.price-b.price:sort==='price-desc'?b.price-a.price:sort==='kms-asc'?a.mileage-b.mileage:sort==='kms-desc'?b.mileage-a.mileage:sort==='discount'?discount(b)-discount(a):sort==='age-asc'?a.year-b.year:sort==='age-desc'||sort==='recent'?b.year-a.year:0);
 },[filters,deferredQuery,sort,luxe,emiMax]);
 const filtered=Boolean(emiMax!==undefined||query.trim()||hasActiveFilters(filters));
 // Counts always reflect the inventory actually shown.
 const count=results.length;
 const defaults=emptyFilters();
 const quickSelection={BRAND:filters.brands.length>0,MODEL:filters.models.length>0,BUDGET:filters.budget.length>0||filters.minimum!==defaults.minimum||filters.maximum!==defaults.maximum,DISCOUNTS:Boolean(filters.extra.DISCOUNTS?.length),YEAR:Boolean(filters.year)||filters.yearMinimum!==defaults.yearMinimum||filters.yearMaximum!==defaults.yearMaximum,MILEAGE:Boolean(filters.mileage)||filters.mileageMinimum!==defaults.mileageMinimum||filters.mileageMaximum!==defaults.mileageMaximum,'BODY TYPE':filters.bodies.length>0,'FUEL TYPE':filters.fuel.length>0};
 useEffect(()=>{if(overlay!=='filters')return;const rail=railRef.current;const selected=rail?.querySelector<HTMLElement>('[aria-pressed="true"]');if(rail&&selected&&window.innerWidth<768)rail.scrollTo({left:Math.max(0,selected.offsetLeft-rail.offsetLeft-12),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});},[active,overlay]);
 function open(kind:'filters'|'sort',tab?:Tab){if(tab)setActive(tab);window.history.pushState({...window.history.state,cars24Overlay:kind},'');setOverlay(kind);}
 function close(){if(window.history.state?.cars24Overlay)window.history.back();setOverlay(null);}
 function reset(){setFilters(emptyFilters());setQuery('');setEmiMax(undefined);}
 function categoryLabel(tab:Tab){const label=tx(tab);return label==='EMI'?label:label.charAt(0)+label.slice(1).toLowerCase();}
 const modal=useModal(overlay!==null,close,{history:false});
 return <div {...stylex.props(s.screen)}>
  <PageHeader title={tx(luxe?'Select collection':'Our cars')} action={<IconButton href="/saved" label={tx('Saved cars')} icon={Heart}/>}/>
  <div role="search" {...stylex.props(s.topInner)}><label data-search-field {...stylex.props(searchField.field)}>
    <Search size={22} strokeWidth={2} aria-hidden="true" {...stylex.props(searchField.icon)}/>
    <span {...stylex.props(searchField.editableGroup)}>
      <span {...stylex.props(searchField.inputSlot)}>
        <span data-search-measure aria-hidden="true" {...stylex.props(searchField.inputMeasure)}>{query || tx('Search make or model')}</span>
        <input data-search-input type="search" autoComplete="off" autoCapitalize="none" spellCheck={false} value={query} onChange={e=>setQuery(e.target.value)} placeholder={tx('Search make or model')} aria-label={tx('Search cars')} aria-describedby="inventory-result-count" {...stylex.props(searchField.input, searchField.inlineInput)}/>
      </span>
      <span id="inventory-result-count" data-result-count role="status" aria-live="polite" aria-atomic="true" {...stylex.props(searchField.count)}><span aria-hidden="true">({count})</span><span className="visually-hidden">{count} {tx(count===1?'car':'cars')}</span></span>
    </span>
    {query?<button type="button" aria-label={tx('Clear search')} onClick={()=>setQuery('')} {...stylex.props(searchField.clear)}><X size={18} aria-hidden="true"/></button>:null}
  </label></div>
  <InventoryPromotion/>
  <nav aria-label={tx("Inventory filters")} {...stylex.props(s.toolbar)}>
    <FilterPill label={tx("Filter")} icon="filter" selected={filtered} onClick={()=>open('filters')}/>
    <FilterPill label={tx("Sort")} icon="sort" selected={sort!=='default'} onClick={()=>open('sort')}/>
    {quickFilterTabs.map(tab=><FilterPill key={tab} label={tx(titleCase(tab))} selected={quickSelection[tab]} onClick={()=>open('filters',tab)}/>)}
  </nav>
  <main {...stylex.props(s.content)}><aside {...stylex.props(s.sidebar)}><h2 {...stylex.props(s.sideTitle)}>{tx("Filter cars")}</h2><label data-search-field {...stylex.props(searchField.field)}><Search size={18} aria-hidden="true" {...stylex.props(searchField.icon)}/><input data-search-input aria-label={tx("Search sidebar brands")} placeholder={tx("Search brand")} autoComplete="off" autoCapitalize="none" spellCheck={false} value={brandSearch} onChange={e=>setBrandSearch(e.target.value)} {...stylex.props(searchField.input)}/></label>{makes.filter(make=>make.toLowerCase().includes(brandSearch.toLowerCase())).map(make=><CheckRow key={make} label={tx(make)} checked={filters.brands.includes(make)} onChange={()=>setFilters({...filters,brands:toggle(filters.brands,make)})}/>)}<button type="button" onClick={reset} {...stylex.props(s.reset)}>{tx("Clear all filters")}</button></aside>
   <section aria-label={tx('Available cars')} aria-busy={query!==deferredQuery} {...stylex.props(s.results)}>
    {luxe?<div {...stylex.props(s.luxeBrands)}><BrandRow compact title={tx("Explore by brand")} onSelect={brand=>setFilters({...filters,brands:[brand]})}/></div>:null}
    {results.length?<div {...stylex.props(s.grid)}>{results.map(vehicle=><VehicleCard key={vehicle.slug} vehicle={vehicle}/>)}</div>:<div {...stylex.props(s.empty)}><Search size={32}/><h3>{tx("No cars match these filters")}</h3><p>{tx("Reset the filters or try a broader search.")}</p><button type="button" onClick={reset} {...stylex.props(s.reset)}>{tx("Reset filters")}</button></div>}
    {dealer.inventoryNotice?<p {...stylex.props(s.inventoryNotice)}>{tx(dealer.inventoryNotice)}</p>:null}
   </section>
  </main>
  {overlay==='filters'?<div ref={modal} tabIndex={-1} role="dialog" aria-modal="true" aria-label={tx("Car filters")} {...stylex.props(s.filterOverlay)}><header {...stylex.props(s.filterHeader)}><button type="button" aria-label={tx("Close filters")} onClick={close} {...stylex.props(s.close)}><X size={21} strokeWidth={1.8}/></button><h2 {...stylex.props(s.filterTitle)}>{tx("Filter")}</h2></header><div {...stylex.props(s.filterBody)}><nav ref={railRef} aria-label={tx("Filter categories")} {...stylex.props(s.rail)}>{tabs.map(tab=><button type="button" key={tab} aria-pressed={tab===active} onClick={()=>setActive(tab)} {...stylex.props(s.railButton,tab===active&&s.railActive)}>{categoryLabel(tab)}</button>)}</nav><section {...stylex.props(s.pane)}><NativeFilterPane key={active} active={active} filters={filters} update={setFilters}/></section></div><footer {...stylex.props(s.filterFooter)}><button type="button" onClick={reset} aria-label={tx("CLEAR ALL")} {...stylex.props(s.clear)}><span {...stylex.props(s.desktopFilterLabel)}>{tx("CLEAR ALL")}</span><span {...stylex.props(s.mobileFilterLabel)}>{tx("Clear")}</span></button><button type="button" onClick={close} aria-label={`${tx("Show")} ${count} ${tx(count===1?'car':'cars')}`} {...stylex.props(s.show)}><span {...stylex.props(s.desktopFilterLabel)}>{tx("SHOW ")}{tx(count)} {tx(" CARS")}</span><span {...stylex.props(s.mobileFilterLabel)}>{tx("Show")} {count} {tx(count===1?'car':'cars')}</span></button></footer></div>:null}
  {overlay==='sort'?<div {...stylex.props(s.sortBackdrop)} onMouseDown={e=>e.target===e.currentTarget&&close()}><div ref={modal} tabIndex={-1} role="dialog" aria-modal="true" aria-label={tx("Sort cars")} {...stylex.props(s.sortSheet)}><i {...stylex.props(s.handle)}/><div {...stylex.props(s.sortHeading)}><h2 {...stylex.props(s.filterTitle)}>{tx("Sort")}</h2><button type="button" aria-label={tx("Close sort")} onClick={close} {...stylex.props(s.close)}><X size={22}/></button></div>{sortGroups.map(group=><section key={group.title||'default'} {...stylex.props(s.sortGroup)}>{group.title?<h3 {...stylex.props(s.sortCaption)}>{tx(group.title)}</h3>:null}{group.items.map(([label,value])=><label key={value} {...stylex.props(s.sortRow)}><input type="radio" name="sort" aria-label={group.title?`${tx(group.title)}: ${tx(label)}`:tx(label)} checked={sort===value} onChange={()=>{setSort(value);close();}}/><span>{tx(label)}</span></label>)}</section>)}</div></div>:null}
  <LoginSheet open={login} onClose={()=>setLogin(false)}/>
 </div>;
}

function CheckRow({label,checked,onChange,plain=false,radio}: {label:string;checked:boolean;onChange:()=>void;plain?:boolean;radio?:string}){
  const tx = useCopy();
return <label {...stylex.props(s.option,plain&&s.optionPlain)}><input className={radio?'cars24-filter-radio':'cars24-filter-checkbox'} type={radio?'radio':'checkbox'} name={radio} checked={checked} onChange={onChange}/><span>{tx(label)}</span></label>;}
function toggle(values:string[],value:string){return values.includes(value)?values.filter(item=>item!==value):[...values,value];}
function titleCase(value:string){return value.toLowerCase().replace(/(^|\s)\S/g,letter=>letter.toUpperCase());}
function discount(car:Vehicle){return (car.previousPrice??car.price)-car.price;}
const s=stylex.create({
 screen:{minHeight:'100vh',paddingBottom:110,backgroundColor:'#fff'},
 topInner:{maxWidth:$.content,marginInline:'auto',paddingTop:4,paddingInline:{[media.mobile]:12,default:28}},
 toolbar:{display:'flex',position:'sticky',top:{[media.desktop]:141,default:'calc(68px + env(safe-area-inset-top))'},zIndex:45,gap:6,overflowX:'auto',overscrollBehaviorX:'contain',maxWidth:$.content,marginInline:'auto',paddingBlock:{[media.mobile]:6,default:12},paddingInline:{[media.mobile]:12,default:28},backgroundColor:'#fff',scrollbarWidth:'none'},
 content:{display:'grid',gridTemplateColumns:{[media.desktop]:'245px minmax(0,1fr)',default:'1fr'},gap:24,maxWidth:$.content,marginInline:'auto',paddingTop:10,paddingInline:{[media.mobile]:12,default:28},paddingBottom:80},
 sidebar:{display:{[media.desktop]:'block',default:'none'},alignSelf:'start',position:'sticky',top:150,padding:18,borderColor:$.line,borderStyle:'solid',borderWidth:1,borderRadius:18},
 sideTitle:{fontSize:20,fontWeight:500},
 results:{minWidth:0},
 luxeBrands:{marginTop:-2,marginBottom:28},
 inventoryNotice:{marginTop:20,paddingTop:16,color:$.muted,fontSize:13,lineHeight:'20px',borderTopWidth:1,borderTopStyle:'solid',borderTopColor:$.line},
 grid:{display:'grid',gridTemplateColumns:{[media.mobile]:'1fr',default:'repeat(2,minmax(0,1fr))'},gap:13},
 empty:{display:'flex',alignItems:'center',flexDirection:'column',gap:16,padding:'50px 20px',textAlign:'center',color:$.muted},
 reset:{display:'block',width:'100%',minHeight:44,marginTop:20,color:$.violet,fontSize:14,fontWeight:500,borderColor:$.violet,borderWidth:1,borderStyle:'solid',borderRadius:12,backgroundColor:'#fff',cursor:'pointer'},
 filterOverlay:{display:'flex',flexDirection:'column',position:'fixed',inset:0,zIndex:200,color:$.ink,backgroundColor:'#fff',outlineStyle:'none'},
 filterHeader:{display:'flex',alignItems:'center',flexShrink:0,gap:12,height:{[media.mobile]:'calc(68px + env(safe-area-inset-top))',default:114},paddingTop:{[media.mobile]:'env(safe-area-inset-top)',default:45},paddingInline:{[media.mobile]:12,default:22},borderBottomWidth:1,borderBottomStyle:'solid',borderBottomColor:$.line,zIndex:1},
 close:{display:'grid',placeItems:'center',width:44,height:44,padding:0,color:$.ink,borderWidth:0,borderRadius:'50%',backgroundColor:$.surfaceAlt,cursor:'pointer'},
 filterTitle:{fontSize:18,fontWeight:600},
 filterBody:{display:{[media.mobile]:'flex',default:'grid'},flexDirection:{[media.mobile]:'column',default:'row'},gridTemplateColumns:'35.4% minmax(0,1fr)',flexGrow:1,minHeight:0,overflow:'hidden'},
 rail:{display:{[media.mobile]:'flex',default:'block'},flexShrink:0,gap:8,overflowX:{[media.mobile]:'auto',default:'hidden'},overflowY:{[media.mobile]:'hidden',default:'auto'},paddingBlock:{[media.mobile]:8,default:0},paddingInline:{[media.mobile]:12,default:0},backgroundColor:{[media.mobile]:'#fff',default:'#f7f7f7'},scrollbarWidth:'none'},
 railButton:{display:'block',flexShrink:0,width:{[media.mobile]:'auto',default:'100%'},minHeight:{[media.mobile]:44,default:57},paddingInline:14,textAlign:'left',color:$.ink,fontFamily:$.fontSans,fontSize:14,fontWeight:500,whiteSpace:{[media.mobile]:'nowrap',default:'normal'},borderWidth:0,borderBottomColor:'#fff',borderBottomStyle:'solid',borderBottomWidth:{[media.mobile]:0,default:1},borderRadius:{[media.mobile]:9999,default:0},backgroundColor:{[media.mobile]:'#f4f4f5',default:'transparent'},cursor:'pointer'},
 railActive:{color:{[media.mobile]:'#fff',default:$.ink},backgroundColor:{[media.mobile]:$.ink,default:'#fff'}},
 pane:{minWidth:0,minHeight:0,flexGrow:1,overflowY:'auto',overscrollBehaviorY:'contain',scrollbarWidth:{[media.mobile]:'none',default:'thin'},padding:{[media.mobile]:'16px 12px 22px',default:'18px 20px 22px 19px'}},
 option:{display:'flex',alignItems:'center',gap:9,minHeight:44,color:'#535353',fontSize:13,fontWeight:400,lineHeight:1.35,borderBottomColor:'#e9e9e9',borderBottomStyle:'solid',borderBottomWidth:1,cursor:'pointer'},
 optionPlain:{minHeight:44,borderBottomWidth:0},
 filterFooter:{display:'grid',gridTemplateColumns:{[media.mobile]:'88px minmax(0,1fr)',default:'34% minmax(0,1fr)'},flexShrink:0,gap:8,minHeight:{[media.mobile]:60,default:94},paddingTop:{[media.mobile]:8,default:14},paddingBottom:{[media.mobile]:'calc(8px + env(safe-area-inset-bottom))',default:34},paddingInline:{[media.mobile]:12,default:22},borderTopColor:'#f0f0f0',borderTopStyle:'solid',borderTopWidth:1,backgroundColor:'#fff'},
 clear:{minHeight:48,paddingInline:10,color:$.ink,fontSize:14,fontWeight:500,borderWidth:0,borderRadius:9999,backgroundColor:$.surfaceAlt,cursor:'pointer'},
 show:{minHeight:48,paddingInline:14,color:'#fff',fontSize:{[media.mobile]:14,default:16},fontWeight:600,whiteSpace:'nowrap',borderWidth:0,borderRadius:9999,backgroundColor:$.violet,cursor:'pointer'},
 desktopFilterLabel:{display:{[media.mobile]:'none',default:'inline'}},
 mobileFilterLabel:{display:{[media.mobile]:'inline',default:'none'}},
 sortBackdrop:{display:'flex',alignItems:'flex-end',justifyContent:'center',position:'fixed',inset:0,zIndex:205,backgroundColor:'rgba(0,0,0,.48)'},
 sortSheet:{width:'100%',maxWidth:650,maxHeight:'calc(100dvh - 48px)',overflowY:'auto',overscrollBehaviorY:'contain',padding:'12px 20px calc(20px + env(safe-area-inset-bottom))',borderRadius:'24px 24px 0 0',color:$.ink,backgroundColor:'#fff',outlineStyle:'none'},
 handle:{display:'block',width:40,height:4,marginInline:'auto',marginBottom:4,borderRadius:9999,backgroundColor:'#d8d8de'},
 sortHeading:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12},
 sortGroup:{paddingTop:12,paddingBottom:12,borderBottomColor:'#e7e7e7',borderBottomStyle:'solid',borderBottomWidth:1},
 sortCaption:{marginBottom:4,color:$.muted,fontSize:12,fontWeight:500,lineHeight:'18px'},
 sortRow:{display:'flex',alignItems:'center',gap:12,minHeight:44,fontSize:15,fontWeight:400,lineHeight:'22px',cursor:'pointer'},
});
