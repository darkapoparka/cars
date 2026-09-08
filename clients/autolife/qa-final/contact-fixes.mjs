import fs from 'node:fs';
for(const c of ['autolife','priselci','ivo-auto']){const base=`J:/cars/clients/${c}/carwow/src/lib/components/`;for(const [f,apply] of [
['financing/DesktopFinancingPage.svelte',s=>s.replace('href="tel:+359888626117"','href={`tel:${daynightSite.phone}`}')],
['detail/desktop/DesktopDetailLocationMap.svelte',s=>s.replace(/const mapUrl =\s*'https:\/\/www.google.com\/maps\/search[^']+';/,'const mapUrl = daynightSite.mapUrl;')],
['admin/dashboard/DesktopDashboardProfile.svelte',s=>s.replace(/'https:\/\/www.google.com\/maps\/embed\?pb=[^']+'/, '`https://www.google.com/maps?q=${encodeURIComponent(daynightSite.location)}&output=embed`')]
]){const p=base+f;let s=fs.readFileSync(p,'utf8');s=apply(s);if(!s.includes("import { daynightSite }"))s=s.replace('<script lang="ts">','<script lang="ts">\n\timport { daynightSite } from \'$lib/data/daynight-site\';');fs.writeFileSync(p,s);}}
