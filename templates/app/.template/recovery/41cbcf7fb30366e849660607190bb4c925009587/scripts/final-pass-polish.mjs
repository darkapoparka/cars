import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const changes=[];
function one(source,before,after){if(source.split(before).length!==2)throw Error(`Ambiguous match: ${before.slice(0,100)}`);return source.replace(before,after);}
async function edit(path,sha,change){const before=await readFile(path,'utf8');if(createHash('sha256').update(before).digest('hex')!==sha)throw Error(`Changed file: ${path}`);changes.push([path,change(before)]);}
await edit('components/DetailOffers.tsx','19a993d523e6ba5174b39b8c00fa2b453daa55369f6a2db6e7c047e4a75e9fe2',s=>{
 s=one(s,"[paused,setPaused]=useState(false),",'');
 s=one(s,"  useEffect(()=>{if(!visible||paused||open||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const timer=setInterval(()=>setIndex(value=>(value+1)%3),5000);return()=>clearInterval(timer);},[visible,paused,open]);",`  useEffect(()=>{
    if(!visible||open||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const timer=setInterval(()=>{
      const node=rail.current,active=document.activeElement;
      const keyboardFocus=active instanceof HTMLElement&&node?.contains(active)&&active.matches(':focus-visible');
      const mouseHover=matchMedia('(hover: hover)').matches&&node?.matches(':hover');
      if(document.hidden||document.querySelector('[aria-modal="true"]')||touch.current!==null||keyboardFocus||mouseHover)return;
      setIndex(value=>(value+1)%3);
    },5000);
    return()=>clearInterval(timer);
  },[visible,open]);`);
 s=one(s,'data-offer-index={index} onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocus={()=>setPaused(true)} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))setPaused(false);}} onTouchStart={event=>{touch.current=event.touches[0].clientX;setPaused(true);}}','data-offer-index={index} data-offer-visible={visible} onTouchStart={event=>{touch.current=event.touches[0].clientX;}} onTouchCancel={()=>{touch.current=null;}}');
 s=one(s,'onClick={()=>{setIndex(item);setPaused(true);}}','onClick={()=>setIndex(item)}');
 s=one(s,'Math.round(vehicle.price*0.01)','Math.floor(vehicle.price*0.01)');
 s=one(s,"offerSubtitle:{color:'#4e628d',fontSize:15,","offerSubtitle:{color:'#4e628d',fontSize:16,");
 s=one(s,"interestSheet:{maxHeight:'calc(100dvh - 165px)'},","interestSheet:{maxHeight:'calc(100dvh - 165px)',borderRadius:0},");
 s=one(s,"scroll:{maxHeight:'calc(100dvh - 165px)',overflowY:'auto',borderRadius:'16px 16px 0 0'},","scroll:{maxHeight:'calc(100dvh - 165px)',overflowY:'auto',borderRadius:0},");return s;
});
await edit('components/VehicleComparison.tsx','adb1e0ea654d876e628f6688c2e9ad0a20093e4dd34ce2eedeeaad086c86af93',s=>{
 s=one(s,"section:{scrollMarginTop:164,","section:{fontFamily:'Roboto,Arial,sans-serif',scrollMarginTop:164,");
 s=one(s,"rail:{display:'flex',gap:12,overflowX:'auto',marginTop:24,","rail:{display:'flex',gap:12,overflowX:'auto',marginTop:21,");
 s=one(s,"compareTitle:{marginTop:18},","compareTitle:{marginTop:17},");
 s=one(s,"compareName:{display:'block',overflow:'hidden',marginTop:9,fontSize:11,","compareName:{display:'block',overflow:'hidden',marginTop:9,fontSize:12,");return s;
});
await edit('components/SimilarVehiclesSheet.tsx','d6908cd1ef81c9024004955d8366e369eaa91821282a5c4c6ac303aaa2af6071',s=>{
 s=one(s,"sheet:{width:'100%',","sheet:{fontFamily:'Roboto,Arial,sans-serif',width:'100%',");
 return one(s,'title:{maxWidth:290,','title:{maxWidth:260,');
});
await edit('components/CustomerStories.tsx','f1026cbe5e95f306a1a9beaf655bf11fbbd6a94e8b7c721d48342386c1e09262',s=>one(s,"color:'#050505',fontFamily:$.fontDisplay,fontSize:13,fontWeight:700,","color:'#050505',fontFamily:$.fontDisplay,fontSize:14,fontWeight:700,"));
await edit('components/VehicleDetailClient.tsx','36ab1f674cca126b3ab9631cd22a9dca2580bcc4bf86ed943eae5ffd55d3d251',s=>{
 s=one(s,'active.offsetLeft+active.offsetWidth-rail.clientWidth+8','active.offsetLeft+active.offsetWidth-rail.clientWidth+22');
 s=one(s,"sectionTab:{display:'grid',","sectionTab:{fontFamily:$.fontDisplay,display:'grid',");
 s=one(s,"compactTitle:{fontFamily:'Roboto,Arial,sans-serif',","compactTitle:{color:'#090909',fontFamily:'Roboto,Arial,sans-serif',");
 s=one(s,"compactPrice:{fontFamily:'Roboto,Arial,sans-serif',display:'block',marginTop:3,color:'#111',fontSize:13},","compactPrice:{fontFamily:'Roboto,Arial,sans-serif',display:'block',marginTop:3,color:'#111',fontSize:14},");
 return one(s,'<span {...stylex.props(s.compactPrice)}>AED {formatPrice(vehicle.price)} | EMI {formatPrice(vehicle.monthly)}/mo</span>','<span {...stylex.props(s.compactPrice)}>AED {formatPrice(vehicle.price)} | EMI {vehicle.monthly}/mo</span>');
});
// Preserve the full captured inspection tree, including the two native expansion points.
const state=JSON.parse(await readFile('reference/2026-09-26-continuation/fortuner-detail-state.json','utf8'));
const report=state.carDetails.content.inspectionReport;
for(const section of report)for(const node of section.child){if(node.status!==1||(node.error?.length??0)>0)throw Error(`Unexpected inspection status ${node.title}`);for(const child of node.child??[])if(child.status!==1||(child.error?.length??0)>0)throw Error(`Unexpected checkpoint ${child.title}`);}
const icons=['CarFront','Cog','Wrench','Zap','Armchair','CircleGauge'];
const sections=report.map((section,index)=>{
 const groups=section.child.map(node=>node.child?.length?{heading:node.title,items:node.child.map(child=>child.title)}:{items:[node.title]});
 const limit=(index===0||index===3)?6:groups.length;
 return `{title:${JSON.stringify(section.title)},icon:${icons[index]},groups:${JSON.stringify(groups.slice(0,limit))}${groups.length>limit?',extra:'+JSON.stringify(groups.slice(limit)):''}}`;
});
await edit('components/InspectionReport.tsx','441ab6f8595a5810c439db55bb04be3363cc23f41065cf3919520b69f89dd785',s=>{
 const start=s.indexOf('const sections: ReportSection[] = ['),end=s.indexOf('\nfunction Section(',start);
 if(start<0||end<0)throw Error('Inspection section boundary missing');
 return s.slice(0,start)+'// All checkpoint statuses were verified against the saved native listing response.\nconst sections: ReportSection[] = [\n'+sections.join(',\n')+'\n];'+s.slice(end);
});
for(const[path,source]of changes){await writeFile(path,source);console.log('UPDATED',path);}
await writeFile('reference/2026-09-26-final-pass/inspection-checkpoint-audit.json',JSON.stringify(report.map(section=>({title:section.title,groups:section.child.length,checkpoints:section.child.reduce((total,n)=>total+(n.child?.length??1),0),statuses:[...new Set(section.child.flatMap(n=>[n.status,...(n.child??[]).map(c=>c.status)]))]})),null,2));
