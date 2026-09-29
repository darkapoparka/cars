import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const changes=[];
function replace(s,a,b){if(s.split(a).length!==2)throw Error(`Expected unique match ${a.slice(0,100)}`);return s.replace(a,b);}
async function edit(file,sha,fn){const s=await readFile(file,'utf8');if(createHash('sha256').update(s).digest('hex')!==sha)throw Error('Changed '+file);changes.push({file,sha,s:fn(s)});}
await edit('components/VehiclePriceSheet.tsx','8a46e3b6af8e79d1e2168982c40e41f6084589e976e04a3fa432793f467dcf7c',s=>{
 s=replace(s,"import {formatPrice, type Vehicle} from '@/lib/data';","import {formatPrice, type Vehicle} from '@/lib/data';\nimport {calculateReferenceLoan} from '@/lib/loan-estimate';");
 s=replace(s,"  const loan = vehicle.price - downPayment;\n  const interest = (1.99 + 2.99 * (years - 1)) / years;\n  const monthly = Math.floor(loan * (1 + (interest / 100) * years) / (years * 12));","  const {loan, interest, monthly} = calculateReferenceLoan(vehicle.price, downPayment, years);");
 return replace(s,'onClick={onEligibility} {...stylex.props(s.eligibility)}','onClick={onEligibility} aria-label="Check loan eligibility from EMI plans" {...stylex.props(s.eligibility)}');
});
await edit('components/VehicleBelowFold.tsx','4f935cac8c1dea7a0398548bc316a44fc1a2fbf8215a03bc5ba90e49b3dae4fe',s=>{
 s=replace(s,"import {useModal} from '@/components/useModal';","import {useModal} from '@/components/useModal';\nimport VehicleServiceHistory from '@/components/VehicleServiceHistory';\nimport VehicleFinanceSection from '@/components/VehicleFinanceSection';");
 const a=s.indexOf('    <section id="service-history"'),b=s.indexOf('    {video ?',a);
 if(a<0||b<0)throw Error('Service section unavailable');
 return s.slice(0,a)+`    {fortuner?<><VehicleServiceHistory/><VehicleFinanceSection vehicle={vehicle} onLogin={onLogin}/></>:<section id="service-history" {...stylex.props(s.serviceHistory)}><h2 {...stylex.props(s.sectionHeading)}>Service History</h2><p {...stylex.props(s.sectionText)}>A service-history document is not included for this vehicle in the captured local catalog.</p><button type="button" onClick={onLogin} {...stylex.props(s.outline)}>Request service history</button></section>}
`+s.slice(b);
});
await edit('components/VehicleDetailClient.tsx','bf42d3e84d59692ce134545ff39f9700c1e61d9e4235678048e71d6962e79933',s=>{
 s=replace(s,"['price','overview','features','condition','service-history']","['price','overview','features','condition','service-history','car-finance','similar-cars']");
 s=replace(s,"['Service History','service-history']]","['Service History','service-history'],...(fortuner?[['Car finance','car-finance']]:[]),['Similar Cars','similar-cars']]");
 s=replace(s,'  <footer {...stylex.props(s.purchase)}>','  {scrolled&&fortuner?<p {...stylex.props(s.popularity)}>🔥<span>Popular: Recently 35 wishlisted this car</span></p>:null}\n  <footer {...stylex.props(s.purchase)}>');
 return replace(s,' purchase:{'," popularity:{display:{[media.desktop]:'none',default:'flex'},alignItems:'center',justifyContent:'center',gap:16,position:'fixed',left:0,right:0,bottom:81,zIndex:79,height:20,color:'#40547c',fontFamily:$.fontDisplay,fontSize:11,lineHeight:'17px',backgroundColor:'#fafafd'},\n purchase:{");
});
await edit('components/VehicleFeatures.tsx','15036f3390dc9f90c31901d55a5caa924bbf125af3de8d392087dfd1b2bb0001',s=>{
 s=replace(s,'Info, Search, ShieldCheck','Info, Music2, Search, ShieldCheck');
 s=replace(s,"'Airbag Passenger Front']},","'Airbag Passenger Front', 'ABS']},\n  {name:'Entertainment',icon:Music2,items:['Bluetooth Player','Apple Play','Android Auto Play']},");
 return s;
});
await edit('components/VehicleFinanceSection.tsx','01ae5b7c40d5740f0fe7a74a328b26fe2e337790b6cce572c4c1fcb3dcb7ba6e',s=>s.replaceAll('<small>','<br/><small>'));
await edit('scripts/verify-continuation.mjs','f39f3854aafe34c02c949233a49201072a86eaf822e32fe42bc5e71787026f25',s=>{
 s=replace(s,"await b.clickText('CHECK YOUR LOAN ELIGIBILITY');","await b.click(labelled('Check loan eligibility from EMI plans'));");
 s=replace(s,"    await b.navigate(`${fortuner}/inspection`);",`    await b.navigate(fortuner); await b.scroll(650);
    await b.click(\`[...document.querySelectorAll('[aria-label="Vehicle sections"] button')].find(element=>element.textContent==='Service History')\`); await sleep(550); await b.capture('detail-service-history');
    await check('Service timeline reproduces both captured records', \`document.querySelectorAll('[aria-label="Captured service history"] time').length === 2 && document.querySelector('[aria-label="Captured service history"]').textContent.includes('39,649')\`);
    await b.click(\`[...document.querySelectorAll('[aria-label="Vehicle sections"] button')].find(element=>element.textContent==='Car finance')\`); await sleep(550); await b.capture('detail-car-finance');
    await check('Inline finance and sheet share the captured AED 1,430 result', \`document.querySelector('[data-inline-emi]').textContent.includes('1,430')\`);
    await b.input('[aria-label="Inline downpayment amount"]','0'); await b.click(labelled('Inline 3 year tenure'));
    await check('Inline finance controls calculate a different estimate', \`!document.querySelector('[data-inline-emi]').textContent.includes('1,430')&&document.querySelector('[data-inline-emi]').textContent.includes('3 years')\`);
    await b.navigate(\`\${fortuner}/inspection\`);`);
 return s;
});
const root='reference/2026-09-26-continuation';
const native=sharp(`${root}/resume-finance-confirmed.png`),meta=await native.metadata(),scale=meta.width/427;
await native.extract({left:0,top:Math.round(205*scale),width:meta.width,height:Math.round(306*scale)}).png().toFile('public/reference-assets/continuation/detail-finance-banner.png');
const url='https://media-ae.cars24.com/ae/banner/warranty/Banner_3.png';
const response=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error(`Service reference image HTTP ${response.status}`);
await sharp(Buffer.from(await response.arrayBuffer())).png().toFile('public/reference-assets/continuation/fortuner-service-banner.png');
await writeFile(`${root}/resume/additional-sources.json`,JSON.stringify({serviceBanner:url,financeBanner:{capture:'resume-finance-confirmed.png',crop:{x:0,y:205,width:427,height:306}},features:'fortuner-detail-state.json: carDetails.content.allFeatures',history:'fortuner-detail-state.json: carDetails.content.serviceHistory'},null,2));
for(const x of changes){if(createHash('sha256').update(await readFile(x.file)).digest('hex')!==x.sha)throw Error('Concurrent change '+x.file);}
for(const x of changes){await writeFile(x.file,x.s);console.log('Updated',x.file);}
