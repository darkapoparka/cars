import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

// The normal source gate, with persistent logs when the remote workbench has no stdout stream.
const root = 'reference/web/parity-followup-20260928/source';
fs.mkdirSync(root, { recursive: true });
const results = [];
for (const task of ['lint','typecheck','test','build','format:check']) {
  const name = task.replaceAll(':','-');
  const log = root + '/' + name + '.log';
  const fd = fs.openSync(log,'w');
  const start = Date.now();
  const result = process.platform === 'win32'
    ? spawnSync(process.env.ComSpec || 'cmd.exe',['/d','/s','/c',`npm.cmd run ${task}`],{stdio:['ignore',fd,fd],timeout:600000,windowsHide:true})
    : spawnSync('npm',['run',task],{stdio:['ignore',fd,fd],timeout:600000});
  fs.closeSync(fd);
  results.push({ task, exitCode:result.status, error:result.error?.message, durationMs:Date.now()-start, sha256:createHash('sha256').update(fs.readFileSync(log)).digest('hex') });
  fs.writeFileSync(root + '/status.json',JSON.stringify({at:new Date().toISOString(),results},null,2));
  console.log(task,result.status===0?'PASS':'FAIL');
  if(result.status!==0) { console.error(fs.readFileSync(log,'utf8').slice(-5000)); process.exit(1); }
}
