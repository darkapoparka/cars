'use client';
import { formatStockMileage } from "@/lib/dealer-mileage";
import {displayMake} from '@/lib/inventory-labels';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import {useEffect,useRef,useState,type TouchEvent} from 'react';
import {dealer} from '@/lib/dealer-config';
import {currency} from '@/lib/currency';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import {ArrowLeft,ArrowRight,CalendarDays,Heart,Info,Layers2,Play,Share2,X,MessageCircle} from 'lucide-react';
import BackButton from '@/components/BackButton';
import {CurrencyLabel} from '@/components/ReferenceUI';
import {useInventoryBack} from '@/components/useInventoryHistory';
import IconButton from '@/components/IconButton';
import VehicleComparison from '@/components/VehicleComparison';
import SimilarVehiclesSheet from '@/components/SimilarVehiclesSheet';
import DealerEnquirySheet,{type DealerEnquiryIntent} from '@/components/DealerEnquirySheet';
import VehicleBelowFold from '@/components/VehicleBelowFold';
import VehiclePhotoAlbums from '@/components/VehiclePhotoAlbums';
import VehicleDetailTabs from '@/components/VehicleDetailTabs';
import VehiclePriceSheet from '@/components/DealerPriceSheet';
import VehiclePhotoViewer from '@/components/VehiclePhotoViewer';
import VehicleTourViewer from '@/components/VehicleTourViewer';
import VehicleViewingSheet from '@/components/VehicleViewingSheet';
import {vehicleGallery,type GalleryPhoto} from '@/lib/vehicle-gallery';
import type {ReferenceVehicleDetail} from '@/lib/reference-types';
import {recordVehicleView,useSavedVehicle} from '@/components/useVehicleState';
import {useModal} from '@/components/useModal';
import {formatPrice,type Vehicle} from '@/lib/data';
import {media,tokens as $} from '@/app/tokens.stylex';

