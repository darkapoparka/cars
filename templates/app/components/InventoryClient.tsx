'use client';
import {useCopy} from '@/lib/locale';
import {useDeferredValue,useEffect,useLayoutEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Heart,Search,X} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import IconButton from '@/components/IconButton';
import FilterPill from '@/components/FilterPill';
import VehicleCard from '@/components/VehicleCard';
import LoginSheet from '@/components/DealerEnquirySheet';
import {BrandEmblem,BrandRow} from '@/components/ReferenceUI';
import {useModal} from '@/components/useModal';
import {vehicles,type Vehicle} from '@/lib/data';
import {dealer} from '@/lib/dealer-config';
import NativeFilterPane from '@/components/NativeFilterPane';
import DealerHomeBanner from '@/components/DealerHomeBanner';
import LandingContentFrame, {landingContent} from '@/components/LandingContentFrame';
import DesktopInventoryFilters, {DesktopAppliedFilters, type DesktopQuickFilter} from '@/components/DesktopInventoryFilters';
import DesktopSortMenu from '@/components/DesktopSortMenu';
import ShowroomSearchSheet from '@/components/ShowroomSearchSheet';
import type {SearchChoice} from '@/components/SearchClient';
import {useInventoryHistory} from '@/components/useInventoryHistory';
import {filterTabs as standardTabs,desktopFilterTabs,quickFilterTabs,filterMakes as makes,emptyFilters,hasActiveFilters,matchesInventory as matches,matchesMonthlyPayment,type Filters,type FilterTab as Tab} from '@/lib/inventory-filters';
import {media,tokens as $} from '@/app/tokens.stylex';
import {searchField} from '@/components/search-field.stylex';
import {pillStyles as pill} from '@/components/pill.stylex';
import DesktopFilterNavigation from '@/components/DesktopFilterNavigation';
import {clearDesktopFilter,desktopFilterCount,desktopFilterHelp,desktopFilterTitles} from '@/lib/desktop-filter-ui';

const sortGroups=[{title:'',items:[['Best match','default'],['Recently added','recent']]},{title:'Discount',items:[['High to low','discount']]},{title:'Price',items:[['Low to high','price-asc'],['High to low','price-desc']]},{title:'Mileage',items:[['Low to high','kms-asc'],['High to low','kms-desc']]},{title:'Car age',items:[['Oldest first','age-asc'],['Newest first','age-desc']]}] as const;
type Props={initialEmiMax?:number;initialQuery?:string;initialBrand?:string;initialBody?:string;initialPriceMax?:number;initialFilters?:Filters;initialSort?:string;initialOverlay?:'filters'|'sort'|null;initialOpen?:string|null;variant?:'standard'|'luxe';presentation?:'page'|'home'};

