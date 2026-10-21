/** Bounded retry of read transport only. No token, URL, path or stderr is emitted. */
const names=new Set(['init','config','fetch','rev-parse','show','hash-object','read-tree','update-index','write-tree','commit-tree','push']);
const readTransport=new Set(['fetch','show']);
const ok=result=>result?.status===0&&!result.signal&&!result.error&&typeof result.stdout==='string';
const wait=milliseconds=>Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,milliseconds);

export function classifyQueueGitFailure(result){
  const text=typeof result?.stderr==='string'?result.stderr:'';
  if(result?.error?.code==='ENOBUFS')return 'output-bound';
  if(result?.error?.code==='ENOENT')return 'git-unavailable';
  if(/authentication failed|could not read username|permission denied|access denied|returned error: (?:401|403)|repository not found/i.test(text))return 'authorization';
  if(/no space left on device|disk full|read-only file system|unable to create .*lock|index\.lock.*file exists/i.test(text))return 'local-storage-or-lock';
  if(/(?:rate limit|returned error: 429)/i.test(text))return 'rate-limit';
  if(result?.error?.code==='ETIMEDOUT')return 'process-timeout';
  if(/could not resolve host|failed to connect|connection (?:reset|timed out|refused)|recv failure|send failure|early eof|remote end hung up unexpectedly|returned error: (?:500|502|503|504)\b/i.test(text))return 'transport-network';
  return 'unclassified';
}

/** args must be the actual Git argv used by execute. Mutation commands always
 * execute at most once. A failed push returns unchanged to the existing CAS
 * uncertainty handling; it is never automatically retried or declared failed.
 */
export function runQueueGitOperation({args,execute,allowFailure=false,sleep=wait}={}){
  const command=args?.[0];
  if(!Array.isArray(args)||!names.has(command)||typeof execute!=='function'||typeof sleep!=='function')throw Error('Bounded known queue Git operation required');
  const maximum=!allowFailure&&readTransport.has(command)?3:1;
  for(let attempt=1;attempt<=maximum;attempt++){
    let result;
    try{result=execute();}catch{throw Error('Durable Git queue operation failed ['+command+':process-launch]; credentials and command output were suppressed');}
    if(allowFailure||ok(result))return result;
    const kind=classifyQueueGitFailure(result);
    if(attempt<maximum&&['transport-network','process-timeout'].includes(kind)){
      sleep(attempt===1?1000:3000);
      continue;
    }
    throw Error('Durable Git queue operation failed ['+command+':'+kind+', attempts='+attempt+']; credentials and command output were suppressed');
  }
}
