import {createHash} from 'node:crypto';
const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
/** A personalized multi-phone string can contain a real newline in the Svelte
 * aria-label expression. Bind that fallback to the same factual contact value
 * already rendered by the link. Application layout and contact data stay intact. */
export function repairSignatureFooterContact(files){
 const path='karento-best/src/lib/components/Footer.svelte',before=files.get(path);if(!before)return null;
 let changed=0;
 const source=before.toString('utf8').replace(/(aria-label=\{desktop\.current\s*\?\s*locale\.t\("contact\.polish\.call",\s*\{\s*phone:\s*dealer\.contacts\.phone,\s*\}\)\s*:\s*)"([+\d\s().\/-]+)"(\})/g,(whole,start,phone,end)=>{if(!/[\r\n]/.test(phone))return whole;changed++;return start+'dealer.contacts.phone'+end;});
 if(!changed)return null;if(changed!==1)throw Error('Signature footer must have one phone fallback');
 const after=Buffer.from(source);files.set(path,after);return{kind:'signature-footer-phone-expression',path,beforeSha256:sha256(before),afterSha256:sha256(after),canonicalSourceUnchanged:true};
}
