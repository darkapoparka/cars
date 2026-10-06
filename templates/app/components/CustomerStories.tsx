'use client';
import {useCopy} from '@/lib/locale';
import * as stylex from '@stylexjs/stylex';
import {CarFront, CircleCheck, MessageSquare, Quote, Star} from 'lucide-react';
import ReferenceVideo from '@/components/ReferenceVideo';
import {media, tokens as $} from '@/app/tokens.stylex';

const stories=[
  'The vehicle information given is very clear!',
  'They have really amazing options in most of the brands!',
  'I found the car I was looking for!',
  'The car got delivered right to my doorstep!',
  'Within a few clicks you can get your dream car!',
];
export default function CustomerStories(){
  const tx = useCopy();

  return <section id="happy-customers" aria-labelledby="customer-stories-title" {...stylex.props(s.section)}>
    <h2 id="customer-stories-title" {...stylex.props(s.heading)}>{tx("Our happy customers")}</h2>
    <div aria-label={tx("Captured customer statistics")} {...stylex.props(s.stats)}><div {...stylex.props(s.stat)}><CarFront size={22} fill="currentColor"/><strong {...stylex.props(s.number)}>{tx("10,000+")}</strong><span {...stylex.props(s.label)}>{tx("Car sold in UAE")}</span></div><div {...stylex.props(s.stat)}><CircleCheck size={19} fill="#202024" color="#fff"/><strong {...stylex.props(s.number)}>{tx("99%")}</strong><span {...stylex.props(s.label)}>{tx("Happy customers")}</span></div><div {...stylex.props(s.stat)}><span {...stylex.props(s.ratingIcon)}><MessageSquare size={23} fill="currentColor"/><Star size={10} fill="#fff" color="#fff" {...stylex.props(s.star)}/></span><strong {...stylex.props(s.number)}>{tx("4.2")}</strong><span {...stylex.props(s.label)}>{tx("Google rating")}</span></div></div>
    <div aria-label={tx("Customer video testimonials")} {...stylex.props(s.rail)}>{stories.map((quote,index)=><figure key={quote} {...stylex.props(s.story)}><div {...stylex.props(s.video)}><ReferenceVideo src={`/reference-assets/final-pass/customer-${index}.mp4`} poster={`/reference-assets/final-pass/customer-${index}.jpg`} label={tx(`customer testimonial ${index+1}`)} ratio="1.85"/></div><figcaption {...stylex.props(s.caption)}><Quote size={21} fill="currentColor" strokeWidth={0} {...stylex.props(s.openQuote)}/><span>{tx(quote)}</span><Quote size={21} fill="currentColor" strokeWidth={0} {...stylex.props(s.endQuote)}/></figcaption></figure>)}</div>
  </section>;
}
const s=stylex.create({
  section:{scrollMarginTop:164,marginTop:37,color:'#202024'},
  heading:{fontFamily:$.fontDisplay,fontSize:16,fontWeight:600,lineHeight:'24px'},
  stats:{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',marginTop:27,marginInline:{[media.mobile]:-22,default:0}},
  stat:{position:'relative',display:'flex',alignItems:'center',flexDirection:'column',height:78,color:'#202024',},
  number:{fontFamily:$.fontDisplay,marginTop:13,color:'#202024',fontSize:19,fontWeight:600,lineHeight:'25px'},
  label:{marginTop:2,color:'#535353',fontFamily:$.fontDisplay,fontSize:11,lineHeight:'18px',whiteSpace:'nowrap'},
  ratingIcon:{position:'relative',height:22},
  star:{position:'absolute',top:5,left:6},
  rail:{display:'flex',gap:22,overflowX:'auto',marginTop:26,marginRight:{[media.mobile]:-22,default:0},scrollSnapType:'x mandatory',scrollbarWidth:'none'},
  story:{flex:'0 0 calc(100% - 34px)',minWidth:0,scrollSnapAlign:'start',margin:0},
  video:{overflow:'hidden',borderRadius:9},
  caption:{display:'grid',gridTemplateColumns:'23px minmax(0,1fr) 23px',alignItems:'start',gap:13,marginTop:16,color:'#050505',fontFamily:$.fontDisplay,fontSize:14,fontWeight:700,lineHeight:'21px',textAlign:'center'},
  openQuote:{color:'#ff8a2d',transform:'rotate(180deg)'},
  endQuote:{color:'#ff8a2d'},
});