export default function InventoryClient({initialEmiMax,initialQuery='',initialBrand='',initialBody='',initialPriceMax,initialFilters,initialSort='default',initialOverlay=null,initialOpen=null,variant='standard',presentation='page'}:Props){
  const tx = useCopy();

 const luxe=variant==='luxe';
 const home=presentation==='home';
 const tabs:readonly Tab[]=home?desktopFilterTabs:standardTabs;
 const [query,setQuery]=useState(initialQuery);
 const [filterRevision,setFilterRevision]=useState(0);
 const deferredQuery=useDeferredValue(query);
 const [emiMax,setEmiMax]=useState(initialEmiMax);
 const [filters,setFilters]=useState<Filters>(()=>{
  if(initialFilters)return initialFilters;
  const defaults=emptyFilters();
  return {...defaults,brands:initialBrand?[initialBrand]:[],bodies:initialBody?[initialBody.toUpperCase()]:[],maximum:initialPriceMax!==undefined&&Number.isFinite(initialPriceMax)?Math.max(defaults.minimum,Math.min(defaults.maximum,initialPriceMax)):defaults.maximum};
 });
 const [sort,setSort]=useState(initialSort);
 const [overlay,setOverlay]=useState<'filters'|'sort'|'search'|null>(initialOpen?'filters':initialOverlay);
 const [active,setActive]=useState<Tab>(tabs.includes(initialOpen?.toUpperCase() as Tab)?initialOpen!.toUpperCase() as Tab:'BRAND');
 const [keywordPane,setKeywordPane]=useState(false);
 const [login,setLogin]=useState(false);
 const [brandSearch,setBrandSearch]=useState('');
 const [quickFilter,setQuickFilter]=useState<DesktopQuickFilter|null>(null);
 const railRef=useRef<HTMLElement>(null);
 const quickFiltersRef=useRef<HTMLElement>(null);
 const mobileFiltersRef=useRef<HTMLElement>(null);
 const previousOverlay=useRef(overlay);
 const sheetSelection=useRef({filters,query,emiMax});
 const resultsRef=useRef<HTMLElement>(null);
 useInventoryHistory({query,filters,sort,emiMax},{setQuery,setFilters,setSort,setEmiMax},home,overlay!==null);
 useEffect(()=>{const pop=()=>setOverlay(null);window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop);},[]);
 const results=useMemo(()=>{
  const items=vehicles.filter(car=>(!luxe||car.tier==='Luxe'||car.slug==='2024-toyota-fortuner-exr')&&matchesMonthlyPayment(car,emiMax)&&matches(car,filters,deferredQuery));
  return [...items].sort((a,b)=>sort==='price-asc'?a.price-b.price:sort==='price-desc'?b.price-a.price:sort==='kms-asc'?a.mileage-b.mileage:sort==='kms-desc'?b.mileage-a.mileage:sort==='discount'?discount(b)-discount(a):sort==='age-asc'?a.year-b.year:sort==='age-desc'||sort==='recent'?b.year-a.year:0);
 },[filters,deferredQuery,sort,luxe,emiMax]);
 const filtered=Boolean(emiMax!==undefined||query.trim()||hasActiveFilters(filters));
 // Counts always reflect the inventory actually shown.
 const count=results.length;
 const defaults=emptyFilters();
 const quickSelection={BRAND:filters.brands.length>0,MODEL:filters.models.length>0,BUDGET:filters.budget.length>0||filters.minimum!==defaults.minimum||filters.maximum!==defaults.maximum,DISCOUNTS:Boolean(filters.extra.DISCOUNTS?.length),YEAR:Boolean(filters.year)||filters.yearMinimum!==defaults.yearMinimum||filters.yearMaximum!==defaults.yearMaximum,MILEAGE:Boolean(filters.mileage)||filters.mileageMinimum!==defaults.mileageMinimum||filters.mileageMaximum!==defaults.mileageMaximum,'BODY TYPE':filters.bodies.length>0,'FUEL TYPE':filters.fuel.length>0};
 useLayoutEffect(()=>{if(overlay!=='filters')return;const rail=railRef.current;const selected=[...(rail?.querySelectorAll<HTMLElement>('[aria-pressed="true"]')??[])].find(button=>button.getClientRects().length>0);if(rail&&selected&&window.innerWidth<768)rail.scrollTo({left:Math.max(0,selected.offsetLeft-rail.offsetLeft-12),behavior:'instant'});},[active,overlay]);
 useLayoutEffect(()=>{
   const wasSelectionSheet=previousOverlay.current==='filters'||previousOverlay.current==='search';
   const isSelectionSheet=overlay==='filters'||overlay==='search';
   if(isSelectionSheet&&!wasSelectionSheet)sheetSelection.current={filters,query,emiMax};
   if(wasSelectionSheet&&!isSelectionSheet&&window.innerWidth<768){
     const before=sheetSelection.current;
     if(before.filters!==filters||before.query!==query||before.emiMax!==emiMax)mobileFiltersRef.current?.scrollTo({left:0,behavior:'instant'});
   }
   previousOverlay.current=overlay;
 },[overlay,filters,query,emiMax]);
 function open(kind:'filters'|'sort'|'search',tab?:Tab){setQuickFilter(null);setKeywordPane(false);if(tab)setActive(tab);if(kind==='filters'&&window.matchMedia('(min-width:1100px)').matches&&emiMax!==undefined){setFilters(current=>({...current,emiLimit:current.emiLimit===null?emiMax:Math.min(current.emiLimit,emiMax)}));setEmiMax(undefined);}window.history.pushState({...window.history.state,cars24Overlay:kind},'');setOverlay(kind);}
 function close(){if(window.history.state?.cars24Overlay)window.history.back();else setOverlay(null);}
 function applySearch(choice:SearchChoice){setQuery(choice.query??'');if(choice.brand||choice.body)setFilters(current=>({...current,...(choice.brand?{brands:[choice.brand],models:[]}:{}),...(choice.body?{bodies:[choice.body.toUpperCase()]}:{})}));close();}
 function reset(){setQuickFilter(null);if(window.matchMedia('(min-width:1100px)').matches)setFilterRevision(revision=>revision+1);setFilters(emptyFilters());setQuery('');setEmiMax(undefined);}
 function countMatches(next:Filters){return vehicles.filter(car=>(!luxe||car.tier==='Luxe'||car.slug==='2024-toyota-fortuner-exr')&&matchesMonthlyPayment(car,emiMax)&&matches(car,next,deferredQuery)).length;}
 function showFilteredResults(){const invalid=[...(modal.current?.querySelectorAll<HTMLInputElement>('input[aria-invalid="true"]')??[])].find(input=>input.getClientRects().length>0);if(invalid){invalid.focus({preventScroll:true});return;}close();}
 function clearActiveSection(){if(keywordPane)setQuery('');else setFilters(clearDesktopFilter(filters,active));setFilterRevision(revision=>revision+1);}
 function showResults(){const results=resultsRef.current;if(!results)return;results.focus({preventScroll:true});window.scrollTo({top:window.scrollY+results.getBoundingClientRect().top-88,behavior:'instant'});}
 function categoryLabel(tab:Tab){if(tab==='TRANSMISSION')return tx('Gearbox');const label=tx(tab);return label==='EMI'?label:label.charAt(0)+label.slice(1).toLowerCase();}
 const modelMakes=home?[...new Set([...filters.brands,...filters.models.map(model=>model.split('::')[0])])]:undefined;
 const modal=useModal(overlay!==null&&overlay!=='search',close,{history:false});
 const filterBackdrop=(content:ReactNode)=><div {...stylex.props(s.filterBackdrop)} onMouseDown={event=>event.target===event.currentTarget&&close()}>{content}</div>;
 const search=<div role="search" {...stylex.props(!home&&s.topInner)}>{home?<label data-search-field {...stylex.props(searchField.field)}>
    <Search size={22} strokeWidth={2} aria-hidden="true" {...stylex.props(searchField.icon)}/>
    <span {...stylex.props(searchField.editableGroup)}>
      <span {...stylex.props(searchField.inputSlot)}>
        <span data-search-measure aria-hidden="true" {...stylex.props(searchField.inputMeasure)}>{query || tx('Search make or model')}</span>
        <input data-search-input type="search" autoComplete="off" autoCapitalize="none" spellCheck={false} value={query} onChange={e=>setQuery(e.target.value)} placeholder={tx('Search make or model')} aria-label={tx('Search cars')} aria-describedby="inventory-result-count" {...stylex.props(searchField.input, searchField.inlineInput)}/>
      </span>
      <span id="inventory-result-count" data-result-count role="status" aria-live="polite" aria-atomic="true" {...stylex.props(searchField.count)}><span aria-hidden="true">({count})</span><span className="visually-hidden">{count} {tx(count===1?'car':'cars')}</span></span>
    </span>
    {query?<button type="button" aria-label={tx('Clear search')} onClick={()=>setQuery('')} {...stylex.props(searchField.clear)}><X size={18} aria-hidden="true"/></button>:null}
  </label>:<div data-search-field {...stylex.props(searchField.field,s.searchRing)}>
    <button type="button" aria-haspopup="dialog" aria-expanded={overlay==='search'} aria-label={query?`${tx('Search cars')}: ${query}`:tx('Search cars')} aria-describedby="inventory-result-count" onClick={()=>open('search')} {...stylex.props(s.searchEntry)}>
      <Search size={22} strokeWidth={2} aria-hidden="true" {...stylex.props(searchField.icon)}/>
      <span {...stylex.props(searchField.copy)}><span {...stylex.props(s.searchPrompt,!query&&s.searchPlaceholder)}>{query||tx('Search make or model')}</span><span id="inventory-result-count" data-result-count role="status" aria-live="polite" aria-atomic="true" {...stylex.props(searchField.count)}><span aria-hidden="true">({count})</span><span className="visually-hidden">{count} {tx(count===1?'car':'cars')}</span></span></span>
    </button>
    {query?<button type="button" aria-label={tx('Clear search')} onClick={()=>setQuery('')} {...stylex.props(searchField.clear)}><X size={18} aria-hidden="true"/></button>:null}
  </div>}</div>;
 return <div data-desktop-buy-inventory={home?'':undefined} {...stylex.props(s.screen)}>
  {home?<DealerHomeBanner desktopSearch={<DesktopInventoryFilters filters={filters} update={setFilters} count={count} countMatches={countMatches} onShowResults={showResults} onAllFilters={()=>open('filters')} quickFilter={quickFilter} setQuickFilter={setQuickFilter} quickFiltersRef={quickFiltersRef}/>}/>:<><PageHeader compact title={tx(luxe?'Select collection':'Our cars')} action={<IconButton href="/saved" label={tx('Saved cars')} icon={Heart}/>}/>{search}</>}
  {!home?<nav ref={mobileFiltersRef} aria-label={tx("Inventory filters")} {...stylex.props(s.toolbar)}>
    {filtered?<DesktopAppliedFilters mobile filters={filters} update={setFilters} query={query} setQuery={setQuery} emiMax={emiMax} setEmiMax={setEmiMax}/>:null}
    <FilterPill label={tx("Filter")} tone="soft" icon="filter" selected={filtered} onClick={()=>open('filters')}/>
    <FilterPill label={tx("Sort")} mobileLabel={sort==='price-asc'?`${tx('Price')} ↑`:sort==='price-desc'?`${tx('Price')} ↓`:sort==='kms-asc'?`${tx('Mileage')} ↑`:sort==='kms-desc'?`${tx('Mileage')} ↓`:sort==='age-asc'?`${tx('Year')} ↑`:sort==='age-desc'?`${tx('Year')} ↓`:sort==='recent'?tx('Recently added'):sort==='discount'?`${tx('Discount')} ↓`:undefined} tone="soft" icon="sort" selected={sort!=='default'} onClick={()=>open('sort')}/>
    {quickFilterTabs.map(tab=><FilterPill key={tab} label={tx(titleCase(tab))} tone="soft" selected={quickSelection[tab]} onClick={()=>open('filters',tab)}/>)}
  </nav>:null}
  <LandingContentFrame enabled={home}><main data-landing-content={home||undefined} {...stylex.props(home&&landingContent.panel,s.content,home&&s.homeContent)}>{!home?<aside {...stylex.props(s.sidebar)}><div {...stylex.props(s.sidebarHeading)}><h2 {...stylex.props(s.sideTitle)}>{tx('Make')}</h2><button type="button" onClick={()=>open('filters')} {...stylex.props(s.sectionClear)}>{tx('All filters')}</button></div><label data-search-field {...stylex.props(searchField.field,s.sidebarSearch)}><Search size={18} aria-hidden="true" {...stylex.props(searchField.icon)}/><input data-search-input aria-label={tx("Search sidebar brands")} placeholder={tx("Search brand")} autoComplete="off" autoCapitalize="none" spellCheck={false} value={brandSearch} onChange={e=>setBrandSearch(e.target.value)} {...stylex.props(searchField.input)}/></label><div {...stylex.props(s.sidebarOptions)}>{makes.filter(make=>(vehicles.some(car=>car.make===make)||filters.brands.includes(make))&&make.toLowerCase().includes(brandSearch.toLowerCase())).map(make=><label key={make} {...stylex.props(s.sideOption,filters.brands.includes(make)&&s.sideOptionSelected)}><input type="checkbox" className="cars24-filter-checkbox" checked={filters.brands.includes(make)} onChange={()=>setFilters({...filters,brands:toggle(filters.brands,make),models:filters.models.filter(model=>!model.startsWith(`${make}::`))})}/><span {...stylex.props(s.sideEmblem)}><BrandEmblem make={make}/></span><span {...stylex.props(s.sideMake)}>{tx(make)}</span><span aria-hidden="true" {...stylex.props(s.sideCount)}>{countMatches({...clearDesktopFilter(filters,'BRAND'),brands:[make]})}</span></label>)}</div>{brandSearch&&!makes.some(make=>vehicles.some(car=>car.make===make)&&make.toLowerCase().includes(brandSearch.toLowerCase()))?<p role="status" {...stylex.props(s.sidebarEmpty)}>{tx('No brands found')}</p>:null}<button type="button" onClick={reset} {...stylex.props(s.reset)}>{tx("Clear all filters")}</button></aside>:null}
   <section ref={resultsRef} tabIndex={home?-1:undefined} aria-label={tx('Available cars')} aria-busy={query!==deferredQuery} {...stylex.props(s.results)}>
    {home?<><div data-desktop-inventory-toolbar {...stylex.props(s.homeToolbar)}>
      <span data-desktop-result-count role="status" aria-live="polite" aria-atomic="true" {...stylex.props(s.homeCount)}>{count} {tx(count===1?'car':'cars')}</span>
      {filtered?<><DesktopAppliedFilters filters={filters} update={setFilters} query={query} setQuery={setQuery}/><button type="button" onClick={reset} {...stylex.props(pill.control,s.homeReset)}><span {...stylex.props(pill.surface,pill.soft,s.homeResetSurface)}>{tx('Clear all filters')}</span></button></>:null}
      <div {...stylex.props(s.homeSort)}><DesktopSortMenu value={sort} groups={sortGroups} onChange={setSort} onOpen={()=>setQuickFilter(null)}/></div>
    </div></>:null}
    {luxe?<div {...stylex.props(s.luxeBrands)}><BrandRow compact title={tx("Explore by brand")} onSelect={brand=>setFilters({...filters,brands:[brand]})}/></div>:null}
    {results.length?<div {...stylex.props(s.grid,home&&s.homeGrid)}>{results.map(vehicle=><VehicleCard key={vehicle.slug} vehicle={vehicle} desktopTile/>)}</div>:<div {...stylex.props(s.empty)}><Search size={32}/><h3>{tx("No cars match these filters")}</h3><p>{tx("Reset the filters or try a broader search.")}</p><button type="button" onClick={reset} {...stylex.props(s.reset)}>{tx("Reset filters")}</button></div>}
    {dealer.inventoryNotice?<p {...stylex.props(s.inventoryNotice)}>{tx(dealer.inventoryNotice)}</p>:null}
   </section>
  </main></LandingContentFrame>
  {overlay==='filters'?filterBackdrop(<div ref={modal} tabIndex={-1} role="dialog" aria-modal="true" aria-label={tx('Car filters')} {...stylex.props(s.filterOverlay)}>
    <header {...stylex.props(s.filterHeader)}><button type="button" aria-label={tx('Close filters')} onClick={close} {...stylex.props(s.close,s.filterClose)}><X size={21} strokeWidth={1.8}/></button><div {...stylex.props(s.filterHeadingCopy)}><h2 {...stylex.props(s.filterTitle)}><span {...stylex.props(s.phoneTabletContents)}>{tx('Filter')}</span><span {...stylex.props(s.desktopOnly)}>{tx('All filters')}</span></h2></div></header>
    {filtered?<div data-desktop-modal-applied {...stylex.props(s.modalApplied)}><DesktopAppliedFilters filters={filters} update={setFilters} query={query} setQuery={setQuery} emiMax={emiMax} setEmiMax={setEmiMax}/></div>:null}
    <div {...stylex.props(s.filterBody)}>
      <nav ref={railRef} aria-label={tx('Filter categories')} {...stylex.props(s.rail)}>
        <DesktopFilterNavigation filters={filters} active={active} keyword={keywordPane} query={query} onKeyword={()=>setKeywordPane(true)} onSelect={tab=>{setKeywordPane(false);setActive(tab);}}/>
        {tabs.map(tab=><button type="button" key={tab} aria-pressed={tab===active&&!keywordPane} onClick={()=>{setKeywordPane(false);setActive(tab);}} {...stylex.props(s.railButton,s.hideDesktopRailButton,tab===active&&!keywordPane&&s.railActive)}><span {...stylex.props(s.railLabel,tab===active&&!keywordPane&&s.railLabelActive)}>{categoryLabel(tab)}</span></button>)}
      </nav>
      <section id="desktop-filter-pane" data-filter-scroll-pane {...stylex.props(s.pane)}>
        <div {...stylex.props(s.desktopPaneHeading)}><div><h3 {...stylex.props(s.desktopPaneTitle)}>{keywordPane?tx('Search'):tx(desktopFilterTitles[active])}</h3>{!keywordPane&&desktopFilterHelp[active]?<p {...stylex.props(s.paneHelp)}>{tx(desktopFilterHelp[active])}</p>:null}</div>{(keywordPane?query.trim():desktopFilterCount(filters,active))?<button type="button" onClick={clearActiveSection} {...stylex.props(s.sectionClear)}>{tx('Clear')}</button>:null}</div>
        {keywordPane?<div data-desktop-keyword-search {...stylex.props(s.desktopOnly)}><label data-search-field {...stylex.props(searchField.field)}><Search size={20} aria-hidden="true" {...stylex.props(searchField.icon)}/><input data-search-input type="search" autoComplete="off" autoCapitalize="none" spellCheck={false} value={query} onChange={event=>setQuery(event.target.value)} placeholder={tx('Make, model or keyword')} aria-label={tx('Search cars')} {...stylex.props(searchField.input)}/>{query?<button type="button" aria-label={tx('Clear search')} onClick={()=>setQuery('')} {...stylex.props(searchField.clear)}><X size={18} aria-hidden="true"/></button>:null}</label></div>:null}
        <div {...stylex.props(keywordPane&&s.hideDesktopPane)}><NativeFilterPane key={`${active}:${filterRevision}`} active={active} filters={filters} update={setFilters} modelMakes={modelMakes} countMatches={countMatches}/></div>
      </section>
    </div>
    <footer {...stylex.props(s.filterFooter)}><button type="button" onClick={reset} aria-label={tx('CLEAR ALL')} {...stylex.props(s.clear)}><span {...stylex.props(s.desktopOnly)}>{tx('Clear all filters')}</span><span {...stylex.props(s.tabletFilterLabel)}>{tx('CLEAR ALL')}</span><span {...stylex.props(s.mobileFilterLabel)}>{tx('Clear')}</span></button><span data-filter-live-count role="status" aria-live="polite" aria-atomic="true" {...stylex.props(s.filterLiveCount)}>{count} {tx(count===1?'car':'cars')}</span><button type="button" onClick={showFilteredResults} aria-label={`${tx('Show')} ${count} ${tx(count===1?'car':'cars')}`} {...stylex.props(s.show)}><span {...stylex.props(s.desktopOnly)}>{tx('Show')} {count} {tx(count===1?'car':'cars')}</span><span {...stylex.props(s.tabletFilterLabel)}>{tx('SHOW ')}{tx(count)} {tx(' CARS')}</span><span {...stylex.props(s.mobileFilterLabel)}>{tx('Show')} {count} {tx(count===1?'car':'cars')}</span></button></footer>
  </div>):null}
  {overlay==='sort'?<div {...stylex.props(s.sortBackdrop)} onMouseDown={e=>e.target===e.currentTarget&&close()}><div ref={modal} tabIndex={-1} role="dialog" aria-modal="true" aria-label={tx("Sort cars")} {...stylex.props(s.sortSheet)}><i {...stylex.props(s.handle)}/><div {...stylex.props(s.sortHeading)}><h2 {...stylex.props(s.filterTitle)}>{tx("Sort")}</h2><button type="button" aria-label={tx("Close sort")} onClick={close} {...stylex.props(s.close)}><X size={22}/></button></div>{sortGroups.map(group=><section key={group.title||'default'} {...stylex.props(s.sortGroup)}>{group.title?<h3 {...stylex.props(s.sortCaption)}>{tx(group.title)}</h3>:null}{group.items.map(([label,value])=><label key={value} {...stylex.props(s.sortRow)}><input type="radio" name="sort" aria-label={group.title?`${tx(group.title)}: ${tx(label)}`:tx(label)} checked={sort===value} onChange={()=>{setSort(value);close();}}/><span>{tx(label)}</span></label>)}</section>)}</div></div>:null}
  {overlay==='search'?<ShowroomSearchSheet initialQuery={query} onSearch={applySearch} onClose={close} history={false}/>:null}
  <LoginSheet open={login} onClose={()=>setLogin(false)}/>
 </div>;
}

