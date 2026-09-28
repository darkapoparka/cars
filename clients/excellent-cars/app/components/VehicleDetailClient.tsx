'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import {useEffect,useRef,useState,type TouchEvent} from 'react';
import {isDealer} from '@/lib/dealer-config';
import {currency} from '@/lib/currency';
import {useRouter} from '@/lib/navigation';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import {ArrowRight,Heart,Play,Share2,X,MessageCircle} from 'lucide-react';
import {STORAGE_KEY} from '@/components/VehicleCard';
import VehicleComparison from '@/components/VehicleComparison';
import SimilarVehiclesSheet from '@/components/SimilarVehiclesSheet';
import PageHeader from '@/components/PageHeader';
import ShowroomBadge from '@/components/ShowroomBadge';
import LoginSheet from '@/components/DealerEnquirySheet';
import VehicleBelowFold from '@/components/VehicleBelowFold';
import VehiclePriceSheet from '@/components/DealerPriceSheet';
import VehiclePhotoViewer from '@/components/VehiclePhotoViewer';
import VehicleTourViewer from '@/components/VehicleTourViewer';
import {vehicleGallery} from '@/lib/vehicle-gallery';
import type {ReferenceVehicleDetail} from '@/lib/reference-types';
import {recordVehicleView} from '@/components/useVehicleState';
import {useModal} from '@/components/useModal';
import {formatPrice,type Vehicle} from '@/lib/data';
import {media,tokens as $} from '@/app/tokens.stylex';

