'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import {useEffect,useRef,useState,type TouchEvent} from 'react';
import {dealer,isDealer} from '@/lib/dealer-config';
import {currency} from '@/lib/currency';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import {ArrowRight,Heart,Info,Layers2,Play,Share2,X,MessageCircle} from 'lucide-react';
import BackButton from '@/components/BackButton';
import IconButton from '@/components/IconButton';
import {STORAGE_KEY} from '@/components/VehicleCard';
import VehicleComparison from '@/components/VehicleComparison';
import SimilarVehiclesSheet from '@/components/SimilarVehiclesSheet';
import LoginSheet from '@/components/DealerEnquirySheet';
import VehicleBelowFold from '@/components/VehicleBelowFold';
import VehicleDetailTabs from '@/components/VehicleDetailTabs';
import VehiclePriceSheet from '@/components/DealerPriceSheet';
import VehiclePhotoViewer from '@/components/VehiclePhotoViewer';
import VehicleTourViewer from '@/components/VehicleTourViewer';
import VehicleViewingSheet from '@/components/VehicleViewingSheet';
import {vehicleGallery,type GalleryPhoto} from '@/lib/vehicle-gallery';
import type {ReferenceVehicleDetail} from '@/lib/reference-types';
import {recordVehicleView} from '@/components/useVehicleState';
import {useModal} from '@/components/useModal';
import {formatPrice,type Vehicle} from '@/lib/data';
import {media,tokens as $} from '@/app/tokens.stylex';

