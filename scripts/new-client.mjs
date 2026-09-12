import fs from 'node:fs/promises';
import path from 'node:path';
import { copySource } from './copy-source.mjs';
import { verifyTemplate } from './template-release.mjs';
import { resolveIdentity, git, validateManifest } from './lib/workflow.mjs';
import { dealerGuidance } from './lib/dealer-guidance.mjs';

const root=await fs.realpath(path.resolve(import.meta.dirname,'..'));
if(process.argv.includes('--help')) {
  console.log('Usage: node scripts/new-client.mjs --client SLUG --repository OWNER/REPO [--preset standard|import] [--templates auto-best,modern,carwow] [--dealer-id ID] [--dry-run]\nUses approved release locks; refuses duplicate identities, drift and occupied destinations.');
  process.exit(0);
}
const catalog=JSON.parse(await fs.readFile(path.join(root,'catalog.json'),'utf8'));
const argv=process.argv.slice(2), options={};
for(let i=0;i<argv.length;i++) {
  const arg=argv[i];
  if(['--dry-run'].includes(arg)) options[arg.slice(2)]=true;
  else if(['--client','--templates','--preset','--repository','--dealer-id'].includes(arg) && argv[i+1] && !argv[i+1].startsWith('--')) options[arg.slice(2)]=argv[++i];
  else throw new Error(`Unknown or incomplete argument: ${arg}`);
}
if(!options.client || !/^[a-z0-9][a-z0-9-]{0,63}$/.test(options.client)) throw new Error('Use --client with a lowercase client slug, e.g. asko96.');
if(options.preset&&!['standard','import'].includes(options.preset))throw new Error('Use --preset standard or import.');
const identity=resolveIdentity(root,options.client,options['dealer-id']);
if(identity.exists)throw new Error(`Existing dealer identity: ${identity.slug}. Continue its canonical source; do not clone a duplicate.`);
const requested=(options.templates||(options.preset==='import'?'auto-best,import,carwow':'auto-best,modern,carwow')).split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
const selected=requested.map(value=>{
  const template=catalog.templates.find(t=>t.key===value || t.aliases.includes(value));
  if(!template)throw new Error(`Unknown template: ${value}`);
  return template;
});
if(new Set(selected.map(x=>x.key)).size!==selected.length)throw new Error('Aliases selected the same template twice.');
const manifest=validateManifest({schemaVersion:1,slug:options.client,dealerId:options['dealer-id']||null,repository:options.repository,defaultBranch:'main',variants:selected.map((t,i)=>({key:t.key,entry:i===0?'/':i===1?(t.key==='modern'?'/variant-2/cars':'/variant-2/'):'/variant-3/',base:i===0?'':`/variant-${i+1}`})),extraAssets:[],packaging:{version:'1'}});
const workflowCommit=git(root,['rev-parse','HEAD']);
const clientRoot=path.join(root,'clients',options.client), plans=[];
// Check every existing ancestor before writing, including client folders that could be junctions.
async function assertLocalAncestor(candidate) {
  let current=candidate;
  while(!(await fs.lstat(current).then(()=>true).catch(()=>false)))current=path.dirname(current);
  const physical=await fs.realpath(current);
  if(physical!==root&&!physical.startsWith(root+path.sep))throw new Error(`Path escapes Cars through an ancestor: ${candidate}`);
}
await assertLocalAncestor(clientRoot);
for(const template of selected) {
  const release=verifyTemplate(root,template.key);
  const source=await fs.realpath(path.join(root,template.path));
  if(!source.startsWith(path.join(root,'templates')+path.sep))throw new Error('Template source escaped the local library.');
  const destination=path.join(clientRoot,template.key);
  if(await fs.lstat(destination).then(()=>true).catch(()=>false))throw new Error(`Destination already exists; continuing must edit it deliberately, not overwrite it: ${destination}`);
  plans.push({template:template.key,version:release.release||release.commit,release,source,destination,readiness:template.readiness,homes:template.homes,personalization:'required',crmRegistration:'not-performed'});
}
console.log(JSON.stringify({mode:options['dry-run']?'dry-run':'copy',client:options.client,plans},null,2));
if(!options['dry-run']) {
  await fs.mkdir(clientRoot,{recursive:false});
  await fs.writeFile(path.join(clientRoot,'dealer.json'),JSON.stringify(manifest,null,2)+'\n');
  await fs.writeFile(path.join(clientRoot,'AGENTS.md'),dealerGuidance({slug:options.client,variants:manifest.variants,workflowCommit}));
  for(const plan of plans) {
    await copySource(plan.source,plan.destination,{key:plan.template});
    // A second integrity check catches an upstream writer racing the copy.
    verifyTemplate(root,plan.template);
    const metadata={schemaVersion:1,client:options.client,templateKey:plan.template,templateVersion:plan.version,createdAt:new Date().toISOString(),state:'needs-personalization',selectedHome:plan.homes[0].id,availableHomes:plan.homes,offeredHomes:[],publicUrl:null,qa:{desktop:false,mobile:false,identity:false,contactPath:false},crm:{leadId:null,demoProjectId:null,registered:false}};
    metadata.templateSource={repository:plan.release.repository,commit:plan.release.commit,digest:plan.release.digest,exportPolicy:plan.release.exportPolicy};
    metadata.packaging={version:'1',entry:manifest.variants.find(v=>v.key===plan.template).entry};
    metadata.workflowCommit=workflowCommit;
    await fs.mkdir(path.join(plan.destination,'.client'),{recursive:true});
    await fs.writeFile(path.join(plan.destination,'.client/project.json'),JSON.stringify(metadata,null,2));
    await fs.writeFile(path.join(plan.destination,'AGENTS.md'),dealerGuidance({slug:options.client,variants:manifest.variants,workflowCommit,variant:plan.template}));
    console.log(`Created ${plan.destination}`);
  }
  const brief=path.join(clientRoot,'CLIENT.md');
  if(!(await fs.access(brief).then(()=>true).catch(()=>false))) await fs.writeFile(brief,`# ${options.client}\n\nStatus: prospect; no sale or outreach is implied.\n\n## Verified facts\n\nCollect business name, logo, colors, contact details, services, sample inventory and public source URLs before personalizing.\n\n## Projects\n\n${plans.map(p=>`- ${p.template}: needs personalization; selected homepage and QA in ${p.template}/.client/project.json`).join('\n')}\n\n## Agency OS\n\nCheck the existing lead and demo records before registering this copy. No CRM record was created by the clone helper.\n`);
}
