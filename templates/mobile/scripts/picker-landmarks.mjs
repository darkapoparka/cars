import fs from 'node:fs/promises';
/** Native UIAutomator rectangles compared to the same interactive web controls, not screenshots of a screen. */
export async function pickerLandmarks(page, native) {
 const xml=await fs.readFile('reference/android/'+native+'.xml','utf8');
 const decode=value=>value.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&apos;',"'");
 const nodes=[...xml.matchAll(/<node\s+([^>]+)>/g)].map(m=>Object.fromEntries([...m[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(a=>[a[1],decode(a[2])])));
 const checks=[];
 const bounds=node=>{const [x,y,r,b]=node.bounds.match(/\d+/g).map(Number);return {x:x/3,y:(y-168)/3,width:(r-x)/3,height:(b-y)/3};};
 async function compare(name,node,locator){if(!node||!await locator.count())return;const actual=await locator.first().boundingBox();if(!actual)return;const expected=bounds(node);const differences=Object.fromEntries(['x','y','width','height'].map(key=>[key,Math.abs(actual[key]-expected[key])]));checks.push({name,expected,actual,differences,pass:Object.values(differences).every(value=>value<=3)});}
 const find=value=>nodes.find(n=>n.text===value&&n.class==='android.widget.EditText');
 const input=nodes.find(n=>n.class==='android.widget.EditText'&&n['resource-id']?.endsWith('/search_input'));
 await compare('search',input,page.getByLabel(/Search (makes|models)/));
 for(const name of ['Cancel','OK'])await compare(name,nodes.find(n=>n.text===name),page.getByRole('dialog').getByRole('button',{name,exact:true}));
 const variants=nodes.filter(n=>n.class==='android.widget.EditText'&&(n.text||'').startsWith('Variant e.g.'));
 const webVariants=page.getByPlaceholder('Variant e.g. GTI (optional)',{exact:true});
 for(let i=0;i<Math.min(variants.length,await webVariants.count());i++){
   if(bounds(variants[i]).height>=43)await compare('variant-'+i,variants[i],webVariants.nth(i));
 }
 return checks;
}