type Overlay='price'|'emi'|'gallery'|'warranty'|'similar'|'tour'|null;
export default function VehicleDetailClient({vehicle,related,reference}: {vehicle:Vehicle;related:Vehicle[];reference?:ReferenceVehicleDetail}){
  const tx = useCopy();

 const router=useRouter();
 const sectionRail=useRef<HTMLElement>(null);
 const fortuner=!isDealer&&vehicle.slug==='2024-toyota-fortuner-exr';
 const primaryImage=reference?.primaryImage??vehicle.image;
 const exteriorThumbnail=reference?.gallery.find(item=>item.label==='Right Side View')?.src??primaryImage;
 const photos=reference?.gallery.length?reference.gallery:vehicleGallery(vehicle);
 const hasDetails=Boolean(reference)||fortuner;
 const shortlist=reference?.shortListCount??(fortuner?35:undefined);
 const isLuxe=reference?.subcategory?reference.subcategory==='LUXE':vehicle.tier==='Luxe'||fortuner;
 const gallery=fortuner?[{label:'Exteriors',image:primaryImage,thumbnail:exteriorThumbnail},{label:'Interiors',image:'/reference-assets/fortuner-interior.jpg',thumbnail:photos.find(item=>/Right Side Front Door Cabin/i.test(item.label))?.src},{label:'Features',image:'/reference-assets/fortuner-feature.jpg'},{label:'Exteriors',image:'/reference-assets/fortuner-right.jpg'}]:(reference?.gallery.length?(['Exteriors','Interiors','Features'] as const).flatMap(category=>{const first=(category==='Interiors'?photos.find(p=>/Right Side Front Door Cabin/i.test(p.label)):category==='Features'?photos.find(p=>/Steering Wheel/i.test(p.label)):undefined)??photos.find(p=>p.category===category);return first?[{label:category,image:category==='Exteriors'?primaryImage:first.src,thumbnail:category==='Exteriors'?exteriorThumbnail:first.src}]:[];}):[{label:'Exteriors',image:primaryImage}]);
 const [photo,setPhoto]=useState(0),[saved,setSaved]=useState(false),[login,setLogin]=useState(false),[overlay,setOverlay]=useState<Overlay>(null),[shared,setShared]=useState(''),[scrolled,setScrolled]=useState(false),[activeSection,setActiveSection]=useState('price'),[swipe,setSwipe]=useState<number|null>(null);
 const panel=useModal(overlay==='warranty',()=>setOverlay(null));
 const title=`${vehicle.year} ${vehicle.make.toUpperCase()} ${vehicle.model.toUpperCase()} ${vehicle.trim.split(' • ')[0]}`;
 const fee=isDealer?0:reference?.convenienceFee??3500;
 useEffect(()=>{recordVehicleView(vehicle.slug);},[vehicle.slug]);
 useEffect(()=>{
  function sync(){try{const values=JSON.parse(localStorage.getItem(STORAGE_KEY)??'[]');setSaved(Array.isArray(values)&&values.includes(vehicle.slug));}catch{setSaved(false);}}
  const frame=requestAnimationFrame(()=>{sync();onScroll();});const onScroll=()=>{setScrolled(window.scrollY>400);const sections=['price','overview','features','condition','service-history','car-finance','happy-customers','similar-cars'];let active='price';for(const section of sections){const target=document.getElementById(section);if(target&&target.getBoundingClientRect().top<=190)active=section;}setActiveSection(active);};window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('drive24:saved-change',sync);window.addEventListener('storage',sync);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',onScroll);window.removeEventListener('drive24:saved-change',sync);window.removeEventListener('storage',sync);};
 },[vehicle.slug]);
 useEffect(()=>{const rail=sectionRail.current;const active=rail?.querySelector<HTMLElement>('[aria-current="location"]');if(rail&&active)rail.scrollTo({left:Math.max(0,active.offsetLeft+active.offsetWidth-rail.clientWidth+22),behavior:'smooth'});},[activeSection,scrolled]);
 function toggleSaved(){try{const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY)??'[]');const items:string[]=Array.isArray(parsed)?parsed:[];const next=items.includes(vehicle.slug)?items.filter(item=>item!==vehicle.slug):[...items,vehicle.slug];localStorage.setItem(STORAGE_KEY,JSON.stringify(next));setSaved(next.includes(vehicle.slug));window.dispatchEvent(new CustomEvent('drive24:saved-change'));}catch{setShared('Your browser could not save this car.');}}
 async function share(){try{if(navigator.share){await navigator.share({title,url:location.href});}else if(navigator.clipboard){await navigator.clipboard.writeText(location.href);setShared('Link copied');}else{setShared(location.href);}}catch(error){if(!(error instanceof DOMException&&error.name==='AbortError'))setShared('Sharing is unavailable in this browser.');}}
 function nextPhoto(direction:number){setPhoto(current=>(current+direction+gallery.length)%gallery.length);}
 function endSwipe(event:TouchEvent){if(swipe!==null&&Math.abs(event.changedTouches[0].clientX-swipe)>40)nextPhoto(event.changedTouches[0].clientX<swipe?1:-1);setSwipe(null);}
 function backToList(){if(history.length>1)router.back();else router.push('/cars');}
 function jump(id:string){const target=document.getElementById(id);if(target){const offset=innerWidth<1100?(id==='service-history'?179:164):194;window.scrollTo({top:scrollY+target.getBoundingClientRect().top-offset,behavior:'smooth'});setActiveSection(id);}}
 return <div {...stylex.props(s.screen)}><PageHeader title={tx("Car details")} onBack={backToList} backLabel={tx("Back to cars")} action={<button type="button" onClick={share} aria-label={tx("Share car")} {...stylex.props(s.headerAction)}><Share2 size={20}/></button>}/>
  <div {...stylex.props(s.gallery)} onTouchStart={e=>setSwipe(e.touches[0].clientX)} onTouchEnd={endSwipe}>
   <button type="button" onClick={()=>setOverlay(reference?.videoTour&&photo===0?'tour':'gallery')} aria-label={tx(reference?.videoTour&&photo===0?'Open vehicle video tour':'Open vehicle photo gallery')} {...stylex.props(s.imageButton)}><img src={assetPath(reference?.videoTour&&photo===0?reference.videoTour.poster:gallery[photo].image)} alt={tx(title)} width={1365} height={768} fetchPriority="high" {...stylex.props(s.heroImage)}/>{reference?.videoTour&&photo===0?<span aria-hidden="true" {...stylex.props(s.tourShade)}/>:null}{reference?.videoTour&&photo===0?<span {...stylex.props(s.tourPlay)}><Play size={22} fill="currentColor"/></span>:null}</button>
   <button type="button" onClick={()=>setOverlay('similar')} {...stylex.props(s.similarButton)}><span {...stylex.props(s.similarIcon)}/>{tx("VIEW SIMILAR CARS")}</button>
  </div>
  <div {...stylex.props(s.layout)}><main {...stylex.props(s.main)}>
   <nav aria-label={tx("Vehicle photographs")} {...stylex.props(s.photoTabs,Boolean(reference?.videoTour)&&s.fourPhotoTabs)}>{reference?.videoTour?<button type="button" onClick={()=>setOverlay('tour')} {...stylex.props(s.photoTab)}><img src={assetPath(photos.find(item=>item.category==='Interiors')?.src??reference.videoTour.poster)} alt={tx("")} {...stylex.props(s.thumb)}/><span {...stylex.props(s.thumbShade)}/><span {...stylex.props(s.thumbLabel)}>{tx("Video tour")}</span></button>:null}{gallery.slice(0,3).map(tab=><Link key={tab.label} href={`/cars/${vehicle.slug}/gallery?category=${tab.label}`} {...stylex.props(s.photoTab)}><img src={assetPath(('thumbnail' in tab?tab.thumbnail:undefined)??tab.image)} alt={tx("")} {...stylex.props(s.thumb)}/><span {...stylex.props(s.thumbShade)}/><span {...stylex.props(s.thumbLabel)}>{tx(tab.label)}</span></Link>)}</nav>
   <header {...stylex.props(s.heading)}><h1 {...stylex.props(s.title)}>{tx(title)}</h1><p {...stylex.props(s.subtitle)}><span {...stylex.props(s.optionsType)}>{tx(vehicle.specifications || vehicle.fuel)}</span> {tx(" • ")}{tx(formatPrice(vehicle.mileage))} {tx(" km")}</p></header>
   <div {...stylex.props(s.dealer)}><ShowroomBadge premium={isLuxe}/><span>{tx("Showroom collection")}</span></div>
   <section id="price" aria-label={tx("Vehicle price")} {...stylex.props(s.priceCard)}><div {...stylex.props(s.pricePart)}><div {...stylex.props(s.priceLine)}><p {...stylex.props(s.price)}>{vehicle.priceOnRequest ? tx('Price on request') : <><span {...stylex.props(s.currency)}>{tx(currency.code)}</span> {tx(formatPrice(vehicle.price))}</>}</p><button type="button" onClick={()=>setOverlay('price')} {...stylex.props(s.priceLink)}>{tx("Price information")}</button></div><p {...stylex.props(s.fee)}>{tx("Listing sample — confirm price and availability")}</p></div><div {...stylex.props(s.emiPart)}><div {...stylex.props(s.priceLine)}><p {...stylex.props(s.emi)}>{tx("Payment options")}</p><button type="button" onClick={()=>setOverlay('emi')} {...stylex.props(s.priceLink)}>{tx("Example calculator")}</button></div><p {...stylex.props(s.fee)}>{tx("Ask the dealer about terms and availability.")}</p></div></section>
   <VehicleBelowFold vehicle={vehicle} reference={reference} onLogin={()=>setLogin(true)}/>
  </main><aside {...stylex.props(s.desktopBuy)}><h2 {...stylex.props(s.sectionTitle)}>{tx(title)}</h2><p {...stylex.props(s.desktopPrice)}>{tx(currency.code)} {tx(formatPrice(vehicle.price))}</p><p {...stylex.props(s.overviewText)}>{tx("Confirm availability and arrange a viewing with the dealer.")}</p><button type="button" onClick={()=>setLogin(true)} {...stylex.props(s.primary)}>{tx("Arrange a viewing")}</button><button type="button" onClick={()=>setLogin(true)} {...stylex.props(s.outline)}>{tx("Enquire about this car")}</button></aside></div>
  <VehicleComparison vehicle={vehicle} related={related}/>
  {scrolled?<nav ref={sectionRail} aria-label={tx("Vehicle sections")} {...stylex.props(s.sectionTabs)}>{[['Price','price'],['Overview','overview'],['Features','features'],['Car Condition','condition'],['Service History','service-history'],...(hasDetails?[['Car finance','car-finance'],['Our happy customers','happy-customers']]:[]),['Similar Cars','similar-cars']].map(([label,id])=><button type="button" key={id} onClick={()=>jump(id)} aria-current={activeSection===id?'location':undefined} {...stylex.props(s.sectionTab,activeSection===id&&s.activeSectionTab)}>{tx(label)}</button>)}</nav>:null}
  <div {...stylex.props(s.floating)}><button type="button" onClick={()=>setLogin(true)} aria-label={tx("Contact the dealer")} {...stylex.props(s.whatsapp)}><span {...stylex.props(s.whatsappInner)}><MessageCircle size={24}/></span></button><button type="button" onClick={toggleSaved} aria-label={tx(saved?'Remove from saved cars':'Save car')} aria-pressed={saved} {...stylex.props(s.save)}><Heart size={27} strokeWidth={2.7} fill={saved?'currentColor':'none'}/></button></div>
  {scrolled&&shortlist?<p {...stylex.props(s.popularity)}>{tx("🔥")}<span>{tx("Popular: Recently ")}{tx(shortlist)} {tx(" wishlisted this car")}</span></p>:null}
  <footer {...stylex.props(s.purchase)}><button type="button" onClick={()=>setLogin(true)} {...stylex.props(s.outline)}>{tx("Enquire about this car")}</button><button type="button" onClick={()=>setLogin(true)} {...stylex.props(s.primary)}>{tx("Arrange a viewing")}</button></footer>
  {shared?<div role="status" {...stylex.props(s.toast)}>{tx(shared)}<button type="button" aria-label={tx("Dismiss sharing message")} onClick={()=>setShared('')} {...stylex.props(s.toastClose)}><X size={17}/></button></div>:null}
  {overlay==='price'||overlay==='emi'?<VehiclePriceSheet kind={overlay} vehicle={vehicle} convenienceFee={fee} onClose={()=>setOverlay(null)} onEligibility={()=>{setOverlay(null);setLogin(true);}}/>:null}
  {overlay==='similar'?<SimilarVehiclesSheet vehicle={vehicle} related={related} onClose={()=>setOverlay(null)}/>:null}
  {overlay==='tour'&&reference?.videoTour?<VehicleTourViewer {...reference.videoTour} onClose={()=>setOverlay(null)}/>:null}
  {overlay==='gallery'?<VehiclePhotoViewer photos={photos} onClose={()=>setOverlay(null)}/>:null}
  {overlay==='warranty'?<div {...stylex.props(s.backdrop)} onMouseDown={event=>event.target===event.currentTarget&&setOverlay(null)}><div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={tx("Showroom information")} {...stylex.props(s.sheet)}><header {...stylex.props(s.sheetHeader)}><h2 {...stylex.props(s.sectionTitle)}>{tx("Showroom information")}</h2><button type="button" aria-label={tx("Close vehicle information")} onClick={()=>setOverlay(null)} {...stylex.props(s.close)}><X size={23}/></button></header><p {...stylex.props(s.overviewText)}>{tx("Ask the showroom about availability, vehicle condition and the terms of any warranty.")}</p><p {...stylex.props(s.referenceNote)}>{tx("Demo inventory; contact and booking services are not connected.")}</p><Link href="/benefits/warranty" {...stylex.props(s.inlineButton)}>{tx("Warranty information ")}<ArrowRight size={17}/></Link></div></div>:null}
  <LoginSheet vehicleTitle={title} open={login} onClose={()=>setLogin(false)}/>
 </div>;
}
const s=stylex.create({
headerAction:{display:'grid',placeItems:'center',width:44,height:44,padding:0,color:$.ink,borderWidth:0,borderRadius:'50%',backgroundColor:'#f4f4f5',cursor:'pointer'},
screen:{paddingTop:0,paddingBottom:130,color:'#202024',backgroundColor:'#fff'},
gallery:{position:'relative',maxWidth:$.content,aspectRatio:'1365/768',marginInline:'auto',overflow:'hidden'},
imageButton:{position:'relative',display:'block',width:'100%',height:'100%',padding:0,borderWidth:0,backgroundColor:'#f5f5f5',cursor:'zoom-in'},
tourShade:{position:'absolute',inset:0,pointerEvents:'none',backgroundImage:'linear-gradient(180deg,rgba(0,0,0,.40),transparent 45%,rgba(0,0,0,.29))'},
tourPlay:{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',display:'grid',placeItems:'center',width:48,height:48,color:'#000',borderRadius:'50%',backgroundColor:'#fff'},
heroImage:{width:'100%',height:'100%',objectFit:'cover'},
similarButton:{display:'inline-flex',alignItems:'center',gap:5,position:'absolute',bottom:9,left:22,height:27,padding:'0 4px',color:'#202024',fontSize:11,fontWeight:600,borderWidth:0,borderRadius:5,backgroundColor:'#fff',cursor:'pointer'},
similarIcon:{width:14,height:16,borderColor:'#fff',borderStyle:'solid',borderWidth:1,borderRadius:3,backgroundColor:'#202024',boxShadow:'2px 1px 0 #202024'},
layout:{display:'grid',gridTemplateColumns:{[media.desktop]:'minmax(0,1fr) 330px',default:'1fr'},gap:{[media.desktop]:30,default:0},maxWidth:$.content,marginInline:'auto',paddingInline:{[media.mobile]:22,default:28}},
main:{minWidth:0},
photoTabs:{display:'flex',gap:11,marginTop:9,paddingRight:{[media.mobile]:6,default:0},overflowX:'auto',scrollbarWidth:'none'},
fourPhotoTabs:{paddingRight:0,marginRight:{[media.mobile]:-4,default:0}},
photoTab:{display:'block',position:'relative',flex:'1 0 0',height:{[media.mobile]:49,default:85},minWidth:0,maxWidth:180,padding:0,overflow:'hidden',borderWidth:0,borderRadius:6,backgroundColor:'#151515',cursor:'pointer'},
thumb:{width:'100%',height:'100%',objectFit:'cover'},
thumbShade:{position:'absolute',inset:0,backgroundImage:'linear-gradient(0deg,rgba(0,0,0,.86),rgba(35,35,35,.48))'},
thumbLabel:{fontFamily:$.fontDisplay,position:'absolute',inset:0,display:'grid',placeItems:'center',color:'#fff',fontSize:12,fontWeight:400},
heading:{marginTop:18},
title:{fontFamily:$.fontDisplay,fontSize:{[media.mobile]:18,default:27},fontWeight:600,lineHeight:{[media.mobile]:'27px',default:'35px'}},
optionsType:{fontFamily:$.fontDisplay,fontSize:13,fontWeight:500},
subtitle:{marginTop:0,fontSize:12,fontWeight:400,lineHeight:'18px'},
dealer:{fontFamily:$.fontDisplay,display:'flex',alignItems:'center',gap:6,minHeight:38,marginTop:10,paddingInline:8,color:'#5c420d',fontSize:14,fontWeight:500,borderRadius:5,backgroundImage:'linear-gradient(90deg,#faf4e7,#fff)'},
priceCard:{overflow:'hidden',marginTop:16,borderColor:'#c7c7c7',borderStyle:'solid',borderWidth:1,borderRadius:9},
pricePart:{padding:'15px 9px 12px'},
priceLine:{display:'flex',alignItems:'center',flexWrap:'wrap',gap:'6px 10px'},
price:{fontFamily:$.fontDisplay,fontSize:18,fontWeight:600,lineHeight:'25px',whiteSpace:'nowrap'},
currency:{fontSize:14,fontWeight:600},
priceLink:{fontFamily:$.fontDisplay,flexShrink:0,marginLeft:'auto',padding:0,color:'#202024',fontSize:11,fontWeight:600,lineHeight:'18px',textDecoration:'underline',borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
fee:{marginTop:8,fontSize:11,fontFamily:$.fontDisplay,fontWeight:400,lineHeight:'18px'},
emiPart:{padding:'14px 9px 13px',backgroundColor:'#f4f4f5'},
emi:{fontFamily:$.fontDisplay,fontSize:16,fontWeight:600,lineHeight:'21px'},
overviewText:{marginTop:5,color:'#727272',fontSize:13,fontWeight:400,lineHeight:1.6},
sectionTabs:{display:'flex',position:'fixed',top:{[media.desktop]:141,default:'calc(68px + env(safe-area-inset-top))'},left:0,right:0,zIndex:59,gap:9,overflowX:'auto',padding:'6px 22px 9px',backgroundColor:'#fff',scrollbarWidth:'none'},
sectionTab:{fontFamily:$.fontDisplay,display:'grid',placeItems:'center',flexShrink:0,minHeight:31,padding:'5px 13px',color:'#202024',fontSize:12,lineHeight:'20px',fontWeight:400,borderColor:'#c4c4c4',borderStyle:'solid',borderWidth:1,borderRadius:14,backgroundColor:'#fff',cursor:'pointer'},
activeSectionTab:{color:'#fff',borderColor:'#202024',backgroundColor:'#202024'},
sectionTitle:{fontSize:20,fontWeight:500,lineHeight:'27px'},
referenceNote:{marginTop:16,color:'#727272',fontSize:12,lineHeight:1.6},
inlineButton:{display:'inline-flex',alignItems:'center',gap:8,minHeight:42,marginTop:16,padding:0,color:$.violet,fontSize:14,fontWeight:500,borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
desktopBuy:{display:{[media.desktop]:'block',default:'none'},alignSelf:'start',position:'sticky',top:95,marginTop:25,padding:22,borderColor:'#dddddd',borderStyle:'solid',borderWidth:1,borderRadius:18},
desktopPrice:{marginTop:20,fontSize:25,fontWeight:600},
floating:{display:'flex',flexDirection:'column',gap:16,position:'fixed',right:22,bottom:110,zIndex:55},
whatsapp:{display:'grid',placeItems:'center',width:44,height:44,padding:0,color:'#fff',borderColor:'#262629',borderStyle:'solid',borderWidth:1,borderRadius:'50%',backgroundColor:'#fff',cursor:'pointer'},
whatsappInner:{display:'grid',placeItems:'center',width:30,height:30,borderRadius:'50%',backgroundColor:'#262629'},
save:{display:'grid',placeItems:'center',width:44,height:44,padding:0,color:'#202024',borderColor:'#202024',borderStyle:'solid',borderWidth:1,borderRadius:'50%',backgroundColor:'#fff',cursor:'pointer'},
popularity:{display:{[media.desktop]:'none',default:'flex'},alignItems:'center',justifyContent:'center',gap:16,position:'fixed',left:0,right:0,bottom:81,zIndex:79,height:20,color:'#535353',fontFamily:$.fontDisplay,fontSize:11,lineHeight:'17px',backgroundColor:'#fafafa'},
purchase:{display:{[media.desktop]:'none',default:'grid'},gridTemplateColumns:'1fr 1fr',gap:8,position:'fixed',left:0,right:0,bottom:0,zIndex:80,minHeight:81,padding:'0 18px 32px',backgroundColor:'#fff'},
primary:{fontFamily:$.fontDisplay,display:'flex',alignItems:'center',justifyContent:'center',width:'100%',minHeight:48,paddingInline:10,color:'#fff',fontSize:15,fontWeight:500,borderWidth:1,borderColor:$.violet,borderStyle:'solid',borderRadius:17,backgroundColor:$.violet,cursor:'pointer'},
outline:{fontFamily:$.fontDisplay,display:'flex',alignItems:'center',justifyContent:'center',width:'100%',minHeight:48,paddingInline:10,color:$.violet,fontSize:15,fontWeight:500,borderColor:$.violet,borderStyle:'solid',borderWidth:1,borderRadius:17,backgroundColor:'#f9f9fa',cursor:'pointer'},
toast:{display:'flex',alignItems:'center',gap:12,position:'fixed',left:'50%',bottom:100,zIndex:90,maxWidth:'calc(100vw - 40px)',padding:'14px 18px',transform:'translateX(-50%)',color:'#fff',fontSize:13,borderRadius:12,backgroundColor:'#202024'},
toastClose:{display:'grid',placeItems:'center',padding:0,color:'#fff',borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
backdrop:{display:'flex',alignItems:{[media.mobile]:'flex-end',default:'center'},justifyContent:'center',position:'fixed',inset:0,zIndex:205,padding:{[media.mobile]:0,default:24},backgroundColor:'rgba(0,0,0,.6)'},
sheet:{width:'100%',maxWidth:600,maxHeight:'90dvh',overflowY:'auto',padding:'20px 22px 34px',borderRadius:24,backgroundColor:'#fff',outlineStyle:'none'},
sheetHeader:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,marginBottom:20},
close:{display:'grid',placeItems:'center',width:32,height:32,padding:0,color:'#202024',borderWidth:0,backgroundColor:'transparent',cursor:'pointer'}
});
