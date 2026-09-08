import fs from 'node:fs';
for(const c of ['autolife','priselci','ivo-auto']){
 const base=`J:/cars/clients/${c}`;
 for(const t of ['auto-best','modern','carwow']){
  const path=`${base}/${t}/.client/project.json`, p=JSON.parse(fs.readFileSync(path));
  if(t==='modern')p.knownGaps.push('Gallery keyboard focus restoration was not separately verified in this client.');
  if(t==='carwow'){p.qa.focusedEvidence='../qa-final/focused.json';p.qa.numericEvidence='../qa-final/numeric-stock-check.json';p.qa.checkedAt=new Date().toISOString();}
  fs.writeFileSync(path,JSON.stringify(p,null,2)+'\n');
 }
}
fs.writeFileSync('J:/cars/clients/autolife/qa-final/launcher-retry.md','# Launcher retry\n\n2026-09-08: first focused Autolife attempt waited on an inherited PowerShell pipe after launch. Owned Vite PID68688 on6643 was stopped, releasing the blocked launcher and causing ERR_CONNECTION_REFUSED before a browser capture. No product defect inferred. Harness now resolves bounded runtime JSON on stdout, ignores stdin, waits for HTTP readiness, and bounds navigation/screenshots. Fresh focus-only rerun passed six checks and stopped its runtime; focused.json is final evidence.\n');
