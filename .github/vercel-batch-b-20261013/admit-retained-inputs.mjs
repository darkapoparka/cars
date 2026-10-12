import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const base='13152f136105e149129e81c227090955081b994d';
const prefix='docs/releases/cloudflare-existing25-20261011/vercel-existing-source/';
const sha=b=>createHash('sha256').update(b).digest('hex');
// Lossless transport of the owner's attached reviewed envelopes. These are the
// original payload hashes, NOT newly asserted qualification or test results.
const rows=[
 ['al-hamoor-al-thahabi','db9cab8196869d934085efc7c9523a9fbd6cdbbe1ad8c8cb3cdeda33f270fa52','793066bc0183fe70c48a0f98289bda19747c6c142e1ee8c094765e844311f831','8081358029980924e9f273a4cd5564109f62605e','7c7ef45db610e6e921eb62e2b5786c15021eb46be24b3e741b560f3530c00af6','08a53ef5304ccfd0ac8f534b7c26b2239f33afccd83c02d35eef755a41cb0e20'],
 ['asko-96','474b163751c3ad737ab47f64dfe6e932db606b1b6af5b6f0cfa78c396fec7d4c','71662620aee610cf97aa4fda3bcde48fb27f3e7c982a1b0eef1680152cc6004d','2cfa66d8df46f12a72cb6dbbc1b2492d9799af01','876599a9d22adcf8f79dcf8fd5b91af83794ab37628a6403f649f91c0634ea64','2cbba8e1ce532418efc9f928ddf798609054a3f40cfd036e1d93ec46c585c667'],
 ['astracar','2b16af3c365d9f4a431a00d69ee83e5e791efc2112a2818ea3adf16bf8b47c09','4606454a5572c4376e0fb94d0739d6df5bba660e475b0ce0e2990e498cd3d5ce','41ecd4eb1e29282a555027ffe75100a461101138','2d81c3aa8a0ab53435c7f91c72d9b24abc39474c005cbf6bbc92e9ffb6193f29','ef47d2e346e4def754eddf530e32d477861a2ac8ad5d8d7dd35a6fe4f267f48a'],
 ['autolife','aafa8625ebf3eabb090f72279b704f2a9124e795f8dbd17f06b4b4d19d66a709','96e75888d97cd62c85ea95df8eba52c7572e924f259358402f16fed16084a735','e181cf2579e12edeb166cd9765605ae87c92ead7','858c4457a0a67d23035d0a4b19fa1a071bac6f3303e23e989944c8d1eed8c3b6','74f781b4e0f7c9a7908c59984199d3f166825e99cbc61d6364e4573a40cb2be0'],
 ['champion-auto-pro','37d131144e40be11f7166c3c30a64b8ec99ddea122fda665d02ec6453ed8e78f','2eb05bce2ff25ae413acc54fcfa23378a34e1d917be41621983d22f635d8804c','118f51395d890326e666d62616da3fdc14604faf','a5dd41603171adac4e877f317aaee5850588d62b77eef655dfc28d7111794818','a5367e5749fde61fca2e53e366c4b86ab6bb03ec4935f4a7c42608b9330a704e'],
 ['eliqauto','7a1e9c1a6f2f19390d7a1d478a377089942352d19fe4e4678ef3ba479b6c9c4a','97b935d9ac9c2e3480198ef77a6468100b6591d3830c84ed664dbce6ef0152ef','96661e391c0567acbe595b204fba2eb62d9a6481','02e8f007c3dce70dacc334bec842e172054773567dd1cf8e4638b68a255fedc2','7b7124b885312d94a2b1da284e74718ced36a37c307afb4bd114b8621fd009c3'],
 ['elit-auto-import','1a81c73f87b5a4c58e353a90460d8d61827b175d7dbbd936a6759ec9bd4fdee7','5a6fc0ef20f42ae224a212fe31dd13d967b8127fbfd1c19c68b4be1099d098fd','554ec09ef3cf15ffc319ddf3a721d9267d197974','fea74551479d7a5a3ff8cea2821d0bf9c6edc2d0f14a27cae89d3863b032325c','30aaefc2de37ce18e73ba0d050df1526e3d98bd0a94dfb17b757b3fdfb671e21']
];
export function admitRetainedInputs(slug){
 const row=rows.find(r=>r[0]===slug);assert(row,'Only the seven remaining Batch B rows are admitted');
 const [name,lockHash,contextHash,tree,brandingHash,copyHash]=row;
 const read=filename=>execFileSync('git',['show',base+':'+prefix+'al-basma-motors/'+filename],{maxBuffer:1024**2});
 const oldLock=read('qualification-lock.json'),oldContext=read('qualification-context.json');
 assert.equal(sha(oldLock),'514a658fc544d6d26ea3bc70618d6659a9866be3292135b92d13a5aabfb8cdf0');
 assert.equal(sha(oldContext),'4240c49f1a5305b0e135ff86217643e6b9fcee2b0f0a7393e35a19287146a62f');
 const lockBytes=Buffer.from(oldLock.toString().replaceAll('vercel-al-basma-motors-b1f-source-qualification','vercel-'+name+'-b1f-source-qualification'));
 const contextBytes=Buffer.from(oldContext.toString().replaceAll('al-basma-motors',name).replace('514a658fc544d6d26ea3bc70618d6659a9866be3292135b92d13a5aabfb8cdf0',lockHash).replace('7094a2b2cfe73e49701819ca8ac983468106cf7a',tree));
 assert.equal(sha(lockBytes),lockHash,'Recovered lock is not byte-identical to the attached reviewed payload');
 assert.equal(sha(contextBytes),contextHash,'Recovered context is not byte-identical to the attached reviewed payload');
 for(const [filename,bytes]of [['qualification-lock.json',lockBytes],['qualification-context.json',contextBytes]]){
  const target=prefix+name+'/'+filename;fs.mkdirSync(path.dirname(target),{recursive:true});
  if(fs.existsSync(target))assert(fs.readFileSync(target).equals(bytes),'Do not overwrite a different published input');else fs.writeFileSync(target,bytes,{flag:'wx'});
 }
 return {schemaVersion:1,sourceRevision:'b1f0f5609c7c249cfd0649c122849ff2cbb8dfde',approvedParentLockDigest:'ecdfaf9599fbcbeadebc24de3b9aa1c7615a9a49e29d338e5e9a23427d405e26',dealers:[name],inputs:{[name]:{
  candidateLock:{path:prefix+name+'/qualification-lock.json',sha256:lockHash},
  qualification:{path:prefix+name+'/qualification-context.json',sha256:contextHash},
  sourceDeltaReview:{path:'docs/releases/cloudflare-existing25-20261011/signature-successor/source-delta-review.json',sha256:'cbdd14d8bc3d18a10c028134e33b47225a4fe2a52951b527b08f33cb55581975'},
  branding:{path:'docs/releases/cloudflare-existing25-20261011/branding-inputs52/'+name+'/branding.json',sha256:brandingHash},
  modernCopyReview:{path:prefix+name+'/modern-copy-review.json',sha256:copyHash}
 }}};
}
