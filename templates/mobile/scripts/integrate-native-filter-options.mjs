import fs from 'node:fs';
const first=JSON.parse(fs.readFileSync('reference/android/filter-options/manifest.json','utf8')).fields;
const second=JSON.parse(fs.readFileSync('reference/android/filter-options-remaining/manifest.json','utf8')).fields;
delete first.parking;
const merged={...first,...second};
const records={};
for(const [id,field] of Object.entries(merged)){
  if(field.options.includes('Search Filters'))throw Error('Contaminated capture '+id);
  const mode=field.options.includes('From')&&field.options.includes('To')?'range':field.multiple?'multiple':'single';
  records[id]={mode,includeAny:field.any,options:field.options,source:(second[id]?'reference/android/filter-options-remaining/':'reference/android/filter-options/')+field.files[0]};
}
const contents="// Generated from verified native Android dialog captures. Re-run scripts/integrate-native-filter-options.mjs to refresh.\nexport type NativeFilterCapture = { mode: 'range'|'single'|'multiple'; includeAny: boolean; options: string[]; source: string };\nexport const nativeFilterOptions: Record<string,NativeFilterCapture> = "+JSON.stringify(records,null,2)+';\n';
fs.writeFileSync('src/lib/native-filter-options.ts',contents);
fs.writeFileSync('reference/web/pass2/native-filter-integration.json',JSON.stringify({at:new Date().toISOString(),count:Object.keys(records).length,fields:Object.keys(records),invalidExcluded:['filter-options/parking (recaptured in remaining)']},null,2));
console.log('INTEGRATED_NATIVE_DIALOGS',Object.keys(records).length);
