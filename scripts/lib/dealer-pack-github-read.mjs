/** Bounded GitHub GET retries. Diagnostics never include URLs, credentials or response bodies. */
const assert=(ok,message)=>{if(!ok)throw Error(message);};
const transientStatuses=new Set([500,502,503,504]);
const networkCodes=new Set(['ECONNRESET','ECONNREFUSED','ETIMEDOUT','EPIPE','EAI_AGAIN','ENETUNREACH','EHOSTUNREACH','UND_ERR_SOCKET','UND_ERR_CONNECT_TIMEOUT','UND_ERR_HEADERS_TIMEOUT','UND_ERR_BODY_TIMEOUT','UND_ERR_DESTROYED','UND_ERR_CLOSED']);
const errorNames=new Set(['Error','TypeError','SyntaxError','AbortError','TimeoutError','AggregateError']);
const wait=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds));
export const PACK_GITHUB_READ_RETRY=Object.freeze({attempts:3,delaysMs:Object.freeze([1000,2000])});

function causeCodes(error){
  const pending=[error],seen=new Set(),codes=new Set();
  while(pending.length&&seen.size<8){
    const value=pending.shift();if(!value||typeof value!=='object'||seen.has(value))continue;seen.add(value);
    if(networkCodes.has(value.code))codes.add(value.code);
    if(value.cause)pending.push(value.cause);if(Array.isArray(value.errors))pending.push(...value.errors.slice(0,8));
  }
  return [...codes].sort();
}

export function packGithubReadResource(requestPath){
  if(/\/actions\/artifacts\/[1-9][0-9]*$/.test(requestPath))return 'artifact';
  if(/\/actions\/runs\/[1-9][0-9]*(?:\/attempts\/[1-9][0-9]*)?\/jobs$/.test(requestPath))return 'jobs';
  if(/\/actions\/runs\/[1-9][0-9]*\/artifacts$/.test(requestPath))return 'artifact-list';
  if(/\/actions\/runs\/[1-9][0-9]*$/.test(requestPath))return 'run';
  if(/\/commits\/[a-f0-9]{40}$/.test(requestPath))return 'commit';
  if(/\/git\/blobs\/[a-f0-9]{40}$/.test(requestPath))return 'blob';
  if(/\/git\/trees\/[a-f0-9]{40}$/.test(requestPath))return 'tree';
  return 'repository';
}

/** execute must restart the entire immutable read, including a fresh signed
 * redirect. Only the supplied GET transport/body reader marks retryable errors;
 * identity, digest, filesystem and other validation failures escape unchanged.
 */
export async function runPackGithubRead({operation,resource='repository',artifactId,expectedBytes,execute,fetchImpl=fetch,retryWait=wait,transportClock=Date.now,transportDiagnostic=value=>console.warn(JSON.stringify(value))}={}){
  assert(['repository-metadata','artifact-download'].includes(operation)&&['artifact','jobs','artifact-list','run','commit','blob','tree','repository'].includes(resource)&&typeof execute==='function','Known GitHub read operation required');
  assert(artifactId===undefined||Number.isSafeInteger(artifactId)&&artifactId>0,'Exact artifact ID required');
  assert(expectedBytes===undefined||Number.isSafeInteger(expectedBytes)&&expectedBytes>0,'Exact artifact byte count required');
  for(let attempt=1;attempt<=PACK_GITHUB_READ_RETRY.attempts;attempt++){
    const state={stage:'api-response',startedAt:transportClock(),timeoutMs:30000,responseStatus:null,bytesReceived:0};
    const failure=(error,http=false)=>{
      const codes=causeCodes(error),details={operation,resource,stage:state.stage,method:'GET',attempt,maximumAttempts:PACK_GITHUB_READ_RETRY.attempts,
        errorName:http?'HttpError':errorNames.has(error?.name)?error.name:'Error',causeCodes:codes,elapsedMs:Math.max(0,Math.round(transportClock()-state.startedAt)),timeoutMs:state.timeoutMs,responseStatus:state.responseStatus,
        ...(artifactId===undefined?{}:{artifactId}),...(expectedBytes===undefined?{}:{expectedBytes,bytesReceived:state.bytesReceived})};
      const retryable=transientStatuses.has(state.responseStatus)||(state.responseStatus===null||state.responseStatus>=200&&state.responseStatus<300)&&(codes.length>0||['AbortError','TimeoutError'].includes(error?.name)||error?.name==='TypeError'&&error.message==='fetch failed');
      const result=Error('GitHub '+operation+' read failed: '+JSON.stringify(details));result.name='PackGithubReadError';result.transport=details;result.retryable=retryable;return result;
    };
    const read={
      async get(url,{headers,redirect='manual',object=false}={}){
        state.stage=object?'object-response':'api-response';state.startedAt=transportClock();state.timeoutMs=object?480000:30000;state.responseStatus=null;
        let response;
        try{response=await fetchImpl(url,{method:'GET',headers,redirect,signal:AbortSignal.timeout(state.timeoutMs)});state.responseStatus=response.status;}
        catch(error){throw failure(error);}
        if(transientStatuses.has(response.status)){
          try{await response.body?.cancel?.();}catch{}
          throw failure(null,true);
        }
        return response;
      },
      async body(consume){
        state.stage=state.stage.startsWith('object')?'object-body':'api-body';
        try{return await consume();}catch(error){throw failure(error);}
      },
      received(bytes){state.bytesReceived=bytes;},
    };
    try{return await execute(read);}
    catch(error){
      if(error?.name!=='PackGithubReadError'||!error.retryable||attempt===PACK_GITHUB_READ_RETRY.attempts)throw error;
      const retryInMs=PACK_GITHUB_READ_RETRY.delaysMs[attempt-1];
      transportDiagnostic({type:'cars-pack-github-read-retry',...error.transport,retryInMs});
      await retryWait(retryInMs);
    }
  }
}
