import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import ts from 'typescript';
import sharp from 'sharp';
const specs=[
 ['components/VehicleDetailClient.tsx','c93cc6e62963acc525bc701d168a46d93d8752c74c63d6afc09b377f52c7b88b'],
 ['components/VehicleBelowFold.tsx','58c72b5f5a6935cf5cd0a324a0b992906d7d3521558f49726cb8a1e2592d4c9a'],
 ['lib/data.ts','8199a0d9608a3aedb04ad6429f0e5c330e1f071d7180462a80e4fa182b156e53'],
 ['components/VehicleComparison.tsx','491608cd18542c3b4a0b36c79409b9607b09d99a97d0550032327d97cab86e8e'],
];
const content=new Map();
for(const[file,sha]of specs){const source=await readFile(file,'utf8');if(createHash('sha256').update(source).digest('hex')!==sha)throw Error(`Source changed: ${file}`);content.set(file,source);}
function one(source,before,after){if(source.split(before).length!==2)throw Error(`Nonunique match: ${before.slice(0,110)}`);return source.replace(before,after);}
function prune(source){const at=source.indexOf('const s=stylex.create(')>=0?source.indexOf('const s=stylex.create('):source.indexOf('const s = stylex.create(');if(at<0)throw Error('No styles');const before=source.slice(0,at),used=new Set([...before.matchAll(/\bs\.([A-Za-z0-9_]+)/g)].map(m=>m[1]));const ast=ts.createSourceFile('source.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);let object;function visit(node){if(ts.isCallExpression(node)&&node.expression.getText(ast)==='stylex.create')object=node.arguments[0];ts.forEachChild(node,visit);}visit(ast);if(!object||!ts.isObjectLiteralExpression(object))throw Error('No style object');return before+'const s=stylex.create({\n'+object.properties.filter(p=>used.has(p.name.getText(ast))).map(p=>p.getText(ast)).join(',\n')+'\n});\n';}
let detail=content.get(specs[0][0]);
detail=one(detail,"import VehicleCard,{STORAGE_KEY} from '@/components/VehicleCard';","import {STORAGE_KEY} from '@/components/VehicleCard';\nimport VehicleComparison from '@/components/VehicleComparison';\nimport SimilarVehiclesSheet from '@/components/SimilarVehiclesSheet';\nimport DetailOffers from '@/components/DetailOffers';");
detail=one(detail,"type Overlay='price'|'emi'|'gallery'|'warranty'|null;","type Overlay='price'|'emi'|'gallery'|'warranty'|'similar'|null;");
detail=one(detail,"'service-history','car-finance','similar-cars'","'service-history','car-finance','happy-customers','similar-cars'");
detail=one(detail,"onClick={()=>document.getElementById('similar-cars')?.scrollIntoView({behavior:'smooth'})}","onClick={()=>setOverlay('similar')}");
const offer=detail.split('\n').find(line=>line.trim().startsWith('<section {...stylex.props(s.offer)}>'));
detail=one(detail,offer,'   <DetailOffers vehicle={vehicle} onLogin={()=>setLogin(true)}/>');
const related=detail.split('\n').find(line=>line.trim().startsWith('<section id="similar-cars"'));
detail=one(detail,related,'  <VehicleComparison vehicle={vehicle} related={related}/>');
detail=one(detail,"...(fortuner?[['Car finance','car-finance']]:[])","...(fortuner?[['Car finance','car-finance'],['Our happy customers','happy-customers']]:[])");
detail=one(detail,"  {overlay==='gallery'?<VehiclePhotoViewer", "  {overlay==='similar'?<SimilarVehiclesSheet vehicle={vehicle} related={related} onClose={()=>setOverlay(null)}/>:null}\n  {overlay==='gallery'?<VehiclePhotoViewer");
detail=one(detail,"compactTitle:{display:'block'","compactTitle:{fontFamily:'Roboto,Arial,sans-serif',display:'block'");
detail=one(detail,"compactPrice:{display:'block'","compactPrice:{fontFamily:'Roboto,Arial,sans-serif',display:'block'");
content.set(specs[0][0],prune(detail));
let below=content.get(specs[1][0]);
below=one(below,"import {useState, type ReactNode} from 'react';","import type {ReactNode} from 'react';");
below=one(below,", Wrench, X} from 'lucide-react';",", Wrench} from 'lucide-react';");
below=one(below,"import {useModal} from '@/components/useModal';","import ReferenceVideo from '@/components/ReferenceVideo';\nimport CustomerStories from '@/components/CustomerStories';");
below=one(below,"import {media, tokens as $}","import {tokens as $}");
below=one(below,"  const [video, setVideo] = useState(false);\n  const panel = useModal(video, () => setVideo(false));\n",'');
const start=below.indexOf('<button type="button" aria-label="Watch inspection video"'),end=below.indexOf('</button>',start)+9;
if(start<0||end<9)throw Error('Missing video');
below=below.slice(0,start)+'<ReferenceVideo src="/reference-assets/final-pass/inspection.mp4" poster="/reference-assets/continuation/inspection-poster.png" label="inspection video" posterHasButton ratio="1.64"/>'+below.slice(end);
below=one(below,'<VehicleFinanceSection vehicle={vehicle} onLogin={onLogin}/></>','<VehicleFinanceSection vehicle={vehicle} onLogin={onLogin}/><CustomerStories/></>');
const videoLine=below.split('\n').find(line=>line.trim().startsWith('{video ? <div'));
below=one(below,videoLine,'');
content.set(specs[1][0],prune(below));
let data=content.get(specs[2][0]);data=one(data,"import {capturedVehicles} from './captured-inventory';","import {capturedVehicles} from './captured-inventory';\nimport {capturedRelatedVehicles} from './captured-related';");
data=one(data,'  ...capturedVehicles.filter(vehicle => !existingVehicles.some(existing => existing.slug === vehicle.slug)),','  ...capturedVehicles.filter(vehicle => !existingVehicles.some(existing => existing.slug === vehicle.slug)),\n  ...capturedRelatedVehicles.filter(vehicle => !existingVehicles.some(existing => existing.slug === vehicle.slug) && !capturedBySlug.has(vehicle.slug)),');content.set(specs[2][0],data);
content.set(specs[3][0],one(content.get(specs[3][0]),'car.mileage)))} km','car.mileage))} km'));
// Only isolated artwork and icons are taken from captures; the UI remains interactive HTML.
const crops=[['final-interest-sheet','interest-offer',0,300,427,243],['final-native-promotion-next','offer-icon-0',23,669,32,32],['final-native-detail-ready','offer-icon-1',23,669,32,32],['native-gallery-top','offer-icon-2',23,669,32,32]];
for(const[name,target,x,y,w,h]of crops){const image=sharp(`reference/2026-09-26-continuation/${name}.png`);const meta=await image.metadata(),scale=meta.width/427;await image.extract({left:Math.round(x*scale),top:Math.round(y*scale),width:Math.min(meta.width-Math.round(x*scale),Math.round(w*scale)),height:Math.round(h*scale)}).png().toFile(`public/reference-assets/final-pass/${target}.png`);}
for(const[file,value]of content){await writeFile(file,value);console.log('UPDATED',file);}
await writeFile('reference/2026-09-26-final-pass/crop-manifest.json',JSON.stringify(crops.map(([source,target,x,y,w,h])=>({source:`reference/2026-09-26-continuation/${source}.png`,target:`public/reference-assets/final-pass/${target}.png`,rectAt427:[x,y,w,h]})),null,2));
