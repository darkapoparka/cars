'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import Link from '@/components/AppLink';
import Image from '@/components/AppImage';
import * as stylex from '@stylexjs/stylex';
import FilterPill from '@/components/FilterPill';
import {showroom} from '@/lib/showroom';
import {currency} from '@/lib/currency';
import NativeIcon from '@/components/NativeIcon';
import ShowroomBanner from '@/components/ShowroomBanner';
import { media, tokens as $ } from '@/app/tokens.stylex';

export type ServiceKey = 'buy' | 'sell' | 'finance' | 'service';
export function ServiceTabs({active,compact=false}: {active:ServiceKey;compact?:boolean}) {
  const tx = useCopy();

  return <nav aria-label={tx("Car services")} {...stylex.props(s.tabs)}>{showroom.services.map(tab => <Link key={tab.key} href={tab.href} aria-label={tx(tab.label)} aria-current={active===tab.key?'page':undefined} {...stylex.props(s.tab,active===tab.key&&s.tabActive,compact&&s.tabCompact,compact&&active===tab.key&&s.tabCompactActive)}>
    {!compact ? <Image src={tab.image} alt={tx("")} width={160} height={100} sizes="(max-width: 767px) 90px, 160px" {...stylex.props(s.tabArt,(tab.key==='finance'||tab.key==='service')&&s.serviceArt)}/> : null}
    <span {...stylex.props(s.tabTitle,compact&&s.tabTitleCompact)}>{tx(tab.key === 'finance' ? 'Finance navigation' : tab.label)}</span>
    {active===tab.key&&!compact?<span aria-hidden="true" {...stylex.props(s.tabIndicator)}/>:null}
  </Link>)}</nav>;
}

export function ShowroomPromotion() {
  const tx = useCopy();

  const promo = showroom.promotion;
  return <ShowroomBanner title={tx(promo.title)} description={tx(promo.description)} mobileDescription={promo.mobileDescription} action={promo.action} mobileAction={promo.mobileAction} href={promo.href} image={promo.image} colourful />;
}

const brandList=[['Mercedes Benz','Mercedes-Benz','mercedes'],['BMW','BMW','bmw'],['Audi','Audi','audi'],['Nissan','Nissan','nissan'],['Hyundai','Hyundai','hyundai']] as const;
export function BrandRow({title='Browse by brands',onSelect,compact=false}: {title?:string;onSelect?:(brand:string)=>void;compact?:boolean}) {
  const tx = useCopy();

  const items=compact?[['Mercedes Benz','Mercedes-Benz','mercedes'],['BMW','BMW','bmw'],['Audi','Audi','audi'],['Nissan','Nissan','nissan'],['Toyota','Toyota','toyota']]:brandList;
  const compactAssets:Record<string,string>={mercedes:'sell-brand-4',bmw:'sell-brand-5',audi:'sell-brand-6',nissan:'sell-brand-3',toyota:'sell-brand-1'};
  return <section aria-label={tx(title)} {...stylex.props(s.brandSection)}><h2 {...stylex.props(s.sectionTitle)}>{tx(title)}</h2><div {...stylex.props(s.brandRow)}>{items.map(([label,value,asset])=>{
    const content=<><img src={assetPath(`/reference-assets/${compact?compactAssets[asset]:`brand-${asset}`}.png`)} width={210} height={192} alt={tx("")} {...stylex.props(s.brandImage,compact&&s.brandImageCompact)}/><span {...stylex.props(s.brandLabel,compact&&s.brandLabelCompact)}>{tx(label)}</span></>;
    return onSelect?<button key={value} type="button" onClick={()=>onSelect(value)} {...stylex.props(s.brand)}>{tx(content)}</button>:<Link key={value} href={`/cars?brand=${encodeURIComponent(value)}`} {...stylex.props(s.brand)}>{tx(content)}</Link>;
  })}</div></section>;
}

export function FilterPills() {
  const tx = useCopy();

  return <nav aria-label={tx("Quick filters")} {...stylex.props(s.filters)}>{[['Filter','filters=1'],['Sort','sort=1'],['Brand','open=BRAND'],['Budget','open=BUDGET'],['Body type','open=BODY%20TYPE']].map(([label,query],i)=><FilterPill key={label} label={tx(label)} href={`/cars?${query}`} icon={i===0?'filter':i===1?'sort':undefined}/>)}</nav>;
}

