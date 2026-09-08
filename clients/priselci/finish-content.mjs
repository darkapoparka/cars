import fs from 'node:fs/promises';import path from 'node:path';
const root='J:/cars/clients/priselci',facts=JSON.parse(await fs.readFile(`${root}/business-facts.json`));
async function walk(d){let a=[];for(const e of await fs.readdir(d,{withFileTypes:true})){if(e.isSymbolicLink()||['node_modules','.next','.svelte-kit','.vercel','.git','.turbo'].includes(e.name))continue;const p=path.join(d,e.name);if(e.isDirectory())a.push(...await walk(p));else a.push(p);}return a;}
async function edit(p,fn){const s=await fs.readFile(p,'utf8'),n=fn(s);if(s!==n)await fs.writeFile(p,n);}
for(const variant of ['auto-best','carwow'])for(const p of await walk(`${root}/${variant}/src`))if(/\.(ts|svelte|css|html)$/.test(p))await edit(p,s=>s.replaceAll('Кристиан Кирилов','автокъщата').replaceAll('Покупка без риск','Насоки за покупка').replaceAll('проверени автомобили','автомобили от обяви').replaceAll('Проверени автомобили','Автомобили от обяви').replaceAll('Внос по поръчка','Въпрос за внос').replaceAll('внос по поръчка','внос след потвърждение').replaceAll('Да — можем да обсъдим','Попитайте дали е възможен').replaceAll('Внос по заявка','Запитване за автомобил').replaceAll('Огледи през уикенда с уговорка','Свържете се предварително').replaceAll('до сделката','за избрания автомобил').replace(/\/brand\/daynight-hero[^'"\s)]+\.(?:webp|png)/g,facts.hero).replace(/\/assets\/images\/pages\/daynight-[^'"\s)]+\.(?:webp|png)/g,facts.hero));
// No unmatched social destinations are presented as official accounts.
await edit(`${root}/auto-best/src/lib/config/brand.ts`,s=>s.replace(/"(?:youtubeUrl|instagramUrl|facebookUrl)": "[^"]*"/g,m=>m.replace(/: ".*"/,': ""')).replace('"logo":',`"logoLight": "${facts.logoLight}",\n  "logo":`));
for(const name of ['AboutHero','ContactIntent'])await edit(`${root}/auto-best/src/lib/components/company/${name}.svelte`,s=>s.replace("  ] as const;","  ].filter(item => item.href);"));
await edit(`${root}/auto-best/src/lib/components/layout/Header.svelte`,s=>s.replace(/(<a \{\.\.\.\{ href: brand\.(instagramUrl|youtubeUrl|facebookUrl) \}\}[^\n]+<\/a>)/g,'{#if brand.$2}$1{/if}'));
await edit(`${root}/auto-best/src/lib/components/layout/Footer.svelte`,s=>s.replace('src={brand.logo}','src={brand.logoLight}'));
await edit(`${root}/auto-best/src/app.html`,s=>s.replace('/favicon.ico','/assets/priselci/favicon.svg'));
const detailCss=`${root}/auto-best/src/routes/listing-detail-v1/[id]/detail.css`;
await edit(detailCss,s=>s+'\n/* Real listing gallery uses the existing media-counter position. */\n.dn-detail-gallery__count { width: auto; border-radius: 18px; }\n.dn-detail-gallery__count button { width: 44px; height: 44px; display: grid; place-items: center; border: 0; background: transparent; cursor: pointer; }\n.dn-detail-gallery__count button[aria-pressed="true"] { background: #dfece3; border-radius: 50%; }\n');
// Copying a lead changes the exact media baseline; retain strict reference/missing/orphan checks.
const auto=`${root}/auto-best`,srcFiles=(await walk(`${auto}/src`)).filter(p=>/\.(css|html|js|svelte|ts)$/.test(p));const refs=new Set();
for(const p of srcFiles)for(const m of (await fs.readFile(p,'utf8')).matchAll(/\/(?:assets\/[A-Za-z0-9._@%+~/-]+\.(?:avif|eot|gif|ico|jpe?g|mp4|png|svg|ttf|webm|webp|woff2?)|favicon\.ico)/gi))refs.add(m[0]);
const removed=[];for(const p of await walk(`${auto}/static`)){const rel='/'+path.relative(`${auto}/static`,p).split(path.sep).join('/');if(!refs.has(rel)){await fs.unlink(p);removed.push(rel);}}
await edit(`${auto}/scripts/check-assets.mjs`,s=>s.replace(/const guardedMediaCount = \d+;/,`const guardedMediaCount = ${refs.size}; // Exact personalized inventory; see ../evidence/asset-baseline.json.`));
await fs.writeFile(`${root}/evidence/asset-baseline.json`,JSON.stringify({expectedCount:refs.size,removedUnreferencedSourceMedia:removed,refs:[...refs]},null,2));
// Carwow retains its original contact/team/review routes without invented people or testimonials.
await edit(`${root}/carwow/src/lib/data/daynight-team.ts`,s=>s.replace(/image: '[^']*'/g,`image: '${facts.logo}'`).replaceAll("role: 'Консултант продажби'","role: 'Контакт за продажби'").replaceAll('Екип бартер и оценка','Въпрос за замяна').replaceAll('Оценка, покупка и бартер','Възможността се потвърждава').replaceAll('Екип документи и финансиране','Въпроси за документи').replaceAll('Екип клиентски заявки','Уговорка за оглед').replace(/bio: '[^']*'/g,"bio: 'Свържете се с автокъщата на публикувания телефон.'").replace(/detail:\s*(['"])[\s\S]*?\1/g,"detail: 'Контактна тема, а не потвърден профил на отделен служител. Уточнете наличните услуги и условия по телефона.'"));
await edit(`${root}/carwow/src/lib/data/dealers.ts`,s=>s.replace(/rating: 4\.[78]/g,'rating: 0'));
await edit(`${root}/carwow/src/lib/styles/tokens.css`,s=>s.replaceAll('#d71920','#176b43').replaceAll('#a50f15','#105432').replaceAll('#fee2e2','#e2f0e6').replaceAll('#fff5f5','#f4faf6').replaceAll('#f5c542','#b8dcc4'));
for(const p of await walk(`${root}/carwow/src`))if(/\.(svelte|ts|html)$/.test(p))await edit(p,s=>s.replaceAll('>4.8<','>—<').replaceAll('>4.9<','>—<').replace(/src="\/favicon[^" ]*"/g,'src="/assets/priselci/favicon.svg"').replace(/href="\/favicon[^" ]*"/g,'href="/assets/priselci/favicon.svg"').replace(/https?:\/\/(?:www\.)?(?:facebook\.com|instagram\.com|youtube\.com)[^\s'"<>}]*/g,facts.stockUrl));
const video=`${root}/carwow/src/lib/components/home/desktop/DesktopHomeVideos.svelte`;
await edit(video,s=>s.replace('<section','{#if homeVideos.length > 0}\n<section').replace('</section>','</section>\n{/if}'));
const m=`${root}/modern`;
// Rasterize the documented temporary text mark for framework icon routes.
const {default:sharp}=await import('./modern/apps/web/node_modules/sharp/dist/index.mjs');
for(const p of [`${m}/apps/web/app/-/icon.png`,`${m}/apps/web/app/-/apple-icon.png`,`${m}/apps/web/public/lead-logo.png`])await sharp(`${root}/assets/favicon.svg`).resize(192,192).png().toFile(p);
await sharp(`${root}/assets/favicon.svg`).resize(32,32).png().toFile(`${m}/apps/web/app/-/favicon.ico`);
await fs.writeFile(`${root}/BUILD-STATUS.md`,'# Priselci Fast Skin build\n\n2026-09-07. All three current masters cloned and personalized with 16 listings / 64 photos.\n- Auto Best: content ready; validation and rendered QA next.\n- Modern: frozen install passed; Prisma/typecheck/build and rendered QA next.\n- Carwow: content ready; queued install, checks and rendered QA next.\n- Temporary text wordmark; official logo/hours/social channels unverified.\n- Previews all stopped. Assigned ports: 6646/6647/6648, Modern config 6649/6650.\n- No deployment, outreach or CRM writes.\n');
console.log('Content and strict client asset baseline finalized.');