type Overlay='price'|'gallery'|'warranty'|'similar'|'tour'|'viewing'|null;
export default function VehicleDetailClient({vehicle,related,reference}: {vehicle:Vehicle;related:Vehicle[];reference?:ReferenceVehicleDetail}){
  const tx = useCopy();

 const sectionRail=useRef<HTMLElement>(null);
 const fortuner=!isDealer&&vehicle.slug==='2024-toyota-fortuner-exr';
 const approvedReference=dealer.referenceClaimsApproved?reference:undefined;
 const primaryImage=reference?.primaryImage??vehicle.image;
 const exteriorThumbnail=reference?.gallery.find(item=>item.label==='Right Side View')?.src??primaryImage;
 const photos=reference?.gallery.length?reference.gallery:vehicleGallery(vehicle);
 const hasDetails=Boolean(approvedReference);
 const gallery=fortuner?[{label:'Exteriors',image:primaryImage,thumbnail:exteriorThumbnail},{label:'Interiors',image:'/reference-assets/fortuner-interior.jpg',thumbnail:photos.find(item=>/Right Side Front Door Cabin/i.test(item.label))?.src},{label:'Features',image:'/reference-assets/fortuner-feature.jpg'},{label:'Exteriors',image:'/reference-assets/fortuner-right.jpg'}]:(reference?.gallery.length?(['Exteriors','Interiors','Features'] as const).flatMap(category=>{const first=(category==='Interiors'?photos.find(p=>/Right Side Front Door Cabin/i.test(p.label)):category==='Features'?photos.find(p=>/Steering Wheel/i.test(p.label)):undefined)??photos.find(p=>p.category===category);return first?[{label:category,image:category==='Exteriors'?primaryImage:first.src,thumbnail:category==='Exteriors'?exteriorThumbnail:first.src}]:[];}):[{label:'Exteriors',image:primaryImage}]);
 const [photo,setPhoto]=useState(0),[saved,setSaved]=useState(false),[login,setLogin]=useState(false),[overlay,setOverlay]=useState<Overlay>(null),[shared,setShared]=useState(''),[scrolled,setScrolled]=useState(false),[activeSection,setActiveSection]=useState('price'),[swipe,setSwipe]=useState<number|null>(null);
 const [gallerySelection,setGallerySelection]=useState<{photos:GalleryPhoto[];index:number}|null>(null);
 const [informationVisible,setInformationVisible]=useState(true);
 const [enquiryIntent,setEnquiryIntent]=useState<'enquiry'|'viewing'>('enquiry');
 const panel=useModal(overlay==='warranty',()=>setOverlay(null));
 const title=`${vehicle.year} ${vehicle.make.toUpperCase()} ${vehicle.model.toUpperCase()} ${vehicle.trim.split(' • ')[0]}`;
 const priceLabel=vehicle.priceOnRequest?tx('Price on request'):`${tx(formatPrice(vehicle.price))} ${tx(currency.code)}`;
 const fee=approvedReference?.convenienceFee??0;
 useEffect(()=>{recordVehicleView(vehicle.slug);},[vehicle.slug]);
 useEffect(()=>{
  function sync(){try{const values=JSON.parse(localStorage.getItem(STORAGE_KEY)??'[]');setSaved(Array.isArray(values)&&values.includes(vehicle.slug));}catch{setSaved(false);}}
  const frame=requestAnimationFrame(()=>{sync();onScroll();});const onScroll=()=>{const showSections=window.innerWidth>=768&&window.scrollY>400;setScrolled(showSections);if(!showSections)return;const sections=['price','overview','features','condition','service-history','car-finance','happy-customers','similar-cars'];const offset=window.innerWidth>=1100?132:60;let active='price';for(const section of sections){const target=document.getElementById(section);if(target&&target.getBoundingClientRect().top<=offset)active=section;}setActiveSection(active);};window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);window.addEventListener('drive24:saved-change',sync);window.addEventListener('storage',sync);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);window.removeEventListener('drive24:saved-change',sync);window.removeEventListener('storage',sync);};
 },[vehicle.slug]);
 useEffect(()=>{const rail=sectionRail.current;const active=rail?.querySelector<HTMLElement>('[aria-current="location"]');if(rail&&active)rail.scrollTo({left:Math.max(0,active.offsetLeft+active.offsetWidth-rail.clientWidth+22),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});},[activeSection,scrolled]);
 function toggleSaved(){try{const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY)??'[]');const items:string[]=Array.isArray(parsed)?parsed:[];const next=items.includes(vehicle.slug)?items.filter(item=>item!==vehicle.slug):[...items,vehicle.slug];localStorage.setItem(STORAGE_KEY,JSON.stringify(next));setSaved(next.includes(vehicle.slug));window.dispatchEvent(new CustomEvent('drive24:saved-change'));}catch{setShared('Your browser could not save this car.');}}
 async function share(){try{if(navigator.share){await navigator.share({title,url:location.href});}else if(navigator.clipboard){await navigator.clipboard.writeText(location.href);setShared('Link copied');}else{setShared(location.href);}}catch(error){if(!(error instanceof DOMException&&error.name==='AbortError'))setShared('Sharing is unavailable in this browser.');}}
 function nextPhoto(direction:number){setPhoto(current=>(current+direction+gallery.length)%gallery.length);}
 function endSwipe(event:TouchEvent){if(swipe!==null&&Math.abs(event.changedTouches[0].clientX-swipe)>40)nextPhoto(event.changedTouches[0].clientX<swipe?1:-1);setSwipe(null);}
 function openPhoto(selectedPhotos:GalleryPhoto[],index=0){setGallerySelection({photos:selectedPhotos,index});setOverlay('gallery');}
 function openEnquiry(intent:'enquiry'|'viewing'='enquiry'){setEnquiryIntent(intent);setLogin(true);}
 function jump(id:string){const target=document.getElementById(id);if(target){const offset=innerWidth>=1100?144:68;window.scrollTo({top:scrollY+target.getBoundingClientRect().top-offset,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});setActiveSection(id);}else if(id==='similar-cars'){setOverlay('similar');}}
 return <div {...stylex.props(s.screen)}>
  <div data-vehicle-gallery {...stylex.props(s.gallery)} onTouchStart={e=>setSwipe(e.touches[0].clientX)} onTouchEnd={endSwipe}>
   <button type="button" onClick={()=>reference?.videoTour&&photo===0?setOverlay('tour'):openPhoto(photos)} aria-label={tx(reference?.videoTour&&photo===0?'Open vehicle video tour':'Open vehicle photo gallery')} {...stylex.props(s.imageButton)}><img src={assetPath(reference?.videoTour&&photo===0?reference.videoTour.poster:gallery[photo].image)} alt={vehicle.imagePlaceholder ? tx('Photo unavailable') : tx(title)} width={1365} height={768} fetchPriority="high" {...stylex.props(s.heroImage,vehicle.imagePlaceholder&&s.placeholderHero)}/>{vehicle.imagePlaceholder?<span {...stylex.props(s.photoUnavailable)}>{tx('Photo unavailable')}</span>:null}{reference?.videoTour&&photo===0?<span aria-hidden="true" {...stylex.props(s.tourShade)}/>:null}{reference?.videoTour&&photo===0?<span {...stylex.props(s.tourPlay)}><Play size={22} fill="currentColor"/></span>:null}</button>
   <nav aria-label={tx('Vehicle actions')} {...stylex.props(s.heroActions)}><BackButton href="/cars" label="Back to cars" tone="photo"/><IconButton icon={Share2} label={tx('Share car')} onClick={share} tone="photo"/></nav>
   <button type="button" onClick={()=>setOverlay('similar')} {...stylex.props(s.similarButton)}><Layers2 size={17} aria-hidden="true"/>{tx("Similar Cars")}</button>
  </div>
  <div {...stylex.props(s.layout)}><main {...stylex.props(s.main)}>
   <header {...stylex.props(s.heading)}><h1 {...stylex.props(s.title)}>{tx(title)}</h1><IconButton icon={Info} label={tx('Price information')} onClick={()=>setOverlay('price')}/></header>
   <section id="price" aria-label={tx("Vehicle price")} {...stylex.props(s.priceCard)}>
     <p {...stylex.props(s.price,vehicle.priceOnRequest&&s.requestPrice)}>{vehicle.priceOnRequest ? tx('Price on request') : <>{tx(formatPrice(vehicle.price))} <span {...stylex.props(s.currency)}>{tx(currency.code)}</span></>}</p>
   </section>
   <VehicleDetailTabs photos={photos} onOpenPhoto={openPhoto} onInformationChange={setInformationVisible}><VehicleBelowFold vehicle={vehicle} reference={approvedReference} equipment={reference?.topFeatures} onLogin={()=>openEnquiry()}/></VehicleDetailTabs>
  </main><aside {...stylex.props(s.desktopBuy,scrolled&&informationVisible&&s.desktopBuyWithSections)}><h2 {...stylex.props(s.sectionTitle)}>{tx(title)}</h2><p {...stylex.props(s.desktopPrice)}>{priceLabel}</p><p {...stylex.props(s.overviewText)}>{tx("Confirm availability and arrange a viewing with the dealer.")}</p><button type="button" onClick={()=>setOverlay('viewing')} {...stylex.props(s.primary)}>{tx("Arrange a viewing")}</button><button type="button" onClick={toggleSaved} aria-label={tx(saved?'Remove from saved cars':'Save car')} aria-pressed={saved} {...stylex.props(s.outline,s.saveAction,s.desktopSave)}><Heart size={18} aria-hidden="true" fill={saved?'currentColor':'none'}/>{tx(saved?'Vehicle saved':'Save vehicle')}</button></aside></div>
  {dealer.referenceClaimsApproved?<VehicleComparison vehicle={vehicle} related={related}/>:null}
  {scrolled&&informationVisible?<nav ref={sectionRail} aria-label={tx("Vehicle sections")} {...stylex.props(s.sectionTabs)}>{[['Price','price'],['Overview','overview'],['Features','features'],['Car Condition','condition'],['Service History','service-history'],...(hasDetails?[['Car finance','car-finance'],['Our happy customers','happy-customers']]:[]),['Similar Cars','similar-cars']].map(([label,id])=><button type="button" key={id} onClick={()=>jump(id)} aria-current={activeSection===id?'location':undefined} {...stylex.props(s.sectionTab,activeSection===id&&s.activeSectionTab)}>{tx(label)}</button>)}</nav>:null}
  <div {...stylex.props(s.floating)}><button type="button" onClick={()=>openEnquiry()} aria-label={tx("Contact the dealer")} {...stylex.props(s.whatsapp)}><span {...stylex.props(s.whatsappInner)}><MessageCircle size={24}/></span></button></div>
  <footer {...stylex.props(s.purchase)}><button type="button" onClick={toggleSaved} aria-label={tx(saved?'Remove from saved cars':'Save car')} aria-pressed={saved} {...stylex.props(s.outline,s.mobileCta,s.mobileSecondary,s.saveAction)}><Heart size={18} aria-hidden="true" fill={saved?'currentColor':'none'}/>{tx(saved?'Vehicle saved':'Save vehicle')}</button><button type="button" onClick={()=>setOverlay('viewing')} aria-label={tx("Arrange a viewing")} {...stylex.props(s.primary,s.mobileCta)}><span {...stylex.props(s.mobileLabel)}>{tx("Viewing")}</span><span {...stylex.props(s.wideLabel)}>{tx("Arrange viewing")}</span></button></footer>
  {shared?<div role="status" {...stylex.props(s.toast)}>{tx(shared)}<button type="button" aria-label={tx("Dismiss sharing message")} onClick={()=>setShared('')} {...stylex.props(s.toastClose)}><X size={17}/></button></div>:null}
  {overlay==='price'?<VehiclePriceSheet vehicle={vehicle} convenienceFee={fee} onClose={()=>setOverlay(null)} onEligibility={()=>{setOverlay(null);openEnquiry();}}/>:null}
  {overlay==='viewing'?<VehicleViewingSheet vehicleTitle={title} onClose={()=>setOverlay(null)} onRequest={()=>{setOverlay(null);openEnquiry('viewing');}}/>:null}
  {overlay==='similar'?<SimilarVehiclesSheet vehicle={vehicle} related={related} onClose={()=>setOverlay(null)}/>:null}
  {overlay==='tour'&&reference?.videoTour?<VehicleTourViewer {...reference.videoTour} onClose={()=>setOverlay(null)}/>:null}
  {overlay==='gallery'?<VehiclePhotoViewer photos={gallerySelection?.photos??photos} initialIndex={gallerySelection?.index??0} onClose={()=>setOverlay(null)}/>:null}
  {overlay==='warranty'?<div {...stylex.props(s.backdrop)} onMouseDown={event=>event.target===event.currentTarget&&setOverlay(null)}><div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={tx("Showroom information")} {...stylex.props(s.sheet)}><header {...stylex.props(s.sheetHeader)}><h2 {...stylex.props(s.sectionTitle)}>{tx("Showroom information")}</h2><button type="button" aria-label={tx("Close vehicle information")} onClick={()=>setOverlay(null)} {...stylex.props(s.close)}><X size={23}/></button></header><p {...stylex.props(s.overviewText)}>{tx("Ask the showroom about availability, vehicle condition and the terms of any warranty.")}</p><p {...stylex.props(s.referenceNote)}>{tx("Demo inventory; contact and booking services are not connected.")}</p><Link href="/benefits/warranty" {...stylex.props(s.inlineButton)}>{tx("Warranty information ")}<ArrowRight size={17}/></Link></div></div>:null}
  <LoginSheet vehicleTitle={title} intent={enquiryIntent} open={login} onClose={()=>setLogin(false)}/>
 </div>;
}
const s=stylex.create({
heroActions:{display:'flex',alignItems:'center',justifyContent:'space-between',position:'absolute',top:'calc(8px + env(safe-area-inset-top))',left:8,right:8,zIndex:1,pointerEvents:'none'},
screen:{paddingTop:0,paddingBottom:{[media.mobile]:'calc(72px + env(safe-area-inset-bottom))',default:130},color:'#202024',backgroundColor:'#fff'},
gallery:{position:'relative',maxWidth:$.content,aspectRatio:'1365/768',marginInline:'auto',overflow:'hidden'},
imageButton:{position:'relative',display:'block',width:'100%',height:'100%',padding:0,borderWidth:0,backgroundColor:'#f5f5f5',cursor:'zoom-in'},
tourShade:{position:'absolute',inset:0,pointerEvents:'none',backgroundImage:'linear-gradient(180deg,rgba(0,0,0,.40),transparent 45%,rgba(0,0,0,.29))'},
tourPlay:{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',display:'grid',placeItems:'center',width:48,height:48,color:'#000',borderRadius:'50%',backgroundColor:'#fff'},
heroImage:{width:'100%',height:'100%',objectFit:'cover'},
placeholderHero:{objectFit:'contain',padding:{[media.mobile]:34,default:72},backgroundColor:'#f0f2f4'},
photoUnavailable:{position:'absolute',left:'50%',bottom:18,transform:'translateX(-50%)',padding:'6px 11px',color:'#555b62',fontSize:11,fontWeight:600,borderRadius:999,backgroundColor:'rgba(255,255,255,.94)'},
similarButton:{display:'inline-flex',alignItems:'center',gap:8,position:'absolute',bottom:9,left:12,minHeight:44,padding:'8px 12px',color:$.ink,fontSize:13,fontWeight:600,borderWidth:0,borderRadius:999,backgroundColor:'#fff',cursor:'pointer'},
layout:{display:'grid',gridTemplateColumns:{[media.desktop]:'minmax(0,1fr) 330px',default:'1fr'},gap:{[media.desktop]:30,default:0},maxWidth:$.content,marginInline:'auto',paddingInline:{[media.mobile]:16,default:28}},
main:{minWidth:0},
heading:{display:'flex',alignItems:'flex-start',gap:8,marginTop:14},
title:{flexGrow:1,minWidth:0,paddingTop:8,fontFamily:$.fontDisplay,fontSize:{[media.mobile]:18,default:27},fontWeight:600,lineHeight:{[media.mobile]:'27px',default:'35px'},overflowWrap:'anywhere'},
priceCard:{marginTop:2},
price:{minWidth:0,fontFamily:$.fontSans,fontSize:{[media.mobile]:26,default:28},fontWeight:600,lineHeight:'36px',whiteSpace:'nowrap'},
requestPrice:{fontSize:18,lineHeight:'24px',whiteSpace:'normal',textAlign:'left'},
currency:{color:$.muted,fontSize:12,fontWeight:500},
overviewText:{marginTop:5,color:'#727272',fontSize:13,fontWeight:400,lineHeight:1.6},
sectionTabs:{display:{[media.mobile]:'none',default:'flex'},position:'fixed',top:{[media.desktop]:73,default:'env(safe-area-inset-top)'},left:0,right:0,zIndex:59,gap:9,overflowX:'auto',padding:'6px 22px 9px',backgroundColor:'#fff',scrollbarWidth:'none'},
sectionTab:{fontFamily:$.fontDisplay,display:'grid',placeItems:'center',flexShrink:0,minHeight:44,padding:'7px 13px',color:'#202024',fontSize:14,lineHeight:'20px',fontWeight:500,borderColor:'#c4c4c4',borderStyle:'solid',borderWidth:1,borderRadius:999,backgroundColor:'#fff',cursor:'pointer'},
activeSectionTab:{color:'#fff',borderColor:'#202024',backgroundColor:'#202024'},
sectionTitle:{fontSize:20,fontWeight:500,lineHeight:'27px'},
referenceNote:{marginTop:16,color:'#727272',fontSize:12,lineHeight:1.6},
inlineButton:{display:'inline-flex',alignItems:'center',gap:8,minHeight:44,marginTop:16,padding:0,color:$.violet,fontSize:14,fontWeight:500,borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
desktopBuy:{display:{[media.desktop]:'block',default:'none'},alignSelf:'start',position:'sticky',top:89,marginTop:25,padding:22,borderColor:'#dddddd',borderStyle:'solid',borderWidth:1,borderRadius:18},
desktopBuyWithSections:{top:148},
desktopSave:{marginTop:8},
desktopPrice:{marginTop:20,fontSize:25,fontWeight:600},
floating:{display:{[media.mobile]:'none',default:'flex'},flexDirection:'column',gap:16,position:'fixed',right:22,bottom:110,zIndex:55},
whatsapp:{display:'grid',placeItems:'center',width:44,height:44,padding:0,color:'#fff',borderColor:'#262629',borderStyle:'solid',borderWidth:1,borderRadius:'50%',backgroundColor:'#fff',cursor:'pointer'},
whatsappInner:{display:'grid',placeItems:'center',width:30,height:30,borderRadius:'50%',backgroundColor:'#262629'},
saveAction:{gap:7},
purchase:{display:{[media.desktop]:'none',default:'grid'},gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:8,position:'fixed',left:0,right:0,bottom:0,zIndex:80,minHeight:{[media.mobile]:52,default:60},padding:{[media.mobile]:'6px 12px calc(6px + env(safe-area-inset-bottom))',default:'8px 18px calc(8px + env(safe-area-inset-bottom))'},borderTopColor:$.line,borderTopStyle:'solid',borderTopWidth:1,backgroundColor:$.surface},
mobileCta:{minHeight:$.controlHeight,fontSize:$.controlFontSize,lineHeight:$.controlLineHeight,whiteSpace:'nowrap',borderRadius:$.radiusSm},
mobileSecondary:{color:$.ink,borderWidth:0,backgroundColor:$.surfaceAlt},
mobileLabel:{display:{[media.mobile]:'inline',default:'none'}},
wideLabel:{display:{[media.mobile]:'none',default:'inline'}},
primary:{fontFamily:$.fontDisplay,display:'flex',alignItems:'center',justifyContent:'center',width:'100%',minHeight:48,paddingInline:10,color:'#fff',fontSize:15,fontWeight:500,borderWidth:1,borderColor:$.violet,borderStyle:'solid',borderRadius:17,backgroundColor:$.violet,cursor:'pointer'},
outline:{fontFamily:$.fontDisplay,display:'flex',alignItems:'center',justifyContent:'center',width:'100%',minHeight:48,paddingInline:10,color:$.violet,fontSize:15,fontWeight:500,borderColor:$.violet,borderStyle:'solid',borderWidth:1,borderRadius:17,backgroundColor:'#f9f9fa',cursor:'pointer'},
toast:{display:'flex',alignItems:'center',gap:12,position:'fixed',left:'50%',bottom:100,zIndex:90,maxWidth:'calc(100vw - 40px)',padding:'14px 18px',transform:'translateX(-50%)',color:'#fff',fontSize:13,borderRadius:12,backgroundColor:'#202024'},
toastClose:{display:'grid',placeItems:'center',width:44,height:44,padding:0,color:'#fff',borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
backdrop:{display:'flex',alignItems:{[media.mobile]:'flex-end',default:'center'},justifyContent:'center',position:'fixed',inset:0,zIndex:205,padding:{[media.mobile]:0,default:24},backgroundColor:'rgba(0,0,0,.6)'},
sheet:{width:'100%',maxWidth:600,maxHeight:'90dvh',overflowY:'auto',padding:'20px 22px 34px',borderRadius:24,backgroundColor:'#fff',outlineStyle:'none'},
sheetHeader:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,marginBottom:20},
close:{display:'grid',placeItems:'center',flexShrink:0,width:44,height:44,padding:0,color:'#202024',borderWidth:0,backgroundColor:'transparent',cursor:'pointer'}
});