export function CurrencyLabel({size=14}: {size?:number}) {
  const tx = useCopy();

  return <span style={{display:'inline-block',flexShrink:0,fontSize:size,marginRight:3,lineHeight:'inherit'}}>{tx(currency.code)}</span>;
}

export function WhatsAppIcon({size=26}: {size?:number}) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="4 4 17 17" fill="currentColor"><path d="M17.48 14.41c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.9 1.22 3.1c.15.2 2.11 3.22 5.12 4.51.72.31 1.28.49 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.77-.73 2.02-1.43.25-.69.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"/></svg>;
}

export function BottomIcon({name,active}: {name:string;active:boolean}) {
  const common={width:24,height:24,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.5,strokeLinecap:'round' as const,strokeLinejoin:'round' as const,'aria-hidden':true as const};
  if(name==='Home')return <NativeIcon name={active?'homeSelected':'home'}/>;
  if(name==='Luxe')return <svg {...common}><path d="m4 10 4-5h8l4 5-8 10Z" fill={active?'currentColor':'none'}/><path d="M4 10h16M8 5l4 15 4-15" stroke={active?'white':'currentColor'} strokeWidth="1.1"/>{active?<path d="M12 1v2M4 3l2 2M20 3l-2 2M1 9h1M22 9h1"/>:null}</svg>;
  if(name==='Menu')return <NativeIcon name={active?'menuSelected':'menu'}/>;
  return <NativeIcon name={active?'storesSelected':'stores'}/>;
}

const s=stylex.create({
 tabs:{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:{[media.mobile]:8,default:16}},
 tab:{display:'block',position:'relative',height:{[media.mobile]:88,default:104},minWidth:0,overflow:'hidden',color:$.ink,borderRadius:16,borderWidth:1,borderStyle:'solid',borderColor:'#eeeeef',backgroundColor:'#f4f4f5'},
 tabActive:{color:$.ink,backgroundColor:'#ececee',borderColor:'#dedee1'},
 tabCompact:{aspectRatio:'auto',height:40,borderColor:'#e6e6e9',borderStyle:'solid',borderWidth:1,borderRadius:12,backgroundColor:'#f4f4f5'},
 tabCompactActive:{color:'#fff',backgroundColor:$.ink,borderColor:$.ink},
 tabIndicator:{position:'absolute',bottom:0,left:'calc(50% - 10px)',width:20,height:3,borderTopLeftRadius:3,borderTopRightRadius:3,backgroundColor:$.ink},
 tabTitleCompact:{display:'grid',placeItems:'center',top:0,right:0,bottom:0,left:0,fontSize:13,fontWeight:400,lineHeight:1,whiteSpace:'nowrap',backgroundColor:'inherit'},
 tabArt:{position:'absolute',left:'50%',transform:'translateX(-50%)',bottom:2,width:'100%',height:'64%',maxWidth:160,objectFit:'contain'},
 serviceArt:{bottom:6,width:'90%',height:'57%',maxWidth:140},
 tabTitle:{position:'absolute',top:{[media.mobile]:10,default:16},left:0,right:0,textAlign:'center',zIndex:1,fontSize:{[media.mobile]:'clamp(12px,3.7vw,15px)',default:18},fontWeight:600,lineHeight:1.06,whiteSpace:'pre-line',letterSpacing:0},
 sectionTitle:{fontSize:{[media.mobile]:18,default:25},fontWeight:500,lineHeight:1.2,color:$.text},
 brandSection:{paddingTop:10},
 brandRow:{display:'flex',gap:12,overflowX:'auto',marginTop:12,paddingBottom:0,scrollbarWidth:'none'},
 brand:{display:'flex',flexShrink:0,alignItems:'center',flexDirection:'column',gap:8,width:{[media.mobile]:83,default:108},padding:0,textAlign:'center',color:$.text,borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
 brandImage:{width:'100%',height:'auto'},
 brandImageCompact:{width:74},
 brandLabelCompact:{fontWeight:500},
 brandLabel:{fontSize:{[media.mobile]:14,default:15},fontWeight:400,lineHeight:'18px',maxWidth:80},
 filters:{display:'flex',alignItems:'center',gap:8,overflowX:'auto',paddingBlock:12,paddingInline:12,backgroundColor:'#fff',scrollbarWidth:'none'},
});
