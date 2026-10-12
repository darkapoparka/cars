import path from 'node:path';
const assert=(v,m)=>{if(!v)throw Error(m);};
export function validateNewSourceRaster(bytes,filename){
 assert(Buffer.isBuffer(bytes)&&bytes.length>=12&&bytes.length<=25*1024**2,'Bounded raster bytes required');const ext=path.extname(filename).toLowerCase();
 assert((ext==='.png'&&bytes.subarray(0,8).toString('hex')==='89504e470d0a1a0a')||(['.jpg','.jpeg'].includes(ext)&&bytes.subarray(0,3).toString('hex')==='ffd8ff')||(ext==='.webp'&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP'),'Stock raster bytes do not match the reviewed file extension');return bytes;
}
