import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const root=path.resolve(import.meta.dirname,'..');
const base=fs.existsSync(path.join(root,'templates/boxcar/package.json'))?'templates/boxcar':'boxcar';
const require=createRequire(path.join(root,base,'package.json'));
const {PNG}=require('pngjs');
const dir=path.join(root,'audits/2026-09-06/screenshots');
for(const filename of fs.readdirSync(dir).filter(x=>x.endsWith('-1440.png'))) {
  const stem=filename.replace('-1440.png','');
  const dest=new PNG({width:1110,height:900});dest.data.fill(255);
  for(const [suffix,dx,dy,width] of [['-1440.png',0,0,720],['-1440-below.png',0,450,720],['-390.png',720,0,390]]) {
    const src=PNG.sync.read(fs.readFileSync(path.join(dir,stem+suffix)));
    const height=Math.round(src.height*width/src.width);
    for(let y=0;y<height && y+dy<900;y++)for(let x=0;x<width;x++) {
      const si=(Math.floor(y*src.width/width)*src.width+Math.floor(x*src.width/width))*4;
      const di=((y+dy)*dest.width+x+dx)*4;
      src.data.copy(dest.data,di,si,si+4);
    }
  }
  fs.writeFileSync(path.join(dir,stem+'-sheet.png'),PNG.sync.write(dest));
}