function toggle(values:string[],value:string){return values.includes(value)?values.filter(item=>item!==value):[...values,value];}
function titleCase(value:string){return value.toLowerCase().replace(/(^|\s)\S/g,letter=>letter.toUpperCase());}
function discount(car:Vehicle){return (car.previousPrice??car.price)-car.price;}
const s=stylex.create({
 homeContent:{gridTemplateColumns:'minmax(0,1fr)',paddingTop:16},
 homeGrid:{gridTemplateColumns:'repeat(4,minmax(0,1fr))'},
 homeToolbar:{display:'flex',alignItems:'center',flexWrap:'nowrap',gap:12,minHeight:44,marginBottom:16},
 homeCount:{flexShrink:0,color:$.muted,fontSize:$.desktopSupportSize,fontWeight:400,lineHeight:'20px',whiteSpace:'nowrap'},
 homeSort:{display:'inline-flex',flexShrink:0,marginLeft:'auto'},
 desktopOnly:{display:{[media.desktop]:'block',default:'none'}},
 phoneTabletContents:{display:{[media.desktop]:'none',default:'contents'}},
 hideDesktopRailButton:{display:{[media.mobile]:'flex',[media.desktop]:'none',default:'block'}},
 filterHeadingCopy:{display:{[media.desktop]:'block',default:'contents'}},

 modalApplied:{display:{[media.desktop]:'flex',default:'none'},flexShrink:0,minWidth:0,minHeight:48,padding:'0 24px 8px'},
 desktopPaneHeading:{display:{[media.desktop]:'flex',default:'none'},alignItems:'start',justifyContent:'space-between',gap:12,marginBottom:16},
 paneHelp:{marginTop:6,color:$.muted,fontSize:13,fontWeight:400,lineHeight:'20px'},
 sectionClear:{flexShrink:0,minHeight:40,paddingInline:10,color:$.muted,fontFamily:$.fontSans,fontSize:13,fontWeight:400,whiteSpace:'nowrap',borderWidth:0,borderRadius:8,backgroundColor:{default:'transparent',':hover':$.surfaceAlt},cursor:'pointer'},
 filterLiveCount:{display:{[media.desktop]:'inline',default:'none'},marginLeft:'auto',color:$.muted,fontSize:14,fontWeight:400,whiteSpace:'nowrap'},
 hideDesktopPane:{display:{[media.desktop]:'none',default:'contents'}},
 desktopPaneTitle:{display:{[media.desktop]:'block',default:'none'},margin:0,color:$.ink,fontSize:22,fontWeight:600,lineHeight:'28px'},
 tabletFilterLabel:{display:{[media.tablet]:'inline',default:'none'}},
 filterBackdrop:{display:{[media.desktop]:'flex',default:'contents'},alignItems:'center',justifyContent:'center',position:{[media.desktop]:'fixed',default:'static'},inset:0,zIndex:200,backgroundColor:{[media.desktop]:'rgba(20,20,24,.38)',default:'transparent'}},
 filterClose:{order:{[media.desktop]:1,default:0},marginLeft:{[media.desktop]:'auto',default:0}},
 homeReset:{fontSize:$.desktopSupportSize,fontWeight:400,color:$.muted},
 homeResetSurface:{paddingInline:12,borderColor:'transparent',backgroundColor:{default:'transparent',':hover':$.surfaceAlt}},
 screen:{minHeight:'100vh',paddingBottom:{[media.mobile]:0,default:110},backgroundColor:'#fff'},
 topInner:{maxWidth:$.content,marginInline:'auto',paddingTop:4,paddingInline:{[media.mobile]:12,default:28}},
 searchRing:{outlineOffset:-3},
 searchEntry:{display:'flex',alignItems:'center',flexGrow:1,gap:8,minWidth:0,minHeight:40,padding:0,color:$.ink,fontFamily:$.fontSans,fontSize:16,fontWeight:400,lineHeight:1.5,textAlign:'left',borderWidth:0,backgroundColor:'transparent',outlineStyle:'none',cursor:'pointer'},
 searchPrompt:{minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'},
 searchPlaceholder:{color:$.muted},
 toolbar:{display:'flex',position:'sticky',top:{[media.mobile]:'calc(56px + env(safe-area-inset-top))',[media.desktop]:137,default:'calc(68px + env(safe-area-inset-top))'},zIndex:45,gap:{[media.mobile]:8,default:6},overflowX:'auto',overscrollBehaviorX:'contain',maxWidth:$.content,marginInline:'auto',paddingTop:{[media.mobile]:$.mobilePillGap,default:12},paddingBottom:{[media.mobile]:0,default:12},paddingInline:{[media.mobile]:12,default:28},backgroundColor:'#fff',scrollbarWidth:'none'},
 content:{display:'grid',gridTemplateColumns:{[media.desktop]:'245px minmax(0,1fr)',default:'1fr'},gap:24,maxWidth:$.content,marginInline:'auto',paddingTop:{[media.mobile]:$.mobilePillGap,default:10},paddingInline:{[media.mobile]:12,default:28},paddingBottom:{[media.mobile]:16,default:80}},
 sidebar:{display:{[media.desktop]:'flex',default:'none'},flexDirection:'column',alignSelf:'start',position:'sticky',top:200,maxHeight:'calc(100dvh - 224px)',padding:12,borderColor:$.line,borderStyle:'solid',borderWidth:1,borderRadius:14,overflow:'hidden'},
 sidebarHeading:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,marginBottom:10},
 sideTitle:{fontSize:16,fontWeight:600},
 sidebarSearch:{flexShrink:0,marginBottom:10},
 sidebarOptions:{minHeight:0,overflowY:'auto',overscrollBehaviorY:'contain',scrollbarWidth:'thin'},
 sideOption:{display:'flex',alignItems:'center',gap:8,minHeight:44,paddingInline:6,color:$.ink,fontSize:14,fontWeight:400,borderRadius:8,backgroundColor:{default:'transparent',':hover':$.surfaceAlt},cursor:'pointer'},
 sideOptionSelected:{backgroundColor:$.surfaceAlt},
 sideEmblem:{flexShrink:0,width:24,height:24},
 sideMake:{minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'},
 sideCount:{flexShrink:0,marginLeft:'auto',color:$.muted,fontSize:12,fontVariantNumeric:'tabular-nums'},
 sidebarEmpty:{paddingBlock:12,color:$.muted,fontSize:13},
 results:{minWidth:0},
 luxeBrands:{marginTop:-2,marginBottom:28},
 inventoryNotice:{marginTop:20,paddingTop:16,color:$.muted,fontSize:{[media.desktop]:$.desktopSupportSize,default:13},lineHeight:'20px',},
 grid:{display:'grid',gridTemplateColumns:{[media.mobile]:'1fr','@media (min-width: 1100px) and (max-width: 1399px)':'repeat(3,minmax(0,1fr))','@media (min-width: 1400px)':'repeat(4,minmax(0,1fr))',default:'repeat(2,minmax(0,1fr))'},gap:{[media.mobile]:$.mobileSectionGap,default:13}},
 empty:{display:'flex',alignItems:'center',flexDirection:'column',gap:16,padding:'50px 20px',textAlign:'center',color:$.muted},
 reset:{display:'block',width:'100%',minHeight:44,marginTop:20,color:$.violet,fontSize:14,fontWeight:500,borderColor:$.violet,borderWidth:1,borderStyle:'solid',borderRadius:12,backgroundColor:'#fff',cursor:'pointer'},
 filterOverlay:{display:'flex',flexDirection:'column',position:{[media.desktop]:'relative',default:'fixed'},inset:{[media.desktop]:'auto',default:0},zIndex:200,width:{[media.desktop]:'calc(100% - 64px)',default:'auto'},maxWidth:{[media.desktop]:1040,default:'none'},height:{[media.desktop]:'min(760px,calc(100dvh - 64px))',default:'auto'},borderRadius:{[media.desktop]:20,default:0},overflow:{[media.desktop]:'hidden',default:'visible'},boxShadow:{[media.desktop]:$.shadowStrong,default:'none'},color:$.ink,backgroundColor:'#fff',outlineStyle:'none'},
 filterHeader:{display:'flex',alignItems:'center',flexShrink:0,gap:12,height:{[media.mobile]:'calc(68px + env(safe-area-inset-top))',[media.desktop]:88,default:114},paddingTop:{[media.mobile]:'env(safe-area-inset-top)',[media.desktop]:0,default:45},paddingInline:{[media.mobile]:12,[media.desktop]:24,default:22},zIndex:1},
 close:{display:'grid',placeItems:'center',width:44,height:44,padding:0,color:$.ink,borderWidth:0,borderRadius:'50%',backgroundColor:$.surfaceAlt,cursor:'pointer'},
 filterTitle:{fontSize:18,fontWeight:600},
 filterBody:{display:{[media.mobile]:'flex',default:'grid'},flexDirection:{[media.mobile]:'column',default:'row'},gridTemplateColumns:{[media.desktop]:'224px minmax(0,1fr)',default:'35.4% minmax(0,1fr)'},flexGrow:1,minHeight:0,overflow:'hidden'},
 rail:{display:{[media.mobile]:'flex',default:'block'},flexShrink:0,gap:8,overflowX:{[media.mobile]:'auto',default:'hidden'},overflowY:{[media.mobile]:'hidden',default:'auto'},paddingBlock:{[media.mobile]:4,[media.desktop]:12,default:0},paddingInline:{[media.mobile]:12,[media.desktop]:12,default:0},backgroundColor:{[media.mobile]:'#fff',default:'#f7f7f7'},scrollbarWidth:{[media.desktop]:'thin',default:'none'}},
 railButton:{display:{[media.mobile]:'flex',default:'block'},alignItems:'center',flexShrink:0,width:{[media.mobile]:'auto',default:'100%'},minHeight:{[media.mobile]:44,[media.desktop]:44,default:57},paddingInline:{[media.mobile]:0,default:14},textAlign:'left',color:$.ink,fontFamily:$.fontSans,fontSize:14,fontWeight:{[media.desktop]:400,default:500},whiteSpace:{[media.mobile]:'nowrap',default:'normal'},borderWidth:0,borderRadius:{[media.mobile]:9999,[media.desktop]:8,default:0},backgroundColor:'transparent',outlineOffset:{[media.mobile]:-5,default:null},cursor:'pointer'},
 railActive:{color:{[media.mobile]:'#fff',[media.desktop]:'#fff',default:$.ink},backgroundColor:{[media.mobile]:'transparent',[media.desktop]:$.ink,default:'#fff'},outlineColor:{[media.mobile]:{default:null,':focus-visible':'#fff'},default:null}},
 // A smaller visible pill keeps the full mobile tap target.
 railLabel:{display:{[media.mobile]:'inline-flex',default:'contents'},alignItems:'center',justifyContent:'center',minHeight:36,paddingInline:12,fontSize:{[media.mobile]:13,default:'inherit'},lineHeight:{[media.mobile]:'20px',default:'inherit'},borderRadius:9999,backgroundColor:{[media.mobile]:'#f4f4f5',default:'transparent'}},
 railLabelActive:{backgroundColor:{[media.mobile]:$.ink,default:null}},
 pane:{minWidth:0,minHeight:0,flexGrow:1,overflowY:'auto',overscrollBehaviorY:'contain',scrollbarWidth:{[media.mobile]:'none',default:'thin'},padding:{[media.mobile]:'8px 12px 22px',[media.desktop]:'24px 28px 28px',default:'18px 20px 22px 19px'}},
 filterFooter:{display:{[media.desktop]:'flex',default:'grid'},alignItems:{[media.desktop]:'center',default:null},justifyContent:'space-between',gridTemplateColumns:{[media.mobile]:'88px minmax(0,1fr)',default:'34% minmax(0,1fr)'},flexShrink:0,gap:{[media.desktop]:16,default:8},minHeight:{[media.mobile]:56,[media.desktop]:76,default:68},paddingTop:{[media.mobile]:6,[media.desktop]:16,default:12},paddingBottom:{[media.mobile]:'calc(6px + env(safe-area-inset-bottom))',[media.desktop]:16,default:'calc(12px + env(safe-area-inset-bottom))'},paddingInline:{[media.mobile]:12,[media.desktop]:24,default:22},borderTopWidth:{[media.desktop]:1,default:0},borderTopStyle:'solid',borderTopColor:$.line,backgroundColor:'#fff'},
 clear:{minHeight:44,paddingInline:10,color:$.ink,fontSize:14,fontWeight:500,borderWidth:0,borderRadius:9999,backgroundColor:$.surfaceAlt,cursor:'pointer'},
 show:{minHeight:44,paddingInline:14,color:'#fff',fontSize:14,fontWeight:600,whiteSpace:'nowrap',borderWidth:0,borderRadius:9999,backgroundColor:$.violet,cursor:'pointer'},
 mobileFilterLabel:{display:{[media.mobile]:'inline',default:'none'}},
 sortBackdrop:{display:'flex',alignItems:'flex-end',justifyContent:'center',position:'fixed',inset:0,zIndex:205,backgroundColor:'rgba(0,0,0,.48)'},
 sortSheet:{width:'100%',maxWidth:650,maxHeight:'calc(100dvh - 48px)',overflowY:'auto',overscrollBehaviorY:'contain',padding:'12px 20px calc(20px + env(safe-area-inset-bottom))',borderRadius:'24px 24px 0 0',color:$.ink,backgroundColor:'#fff',outlineStyle:'none'},
 handle:{display:'block',width:40,height:4,marginInline:'auto',marginBottom:4,borderRadius:9999,backgroundColor:'#d8d8de'},
 sortHeading:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12},
 sortGroup:{paddingTop:12,paddingBottom:12,},
 sortCaption:{marginBottom:4,color:$.muted,fontSize:12,fontWeight:500,lineHeight:'18px'},
 sortRow:{display:'flex',alignItems:'center',gap:12,minHeight:44,fontSize:{[media.desktop]:$.desktopTextSize,default:15},fontWeight:400,lineHeight:{[media.desktop]:'24px',default:'22px'},cursor:'pointer'},
});
