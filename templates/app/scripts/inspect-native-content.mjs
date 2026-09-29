import fs from 'node:fs/promises';
const root='reference/2026-09-26-parity';
for(const name of ['sell','finance','service','listing']){
 const html=await fs.readFile(`${root}/public-${name}.html`,'utf8');
 const decoded=html.replaceAll('\\"','"');
 const urls=[...new Set([...decoded.matchAll(/https:\/\/[^"<>\s\\]+/g)].map(m=>m[0].replaceAll('&amp;','&').split('?')[0]))];
 console.log(name,'ART',urls.filter(u=>/banner|hero|robot|bot_|chatbot|robo|app.*webp|mobile.*png/i.test(decodeURIComponent(u))).slice(0,30));
 if(name==='listing'){
  for(const term of ['28799','64699','CIAZ','VELOZ']){
   const matches=[...decoded.matchAll(new RegExp(term,'g'))];console.log(term,'MATCHES',matches.length);
   console.log(matches.slice(-2).map(m=>decoded.slice(Math.max(0,m.index-300),m.index+2000)).join('\n'));
  }
  const links=[...html.matchAll(/href="([^"]*fortuner[^"]*)"/gi)].map(m=>m[1]);console.log('FORTUNER LINKS',[...new Set(links)].slice(0,10));
 }
}
