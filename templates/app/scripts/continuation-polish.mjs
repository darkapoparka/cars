import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
async function edit(file,sha,changes){let s=await readFile(file,'utf8');if(createHash('sha256').update(s).digest('hex')!==sha)throw Error(`Changed ${file}`);for(const [from,to,count=1]of changes){if(s.split(from).length-1!==count)throw Error(`Unexpected match count ${file}: ${from}`);s=s.split(from).join(to);}await writeFile(file,s);console.log('Updated',file);}
await edit('components/FeatureContent.tsx','9d7e01a75c0b1296d0ecb7534dfaafac1b8935359a77412b122f4d6eda968bc0',[["scrollSnapType: 'x proximity'","scrollSnapType: 'x mandatory'"]]);
await edit('components/FinanceCalculator.tsx','4820c0057740ef40a7e657e93f64bc878867a43e8658897c12e85b12c99f71a2',[[", MozAppearance: 'textfield'",'']]);
await edit('components/AppShell.tsx','febf5b03ffc5a38f55246f7fe74a533e9ed3d5a52a7be695cc411128fb6edb4b',[["overflowX:'hidden'","overflowX:'clip'"]]);
await edit('app/page.tsx','6f3b2591a8d503de190109567bfe2afe82874914b76e60f46d20d1e80b1a267d',[["<OfferCarousel />","<OfferCarousel onLogin={() => setLogin(true)} />"]]);
await edit('components/BenefitsPage.tsx','45efabb5587dde56c24abea8eacb634d1637c0f14f8ace9296d298e7bd0af8e5',[
 ['<h2>',"<h2 {...stylex.props(s.policyHeading)}>",6],
 ['<p>',"<p {...stylex.props(s.paragraph)}>",9],
 ['<ul>',"<ul {...stylex.props(s.policyList)}>"],
 ["  policy: {", "  policyHeading: {marginTop: 24, color: '#001442', fontSize: 16, fontWeight: 600, lineHeight: '24px'},\n  paragraph: {marginTop: 16, color: '#4d6086', fontSize: 12, lineHeight: '18px'},\n  policyList: {marginTop: 12, paddingLeft: 0, listStylePosition: 'inside', fontSize: 12, lineHeight: '18px'},\n  policy: {"]
]);
const root='reference/2026-09-26-continuation';
for(const [source,name,x,y,width,height] of [['policy-open','policy-warranty',21,190,385,195],['return-tab','policy-returns',21,190,385,173]]){
 const img=sharp(`${root}/${source}.png`),meta=await img.metadata(),scale=meta.width/427;
 await img.extract({left:Math.round(x*scale),top:Math.round(y*scale),width:Math.round(width*scale),height:Math.round(height*scale)}).png().toFile(`public/reference-assets/continuation/${name}.png`);
}
const virtual='https://c24-media-service.c24.tech/production/prod/c24-assembly-service/uae/Rotating%20carousel.png';
const response=await fetch(virtual,{signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error(`Virtual test drive artwork ${response.status}`);
await sharp(Buffer.from(await response.arrayBuffer())).png().toFile('public/reference-assets/continuation/offer-virtual.png');
console.log('Prepared policy and virtual test drive artwork.');
