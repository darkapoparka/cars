const h40=value=>typeof value==='string'&&/^[a-f0-9]{40}$/.test(value);
const need=(condition,message)=>{if(!condition)throw Error('Vercel mapped native acceptance: authenticated raw provider Git source differs: '+message);};
/** Read observed provider fields without constructing an absent gitSource object. */
export function observeVercelGithubDeployment(raw, expected) {
 need(expected&&/^darkapoparka\/[A-Za-z0-9_-]+$/.test(expected.repository??'')&&expected.branch==='codex/vercel-refresh-pilot'&&h40(expected.commit),'invalid expected reviewed pilot identity');
 const envelope=raw?.kind==='authenticated-vercel-github-deployment-observation';
 if(envelope)need(raw.schemaVersion===1&&raw.authentication==='vercel-connector'&&Number.isFinite(Date.parse(raw.observedAt)),'actual observation envelope required');
 const response=envelope?raw.rawDeploymentResponse:raw,wrapped=response?.result?.deployment!==undefined,v=wrapped?response.result.deployment:response,prefix=(envelope?'rawDeploymentResponse.':'')+(wrapped?'result.deployment.':'');
 need(v&&typeof v==='object'&&!Array.isArray(v)&&(v.source===undefined||v.source==='git'),'actual Git deployment or omitted source field required');
 let clone;
 if(v.source===undefined){
  clone=envelope&&raw.buildCloneObservation;
  need(clone?.schemaVersion===1&&clone.kind==='authenticated-vercel-build-clone-observation'&&clone.deploymentId===expected.deploymentId&&clone.source==='Vercel list_deployment_events connector','omitted source field requires exact observed build clone');
  const event=clone.rawObservedEvent;need(event?.type==='stdout'&&Number.isSafeInteger(event.created)&&event.info?.type==='build'&&event.info.entrypoint==='.'&&/^bld_[A-Za-z0-9]+$/.test(event.info.name??''),'actual build clone event required');
  const match=typeof event.text==='string'&&event.text.match(/^Cloning github\.com\/(darkapoparka\/[A-Za-z0-9_-]+) \(Branch: (codex\/vercel-refresh-pilot), Commit: ([a-f0-9]{7,40})\)$/);
  need(match&&match[1]===expected.repository&&match[2]===expected.branch&&expected.commit.startsWith(match[3]),'observed Git clone repository/ref/commit prefix');
 }

 need(v.id===expected.deploymentId,'deployment ID');
 const projectId=v.project?.id??v.projectId;need(projectId===expected.projectId,'project ID');
 if(v.project?.id!==undefined&&v.projectId!==undefined)need(v.project.id===v.projectId,'conflicting observed project IDs');
 need((v.readyState??v.state)==='READY','READY required');
 for(const field of ['state','readyState'])if(v[field]!==undefined)need(v[field]==='READY','conflicting or pending observed deployment state');
 const [owner,repository]=expected.repository.split('/'),meta=v.meta;
 need(meta&&h40(meta.githubCommitSha)&&meta.githubCommitSha===expected.commit,'full observed private export SHA');
 need(meta.githubOrg===owner&&meta.githubRepo===repository&&meta.githubCommitRef===expected.branch,'observed GitHub owner/repository/ref');
 if(v.gitSource!==undefined)need(v.gitSource&&v.gitSource.type==='github'&&h40(v.gitSource.sha)&&v.gitSource.sha===meta.githubCommitSha,'conflicting actual gitSource');
 let origin;try{need(typeof v.url==='string','observed URL');origin=new URL(v.url.startsWith('https://')?v.url:'https://'+v.url);}catch{need(false,'invalid observed URL');}
 need(origin.protocol==='https:'&&!origin.username&&!origin.password&&origin.pathname==='/'&&!origin.search&&!origin.hash&&origin.href===expected.publicOrigin,'observed public origin');
 return {schemaVersion:1,kind:'observed-vercel-github-deployment-identity',representation:v.source===undefined?'deployment-meta-github-with-observed-build-clone':v.gitSource===undefined?'deployment-meta-github':'deployment-meta-and-gitSource-github',actualSourceFieldPresent:v.source!==undefined,deploymentId:v.id,projectId,state:v.readyState??v.state,repository:meta.githubOrg+'/'+meta.githubRepo,branch:meta.githubCommitRef,commit:meta.githubCommitSha,publicOrigin:origin.href,observedFields:{...(v.source!==undefined?{source:prefix+'source'}:{buildClone:'buildCloneObservation.rawObservedEvent.text',buildId:'buildCloneObservation.rawObservedEvent.info.name'}),projectId:prefix+(v.project?.id!==undefined?'project.id':'projectId'),commit:prefix+'meta.githubCommitSha',repository:prefix+'meta.githubOrg + meta.githubRepo',branch:prefix+'meta.githubCommitRef',state:prefix+(v.readyState!==undefined?'readyState':'state'),url:prefix+'url',...v.gitSource!==undefined?{gitSource:prefix+'gitSource'}:{}}};
}
