'use client';

import {useState} from 'react';
import {useSearchParams} from '@/lib/navigation';
import * as stylex from '@stylexjs/stylex';
import PageHeader from './PageHeader';
import DealerEnquirySheet from './DealerEnquirySheet';
import {dealer} from '@/lib/dealer-config';
import {useCopy} from '@/lib/locale';
import {media, tokens as $} from '@/app/tokens.stylex';
export default function DealerRequestPage({kind}: {kind: 'sell' | 'service'}) {
  const tx = useCopy(), params = useSearchParams();
  const [make, setMake] = useState(params.get('brand') || '');
  const [model, setModel] = useState(''), [details, setDetails] = useState(''), [open, setOpen] = useState(false);
  const title = kind === 'sell' ? 'Sell or part-exchange' : 'Vehicle service enquiry';
  return <><PageHeader title={tx(title)}/><main {...stylex.props(s.page)}>
    <h2 {...stylex.props(s.title)}>{tx('Tell the dealer about your car')}</h2>
    <p {...stylex.props(s.note)}>{tx('Prepare a draft to discuss with the dealer. This does not create a valuation, booking or service order.')}</p>
    <form onSubmit={event => {event.preventDefault();setOpen(true);}} {...stylex.props(s.form)}>
      <label {...stylex.props(s.label)}>{tx('Make')}<input required maxLength={80} value={make} onChange={event => setMake(event.target.value)} autoComplete="off" {...stylex.props(s.input)}/></label>
      <label {...stylex.props(s.label)}>{tx('Model')}<input required maxLength={100} value={model} onChange={event => setModel(event.target.value)} autoComplete="off" {...stylex.props(s.input)}/></label>
      <label {...stylex.props(s.label)}>{tx('Year, mileage and what you need')}<textarea rows={5} maxLength={2000} value={details} onChange={event => setDetails(event.target.value)} {...stylex.props(s.input)}/></label>
      <button type="submit" {...stylex.props(s.action)}>{tx('Prepare enquiry')}</button>
    </form>
    {dealer.phoneE164 ? <a href={'tel:' + dealer.phoneE164} {...stylex.props(s.contact)}>{tx('Call dealer')} · {dealer.phoneDisplay}</a> : null}
    <p {...stylex.props(s.note)}>{tx('Service availability, prices and terms must be confirmed directly with the dealer.')}</p>
    <DealerEnquirySheet open={open} onClose={() => setOpen(false)} vehicleTitle={make + ' ' + model + '\n' + tx(title) + '\n' + details}/>
  </main></>;
}
const s = stylex.create({
  page:{maxWidth:720,marginInline:'auto',paddingInline:{[media.mobile]:22,default:28},paddingBottom:80},
  title:{marginTop:24,fontSize:23,lineHeight:1.3,fontWeight:600,color:$.ink},
  note:{marginTop:14,fontSize:13,lineHeight:1.6,color:$.muted},form:{display:'grid',gap:20,marginTop:28},
  label:{display:'grid',gap:8,fontSize:14,color:$.ink},input:{display:'block',width:'100%',minHeight:46,padding:12,fontSize:16,lineHeight:1.5,color:$.ink,borderColor:$.controlBorder,borderStyle:'solid',borderWidth:1,borderRadius:12,backgroundColor:'#fff'},
  action:{minHeight:48,padding:12,fontSize:15,fontWeight:500,color:'#fff',borderWidth:0,borderRadius:14,backgroundColor:'#262629',cursor:'pointer'},
  contact:{display:'flex',alignItems:'center',justifyContent:'center',minHeight:48,marginTop:18,fontSize:14,color:$.ink},
});