type Overlay='price'|'gallery'|'warranty'|'similar'|'tour'|'viewing'|null;
export default function VehicleDetailClient({vehicle,related,reference}: {vehicle:Vehicle;related:Vehicle[];reference?:ReferenceVehicleDetail}){
  const tx = useCopy();

 const sectionRail=useRef<HTMLElement>(null);
 const purchaseBar=useRef<HTMLElement>(null),purchaseSpace=useRef<HTMLDivElement>(null);
 const {saved,toggle:toggleSaved,error:saveError,clearError}=useSavedVehicle(vehicle.slug);
 const approvedReference=dealer.referenceClaimsApproved?reference:undefined;
 const primaryImage=reference?.primaryImage??vehicle.image;
 const listedPhotos=reference?.gallery.length?reference.gallery:vehicleGallery(vehicle);
 const photos=listedPhotos.some(item=>item.src===primaryImage)?listedPhotos:[{category:'Exteriors' as const,label:'Exterior',src:primaryImage},...listedPhotos];
 const hasDetails=Boolean(approvedReference);
 const [photo,setPhoto]=useState(0),[enquiryOpen,setEnquiryOpen]=useState(false),[overlay,setOverlay]=useState<Overlay>(null),[shared,setShared]=useState(''),[scrolled,setScrolled]=useState(false),[activeSection,setActiveSection]=useState('price'),[swipe,setSwipe]=useState<number|null>(null);
 const [gallerySelection,setGallerySelection]=useState<{photos:GalleryPhoto[];index:number}|null>(null);
 const [informationVisible,setInformationVisible]=useState(true);
 const [enquiryIntent,setEnquiryIntent]=useState<DealerEnquiryIntent>('enquiry');
 const panel=useModal(overlay==='warranty',()=>setOverlay(null));
 const title=`${vehicle.year} ${displayMake(vehicle.make).toUpperCase()} ${vehicle.model.toUpperCase()} ${vehicle.trim.split(' • ')[0]}`;
 const desktopTitle=`${vehicle.year} ${displayMake(vehicle.make)} ${vehicle.model} ${vehicle.trim.split(' • ')[0]}`;
 const summary=[vehicle.mileageOnRequest?tx('Mileage on request'):`${formatStockMileage(vehicle)}`,vehicle.transmission!=='Not published'?tx(vehicle.transmission):null,vehicle.fuel!=='Not published'?tx(vehicle.fuel):null].filter(Boolean).join(' · ');
 const backToInventory=useInventoryBack();
 const priceLabel=vehicle.priceOnRequest?tx('Price on request'):`${tx(currency.symbol)} ${tx(formatPrice(vehicle.price))}`;
 const fee=approvedReference?.convenienceFee??0;
 const message=saveError||shared;
 useEffect(()=>{recordVehicleView(vehicle.slug);},[vehicle.slug]);
 useEffect(()=>{
  const onScroll=()=>{const showSections=window.innerWidth>=768&&window.scrollY>400;setScrolled(showSections);if(!showSections)return;const sections=['price','overview','features','condition','service-history','car-finance','happy-customers','similar-cars'];const offset=window.innerWidth>=1100?132:60;let active='price';for(const section of sections){const target=document.getElementById(section);if(target&&target.getBoundingClientRect().top<=offset)active=section;}setActiveSection(active);};
  const frame=requestAnimationFrame(onScroll);window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);};
 },[]);
 useEffect(()=>{
  const bar=purchaseBar.current,space=purchaseSpace.current;
  if(!bar||!space)return;
  const update=()=>{space.style.height=`${bar.getBoundingClientRect().height+16}px`;};
  const observer=new ResizeObserver(update);observer.observe(bar);update();
  return()=>observer.disconnect();
 },[]);
 useEffect(()=>{const rail=sectionRail.current;const active=rail?.querySelector<HTMLElement>('[aria-current="location"]');if(rail&&active)rail.scrollTo({left:Math.max(0,active.offsetLeft+active.offsetWidth-rail.clientWidth+22),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});},[activeSection,scrolled]);
 async function share(){try{if(navigator.share){await navigator.share({title,url:location.href});}else if(navigator.clipboard){await navigator.clipboard.writeText(location.href);setShared('Link copied');}else{setShared(location.href);}}catch(error){if(!(error instanceof DOMException&&error.name==='AbortError'))setShared('Sharing is unavailable in this browser.');}}
 function nextPhoto(direction:number){setPhoto(current=>(current+direction+photos.length)%photos.length);}
 function endSwipe(event:TouchEvent){if(swipe!==null&&Math.abs(event.changedTouches[0].clientX-swipe)>40)nextPhoto(event.changedTouches[0].clientX<swipe?1:-1);setSwipe(null);}
 function openPhoto(selectedPhotos:GalleryPhoto[],index=0){setGallerySelection({photos:selectedPhotos,index});setOverlay('gallery');}
 function openEnquiry(intent:DealerEnquiryIntent='enquiry'){setEnquiryIntent(intent);setEnquiryOpen(true);}
 function jump(id:string){const target=id==='price'&&innerWidth>=1100?document.querySelector<HTMLElement>('[data-desktop-vehicle-hero]'):document.getElementById(id);if(target){const offset=innerWidth>=1100?144:68;if(id==='price'&&innerWidth>=1100)document.querySelector<HTMLElement>('[data-desktop-viewing]')?.scrollTo({top:0,behavior:'instant'});window.scrollTo({top:scrollY+target.getBoundingClientRect().top-offset,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});setActiveSection(id);}else if(id==='similar-cars'){setOverlay('similar');}}
 return <div {...stylex.props(s.screen)}>
  <div data-desktop-detail-layout {...stylex.props(s.desktopLayout)}>
  <section data-desktop-vehicle-hero aria-label={tx(desktopTitle)} {...stylex.props(s.desktopHero)}>
   <nav aria-label={tx('Vehicle actions')} {...stylex.props(s.desktopHeroTools)}>
    <button type="button" onClick={backToInventory} {...stylex.props(s.desktopHeroAction)}><ArrowLeft size={18} aria-hidden="true"/>{tx('Back to cars')}</button>
    <button type="button" onClick={share} {...stylex.props(s.desktopHeroAction)}><Share2 size={18} aria-hidden="true"/>{tx('Share car')}</button>
   </nav>
   <div {...stylex.props(s.desktopHeroTitle)}><h1 {...stylex.props(s.desktopTitle)}>{tx(desktopTitle)}</h1><p {...stylex.props(s.desktopSummary)}>{summary}</p></div>
  </section>
  <main {...stylex.props(s.vehicleContent)}>
  <div data-vehicle-gallery {...stylex.props(s.gallery)} onTouchStart={e=>setSwipe(e.touches[0].clientX)} onTouchEnd={endSwipe}>
   <button type="button" onClick={()=>reference?.videoTour&&photo===0?setOverlay('tour'):openPhoto(photos,photo)} aria-label={tx(reference?.videoTour&&photo===0?'Open vehicle video tour':'Open vehicle photo gallery')} {...stylex.props(s.imageButton)}><img src={assetPath(reference?.videoTour&&photo===0?reference.videoTour.poster:photos[photo].src)} alt={vehicle.imagePlaceholder ? tx('Illustration — not the advertised vehicle') : tx(title)} width={1365} height={768} fetchPriority="high" {...stylex.props(s.heroImage,vehicle.imagePlaceholder&&s.placeholderHero)}/>{vehicle.imagePlaceholder?<span {...stylex.props(s.photoUnavailable)}>{tx('Illustration — not the advertised vehicle')}</span>:null}{reference?.videoTour&&photo===0?<span aria-hidden="true" {...stylex.props(s.tourShade)}/>:null}{reference?.videoTour&&photo===0?<span {...stylex.props(s.tourPlay)}><Play size={22} fill="currentColor"/></span>:null}</button>
   <nav aria-label={tx('Vehicle actions')} {...stylex.props(s.heroActions)}><BackButton onClick={backToInventory} label="Back" tone="photo"/><IconButton icon={Share2} label={tx('Share car')} onClick={share} tone="photo"/></nav>
   <div {...stylex.props(s.heroFooter)}><button type="button" onClick={()=>setOverlay('similar')} aria-label={tx('Similar Cars')} {...stylex.props(s.similarButton)}><span {...stylex.props(s.similarSurface)}><Layers2 size={13} aria-hidden="true" {...stylex.props(s.actionIcon)}/>{tx('Similar')}</span></button>
   {!vehicle.imagePlaceholder&&photos.length>1?<span aria-hidden="true" {...stylex.props(s.photoCount)}>{photo+1} / {photos.length}</span>:null}</div>
   {photos.length>1?<nav aria-label={tx('Vehicle photos')} {...stylex.props(s.galleryNavigation)}><button type="button" aria-label={tx('Previous photo')} onClick={()=>nextPhoto(-1)} {...stylex.props(s.galleryArrow)}><ArrowLeft size={20} aria-hidden="true"/></button><button type="button" aria-label={tx('Next photo')} onClick={()=>nextPhoto(1)} {...stylex.props(s.galleryArrow)}><ArrowRight size={20} aria-hidden="true"/></button></nav>:null}
  </div>
  <div {...stylex.props(s.layout)}>
   {!vehicle.imagePlaceholder?<div {...stylex.props(s.albumRow)}><VehiclePhotoAlbums photos={photos} onOpenPhoto={openPhoto}/></div>:null}
   <header data-vehicle-heading {...stylex.props(s.heading)}><h1 {...stylex.props(s.title)}>{tx(title)}</h1><p {...stylex.props(s.summary)}>{summary}</p></header>
   <section id="price" aria-label={tx("Vehicle price")} {...stylex.props(s.priceCard)}>
     <p {...stylex.props(s.price,vehicle.priceOnRequest&&s.requestPrice)}>{vehicle.priceOnRequest ? tx('Price on request') : <><CurrencyLabel size={18}/>{tx(formatPrice(vehicle.price))}</>}</p>
     <IconButton icon={Info} label={tx('Price information')} onClick={()=>setOverlay('price')}/>
   </section>
   <div {...stylex.props(s.detailRow)}><VehicleDetailTabs photos={photos} onOpenPhoto={openPhoto} onInformationChange={setInformationVisible}><VehicleBelowFold vehicle={vehicle} reference={approvedReference} equipment={reference?.topFeatures} onLogin={intent=>openEnquiry(intent)}/></VehicleDetailTabs></div>
  </div></main><aside data-desktop-viewing aria-label={tx('Vehicle price')} {...stylex.props(s.desktopBuy,scrolled&&informationVisible&&s.desktopBuyWithSections)}><div {...stylex.props(s.buyHeader)}><h2 {...stylex.props(s.buyLabel)}>{tx('Vehicle price')}</h2><IconButton icon={Info} label={tx('Price information')} onClick={()=>setOverlay('price')}/></div><p {...stylex.props(s.desktopPrice,vehicle.priceOnRequest&&s.requestPrice)}>{priceLabel}</p><p {...stylex.props(s.overviewText)}>{tx("Confirm availability and arrange a viewing with the dealer.")}</p><button type="button" onClick={()=>setOverlay('viewing')} {...stylex.props(s.primary,s.actionWithIcon,s.desktopViewing)}><CalendarDays size={18} aria-hidden="true" {...stylex.props(s.actionIcon)}/>{tx("Arrange a viewing")}</button><button type="button" onClick={toggleSaved} aria-label={tx(saved?'Remove from saved cars':'Save car')} aria-pressed={saved} {...stylex.props(s.outline,s.actionWithIcon,s.desktopSave)}><Heart size={18} aria-hidden="true" fill={saved?'currentColor':'none'}/>{tx(saved?'Vehicle saved':'Save vehicle')}</button></aside></div>
  {dealer.mode === 'template' && dealer.referenceClaimsApproved?<VehicleComparison vehicle={vehicle} related={related}/>:null}
  {scrolled&&informationVisible?<nav ref={sectionRail} aria-label={tx("Vehicle sections")} {...stylex.props(s.sectionTabs)}>{[['Price','price'],['Overview','overview'],['Features','features'],...(approvedReference?.inspection.length? [['Inspection report','condition']]:[]),['Service History','service-history'],...(hasDetails?[['Car finance','car-finance'],['Our happy customers','happy-customers']]:[]),['Similar Cars','similar-cars']].map(([label,id])=><button type="button" key={id} onClick={()=>jump(id)} aria-current={activeSection===id?'location':undefined} {...stylex.props(s.sectionTab,activeSection===id&&s.activeSectionTab)}>{tx(label)}</button>)}</nav>:null}
  <div {...stylex.props(s.floating)}><button type="button" onClick={()=>openEnquiry()} aria-label={tx("Contact the dealer")} {...stylex.props(s.whatsapp)}><span {...stylex.props(s.whatsappInner)}><MessageCircle size={24}/></span></button></div>
  <div ref={purchaseSpace} aria-hidden="true" {...stylex.props(s.purchaseSpace)}/>
  <footer ref={purchaseBar} {...stylex.props(s.purchase)}><button type="button" onClick={toggleSaved} aria-label={tx(saved?'Remove from saved cars':'Save car')} aria-pressed={saved} {...stylex.props(s.outline,s.mobileCta,s.mobileSecondary,s.actionWithIcon)}><Heart size={18} aria-hidden="true" fill={saved?'currentColor':'none'} {...stylex.props(s.actionIcon)}/><span>{tx(saved?'Vehicle saved':'Save vehicle')}</span></button><button type="button" onClick={()=>setOverlay('viewing')} aria-label={tx("Arrange a viewing")} {...stylex.props(s.primary,s.mobileCta,s.actionWithIcon)}><CalendarDays size={18} aria-hidden="true" {...stylex.props(s.actionIcon)}/><span {...stylex.props(s.mobileLabel)}>{tx("Viewing")}</span><span {...stylex.props(s.wideLabel)}>{tx("Arrange viewing")}</span></button></footer>
  {message?<div role={saveError?'alert':'status'} {...stylex.props(s.toast)}><span {...stylex.props(s.toastText)}>{tx(message)}</span><button type="button" aria-label={tx("Dismiss message")} onClick={()=>{setShared('');clearError();}} {...stylex.props(s.toastClose)}><X size={17}/></button></div>:null}
  {overlay==='price'?<VehiclePriceSheet vehicle={vehicle} convenienceFee={fee} onClose={()=>setOverlay(null)} onEligibility={()=>{setOverlay(null);openEnquiry();}}/>:null}
  {overlay==='viewing'?<VehicleViewingSheet vehicleTitle={title} onClose={()=>setOverlay(null)} onRequest={()=>{setOverlay(null);openEnquiry('viewing');}}/>:null}
  {overlay==='similar'?<SimilarVehiclesSheet vehicle={vehicle} related={related} onClose={()=>setOverlay(null)}/>:null}
  {overlay==='tour'&&reference?.videoTour?<VehicleTourViewer {...reference.videoTour} onClose={()=>setOverlay(null)}/>:null}
  {overlay==='gallery'?<VehiclePhotoViewer photos={gallerySelection?.photos??photos} initialIndex={gallerySelection?.index??0} onClose={()=>setOverlay(null)}/>:null}
  {overlay==='warranty'?<div {...stylex.props(s.backdrop)} onMouseDown={event=>event.target===event.currentTarget&&setOverlay(null)}><div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={tx("Showroom information")} {...stylex.props(s.sheet)}><header {...stylex.props(s.sheetHeader)}><h2 {...stylex.props(s.sectionTitle)}>{tx("Showroom information")}</h2><button type="button" aria-label={tx("Close vehicle information")} onClick={()=>setOverlay(null)} {...stylex.props(s.close)}><X size={23}/></button></header><p {...stylex.props(s.overviewText)}>{tx("Ask the showroom about availability, vehicle condition and the terms of any warranty.")}</p><Link href="/benefits/warranty" {...stylex.props(s.inlineButton)}>{tx("Warranty information ")}<ArrowRight size={17}/></Link></div></div>:null}
  <DealerEnquirySheet vehicleTitle={title} intent={enquiryIntent} open={enquiryOpen} onClose={()=>setEnquiryOpen(false)}/>
 </div>;
}
const s=stylex.create({
heroActions:{display:{[media.desktop]:'none',default:'flex'},alignItems:'center',justifyContent:'space-between',position:'absolute',top:'calc(8px + env(safe-area-inset-top))',left:8,right:8,zIndex:1,pointerEvents:'none'},
screen:{paddingTop:0,paddingBottom:0,color:'#202024',backgroundColor:'#fff'},
desktopHero:{display:{[media.desktop]:'block',default:'none'},gridColumn:'1 / -1',padding:'12px 24px 20px',borderWidth:1,borderStyle:'solid',borderColor:$.line,borderRadius:20,backgroundColor:$.surface},
desktopHeroTitle:{minWidth:0},
desktopHeroTools:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,marginBottom:4},
desktopHeroAction:{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,minHeight:44,padding:'0 4px',color:{default:$.muted,':hover':$.ink},fontFamily:$.fontSans,fontSize:14,lineHeight:'20px',borderWidth:0,borderRadius:8,backgroundColor:{default:'transparent',':hover':$.surfaceAlt},cursor:'pointer',outlineOffset:3},
desktopTitle:{margin:0,color:$.ink,fontFamily:$.fontDisplay,fontSize:28,fontWeight:600,lineHeight:'36px',letterSpacing:'-.02em',overflowWrap:'anywhere'},
desktopSummary:{marginTop:4,color:$.muted,fontFamily:$.fontSans,fontSize:14,lineHeight:'20px'},
desktopLayout:{display:{[media.desktop]:'grid',default:'contents'},gridTemplateColumns:'minmax(0,1fr) clamp(340px,30%,396px)',rowGap:20,columnGap:28,width:{[media.desktop]:'100%',default:'auto'},maxWidth:$.content,marginInline:'auto',padding:{[media.desktop]:'16px 28px 28px',default:0}},
vehicleContent:{display:{[media.desktop]:'grid',default:'block'},gridTemplateColumns:'minmax(0,1fr)',alignContent:'start',minWidth:0},
gallery:{position:'relative',gridRow:{[media.desktop]:2,default:'auto'},width:{[media.desktop]:'100%',default:'auto'},maxWidth:$.content,aspectRatio:{[media.mobile]:'8/5',default:'1365/768'},marginInline:'auto',borderRadius:{[media.desktop]:18,default:0},overflow:'hidden'},
imageButton:{position:'relative',display:'block',width:'100%',height:'100%',padding:0,borderWidth:0,backgroundColor:'#f5f5f5',cursor:'zoom-in'},
tourShade:{position:'absolute',inset:0,pointerEvents:'none',backgroundImage:'linear-gradient(180deg,rgba(0,0,0,.40),transparent 45%,rgba(0,0,0,.29))'},
tourPlay:{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',display:'grid',placeItems:'center',width:48,height:48,color:'#000',borderRadius:'50%',backgroundColor:'#fff'},
heroImage:{width:'100%',height:'100%',objectFit:'cover'},
placeholderHero:{objectFit:'contain',padding:{[media.mobile]:34,default:72},backgroundColor:'#f0f2f4'},
photoUnavailable:{position:'absolute',left:'50%',bottom:18,transform:'translateX(-50%)',padding:'6px 11px',color:'#555b62',fontSize:{[media.desktop]:$.desktopLabelSize,default:11},fontWeight:600,borderRadius:999,backgroundColor:'rgba(255,255,255,.94)'},
heroFooter:{position:'absolute',left:12,right:12,bottom:9,display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,pointerEvents:'none'},
similarButton:{display:'inline-flex',alignItems:'center',justifyContent:'center',minWidth:44,minHeight:44,padding:0,color:$.ink,fontFamily:$.fontSans,fontSize:12,fontWeight:500,lineHeight:'18px',borderWidth:0,borderRadius:$.radiusPill,backgroundColor:'transparent',cursor:'pointer',pointerEvents:'auto',outlineOffset:3},
similarSurface:{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:5,minHeight:28,padding:'5px 9px',borderRadius:$.radiusPill,backgroundColor:{default:$.surface,':hover':$.rail}},
photoCount:{flexShrink:0,padding:'4px 8px',color:'#fff',fontFamily:$.fontSans,fontSize:12,lineHeight:'16px',borderRadius:6,backgroundColor:'rgba(0,0,0,.65)'},
galleryNavigation:{display:{[media.desktop]:'flex',default:'none'},position:'absolute',left:'50%',bottom:12,transform:'translateX(-50%)',gap:8},
galleryArrow:{display:'grid',placeItems:'center',width:44,height:44,padding:0,color:$.ink,borderWidth:0,borderRadius:'50%',backgroundColor:{default:'#fff',':hover':'#eaeaed'},cursor:'pointer',outlineOffset:3},
layout:{display:{[media.desktop]:'contents',default:'block'},maxWidth:$.content,marginInline:'auto',paddingInline:{[media.mobile]:16,[media.desktop]:0,default:28}},
albumRow:{display:{[media.desktop]:'block',default:'contents'},gridRow:{[media.desktop]:3,default:'auto'}},
detailRow:{display:{[media.desktop]:'block',default:'contents'},gridRow:{[media.desktop]:4,default:'auto'}},
heading:{display:{[media.desktop]:'none',default:'block'},gridRow:{[media.desktop]:1,default:'auto'},marginTop:{[media.desktop]:0,default:16},marginBottom:{[media.desktop]:20,default:0}},
title:{minWidth:0,fontFamily:$.fontDisplay,fontSize:{[media.mobile]:18,[media.desktop]:28,default:27},fontWeight:600,lineHeight:{[media.mobile]:'27px',[media.desktop]:'36px',default:'35px'},overflowWrap:'anywhere'},
summary:{marginTop:4,color:$.muted,fontFamily:$.fontSans,fontSize:{[media.desktop]:$.desktopSupportSize,default:13},fontWeight:400,lineHeight:'20px',overflowWrap:'anywhere'},
priceCard:{display:{[media.desktop]:'none',default:'flex'},alignItems:'center',justifyContent:'space-between',gap:12,marginTop:6},
price:{minWidth:0,fontFamily:$.fontSans,fontSize:{[media.mobile]:26,default:28},fontWeight:600,lineHeight:'36px',whiteSpace:'nowrap'},
requestPrice:{fontSize:18,lineHeight:'24px',whiteSpace:'normal',textAlign:'left'},
overviewText:{marginTop:5,color:$.muted,fontSize:{[media.desktop]:$.desktopSupportSize,default:13},fontWeight:400,lineHeight:1.6},
sectionTabs:{display:{[media.mobile]:'none',default:'flex'},position:'fixed',top:{[media.desktop]:69,default:'env(safe-area-inset-top)'},left:{[media.desktop]:$.desktopShellInset,default:0},right:{[media.desktop]:$.desktopShellInset,default:0},zIndex:59,gap:9,overflowX:'auto',padding:{[media.desktop]:'6px 28px 9px',default:'6px 22px 9px'},backgroundColor:'#fff',scrollbarWidth:'none'},
sectionTab:{fontFamily:$.fontDisplay,display:'grid',placeItems:'center',flexShrink:0,minHeight:44,padding:'7px 13px',color:'#202024',fontSize:14,lineHeight:'20px',fontWeight:500,borderColor:'#c4c4c4',borderStyle:'solid',borderWidth:1,borderRadius:999,backgroundColor:'#fff',cursor:'pointer'},
activeSectionTab:{color:'#fff',borderColor:'#202024',backgroundColor:'#202024'},
sectionTitle:{fontSize:20,fontWeight:500,lineHeight:'27px'},
inlineButton:{display:'inline-flex',alignItems:'center',gap:8,minHeight:44,marginTop:16,padding:0,color:$.violet,fontSize:14,fontWeight:500,borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
desktopBuy:{display:{[media.desktop]:'block',default:'none'},alignSelf:'start',position:'sticky',top:89,maxHeight:'calc(100svh - 105px)',overflowY:'auto',overscrollBehaviorY:'contain',scrollbarWidth:'thin',marginTop:{[media.desktop]:0,default:25},padding:24,borderColor:$.line,borderStyle:'solid',borderWidth:1,borderRadius:20,backgroundColor:$.surfaceAlt},
buyHeader:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12},
buyLabel:{color:$.muted,fontSize:$.desktopSupportSize,fontWeight:400,lineHeight:'20px'},
desktopBuyWithSections:{top:148,maxHeight:'calc(100svh - 164px)'},
desktopSave:{marginTop:8},
desktopViewing:{marginTop:20},
desktopPrice:{marginTop:8,fontSize:32,fontWeight:600,lineHeight:'40px'},
floating:{display:{[media.mobile]:'none',[media.desktop]:'none',default:'flex'},flexDirection:'column',gap:16,position:'fixed',right:22,bottom:110,zIndex:55},
whatsapp:{display:'grid',placeItems:'center',width:44,height:44,padding:0,color:'#fff',borderColor:'#262629',borderStyle:'solid',borderWidth:1,borderRadius:'50%',backgroundColor:'#fff',cursor:'pointer'},
whatsappInner:{display:'grid',placeItems:'center',width:30,height:30,borderRadius:'50%',backgroundColor:'#262629'},
actionWithIcon:{gap:7},
actionIcon:{flexShrink:0},
purchaseSpace:{display:{[media.desktop]:'none',default:'block'},height:'calc(72px + env(safe-area-inset-bottom))'},
purchase:{display:{[media.desktop]:'none',default:'flex'},flexWrap:'wrap',gap:8,position:'fixed',left:0,right:0,bottom:0,zIndex:80,minHeight:{[media.mobile]:52,default:60},padding:{[media.mobile]:'6px 12px calc(6px + env(safe-area-inset-bottom))',default:'8px 18px calc(8px + env(safe-area-inset-bottom))'},backgroundColor:$.surface},
mobileCta:{flex:'1 1 0',minWidth:'max-content',maxWidth:'100%',minHeight:$.controlHeight,fontSize:$.controlFontSize,lineHeight:$.controlLineHeight,whiteSpace:'normal',borderRadius:$.radiusPill},
mobileSecondary:{color:$.ink,borderWidth:0,backgroundColor:$.surfaceAlt},
mobileLabel:{display:{[media.mobile]:'inline',default:'none'}},
wideLabel:{display:{[media.mobile]:'none',default:'inline'}},
primary:{fontFamily:$.fontDisplay,display:'flex',alignItems:'center',justifyContent:'center',width:'100%',minHeight:48,paddingInline:10,color:'#fff',fontSize:{[media.desktop]:$.desktopTextSize,default:15},fontWeight:500,borderWidth:1,borderColor:$.violet,borderStyle:'solid',borderRadius:$.radiusPill,backgroundColor:$.violet,cursor:'pointer'},
outline:{fontFamily:$.fontDisplay,display:'flex',alignItems:'center',justifyContent:'center',width:'100%',minHeight:48,paddingInline:10,color:$.violet,fontSize:{[media.desktop]:$.desktopTextSize,default:15},fontWeight:500,borderColor:$.violet,borderStyle:'solid',borderWidth:1,borderRadius:$.radiusPill,backgroundColor:'#f9f9fa',cursor:'pointer'},
toast:{display:'flex',alignItems:'center',gap:12,position:'fixed',left:'50%',bottom:100,zIndex:90,width:'max-content',maxWidth:'calc(100vw - 40px)',padding:'14px 18px',transform:'translateX(-50%)',color:'#fff',fontSize:14,lineHeight:1.5,borderRadius:12,backgroundColor:'#202024'},
toastText:{minWidth:0,overflowWrap:'anywhere'},
toastClose:{display:'grid',placeItems:'center',flexShrink:0,width:44,height:44,padding:0,color:'#fff',borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
backdrop:{display:'flex',alignItems:{[media.mobile]:'flex-end',default:'center'},justifyContent:'center',position:'fixed',inset:0,zIndex:205,padding:{[media.mobile]:0,default:24},backgroundColor:'rgba(0,0,0,.6)'},
sheet:{width:'100%',maxWidth:600,maxHeight:'90dvh',overflowY:'auto',padding:'20px 22px 34px',borderRadius:24,backgroundColor:'#fff',outlineStyle:'none'},
sheetHeader:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,marginBottom:20},
close:{display:'grid',placeItems:'center',flexShrink:0,width:44,height:44,padding:0,color:'#202024',borderWidth:0,backgroundColor:'transparent',cursor:'pointer'}
});
