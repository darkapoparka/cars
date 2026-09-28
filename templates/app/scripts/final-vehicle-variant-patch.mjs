import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const changes=[];
function one(s,a,b){if(s.split(a).length!==2)throw Error('Ambiguous source: '+a.slice(0,110));return s.replace(a,b);}
async function edit(file,sha,change){const source=await readFile(file,'utf8');if(createHash('sha256').update(source).digest('hex')!==sha)throw Error('Concurrent source change: '+file);changes.push([file,change(source)]);}
await edit('lib/reference-types.ts','5bd4708bc1539caab9cd56f857a96782a097e983024fb68c93504e9fd1b32c79',s=>{
 s=one(s,'status: number | null; remarks: string[]','status: number | null; remarks: string[]; value?: string');
 return one(s,'  gallery: GalleryPhoto[];','  gallery: GalleryPhoto[];\n  primaryImage?: string;\n  subcategory?: string;\n  optionsType?: string;\n  videoTour?: {src:string;poster:string};\n  priceComparison?: {marketPrice:number;newCarPrice?:number;cars24Price:number;totalSavings:number};');
});
await edit('scripts/build-captured-vehicle-details.mjs','3dcae2aad0c763e10b607cf0a954c0aff3dab500b96a05a5d25fb3c09c98c64d',s=>{
 s=one(s,"const jobs=[],data={},photoSources=new Map(),failures=[];","const variants=JSON.parse(await readFile(root+'/variant-data.json','utf8'));\nconst jobs=[],data={},photoSources=new Map(),failures=[];");
 s=one(s,'remarks:errors(node)};','remarks:errors(node),...(node.value!==undefined?{value:String(node.value)}:{})};');
 s=one(s,'gallery:photos,specifications:specs,',"gallery:photos,primaryImage:asset(c.mainImage?.standardised?.path??c.mainImage?.path,id,'primary'),subcategory:c.assortmentSubCategory,optionsType:c.optionsType,...(variants[entry.slug]?.videoTour?{videoTour:variants[entry.slug].videoTour}:{}),...(Number.isFinite(c.priceBenefits?.marketPrice)?{priceComparison:{marketPrice:c.priceBenefits.marketPrice,...(Number.isFinite(c.priceBenefits.newCarPrice)?{newCarPrice:c.priceBenefits.newCarPrice}:{}),cars24Price:c.priceBenefits.cars24Price,totalSavings:c.priceBenefits.totalSavings}}:{}),specifications:specs,");
 s=one(s,'filter(p=>p.status!==1||p.remarks.length>0).length,','filter(p=>p.status===2||p.remarks.length>0).length,');
 return s;
});
await edit('components/ReferenceVideo.tsx','e830199b958102079c0f150171578ce32ebd29720f884bdcb5691126a9df4918',s=>{
 s=one(s,"posterHasButton = false, ratio = '1.64'","posterHasButton = false, ratio = '1.64',autoPlay=false");
 s=one(s,'posterHasButton?: boolean; ratio?: string','posterHasButton?: boolean; ratio?: string;autoPlay?:boolean');
 s=one(s,'[started, setStarted] = useState(false)','[started, setStarted] = useState(autoPlay)');
 s=one(s,'[controls, setControls] = useState(true)','[controls, setControls] = useState(!autoPlay)');
 s=one(s,'    observer.observe(element);','    observer.observe(element);\n    if(autoPlay)void element.play().catch(()=>setError(\'The video could not start. Tap play to retry.\'));');
 return one(s,'  }, []);','  }, [autoPlay]);');
});
await edit('components/VehicleDetailClient.tsx','644951100015e60a4ad2271a00b3e29a3a8ca1733393dc1b80119844113fbe0f',s=>{
 s=one(s,'ChevronLeft,Heart,Info,Share2','ChevronLeft,Heart,Info,Play,Share2');
 s=one(s,"import VehiclePhotoViewer from '@/components/VehiclePhotoViewer';","import VehiclePhotoViewer from '@/components/VehiclePhotoViewer';\nimport VehicleTourViewer from '@/components/VehicleTourViewer';");
 s=one(s,"'warranty'|'similar'|null","'warranty'|'similar'|'tour'|null");
 s=one(s,' const primaryImage=vehicle.image;',' const primaryImage=reference?.primaryImage??vehicle.image;');
 s=one(s," const isLuxe=vehicle.tier==='Luxe'||fortuner;"," const isLuxe=reference?.subcategory?reference.subcategory==='LUXE':vehicle.tier==='Luxe'||fortuner;\n const tier=reference?.subcategory==='LITE'?'Lite':isLuxe?'Luxe':'Prime';");
 const imageButton=s.split('\n').find(line=>line.trim().startsWith('<button type="button" onClick={()=>setOverlay(\'gallery\')}'));
 if(!imageButton)throw Error('Hero image button missing');
 s=one(s,imageButton,`   <button type="button" onClick={()=>setOverlay(reference?.videoTour&&photo===0?'tour':'gallery')} aria-label={reference?.videoTour&&photo===0?'Open vehicle video tour':'Open vehicle photo gallery'} {...stylex.props(s.imageButton)}><img src={reference?.videoTour&&photo===0?reference.videoTour.poster:gallery[photo].image} alt={title} width={1365} height={768} fetchPriority="high" {...stylex.props(s.heroImage)}/>{reference?.videoTour&&photo===0?<span {...stylex.props(s.tourPlay)}><Play size={22} fill="currentColor"/></span>:null}</button>`);
 const tabs=s.split('\n').find(line=>line.trim().startsWith('<nav aria-label="Vehicle photographs"'));
 s=one(s,tabs,`   <nav aria-label="Vehicle photographs" {...stylex.props(s.photoTabs)}>{reference?.videoTour?<button type="button" onClick={()=>setOverlay('tour')} {...stylex.props(s.photoTab)}><img src={photos.find(item=>item.category==='Interiors')?.src??reference.videoTour.poster} alt="" {...stylex.props(s.thumb)}/><span {...stylex.props(s.thumbShade)}/><span {...stylex.props(s.thumbLabel)}>Video tour</span></button>:null}{gallery.slice(0,3).map(tab=><Link key={tab.label} href={\`/cars/\${vehicle.slug}/gallery?category=\${tab.label}\`} {...stylex.props(s.photoTab)}><img src={tab.image} alt="" {...stylex.props(s.thumb)}/><span {...stylex.props(s.thumbShade)}/><span {...stylex.props(s.thumbLabel)}>{tab.label}</span></Link>)}</nav>`);
 s=one(s,"{vehicle.optionsType??'Basic'} • GCC Specs","{reference?.optionsType??vehicle.optionsType??'Basic'} • GCC Specs");
 const dealer=s.split('\n').find(line=>line.trim().startsWith('<div {...stylex.props(s.dealer)}>'));
 s=one(s,dealer,`   <div {...stylex.props(s.dealer,!isLuxe&&s.dealerPrime)}><img src={isLuxe?'/reference-assets/luxe-tag.svg':tier==='Lite'?'/reference-assets/continuation/filter-type-lite.png':'/reference-assets/final-pass/prime-tag.png'} alt={'Cars24 '+tier} width={61} height={15}/><span>| Sold by Cars24</span><button type="button" onClick={()=>setOverlay('warranty')} aria-label="About the seller" {...stylex.props(s.info,!isLuxe&&s.primeInfo)}><Info size={14}/></button></div>`);
 s=one(s,'   <DetailOffers vehicle={vehicle} onLogin={()=>setLogin(true)}/>','   {isLuxe?<DetailOffers vehicle={vehicle} onLogin={()=>setLogin(true)}/>:null}');
 s=one(s,'   <VehicleBelowFold vehicle={vehicle} reference={reference}',"   {!isLuxe?<DetailOffers vehicle={vehicle} onLogin={()=>setLogin(true)}/>:null}\n   <VehicleBelowFold vehicle={vehicle} reference={reference}");
 s=one(s,"  {overlay==='gallery'?<VehiclePhotoViewer", "  {overlay==='tour'&&reference?.videoTour?<VehicleTourViewer {...reference.videoTour} onClose={()=>setOverlay(null)}/>:null}\n  {overlay==='gallery'?<VehiclePhotoViewer");
 s=one(s,"imageButton:{display:'block',","imageButton:{position:'relative',display:'block',");
 s=one(s,"minWidth:90,maxWidth:180,","minWidth:0,maxWidth:180,");
 return one(s,'heroImage:{',"tourPlay:{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',display:'grid',placeItems:'center',width:48,height:48,color:'#000',borderRadius:'50%',backgroundColor:'#fff'},\ndealerPrime:{color:'#033294',backgroundImage:'linear-gradient(90deg,#f0f4ff,#fff)'},\nprimeInfo:{color:'#033294'},\nheroImage:{");
});
await edit('components/VehicleBelowFold.tsx','63802ff6553e189cc8440d2187392c79931ae567ed392cc5d5a48ce2e36562b9',s=>{
 s=one(s,'  const hasDetails=Boolean(reference)||fortuner;',"  const hasDetails=Boolean(reference)||fortuner;\n  const isLuxe=reference?.subcategory==='LUXE'||(!reference&&vehicle.tier==='Luxe')||fortuner;\n  const comparison=reference?.priceComparison??(fortuner?{cars24Price:94099,marketPrice:104000,newCarPrice:127000,totalSavings:9901}:undefined);\n  const comparedPrices=comparison?[['CARS24 price',comparison.cars24Price,72],['Market price',comparison.marketPrice,93],...(comparison.newCarPrice?[['New car price',comparison.newCarPrice,150]]:[])]:[];");
 const assurance=s.split('\n').find(line=>line.trim().startsWith('{fortuner || vehicle.tier'));
 s=one(s,assurance,`      {hasDetails&&reference?.subcategory!=='LITE'?<Link href="/benefits/warranty" aria-label={isLuxe?'Cars24 Luxe Assurance':'Cars24 Assurance'} {...stylex.props(s.assurance)}><img src={isLuxe?'/reference-assets/continuation/luxe-assurance.png':'/reference-assets/final-pass/prime-assurance.png'} width={1086} height={702} alt="Cars24 assurance. 30 day return, no flood damage, no structural damage, no odometer tampering. Captured reference benefits." {...stylex.props(s.image)}/></Link>:null}`);
 s=one(s,'{fortuner ? <section aria-labelledby="price-comparison"','{comparison ? <section aria-labelledby="price-comparison"');
 s=one(s,'>AED 9,901 Savings</span>','>AED {formatPrice(comparison.totalSavings)} Savings</span>');
 s=one(s,"{[['CARS24 price', 94099, 72], ['Market price', 104000, 93], ['New car price', 127000, 150]].map(",'{comparedPrices.map(');
 return s;
});
await edit('components/InspectionReport.tsx','e4ce37ca5c6f7445178c959814898f316ba4fb3b4598c61ca9db76d8b1f6602b',s=>{
 const first=s.indexOf('function Checkpoint('),last=s.indexOf('\nfunction Section(',first);if(first<0||last<0)throw Error('Checkpoint component missing');
 s=s.slice(0,first)+`function Checkpoint({item,direct}: {item:ReferenceCheckpoint;direct:boolean}) {
  const passed=item.status===1;
  return <><div data-inspection-status={item.status??'unknown'} data-inspection-name={item.name} {...stylex.props(s.row,direct&&s.directRow,item.remarks.length>0&&s.rowWithFinding)}><span>{item.name}</span>{item.value?<span {...stylex.props(s.metric)}>{item.value}</span>:item.remarks.length?<span aria-label="Imperfection recorded" {...stylex.props(s.findingIcon)}><Info size={20}/></span>:<span aria-label={passed?'Passed in captured report':'No pass result recorded'} {...stylex.props(s.passed,!passed&&s.unrated)}>{passed?<Check size={16} strokeWidth={1.7}/>:'−'}</span>}</div>{item.remarks.length?<div {...stylex.props(s.findingText)}><h4 {...stylex.props(s.findingLabel)}>Imperfection</h4>{item.remarks.map((remark,index)=><p key={index}>{remark}</p>)}</div>:null}</>;
}`+s.slice(last);
 s=one(s,"  findingButton:{display:'grid',placeItems:'center',width:25,height:25,padding:0,color:'#e67e22',borderWidth:0,borderRadius:'50%',backgroundColor:'#fff4e5',cursor:'pointer'},","  findingIcon:{display:'grid',placeItems:'center',width:24,height:24,color:'#176597'},\n  metric:{color:'#40506d',fontSize:14,fontWeight:500},\n  rowWithFinding:{minHeight:42,paddingBottom:2,borderBottomWidth:0},\n  findingLabel:{marginBottom:3,color:'#00578b',fontSize:12,fontWeight:500,lineHeight:'18px'},");
 return one(s,"findingText:{padding:'10px 16px 14px',color:'#79522c',fontSize:12,lineHeight:'19px',backgroundColor:'#fffaf3'},","findingText:{padding:'0 16px 18px',color:'#7a869f',fontSize:12,lineHeight:'19px',backgroundColor:'#fff'},");
});
await edit('app/cars/[slug]/inspection/page.tsx','26717af57da28178f59d04332d0f7bf8a34f3b4fef359fcef254721a00e03d1d',s=>one(s,'vehicle={vehicle} capturedSections=','vehicle={{...vehicle,image:reference.primaryImage??vehicle.image}} capturedSections='));
// Reuse the verified native Prime tag, cropped independently of the rest of the interface.
const image=sharp('reference/2026-09-26-continuation/final-ciaz-ready.png');const m=await image.metadata(),scale=m.width/427;
await image.extract({left:Math.round(30*scale),top:Math.round(432*scale),width:Math.round(67*scale),height:Math.round(19*scale)}).png().toFile('public/reference-assets/final-pass/prime-tag.png');
for(const[file,source]of changes){await writeFile(file,source);console.log('UPDATED',file);}
