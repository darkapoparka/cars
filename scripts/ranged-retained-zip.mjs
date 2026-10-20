import assert from 'node:assert/strict';
import {inflateRawSync} from 'node:zlib';
const safe=n=>typeof n==='string'&&n&&!n.startsWith('/')&&!n.includes('\\')&&!n.includes(':')&&!n.split('/').some(x=>!x||x==='.'||x==='..');
export async function rangedZipReader(size,fetchRange){
 assert(Number.isSafeInteger(size)&&size>22&&size<0xffffffff);
 let transferred=0;
 async function get(a,b){assert(Number.isSafeInteger(a)&&Number.isSafeInteger(b)&&a>=0&&b>=a&&b<size);const bytes=Buffer.from(await fetchRange(a,b));assert.equal(bytes.length,b-a+1,'Exact ZIP range length required');transferred+=bytes.length;return bytes;}
 const tailStart=Math.max(0,size-65557),tail=await get(tailStart,size-1);
 let end=tail.lastIndexOf(Buffer.from([80,75,5,6]));
 while(end>=0&&end+22+tail.readUInt16LE(end+20)!==tail.length)end=tail.lastIndexOf(Buffer.from([80,75,5,6]),end-1);
 assert(end>=0,'ZIP end record required');assert.equal(tail.readUInt16LE(end+4),0);assert.equal(tail.readUInt16LE(end+6),0);
 const count=tail.readUInt16LE(end+10),cdBytes=tail.readUInt32LE(end+12),cdAt=tail.readUInt32LE(end+16);
 assert.equal(count,tail.readUInt16LE(end+8));assert(count>0&&count<65535&&cdBytes<=32*1024**2&&cdAt+cdBytes<=tailStart+end);
 const directory=cdAt>=tailStart?tail.subarray(cdAt-tailStart,cdAt-tailStart+cdBytes):await get(cdAt,cdAt+cdBytes-1);
 let cursor=0;const index=new Map();
 for(let i=0;i<count;i++){
  assert(cursor+46<=directory.length);assert.equal(directory.readUInt32LE(cursor),0x02014b50);
  const flags=directory.readUInt16LE(cursor+8),n=directory.readUInt16LE(cursor+28),ex=directory.readUInt16LE(cursor+30),co=directory.readUInt16LE(cursor+32);
  const name=directory.subarray(cursor+46,cursor+46+n).toString('utf8');
  const row={name,method:directory.readUInt16LE(cursor+10),compressed:directory.readUInt32LE(cursor+20),bytes:directory.readUInt32LE(cursor+24),local:directory.readUInt32LE(cursor+42)};
  cursor+=46+n+ex+co;assert(cursor<=directory.length&&safe(name)&&!index.has(name)&&!(flags&1)&&[0,8].includes(row.method)&&row.local+30<=cdAt);index.set(name,row);
 }
 assert.equal(cursor,directory.length);
 async function read(name){
  const row=index.get(name);assert(row&&row.bytes<=150*1024**2&&row.compressed<=150*1024**2,'Bounded selected ZIP entry required');
  const preEnd=Math.min(cdAt-1,row.local+65535),head=await get(row.local,preEnd);
  assert.equal(head.readUInt32LE(0),0x04034b50);assert.equal(head.readUInt16LE(8),row.method);assert(!(head.readUInt16LE(6)&1));
  const n=head.readUInt16LE(26),ex=head.readUInt16LE(28),offset=30+n+ex;
  assert(offset<=head.length&&head.subarray(30,30+n).toString('utf8')===name&&row.local+offset+row.compressed<=cdAt);
  const packed=offset+row.compressed<=head.length?head.subarray(offset,offset+row.compressed):await get(row.local+offset,row.local+offset+row.compressed-1);
  const body=row.method===0?packed:inflateRawSync(packed,{maxOutputLength:row.bytes});assert.equal(body.length,row.bytes);return body;
 }
 return {index,read,transferred:()=>transferred};
}
