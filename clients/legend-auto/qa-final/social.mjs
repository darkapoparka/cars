import fs from 'node:fs/promises';
for(const slug of ['automarket-varna','elit-auto-import','legend-auto']){
const p=`J:/cars/clients/${slug}/modern/packages/marketplace-ui/components/dealer-social-links.tsx`;
let s=await fs.readFile(p,'utf8');s=s.replace(/links\?\.\[platform.key\] \|\|\s*platform.key === "youtube" \|\|\s*platform.key === "facebook"/,'links?.[platform.key]');await fs.writeFile(p,s);
}
