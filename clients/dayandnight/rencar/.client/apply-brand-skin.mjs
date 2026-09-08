import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

// Initial, guarded branding pass. Never run this over a subsequently edited client.
const root=path.resolve(import.meta.dirname,'..');
const source='J:/cars/templates/rencar';
const replacements=[
  ['/assets/img/logo/logo-light.png','/daynight/day-night-logo.png'],
  ['/assets/img/logo/logo.png','/daynight/day-night-logo.png'],
  ['/assets/img/hero/01.png','/daynight/day-night-cutout-graphite-v1.webp'],
  ['/assets/img/hero/03.png','/daynight/day-night-cutout-gclass-v1.webp'],
  ['/assets/img/about/01.jpg','/daynight/day-night-about-showroom-v1-light.webp'],
  ['/assets/img/about/02.jpg','/daynight/day-night-showroom-color-v1.webp'],
  ['/assets/img/about/03.jpg','/daynight/day-night-studio-keys-v1.webp'],
  ['Welcome To Rencar!','Day &amp; Night Auto Group'],
  ['Book Your Car <span>For Safe</span> Ride','Изберете своя <span>модел</span>'],
  ['Make Your Travel <span>More Easy</span> Safe And Faster','Изберете своя <span>модел</span>'],
  ['Find Affordable <span>Dream Cars</span> For Your Rental','Изберете своя <span>модел</span>'],
  ['Make Your <span>Travel Safe</span> And Faster','Изберете своя <span>модел</span>'],
  ['<span>rental cars</span>','<span>Day &amp; Night</span>'],
  ['+2 123 654 7898','0877 733 110'],
  ['tel:+21236547898','tel:+359877733110'],
  ['25/AB Milford Road, New York, USA','ул. „Атанас Манчев“ 18, София'],
  ['Rencar','Day &amp; Night'],
];
const files=(await fs.readdir(path.join(source,'src/pages'))).filter(f=>f.endsWith('.svelte'));
const records=[];
for(const name of files) {
  const original=await fs.readFile(path.join(source,'src/pages',name),'utf8');
  const destination=path.join(root,'src/pages',name);
  if(await fs.readFile(destination,'utf8')!==original)throw new Error('Client page is already edited: '+name);
}
for(const name of files) {
  const original=await fs.readFile(path.join(source,'src/pages',name),'utf8');
  let updated=original;const changes=[];
  for(const [before,after] of replacements){const count=updated.split(before).length-1;if(count){updated=updated.replaceAll(before,after);changes.push({before,after,count});}}
  await fs.writeFile(path.join(root,'src/pages',name),updated);
  records.push({file:'src/pages/'+name,sourceHash:crypto.createHash('sha256').update(original).digest('hex'),resultHash:crypto.createHash('sha256').update(updated).digest('hex'),changes});
}
const manifestPath=path.join(root,'src/manifest.json');const manifest=JSON.parse(await fs.readFile(manifestPath,'utf8'));
for(const entry of Object.values(manifest))entry.title='Day & Night — Rencar visual preview';
await fs.writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
const html=await fs.readFile(path.join(root,'index.html'),'utf8');
await fs.writeFile(path.join(root,'index.html'),html.replace('Rencar - Car Rental And Booking HTML5 Template','Day &amp; Night — Rencar visual preview').replace('/assets/img/logo/favicon.png','/daynight/day-night-logo.png').replace('</head>','<link rel="stylesheet" href="/daynight/brand.css"></head>'));
await fs.writeFile(path.join(root,'.client/skin-changes.json'),JSON.stringify({appliedAt:new Date().toISOString(),scope:'Branding, image references and business text only; source elements/classes/controls unchanged.',source,files:records},null,2)+'\n');
console.log(JSON.stringify({pages:records.length,sourceCssUnchanged:true,sourceAppUnchanged:true,sourceWidgetsUnchanged:true}));
