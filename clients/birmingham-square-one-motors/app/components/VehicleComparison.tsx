'use client';
import { formatStockMileage } from "@/lib/dealer-mileage";
import {displayMake} from '@/lib/inventory-labels';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import {useRef, useState} from 'react';
import {currency} from '@/lib/currency';
import ShowroomBadge from '@/components/ShowroomBadge';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import {Check, MapPin, ShieldCheck} from 'lucide-react';
import {CurrencyLabel} from '@/components/ReferenceUI';
import {formatPrice, type Vehicle} from '@/lib/data';
import {capturedRelatedVehicles} from '@/lib/captured-related';
import {media, tokens as $} from '@/app/tokens.stylex';

/** The reference's three-column comparison is a captured listing snapshot, not a vehicle assessment. */
export default function VehicleComparison({vehicle, related}: {vehicle: Vehicle; related: Vehicle[]}) {
  const tx = useCopy();

  const native = vehicle.slug === '2024-toyota-fortuner-exr';
  const cars = native ? capturedRelatedVehicles : related.slice(0, 3);
  const columns = [vehicle, ...(native ? [cars[1], cars[0]] : cars.slice(0, 2))].filter(Boolean);
  const rail = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  const features: [string, (boolean | null)[]][] = native ? [
    ['Adaptive cruise control', [null, true, null]], ['Climate Control AC', [null, true, null]],
    ['Fog Light Front', [true, true, null]], ['Cruise Control', [true, true, true]],
  ] : [];
  function select(index: number) {
    const card = rail.current?.children[index] as HTMLElement | undefined;
    if (card && rail.current) {rail.current.scrollTo({left: card.offsetLeft - rail.current.offsetLeft, behavior: 'smooth'}); setSlide(index);}
  }
  return <section id="similar-cars" aria-labelledby="similar-cars-title" {...stylex.props(s.section)}>
    <div {...stylex.props(s.inner)}><h2 id="similar-cars-title" {...stylex.props(s.heading)}>{tx("Similar Cars")}</h2>
      <div ref={rail} aria-label={tx("Similar car recommendations")} onScroll={event => {
        const element = event.currentTarget; const width = element.firstElementChild?.getBoundingClientRect().width ?? 1;
        setSlide(Math.min(cars.length - 1, Math.max(0, Math.round(element.scrollLeft / (width + 12)))));
      }} {...stylex.props(s.rail)}>{cars.map(car => <article key={car.slug} {...stylex.props(s.card)}>
        <Link href={`/cars/${car.slug}`} aria-label={tx(`View similar ${car.year} ${displayMake(car.make)} ${car.model}`)} {...stylex.props(s.cardLink)}>
          <h3 {...stylex.props(s.carTitle)}>{tx(car.year)} {tx(displayMake(car.make).toUpperCase())} {tx(car.model.toUpperCase())}</h3>
          <div {...stylex.props(s.carBody)}><div {...stylex.props(s.picture)}><img src={assetPath(car.image)} alt={tx(`${car.year} ${displayMake(car.make)} ${car.model}`)} width={384} height={216} {...stylex.props(s.carPhoto)} /><span {...stylex.props(s.interestBadge)}>{tx("1.99% INTEREST RATE*")}</span></div>
            <div {...stylex.props(s.carInfo)}><p {...stylex.props(s.trim)}>{tx(car.optionsType ?? 'Basic')} {tx(" • ")}{tx(car.trim.split(' • ')[0])}</p><p {...stylex.props(s.price)}><CurrencyLabel size={14}/><strong>{tx(formatPrice(car.price))}</strong>{car.previousPrice && car.previousPrice > car.price ? <span {...stylex.props(s.discount)}>{tx(formatPrice(car.previousPrice - car.price))} {tx(" OFF")}</span> : null}</p><p {...stylex.props(s.monthly)}>{tx("EMI ")}<strong>{tx(formatPrice(car.monthly))}</strong>{tx("/mo ")}<span {...stylex.props(s.monthlyTerms)}>{tx("| 5yrs, 0% downpay")}</span></p></div>
          </div>
          <div {...stylex.props(s.pills)}><span {...stylex.props(s.pill)}>{formatStockMileage(car)}</span><span {...stylex.props(s.pill)}>{tx("GCC")}</span>{native ? <span {...stylex.props(s.pill)}>{tx("Flood free")}</span> : null}<span {...stylex.props(s.pill,s.condition)}><ShieldCheck size={12} fill="currentColor"/><strong>{tx("Great condition")}</strong></span></div>
          <div {...stylex.props(s.location)}><MapPin size={11} fill="currentColor"/><span {...stylex.props(s.locationText)}>{tx(car.location)}</span>{car.tier === 'Luxe' ? <ShowroomBadge premium/> : null}</div>
        </Link>
      </article>)}</div>
      <div aria-label={tx("Similar car slides")} {...stylex.props(s.dots)}>{cars.map((car,index)=><button key={car.slug} type="button" onClick={()=>select(index)} aria-label={tx(`Show similar car ${index+1}`)} aria-pressed={index===slide} {...stylex.props(s.dotButton)}><span {...stylex.props(s.dot,index===slide&&s.activeDot)}/></button>)}</div>
      <h2 {...stylex.props(s.heading,s.compareTitle)}>{tx("Similar Cars To Compare")}</h2>
      <div aria-hidden="true" {...stylex.props(s.labels)}><strong {...stylex.props(s.selectedLabel)}>{tx("Selected Car")}</strong><span {...stylex.props(s.otherLabel)}>{tx("Similar Cars")}</span></div>
      <div {...stylex.props(s.compareCars)}>{columns.map((car,index)=><Link key={car.slug} href={`/cars/${car.slug}`} aria-label={tx(`${index===0?'Selected':'Compare'} ${car.year} ${displayMake(car.make)} ${car.model}`)} {...stylex.props(s.compareCar)}><img src={assetPath(car.image)} alt={tx("")} width={350} height={197} {...stylex.props(s.comparePhoto)}/><strong {...stylex.props(s.compareName)}>{tx(car.year)} {tx(displayMake(car.make).toUpperCase())} {tx(car.model.toUpperCase())}</strong><span {...stylex.props(s.compareTrim)}>{tx(car.trim.split(' • ')[0])}</span></Link>)}</div>
    </div>
    <table aria-label={tx("Vehicle specification comparison")} {...stylex.props(s.table)}><caption {...stylex.props(s.srOnly)}>{tx("Selected vehicle followed by ")}{tx(columns.slice(1).map(c=>`${c.year} ${c.make} ${c.model}`).join(' and '))}</caption><tbody>
      <tr><th colSpan={columns.length} {...stylex.props(s.rowHeading)}>{tx("Price")}</th></tr><tr>{columns.map(car=><td key={car.slug} data-comparison-price={car.price} {...stylex.props(s.value,s.priceValue)}><strong>{tx(formatPrice(car.price))} {tx(currency.code)}</strong><span {...stylex.props(s.emiValue)}>{tx("Or ")}{tx(currency.code)} {tx(car.monthly)} {tx(" /")}<br/>{tx("Month")}</span></td>)}</tr>
      {([
        ['Mileage', columns.map(car=>formatStockMileage(car))],
        ['Engine Size', columns.map(car=>`${Number.parseFloat(car.engine)} L`)],
        ['Transmission', columns.map(car=>car.transmission)],
        ['Option Type', columns.map(car=>car.optionsType ?? 'Not recorded')],
      ] as [string,string[]][]).map(([label,values])=><Row key={label} label={tx(label)} values={values}/>)}
      {features.map(([label,values])=><Row key={label} label={tx(label)} values={values}/>)}
    </tbody></table>
  </section>;
}
function Row({label, values}: {label: string; values: (string | boolean | null)[]}) {
  const tx = useCopy();

  return <><tr><th colSpan={values.length} {...stylex.props(s.rowHeading)}>{tx(label)}</th></tr><tr>{values.map((value,index)=><td key={index} {...stylex.props(s.value)}>{value===true?<span aria-label={tx("Included in captured listing")} {...stylex.props(s.check)}><Check size={11} strokeWidth={2.2}/></span>:value===null||value===false?'−':value}</td>)}</tr></>;
}
const s=stylex.create({
  section:{fontFamily:'Roboto,Arial,sans-serif',scrollMarginTop:164,maxWidth:$.content,marginInline:'auto',marginTop:36,paddingBottom:40,color:'#202024',backgroundColor:'#fff'},
  inner:{paddingInline:{[media.mobile]:22,default:28}},
  heading:{fontFamily:$.fontDisplay,fontSize:16,fontWeight:600,lineHeight:'24px'},
  rail:{display:'flex',gap:12,overflowX:'auto',marginTop:21,scrollSnapType:'x mandatory',scrollbarWidth:'none'},
  card:{flex:'0 0 100%',minWidth:0,overflow:'hidden',scrollSnapAlign:'start',borderColor:'#f1ece3',borderStyle:'solid',borderWidth:1,borderRadius:9,backgroundImage:'linear-gradient(105deg,#faf5e9,#fff 75%)'},
  cardLink:{display:'block',color:'#101010'},
  carTitle:{overflow:'hidden',margin:'10px 10px 0',fontSize:16,fontWeight:700,lineHeight:'20px',whiteSpace:'nowrap',textOverflow:'ellipsis'},
  carBody:{display:'grid',gridTemplateColumns:'127px minmax(0,1fr)',gap:10,margin:'5px 9px 0'},
  picture:{position:'relative',height:72,overflow:'hidden',borderRadius:3},
  carPhoto:{width:'100%',height:'100%',objectFit:'cover'},
  interestBadge:{position:'absolute',left:0,right:0,bottom:0,color:'#fff',fontSize:9,fontWeight:600,lineHeight:'14px',textAlign:'center',backgroundColor:'#fc7700'},
  carInfo:{minWidth:0},
  trim:{fontFamily:$.fontDisplay,fontSize:13,lineHeight:'19px'},
  price:{display:'flex',alignItems:'center',gap:4,marginTop:5,color:'#202024',fontSize:16,lineHeight:'20px'},
  discount:{marginLeft:9,padding:'3px 5px',color:'#007641',fontSize:11,fontWeight:600,lineHeight:'17px',backgroundColor:'#e9f8ef'},
  monthly:{marginTop:7,overflow:'hidden',fontSize:14,lineHeight:'18px',whiteSpace:'nowrap'},
  monthlyTerms:{fontSize:11},
  pills:{display:'flex',gap:5,margin:'12px 9px 8px',overflow:'hidden'},
  pill:{display:'inline-flex',alignItems:'center',gap:4,flexShrink:0,minHeight:26,padding:'3px 8px',fontSize:12,lineHeight:'18px',borderColor:'#e6d7ba',borderStyle:'solid',borderWidth:1,borderRadius:7},
  condition:{backgroundColor:'#fff'},
  location:{display:'flex',alignItems:'center',gap:3,minHeight:31,paddingInline:9,},
  locationText:{fontFamily:$.fontDisplay,flexGrow:1,minWidth:0,overflow:'hidden',fontSize:11,lineHeight:'18px',whiteSpace:'nowrap',textOverflow:'ellipsis'},
  dots:{display:'flex',alignItems:'center',justifyContent:'center',gap:1,height:20,marginTop:3},
  dotButton:{display:'grid',placeItems:'center',minWidth:9,height:20,padding:0,borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
  dot:{width:5,height:5,borderRadius:5,backgroundColor:'#a8a8a8'},
  activeDot:{width:13,backgroundColor:'#202024'},
  compareTitle:{marginTop:18},
  labels:{display:'grid',gridTemplateColumns:'1fr 2fr',marginTop:18,fontFamily:$.fontDisplay,fontSize:12,lineHeight:'18px'},
  selectedLabel:{padding:'6px 5px',fontWeight:600,backgroundImage:'linear-gradient(90deg,#f5f5f5,#fdfdfd)'},
  otherLabel:{padding:'6px 5px',backgroundImage:'linear-gradient(90deg,#f5f5f5,#fff)'},
  compareCars:{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:0,marginTop:8},
  compareCar:{display:'block',minWidth:0,paddingInline:6},
  comparePhoto:{display:'block',width:'100%',height:'auto',aspectRatio:'16/9',objectFit:'cover'},
  compareName:{fontFamily:$.fontDisplay,display:'block',overflow:'hidden',marginTop:9,fontSize:12,fontWeight:700,lineHeight:'17px',whiteSpace:'nowrap',textOverflow:'ellipsis'},
  compareTrim:{fontFamily:$.fontDisplay,display:'block',marginTop:5,fontSize:11,lineHeight:'17px',color:'#202024'},
  table:{tableLayout:'fixed',width:'100%',marginTop:29,borderCollapse:'collapse',textAlign:'left'},
  rowHeading:{height:40,padding:'8px 22px',fontSize:15,fontWeight:600,lineHeight:'23px',color:'#202024',backgroundColor:'#f9f9fa',},
  value:{height:40,padding:'10px 22px',fontSize:11,lineHeight:'19px',color:'#858585',verticalAlign:'middle'},
  priceValue:{height:80,paddingTop:10,paddingBottom:8,fontSize:16,lineHeight:'24px'},
  emiValue:{display:'block',marginTop:1,fontSize:11,fontWeight:400,lineHeight:'18px'},
  check:{display:'grid',placeItems:'center',width:16,height:16,color:'#00ad67',borderRadius:'50%',backgroundColor:'#e4f7ef'},
  srOnly:{position:'absolute',width:1,height:1,padding:0,margin:-1,overflow:'hidden',clipPath:'inset(50%)',whiteSpace:'nowrap',borderWidth:0},
});
