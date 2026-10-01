import fs from 'node:fs';
const p='scripts/capture-complete-gallery.mjs';let t=fs.readFileSync(p,'utf8');
t=t.replace("for(let i=1;i<=total;i++){", "for(let i=Number(process.argv[4]||1);i<=total;i++){");
t=t.replace("run('shell','uiautomator','dump','/sdcard/mobile-gallery.xml');const xml=run('shell','cat','/sdcard/mobile-gallery.xml');", "run('shell','uiautomator','dump','/sdcard/mobile-gallery.xml');let xml=run('shell','cat','/sdcard/mobile-gallery.xml');\n for(let ad=0;ad<3&&!xml.includes(`text=\"${i} / ${total}\"`)&&xml.includes('Advertisement');ad++){run('shell','input','tap','1160','2688');await sleep(900);run('shell','uiautomator','dump','/sdcard/mobile-gallery.xml');xml=run('shell','cat','/sdcard/mobile-gallery.xml');}");
t=t.replace("console.log(i,total,asset,top,height);", "console.log(i,total,asset,top,height);await fs.writeFile(out+'/capture-progress.json',JSON.stringify(entries,null,2));");
fs.writeFileSync(p,t);
