import fs from 'node:fs/promises';
process.env.QA_REPORT_DIR='reference/2026-09-26-parity/diagnostics';
const source=await fs.readFile('scripts/verify-parity.mjs','utf8');
const start=source.indexOf(" await navigate('/');");
const end=source.indexOf(" check('No browser exceptions");
if(start<0||end<start)throw Error('QA harness markers changed');
const probe=`
 await navigate('/cars');await sleep(1200);
 console.log('FOOTERS',JSON.stringify(await evaluate(\`[...document.querySelectorAll('article')].slice(0,4).map(article=>({name:article.getAttribute('aria-label'),footer:article.lastElementChild.outerHTML,elements:[article.lastElementChild,...article.lastElementChild.children].map(e=>({tag:e.tagName,text:e.textContent,rect:e.getBoundingClientRect().toJSON(),font:getComputedStyle(e).font,color:getComputedStyle(e).color,display:getComputedStyle(e).display,visibility:getComputedStyle(e).visibility,opacity:getComputedStyle(e).opacity}))}))\`)));
 await capture('inventory-inspected');
 await navigate('/cars/2024-toyota-fortuner-exr');await evaluate('scrollTo(0,500)');await sleep(600);await capture('detail-scrolled');
`;
await import('data:text/javascript;base64,'+Buffer.from(source.slice(0,start)+probe+source.slice(end)).toString('base64'));
