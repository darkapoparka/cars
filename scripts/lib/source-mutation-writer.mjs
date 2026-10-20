import {AsyncLocalStorage} from 'node:async_hooks';

// An explicit, invocation-local seam for maintained helper writes. The global
// filesystem object is never patched; ordinary callers keep their own writer.
const writers=new AsyncLocalStorage();
export function withSourceMutationWriter(writer,operation){
 if(writer===undefined||writer===null)return operation();
 if(typeof writer.writeFile!=='function'||typeof operation!=='function')throw Error('Explicit source mutation writer required');
 return writers.run(writer,operation);
}
export function sourceMutationWrite(file,bytes,fallback){
 const writer=writers.getStore();
 return writer?writer.writeFile(file,Buffer.isBuffer(bytes)?bytes:Buffer.from(bytes)):fallback();
}
