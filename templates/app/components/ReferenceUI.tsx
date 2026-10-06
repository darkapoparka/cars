'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import Link from '@/components/AppLink';
import {getImageProps} from 'next/image';
import * as stylex from '@stylexjs/stylex';
import FilterPill from '@/components/FilterPill';
import {showroom} from '@/lib/showroom';
import {currency} from '@/lib/currency';
import NativeIcon from '@/components/NativeIcon';
import DealerHomeBanner from '@/components/DealerHomeBanner';
import {brandLogo} from '@/lib/brand-logos';
import {vehicles} from '@/lib/data';
import { media, tokens as $ } from '@/app/tokens.stylex';
import {typography as t} from '@/app/typography.stylex';

export type ServiceKey = 'buy' | 'sell' | 'finance' | 'service';
export function ServiceTabs({active,compact=false,onDark=false}: {active:ServiceKey;compact?:boolean;onDark?:boolean}) {
  const tx = useCopy();

  return <nav aria-label={tx("Car services")} {...stylex.props(s.tabs)}>{showroom.services.map(tab => <Link key={tab.key} href={tab.href} aria-label={tx(tab.key === 'finance' ? 'Finance navigation' : tab.label)} aria-current={active===tab.key?'page':undefined} {...stylex.props(s.tab,active===tab.key&&s.tabActive,onDark&&active===tab.key&&s.tabOnDarkActive,compact&&s.tabCompact)}>
    <span {...stylex.props(s.tabTitle,t.navigation,active===tab.key&&s.tabTitleActive,compact&&s.tabTitleCompact,compact&&active===tab.key&&s.tabTitleCompactActive,compact&&onDark&&s.tabTitleOnDark,compact&&onDark&&active===tab.key&&s.tabTitleOnDarkActive)}>{tx(tab.key === 'finance' ? 'Finance navigation' : tab.label)}</span>
    {!compact ? <span aria-hidden="true" {...stylex.props(s.tabArtworkBox)}><ServiceTabArtwork image={tab.image} mobileImage={tab.mobileImage} buy={tab.key === 'buy'}/></span> : null}
    {active===tab.key?<span aria-hidden="true" {...stylex.props(s.tabIndicator,compact&&s.tabIndicatorCompact)}/>:null}
  </Link>)}</nav>;
}

export function ShowroomPromotion() {
  return <DealerHomeBanner/>;
}

function ServiceTabArtwork({image, mobileImage, buy}: {image: string; mobileImage: string; buy: boolean}) {
  const common = {alt: '', fill: true, sizes: '(max-width: 767px) 90px, 160px'};
  const {props: desktop} = getImageProps({...common, src: assetPath(image)});
  const {props: mobile} = getImageProps({...common, src: assetPath(mobileImage)});
  return <picture><source media="(max-width: 767px)" srcSet={mobile.srcSet} sizes={mobile.sizes}/><img {...desktop} alt="" {...stylex.props(s.tabArt, buy && s.tabArtBuy)}/></picture>;
}

export function BrandEmblem({make}: {make: string}) {
  const artwork = brandLogo(make);
  const logo = artwork?.presentation === 'framed' ? <img data-brand-logo src={assetPath(artwork.src)} width={72} height={72} alt="" {...stylex.props(s.brandImageFramed)}/> : artwork ? <svg data-brand-logo viewBox={artwork.symbolViewBox} aria-hidden="true" focusable="false" {...stylex.props(s.brandImage, artwork.wide && s.brandImageWide, artwork.compact && s.brandImageCompact)}><image href={assetPath(artwork.src)} width={artwork.sourceSize?.[0]} height={artwork.sourceSize?.[1]}/></svg> : <span {...stylex.props(s.brandName)}>{make}</span>;
  return <span aria-hidden="true" {...stylex.props(s.brandIcon, artwork?.presentation === 'framed' && s.brandIconFramed)}>{logo}</span>;
}

