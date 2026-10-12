/** Complete the native Signature Sofia Sans assets from the reviewed Import font family. */
export const SIGNATURE_FONT_FILES = Object.freeze(['Regular','SemiBold','Bold'].flatMap(weight=>['woff2','latin.woff2','cyrillic.woff2'].map(suffix=>`SofiaSans-${weight}.${suffix}`)));
export function completeSignatureFontAssets(files,{sourcePrefix='import/static/fonts/sofia-sans',targetPrefix='karento-best/static/assets/fonts/sofia-sans'}={}) {
 if(!(files instanceof Map))throw Error('A sealed source file Map is required');
 const additions=[];
 for(const name of SIGNATURE_FONT_FILES){const source=sourcePrefix+'/'+name,target=targetPrefix+'/'+name;const existing=files.get(target);if(existing){if(!Buffer.isBuffer(existing)||existing.subarray(0,4).toString()!=='wOF2')throw Error('Invalid existing Signature WOFF2: '+target);continue;}
 const bytes=files.get(source);if(!Buffer.isBuffer(bytes)||bytes.length<64||bytes.subarray(0,4).toString()!=='wOF2')throw Error('Missing reviewed Sofia Sans WOFF2: '+source);additions.push({source,target,bytes:Buffer.from(bytes)});}
 // Validate the complete set before changing the caller's map.
 for(const row of additions)files.set(row.target,row.bytes);
 return additions.map(({source,target,bytes})=>({source,target,bytes:bytes.length}));
}