import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const changes=[];
async function edit(file,sha,replacements){let text=await readFile(file,'utf8');if(createHash('sha256').update(text).digest('hex')!==sha)throw Error('Concurrent source change: '+file);for(const [before,after]of replacements){if(text.split(before).length!==2)throw Error('Nonunique replacement in '+file+': '+before.slice(0,80));text=text.replace(before,after);}changes.push([file,text]);}
await edit('components/VehicleDetailClient.tsx','c29dcba95bc39f0cac15b8301bda66cfaa0f346dc51cc5f0c360a92174023cc5',[
 ['Share2,ShieldCheck,X','Share2,X'],
 ["{reference?.optionsType??vehicle.optionsType??'Basic'} • GCC Specs", "<span {...stylex.props(s.optionsType)}>{reference?.optionsType??vehicle.optionsType??'Basic'}</span> • GCC Specs"],
 ['<span {...stylex.props(s.warrantyIcon)}><ShieldCheck size={27}/></span>','<img src="/reference-assets/polish/warranty-emblem.png" alt="" width={40} height={40}/>'],
 ["warrantyIcon:{display:'grid',placeItems:'center',width:40,height:40,color:'#006e68',borderRadius:'50%',backgroundColor:'#fff'},\n",''],
 ["title:{fontSize:{[media.mobile]:18,default:27},fontWeight:600", "title:{fontSize:{[media.mobile]:18,default:27},fontWeight:700"],
 ["subtitle:{marginTop:2,", "optionsType:{fontFamily:$.fontDisplay,fontSize:13,fontWeight:500},\nsubtitle:{marginTop:2,"],
 ["gap:8,minHeight:38,marginTop:10,paddingInline:8", "gap:10,minHeight:38,marginTop:10,paddingInline:8"],
 ["fontSize:11,fontWeight:600,lineHeight:'18px',whiteSpace:'nowrap'},\npriceLink", "fontSize:11,fontWeight:700,lineHeight:'18px',whiteSpace:'nowrap'},\npriceLink"],
 ["emi:{fontSize:16,fontWeight:500,lineHeight:'21px'}", "emi:{fontSize:16,fontWeight:600,lineHeight:'21px'}"],
 ["thumbShade:{position:'absolute',inset:0,backgroundImage:'linear-gradient(0deg,rgba(0,0,0,.88),rgba(0,0,0,.35))'}", "thumbShade:{position:'absolute',inset:0,backgroundImage:'linear-gradient(0deg,rgba(0,0,0,.86),rgba(35,35,35,.48))'}"],
 ["thumbLabel:{position:", "thumbLabel:{fontFamily:$.fontDisplay,position:"],
 ["primary:{display:", "primary:{fontFamily:$.fontDisplay,display:"],
 ["outline:{display:", "outline:{fontFamily:$.fontDisplay,display:"],
 ["{reference?.videoTour&&photo===0?<span {...stylex.props(s.tourPlay)}>","{reference?.videoTour&&photo===0?<span aria-hidden=\"true\" {...stylex.props(s.tourShade)}/>:null}{reference?.videoTour&&photo===0?<span {...stylex.props(s.tourPlay)}>"],
 ["tourPlay:{position:","tourShade:{position:'absolute',inset:0,pointerEvents:'none',backgroundImage:'linear-gradient(180deg,rgba(0,0,0,.40),transparent 45%,rgba(0,0,0,.29))'},\ntourPlay:{position:"],
]);
await edit('components/VehicleComparison.tsx','e1b97094ae5a0623c2660086b0457e7c3ea1acb7592052bc00920f1019bcd808',[
 ["fontSize:16,fontWeight:600,lineHeight:'20px',whiteSpace:'nowrap'","fontSize:16,fontWeight:700,lineHeight:'20px',whiteSpace:'nowrap'"],
 ["trim:{fontSize:14,", "trim:{fontFamily:$.fontDisplay,fontSize:13,"],
 ["monthly:{marginTop:7,overflow:'hidden',fontSize:12", "monthly:{marginTop:7,overflow:'hidden',fontSize:14"],
 ["<span>| 5yrs, 0% downpay</span>","<span {...stylex.props(s.monthlyTerms)}>| 5yrs, 0% downpay</span>"],
 ["  pills:{", "  monthlyTerms:{fontSize:11},\n  pills:{"],
 ["locationText:{flexGrow:1,", "locationText:{fontFamily:$.fontDisplay,flexGrow:1,"],
 ["compareName:{display:'block'", "compareName:{fontFamily:$.fontDisplay,display:'block'"],
 ["compareTrim:{display:'block'", "compareTrim:{fontFamily:$.fontDisplay,display:'block'"],
 ["compareTitle:{marginTop:17}", "compareTitle:{marginTop:18}"],
 ["table:{tableLayout:'fixed',width:'100%',marginTop:28", "table:{tableLayout:'fixed',width:'100%',marginTop:29"],
]);
await edit('components/DetailOffers.tsx','9c449365410371930b17ef79a242d550f79830aa8ee775b52bda36b1869093bb',[
 ["  terms:{display:","  terms:{fontFamily:'Roboto,Arial,sans-serif',display:"],
 ["gap:9,marginTop:11,color:'#777',fontSize:13,lineHeight:'20px'", "gap:9,marginTop:11,color:'#777',fontSize:14,lineHeight:'20px'"],
]);
await edit('components/CustomerStories.tsx','d55f1bf340f165e919599c349beb990be3677cc5e0365a70633f3513373d761d',[
 ["number:{marginTop:13,", "number:{fontFamily:$.fontDisplay,marginTop:13,"],
 ["fontSize:20,fontWeight:600,lineHeight:'25px'", "fontSize:19,fontWeight:600,lineHeight:'25px'"],
]);
for(const[file,text]of changes){await writeFile(file,text);console.log('Updated',file);}