export function BrandRow({title='Browse by brands',showTitle=true,onSelect,compact=false}: {title?:string;showTitle?:boolean;onSelect?:(brand:string)=>void;compact?:boolean}) {
  const tx = useCopy();

  const stocked = [...new Map(vehicles.filter(vehicle => vehicle.make.trim()).map(vehicle => [vehicle.make.toLowerCase(), vehicle.make])).values()];
  if (!stocked.length) return null;
  return <section data-stocked-brands aria-label={tx(title)} {...stylex.props(s.brandSection,!showTitle&&s.brandSectionWithoutTitle)}>{showTitle?<h2 {...stylex.props(s.sectionTitle)}>{tx(title)}</h2>:null}<div {...stylex.props(s.brandRow,!showTitle&&s.brandRowWithoutTitle)}>{stocked.map(make=>{
    const content=<><BrandEmblem make={make}/><span {...stylex.props(s.brandLabel,compact&&s.brandLabelCompact)}>{tx(make === 'Mercedes-Benz' ? 'Mercedes' : make)}</span></>;
    return onSelect?<button key={make} type="button" aria-label={tx(make)} onClick={()=>onSelect(make)} {...stylex.props(s.brand)}>{content}</button>:<Link key={make} aria-label={tx(make)} href={`/cars?brand=${encodeURIComponent(make)}`} {...stylex.props(s.brand)}>{content}</Link>;
  })}</div></section>;
}

export function FilterPills() {
  const tx = useCopy();

  return <nav aria-label={tx("Quick filters")} {...stylex.props(s.filters)}>{[['Filter','filters=1'],['Sort','sort=1'],['Brand','open=BRAND'],['Budget','open=BUDGET'],['Body type','open=BODY%20TYPE']].map(([label,query],i)=><FilterPill key={label} label={tx(label)} href={`/cars?${query}`} icon={i===0?'filter':i===1?'sort':undefined}/>)}</nav>;
}

