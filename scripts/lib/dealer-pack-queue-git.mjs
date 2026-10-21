/** Atomic Git-protocol queue transport for CI. A new commit has the exact read
 * revision as its sole parent; a normal (never forced) push is the server CAS.
 * This avoids spending the Actions REST quota on each durable provider intent.
 */
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {runQueueGitOperation} from './dealer-pack-git-operation.mjs';
import {PACK_QUEUE_REPOSITORY,PACK_QUEUE_BRANCH,PACK_QUEUE_PATH,validatePackQueue} from './dealer-pack-queue.mjs';

const assert=(ok,message)=>{if(!ok)throw Error(message);};
const hex40=value=>/^[a-f0-9]{40}$/.test(value??'');
export function gitPackQueueStore({directory,token=process.env.GH_TOKEN??process.env.GITHUB_TOKEN,remote='https://github.com/'+PACK_QUEUE_REPOSITORY+'.git',allowLocalTestRemote=false}={}) {
  assert(path.isAbsolute(directory??''),'Use an absolute dedicated generated bare queue directory');
  assert(remote==='https://github.com/'+PACK_QUEUE_REPOSITORY+'.git'||allowLocalTestRemote===true&&path.isAbsolute(remote),'Queue Git remote must be the authorized Cars repository');
  assert(allowLocalTestRemote||typeof token==='string'&&token.length>10,'Queue Git transport requires the Actions contents:write token');
  fs.mkdirSync(directory,{recursive:true,mode:0o700});
  const env={...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'never',GIT_AUTHOR_NAME:'Cars deployment queue',GIT_AUTHOR_EMAIL:'cars-deploy-queue@users.noreply.github.com',GIT_COMMITTER_NAME:'Cars deployment queue',GIT_COMMITTER_EMAIL:'cars-deploy-queue@users.noreply.github.com'};
  if(!allowLocalTestRemote){env.GIT_CONFIG_COUNT='1';env.GIT_CONFIG_KEY_0='http.https://github.com/.extraheader';env.GIT_CONFIG_VALUE_0='AUTHORIZATION: basic '+Buffer.from('x-access-token:'+token).toString('base64');}
  const run=(args,{input,allowFailure=false}={})=>runQueueGitOperation({args,allowFailure,
    execute:()=>spawnSync('git',['-C',directory,...args],{env,encoding:'utf8',input,maxBuffer:20*1024**2,timeout:120000})});
  if(!fs.existsSync(path.join(directory,'HEAD'))){run(['init','--bare','--quiet']);run(['config','remote.origin.url',remote]);run(['config','remote.origin.promisor','true']);run(['config','remote.origin.partialclonefilter','blob:none']);}
  assert(run(['config','--get','remote.origin.url']).stdout.trim()===remote,'Existing queue cache points to another repository');
  return {
    async read(){
      run(['fetch','--quiet','--no-tags','--depth=1','--filter=blob:none','origin','+refs/heads/'+PACK_QUEUE_BRANCH+':refs/remotes/queue/source']);
      const revision=run(['rev-parse','refs/remotes/queue/source']).stdout.trim();assert(hex40(revision),'Queue commit identity missing');
      const bytes=run(['show',revision+':'+PACK_QUEUE_PATH]).stdout;assert(Buffer.byteLength(bytes)<=16*1024**2,'Durable queue exceeds its bounded state size');
      const state=JSON.parse(bytes);validatePackQueue(state);return {revision,state};
    },
    async compareAndSwap(revision,state){
      assert(hex40(revision),'Queue CAS needs the exact read commit');validatePackQueue(state);
      // A private regular file also works in executors whose process bridge
      // cannot reliably pipe stdin to a synchronous child process.
      const file=path.join(directory,'queue-write-'+randomUUID()+'.json');let blob;
      fs.writeFileSync(file,JSON.stringify(state)+'\n',{flag:'wx',mode:0o600});
      try{blob=run(['hash-object','-w','--',file]).stdout.trim();}finally{fs.rmSync(file,{force:true});}
      assert(hex40(blob),'Queue blob identity missing');
      // Preserve every unrelated branch file, including any bootstrap evidence.
      run(['read-tree',revision]);run(['update-index','--add','--cacheinfo','100644',blob,PACK_QUEUE_PATH]);
      const tree=run(['write-tree']).stdout.trim(),commit=run(['commit-tree',tree,'-p',revision,'-m','deploy-queue: generation '+state.generation]).stdout.trim();assert(hex40(commit),'Queue commit could not be created');
      const pushed=run(['push','--porcelain','origin',commit+':refs/heads/'+PACK_QUEUE_BRANCH],{allowFailure:true});
      if(pushed.status===0&&!pushed.signal)return commit;
      if(/\[rejected\]|non-fast-forward|fetch first|cannot lock ref/.test((pushed.stdout??'')+(pushed.stderr??'')))return false;
      throw Error('Durable Git queue push outcome is unknown; re-read state before retrying');
    },
  };
}
