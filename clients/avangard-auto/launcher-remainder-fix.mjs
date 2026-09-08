import fs from 'node:fs';
for(const name of ['remainder-final.mjs','numeric-browser-final.mjs']){const path='J:/cars/clients/avangard-auto/'+name;let s=fs.readFileSync(path,'utf8').replace('{execFile}', '{execFile,spawn}');const helper=`
async function launch(args){return new Promise((resolve,reject)=>{const proc=spawn('powershell.exe',args,{stdio:['ignore','pipe','pipe']});let output='';const timer=setTimeout(()=>reject(Error('Runtime launch timed out: '+output)),30000);proc.stdout.on('data',chunk=>{output+=chunk;try{JSON.parse(output);clearTimeout(timer);proc.stdout.destroy();proc.stderr.destroy();proc.unref();resolve({stdout:output});}catch{}});proc.on('error',reject);});}
`;
s=helper+s;
s=s.replace("exec('powershell.exe',['-NoProfile','-File',runtime,'-Client',c,'-Template',t,'-Port',String(port)])", "launch(['-NoProfile','-File',runtime,'-Client',c,'-Template',t,'-Port',String(port)])");s=s.replace("exec('powershell.exe',['-NoProfile','-File',runtime,'-Client',client,'-Template','carwow','-Port',String(port)],{timeout:30000})", "launch(['-NoProfile','-File',runtime,'-Client',client,'-Template','carwow','-Port',String(port)])");fs.writeFileSync(path,s);}
