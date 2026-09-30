import {spawnSync} from 'node:child_process';
import path from 'node:path';
const cwd=path.resolve(import.meta.dirname,'../app');
const result=spawnSync(process.execPath,[path.join(cwd,'node_modules/next/dist/bin/next'),'build','--webpack'],{cwd,stdio:'inherit',env:{...process.env,NEXT_PUBLIC_BASE_PATH:'/variant-4'},windowsHide:true});
if(result.error)throw result.error;process.exitCode=result.status??1;
