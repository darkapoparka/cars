import fs from 'node:fs';
import path from 'node:path';

/** Technical state is read from the same registry that generates the Markdown views. */
export function registryProjects(root) {
  const registry=JSON.parse(fs.readFileSync(path.join(root,'docs/DEPLOYMENT-INVENTORY.json'),'utf8'));
  const projects=new Map();
  for(const dealer of registry.dealers) {
    if(dealer.aliasOf)continue;
    const variants=dealer.variants.map(v=>typeof v==='string'?v:v.key);
    const source=dealer.evidence?.source||{state:'unknown'};
    const commit=source.commit||dealer.canonicalSourceCommit||null;
    const location=commit?'recorded-commit':dealer.localPresent?'local':'branch-only';
    const branch=commit?commit.slice(0,12):dealer.branchSources?.[0]?.branch||'unrecorded';
    const url=commit?`https://github.com/darkapoparka/cars/tree/${commit}/clients/${dealer.slug}`:null;
    const browser=dealer.evidence?.browser||{state:'unknown'};
    const evidence=dealer.evidence||{};
    const checked=Object.values(evidence).filter(v=>v?.state&&v.state!=='unknown').length;
    const passed=Object.values(evidence).filter(v=>v?.state==='passed').length;
    projects.set(dealer.slug,{
      slug:dealer.slug,variants,variantCount:variants.length,location,ref:commit,branch,sha:commit,
      meta:Object.fromEntries(dealer.variants.map(v=>[typeof v==='string'?v:v.key,typeof v==='string'?{}:v])),
      qaState:browser.state==='passed'?'passed':browser.state==='failed'?'pending':'missing',
      qaChecked:checked,qaPassed:passed,evidence,delivery:dealer.delivery||{},
      githubUrl:url,designUrls:url?Object.fromEntries(variants.map(v=>[v,url+'/'+v])):{},
      refsList:dealer.branchSources||[],business:{name:dealer.name||dealer.slug},stockCount:null,
    });
  }
  return {projects,registryPath:'docs/DEPLOYMENT-INVENTORY.json',updatedAt:registry.updatedAt||null};
}
