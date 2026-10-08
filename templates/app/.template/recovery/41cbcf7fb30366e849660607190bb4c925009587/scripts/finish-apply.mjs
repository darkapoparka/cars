import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const changes=[];
function replace(source,before,after){if(source.split(before).length!==2)throw Error('Expected unique match: '+before.slice(0,100));return source.replace(before,after);}
async function edit(file,sha,fn){const source=await readFile(file,'utf8');if(createHash('sha256').update(source).digest('hex')!==sha)throw Error('Source changed: '+file);changes.push({file,before:source,after:fn(source)});}
await edit('components/VehicleDetailClient.tsx','a6e258f759101a77595fd1770af5a605c78bd086483a57d283b1fc1ad90a7497',s=>{
 s=replace(s,' const primaryImage=reference?.primaryImage??vehicle.image;',' const primaryImage=reference?.primaryImage??vehicle.image;\n const exteriorThumbnail=reference?.gallery.find(item=>item.label===\'Right Side View\')?.src??primaryImage;');
 s=replace(s,"[{label:'Exteriors',image:primaryImage},{label:'Interiors',image:'/reference-assets/fortuner-interior.jpg'}","[{label:'Exteriors',image:primaryImage,thumbnail:exteriorThumbnail},{label:'Interiors',image:'/reference-assets/fortuner-interior.jpg',thumbnail:photos.find(item=>/Right Side Front Door Cabin/i.test(item.label))?.src}");
 s=replace(s,"image:category==='Exteriors'?primaryImage:first.src}","image:category==='Exteriors'?primaryImage:first.src,thumbnail:category==='Exteriors'?exteriorThumbnail:first.src}");
 s=replace(s,'stylex.props(s.photoTabs)}','stylex.props(s.photoTabs,Boolean(reference?.videoTour)&&s.fourPhotoTabs)}');
 s=replace(s,'<img src={tab.image} alt="" {...stylex.props(s.thumb)}/>','<img src={(\'thumbnail\' in tab?tab.thumbnail:undefined)??tab.image} alt="" {...stylex.props(s.thumb)}/>');
 s=replace(s,"photoTabs:{display:'flex',gap:12,marginTop:8,overflowX:'auto',scrollbarWidth:'none'},","photoTabs:{display:'flex',gap:11,marginTop:9,paddingRight:{[media.mobile]:6,default:0},overflowX:'auto',scrollbarWidth:'none'},\nfourPhotoTabs:{paddingRight:0,marginRight:{[media.mobile]:-4,default:0}},");
 s=replace(s,'heading:{marginTop:20}','heading:{marginTop:18}');
 s=replace(s,"title:{fontSize:{[media.mobile]:18,default:27},fontWeight:700,lineHeight:'25px'}","title:{fontFamily:$.fontDisplay,fontSize:{[media.mobile]:18,default:27},fontWeight:600,lineHeight:{[media.mobile]:'27px',default:'35px'}}");
 s=replace(s,'subtitle:{marginTop:2,','subtitle:{marginTop:0,');
 s=replace(s,"dealer:{display:'flex',alignItems:'center',gap:10,","dealer:{fontFamily:$.fontDisplay,display:'flex',alignItems:'center',gap:6,");
 s=replace(s,"price:{fontSize:19,fontWeight:600,lineHeight:'24px'","price:{fontFamily:$.fontDisplay,fontSize:18,fontWeight:600,lineHeight:'25px'");
 s=replace(s,'currency:{fontSize:15,fontWeight:500}','currency:{fontSize:14,fontWeight:600}');
 s=replace(s,"oldPrice:{color:'#007440',fontSize:11,fontWeight:700,","oldPrice:{fontFamily:$.fontDisplay,color:'#007440',fontSize:11,fontWeight:600,");
 s=replace(s,"priceLink:{flexShrink:0,marginLeft:'auto',padding:0,color:'#00338c',fontSize:12,fontWeight:500,","priceLink:{fontFamily:$.fontDisplay,flexShrink:0,marginLeft:'auto',padding:0,color:'#00338c',fontSize:11,fontWeight:600,");
 return replace(s,"emi:{fontSize:16,","emi:{fontFamily:$.fontDisplay,fontSize:16,");
});
await edit('components/VehicleGallery.tsx','84fa93f4f0aae4e80e79491a6215441a4708d91d9523b69ff446fb64b9bab2f4',s=>replace(s,'  tab: {minHeight: 29,','  tab: {fontFamily:$.fontDisplay,minHeight: 29,'));
await edit('components/VehiclePriceSheet.tsx','c44399846891f9ed5a85a0802d7b0a8d7646a004390bca98ca30d26e9e715b64',s=>{
 s=replace(s,"  emiSheet: {minHeight:0,","  emiSheet: {minHeight:{[media.mobile]:'min(856px,calc(100dvh - 96px))',default:0},");
 s=replace(s,'  emiHeading: {fontSize: 18,','  emiHeading: {position:\'relative\',left:-2,top:-2,fontSize: 18,');
 return replace(s,"eligibility: {width: '100%', minHeight: 45, marginTop: 22,","eligibility: {width: '100%', minHeight: 45, marginTop: 25,");
});
await mkdir('reference/2026-09-26-finish/source-before',{recursive:true});
for(const change of changes){await writeFile('reference/2026-09-26-finish/source-before/'+change.file.split('/').at(-1)+'.txt',change.before,{flag:'wx'});}
for(const change of changes){await writeFile(change.file,change.after);console.log('Updated '+change.file);}
await writeFile('reference/2026-09-26-finish/changes.json',JSON.stringify(changes.map(c=>({path:c.file,before:createHash('sha256').update(c.before).digest('hex'),after:createHash('sha256').update(c.after).digest('hex')})),null,2));
