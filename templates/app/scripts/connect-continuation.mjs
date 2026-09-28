import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
async function edit(file,sha,changes){let s=await readFile(file,'utf8');if(createHash('sha256').update(s).digest('hex')!==sha)throw Error(`Changed ${file}`);for(const [from,to,count=1]of changes){if(s.split(from).length-1!==count)throw Error(`Unexpected match count ${file}: ${from}`);s=s.split(from).join(to);}await writeFile(file,s);console.log('Updated',file);}
await edit('app/page.tsx','3717a8327c55a0eb0c59141787cb19c669440e9c49bc02c32fc5ad205a42f147',[
 ['<VehicleCard vehicle={vehicle} />','<VehicleCard vehicle={vehicle} showDiscount={false} />'],
 ['<VehicleCard key={vehicle.slug} vehicle={vehicle} />','<VehicleCard key={vehicle.slug} vehicle={vehicle} showDiscount={false} />']
]);
await edit('components/InventoryClient.tsx','ce4ab773ca2a8859c447a8ecfeb4de7b215bd294b49457fae83ec2d4ed45b4e8',[
 ["type Props={initialQuery?:string;","type Props={initialEmiMax?:number;initialQuery?:string;"],
 ["export default function InventoryClient({initialQuery=''","export default function InventoryClient({initialEmiMax,initialQuery=''"],
 [" const [query,setQuery]=useState(initialQuery);"," const [query,setQuery]=useState(initialQuery);\n const [emiMax,setEmiMax]=useState(initialEmiMax);"],
 ["(!luxe||car.slug==='2024-toyota-fortuner-exr'||['Mercedes-Benz','BMW','Audi'].includes(car.make)||car.slug==='2024-toyota-land-cruiser-exr')&&matches(car,filters,query)","(!luxe||car.tier==='Luxe'||car.slug==='2024-toyota-fortuner-exr')&&(emiMax===undefined||car.monthly<=emiMax)&&matches(car,filters,query)"],
 [" },[filters,query,sort,luxe]);"," },[filters,query,sort,luxe,emiMax]);"],
 [" const filtered=Boolean(query.trim()"," const filtered=Boolean(emiMax!==undefined||query.trim()"],
 [" function reset(){setFilters(emptyFilters());setQuery('');}"," function reset(){setFilters(emptyFilters());setQuery('');setEmiMax(undefined);}"],
 [" const modal=useModal(overlay!==null,close);"," const modal=useModal(overlay!==null,close,{history:false});"],
]);
await edit('app/cars/page.tsx','6fc6c0c39caf4e0c941fa4172b0641907b89190eae4f8e823e969c21dc0b0845',[
 ['type CarsSearchParams = {','type CarsSearchParams = {\n  emiMax?: string | string[];'],
 ['    <InventoryClient\n','    <InventoryClient\n      key={JSON.stringify(params)}\n      initialEmiMax={params.emiMax !== undefined && Number.isFinite(Number(first(params.emiMax))) ? Math.max(0, Number(first(params.emiMax))) : undefined}\n'],
]);
await edit('app/app.css','78ef1c5ea4f84adb180f0a1f85ee3be4399739322fe178a3b7648e3d285498dd',[
 ['  h1, h2, h3, h4, p, figure, fieldset, legend { margin: 0; }','  h1, h2, h3, h4, p, figure, fieldset, legend, dd { margin: 0; }'],
 ['@stylex;','@stylex;\n\n/* Native range thumb and track pseudo-elements are scoped to this control. */\n.cars24-budget-range { display: block; appearance: none; width: calc(100% - 20px); height: 8px; margin: 20px 10px 0; border: 0; border-radius: 9px; background: linear-gradient(to right,#4736fe var(--range-progress,0%),#e1e7f1 var(--range-progress,0%)); cursor: pointer; }\n.cars24-budget-range::-webkit-slider-thumb { appearance: none; width: 20px; height: 20px; border: 1px solid #cbd7e9; border-radius: 50%; background: #fff; box-shadow: inset 7px 0 #fff,inset -7px 0 #fff; }\n.cars24-budget-range::-moz-range-thumb { width: 18px; height: 18px; border: 1px solid #cbd7e9; border-radius: 50%; background: #fff; }\ninput[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button, input[type=search]::-webkit-search-cancel-button { appearance: none; margin: 0; }\n']
]);