export function CurrencyLabel({size=14}: {size?:number}) {
  const tx = useCopy();

  return <span style={{display:'inline-block',flexShrink:0,fontSize:Math.max(12,size),marginRight:3,lineHeight:'inherit'}}>{tx(currency.symbol)}</span>;
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
 tabs:{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:{[media.mobile]:0,default:16}},
 tab:{display:{[media.mobile]:'flex',default:'block'},flexDirection:'column',alignItems:'center',justifyContent:'space-between',gap:4,position:'relative',height:{[media.mobile]:'auto',default:104},minHeight:{[media.mobile]:86,default:104},padding:{[media.mobile]:'7px 2px',default:0},minWidth:0,overflow:'hidden',color:$.ink,borderRadius:{[media.mobile]:0,default:16},borderWidth:{[media.mobile]:0,default:1},borderStyle:'solid',borderColor:'#eeeeef',backgroundColor:{[media.mobile]:'transparent',default:'#f4f4f5'}},
 tabActive:{color:$.ink,backgroundColor:{[media.mobile]:'transparent',default:'#ececee'},borderColor:{[media.mobile]:'transparent',default:'#dedee1'},boxShadow:'none'},
 tabOnDarkActive:{backgroundColor:{[media.mobile]:'transparent',default:'#fff'},borderColor:{[media.mobile]:'transparent',default:'#fff'}},
 tabCompact:{aspectRatio:'auto',height:'auto',minHeight:44,justifyContent:'center',padding:0,borderWidth:0,borderRadius:{[media.mobile]:0,default:30},backgroundColor:'transparent',boxShadow:'none',overflow:'visible'},
 tabIndicator:{position:'absolute',bottom:0,left:{[media.mobile]:0,default:'calc(50% - 10px)'},width:{[media.mobile]:'100%',default:20},height:3,borderTopLeftRadius:3,borderTopRightRadius:3,backgroundColor:$.ink},
 tabIndicatorCompact:{display:{[media.mobile]:'block',default:'none'}},
 tabTitleCompact:{position:'static',display:'grid',placeItems:'center',width:'100%',minHeight:32,padding:'6px 2px',whiteSpace:'normal',borderRadius:{[media.mobile]:0,default:30},backgroundColor:{[media.mobile]:'transparent',default:'#f4f4f5'}},
 tabTitleCompactActive:{color:{[media.mobile]:$.ink,default:'#fff'},backgroundColor:{[media.mobile]:'transparent',default:$.ink}},
 tabTitleOnDark:{color:{[media.mobile]:$.ink,default:'#dddde1'},backgroundColor:{[media.mobile]:'transparent',default:'#343438'}},
 tabTitleOnDarkActive:{color:$.ink,backgroundColor:{[media.mobile]:'transparent',default:'#fff'}},
 tabArtworkBox:{position:{[media.mobile]:'relative',default:'absolute'},flexShrink:0,left:{[media.mobile]:'auto',default:'50%'},transform:{[media.mobile]:'none',default:'translateX(-50%)'},bottom:{[media.mobile]:'auto',default:2},width:{[media.mobile]:'calc(100% - 8px)',default:'100%'},height:{[media.mobile]:48,default:'64%'},maxWidth:160},
 tabArt:{objectFit:'contain'},
 tabArtBuy:{transform:{[media.mobile]:'scale(1.12)',default:'none'}},
 tabTitle:{position:{[media.mobile]:'static',default:'absolute'},top:16,left:0,right:0,maxWidth:'100%',textAlign:'center',zIndex:1,whiteSpace:'pre-line',overflowWrap:'anywhere',letterSpacing:0},
 tabTitleActive:{fontWeight:{[media.mobile]:500,default:400}},
 sectionTitle:{fontSize:{[media.mobile]:18,default:25},fontWeight:{[media.mobile]:600,default:500},lineHeight:1.35,color:$.text},
 brandSection:{paddingTop:10},
 brandSectionWithoutTitle:{paddingTop:{[media.mobile]:$.mobileBrandGap,default:10}},
 brandRow:{display:'flex',gap:{[media.mobile]:10,default:12},overflowX:'auto',overscrollBehaviorX:'contain',marginTop:12,marginRight:{[media.mobile]:-12,default:0},paddingRight:{[media.mobile]:12,default:0},paddingBlock:4,scrollbarWidth:'none'},
 brandRowWithoutTitle:{marginTop:0},
 brand:{display:'flex',flexShrink:0,alignItems:'center',flexDirection:'column',gap:8,width:{[media.mobile]:72,default:108},padding:0,textAlign:'center',color:$.text,borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
 brandIcon:{display:'grid',placeItems:'center',width:'100%',aspectRatio:'1',overflow:'hidden',borderWidth:1,borderStyle:'solid',borderColor:'#e1e6ed',borderRadius:'50%',backgroundColor:'#fff'},
 brandIconFramed:{borderWidth:0},
 brandImage:{display:'block',width:'60%',height:'auto',maxHeight:'60%',overflow:'hidden'},
 brandImageWide:{width:'76%'},
 brandImageCompact:{width:'50%',maxHeight:'50%'},
 brandImageFramed:{display:'block',width:'100%',height:'100%',objectFit:'cover'},
 brandName:{maxWidth:'90%',fontSize:11,fontWeight:600,overflowWrap:'anywhere'},
 brandLabelCompact:{fontWeight:500},
 brandLabel:{fontSize:{[media.mobile]:12,default:15},fontWeight:400,lineHeight:'18px',maxWidth:'100%',overflowWrap:'anywhere'},
 filters:{display:'flex',alignItems:'center',gap:6,overflowX:'auto',overscrollBehaviorX:'contain',paddingBlock:{[media.mobile]:6,default:12},paddingInline:{[media.mobile]:12,default:28},backgroundColor:'#fff',scrollbarWidth:'none'},
});
