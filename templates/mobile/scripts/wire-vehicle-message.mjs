import fs from 'node:fs';
import sharp from 'sharp';
function patch(path,a,b){let t=fs.readFileSync(path,'utf8');if(!t.includes(a))throw Error('Patch not found '+path+' '+a);fs.writeFileSync(path,t.replace(a,b));}
fs.mkdirSync('src/app/vehicle/[id]/message',{recursive:true});
fs.writeFileSync('src/app/vehicle/[id]/message/page.tsx',`import { notFound } from 'next/navigation';
import { getVehicle, vehicles } from '@/lib/catalog';
import { VehicleMessageScreen } from '@/components/VehicleMessageScreen';
export function generateStaticParams(){return vehicles.map(vehicle=>({id:vehicle.id}));}
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;const vehicle=getVehicle(id);if(!vehicle)notFound();return <VehicleMessageScreen vehicle={vehicle}/>;}
`);
const detail='src/components/DetailScreen.tsx';let text=fs.readFileSync(detail,'utf8');text=text.replace('<Button icon="mail" onClick={() => setContact(true)}>','<Button icon="mail" href={\'/vehicle/\' + v.id + \'/message\'}>');fs.writeFileSync(detail,text);
const gallery='src/components/GalleryScreen.tsx';text=fs.readFileSync(gallery,'utf8').replace('<Button icon="mail" onClick={() => setContact(true)}>','<Button icon="mail" href={\'/vehicle/\' + v.id + \'/message\'}>');fs.writeFileSync(gallery,text);
await sharp('reference/android/119-native-message.png').extract({left:48,top:378,width:144,height:144}).webp({quality:100}).toFile('public/images/dealer-hofmann.webp');
const qa='scripts/qa-interactions.mjs';text=fs.readFileSync(qa,'utf8');text=text.replace("    await page.getByRole('dialog').getByRole('button', { name: 'Message', exact: true }).click();\n",'');text=text.replace("await page.getByRole('button', { name: 'Save message draft' }).click(); await go(page, '/messages');","await page.getByRole('button', { name: 'Send', exact: true }).click(); await page.getByRole('dialog').getByRole('link', { name: 'View message drafts' }).click();");text=text.replace("'/vehicle/' + id + '/gallery', '/dealer/' + id","'/vehicle/' + id + '/gallery', '/vehicle/' + id + '/message', '/dealer/' + id");fs.writeFileSync(qa,text);
console.log('Native message route and direct detail/gallery actions wired, local-only drafting preserved.');
