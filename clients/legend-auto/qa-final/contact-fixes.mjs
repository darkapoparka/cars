import fs from 'node:fs/promises';
for(const slug of ['automarket-varna','elit-auto-import','legend-auto']){
const root=`J:/cars/clients/${slug}/carwow/src/lib/components/`;
let p=root+'detail/desktop/DesktopDetailLocationMap.svelte',s=await fs.readFile(p,'utf8');s=s.replace(/const mapUrl =\s*'[^']*';/,'const mapUrl = daynightSite.mapUrl;');await fs.writeFile(p,s);
p=root+'financing/DesktopFinancingPage.svelte';s=await fs.readFile(p,'utf8');if(!s.includes("import { daynightSite }"))s=s.replace('<script lang="ts">','<script lang="ts">\n\timport { daynightSite } from \'$lib/data/daynight-site\';');s=s.replace('href="tel:+359888626117"','href={`tel:${daynightSite.phone}`}');await fs.writeFile(p,s);
}
