import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const changes=[];
async function edit(file,sha,replacements){let text=await readFile(file,'utf8');if(createHash('sha256').update(text).digest('hex')!==sha)throw Error('Concurrent source change: '+file);for(const [before,after]of replacements){if(text.split(before).length!==2)throw Error('Non-unique replacement in '+file+': '+before.slice(0,70));text=text.replace(before,after);}changes.push([file,text]);}
await edit('components/VehiclePriceSheet.tsx','cf991661aa450bd861e8de149494a8646a12aaf789099f84a611186cf9a525bd',[
 ['position: \'fixed\', inset: 0, zIndex: 210','position: \'fixed\', top: {[media.mobile]:51,default:0}, right:0, bottom:0, left:0, zIndex: 210'],
 ["maxWidth: 600, maxHeight:","maxWidth: 600, minHeight:{[media.mobile]:'min(620px,calc(100dvh - 75px))',default:0}, maxHeight:"],
 ["padding: '18px 17px 14px'","padding: '18px 17px 13px'"],
 ["s.priceRow, s.benefit)}><span>3 months warranty","s.priceRow, s.benefit, s.firstBenefit)}><span>3 months warranty"],
 ["description: {marginTop: 7,","description: {marginTop: 6,"],
 ["  benefit: {","  firstBenefit:{marginTop:15},\n  benefit: {"],
 ["total: {marginTop: 20,","total: {marginTop: 17,"],
 ["mandatory: {marginTop: 13}","mandatory: {marginTop: 12, paddingBottom:19}"],
 ["s.charge)}><div><span {...stylex.props(s.dotted)}>Registration","s.charge, s.firstCharge)}><div><span {...stylex.props(s.dotted)}>Registration"],
 ["  charge: {","  firstCharge:{marginTop:11},\n  charge: {"],
 ["gap: 8, marginTop: 13, fontSize: 13","gap: 8, marginTop: 16, fontSize: 13"],
 ["priceNote: {marginTop: 27,","priceNote: {maxWidth:355, marginTop: 27,"],
 ["<p {...stylex.props(s.description)}>Includes","<p {...stylex.props(s.description,s.feeDescription)}>Includes"],
 ["  feeGroup: {","  feeDescription:{maxWidth:300},\n  feeGroup: {"],
 ["emiSheet: {maxHeight:","emiSheet: {minHeight:0, maxHeight:"],
 ["emiSummary: {marginTop: 22,","emiSummary: {marginTop: 21,"],
 ["s.sliderLabel)}><label htmlFor=\"vehicle-downpayment\">Select your Downpayment</label><output>","s.sliderLabel)}><label htmlFor=\"vehicle-downpayment\">Select your Downpayment</label><output {...stylex.props(s.depositValue)}>"],
 ["  limits: {","  depositValue:{fontFamily:'Roboto,Arial,sans-serif',fontSize:16,fontWeight:500},\n  limits: {"],
 ["yearButtons: {display: 'flex', gap: 11,","yearButtons: {display: 'flex', gap: 12,"],
 ["year: {width: 50, height: 37,","year: {width: 49, height: 36,"],
 ["interestRow: {display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 26,","interestRow: {display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 24,"],
 ["loanTerms: {marginTop: 25,","loanTerms: {marginTop: 21,"],
 ["<aside {...stylex.props(s.pleaseNote)}><h3>Please Note</h3><p>• Convenience fee, Insurance fee & RTA fee is not included in this EMI<br />• 2 year warranty and service contract is mandatory for availing zero downpayment</p></aside>","<aside {...stylex.props(s.pleaseNote)}><h3 {...stylex.props(s.noteTitle)}>Please Note</h3><ul {...stylex.props(s.noteList)}><li>Convenience fee, Insurance fee &amp; RTA fee is not included in this EMI</li><li>2 year warranty and service contract is mandatory for availing zero downpayment</li></ul></aside>"],
 ["  pleaseNote: {","  noteTitle:{fontSize:13,fontWeight:500,lineHeight:'20px'},\n  noteList:{display:'grid',gap:3,margin:'8px 0 0',paddingLeft:11,lineHeight:'18px'},\n  pleaseNote: {"],
]);
await edit('components/VehicleServiceHistory.tsx','48c143cf36414a00a6b713b182286a7dc633c3bb57b009d75f75ca4a8dc67967',[
 ["marginTop:23,marginInline","marginTop:20,marginInline"],
 ["fontSize:13,fontWeight:400,lineHeight:'21px'","fontSize:14,fontWeight:400,lineHeight:'21px'"],
 ["recordHeader:{display:","recordHeader:{fontFamily:'Roboto,Arial,sans-serif',display:"],
 ["location:{marginTop:6,color:'#555',fontSize:11","location:{marginTop:6,color:'#555',fontSize:11.5"],
]);
await edit('components/VehicleFeatures.tsx','43b96fc9ad7234859b5671140f110899e36c391c280a7b4423f917fc6c361804',[
 ["section: {marginTop: 36}","section: {marginTop: 28}"],
 ["item: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 15, minHeight: 42,","item: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 15, minHeight: 41,"],
]);
for(const [file,text]of changes){await writeFile(file,text);console.log('Updated',file);}
