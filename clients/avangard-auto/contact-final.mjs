import fs from 'node:fs';
import {svelteAutofixer} from 'file:///C:/Users/radev/AppData/Local/npm-cache/_npx/0ff2b174d795ade9/node_modules/@sveltejs/mcp/dist/handlers.mjs';
for(const c of ['avangard-auto','champion-auto-pro','astracar']) {
 const root=`J:/cars/clients/${c}/carwow/src/lib/components/`;
 const map=root+'detail/desktop/DesktopDetailLocationMap.svelte'; let s=fs.readFileSync(map,'utf8'); s=s.replace(/const mapUrl =\s*'https:[^']+';/,'const mapUrl = daynightSite.mapUrl;');fs.writeFileSync(map,s);
 const fin=root+'financing/DesktopFinancingPage.svelte';s=fs.readFileSync(fin,'utf8');if(!s.includes("import { daynightSite }"))s=s.replace('<script lang="ts">',"<script lang=\"ts\">\n\timport { daynightSite } from '$lib/data/daynight-site';");s=s.replace('href="tel:+359888626117"','href={`tel:${daynightSite.phone}`}');fs.writeFileSync(fin,s);
 const results=[];for(const file of [map,fin,root+'chat/ChatLauncher.svelte'])results.push({file,...await svelteAutofixer({code:fs.readFileSync(file,'utf8'),desired_svelte_version:5,filename:file.split('/').pop()})});fs.mkdirSync(`J:/cars/clients/${c}/qa-final`,{recursive:true});fs.writeFileSync(`J:/cars/clients/${c}/qa-final/autofixer.json`,JSON.stringify(results,null,2));
}
