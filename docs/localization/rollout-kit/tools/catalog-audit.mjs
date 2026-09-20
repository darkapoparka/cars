import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { isKnownLanguage } from '../dist/policy.js';

const digest = value => createHash('sha256').update(value).digest('hex');
const normalize = value => value.replace(/\s+/g,' ').trim();
const placeholders = value => [...value.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map(m=>m[1]).sort().join('|');
const validText = value => typeof value === 'string' && value.trim() && !/TODO|TRANSLATE_ME|MISSING_TRANSLATION/.test(value);

/** Build-time catalog diagnostics. Complete text is not linguistic or browser approval. */
export function auditCatalog({ records, common, locale }) {
  if(!isKnownLanguage(locale)) throw new Error('Unknown language code; use uk for Ukrainian and el for Greek');
  if(!Array.isArray(records) || !common || typeof common!=='object' || Array.isArray(common)) throw new Error('Invalid catalog inputs');
  const keys=new Set(), messages=[], problems=[];
  for(const [key, values] of Object.entries(common)) {
    if(!values || typeof values!=='object' || !validText(values.en)) throw new Error('Invalid common English message: '+key);
    keys.add(key);messages.push({key,source:values.en,en:values.en,value:values[locale],kind:'common'});
  }
  for(const record of records) {
    if(!record || typeof record.source!=='string' || normalize(record.source)!==record.source || record.key!=='m_'+digest(record.source).slice(0,12)) throw new Error('Source/key mismatch');
    if(keys.has(record.key)) throw new Error('Duplicate catalog key: '+record.key);
    keys.add(record.key);
    if(!['translate','invariant','not-ui'].includes(record.disposition)) throw new Error('Invalid disposition: '+record.key);
    if(record.disposition==='not-ui') continue;
    if(!validText(record.en)) throw new Error('Missing English source text: '+record.key);
    messages.push({key:record.key,source:record.source,en:record.en,value:record[locale],kind:record.disposition});
  }
  for(const message of messages) {
    if(!validText(message.value)) problems.push({key:message.key,reason:'missing'});
    else if(placeholders(message.en)!==placeholders(message.value)) problems.push({key:message.key,reason:'placeholder-mismatch'});
    else if(locale==='en' && message.kind!=='invariant' && /[\u0400-\u04ff]/.test(message.value)) problems.push({key:message.key,reason:'cyrillic-in-english'});
  }
  const bad=new Set(problems.map(p=>p.key));
  return {
    locale,total:messages.length,complete:messages.length-bad.size,problems,
    contentComplete:problems.length===0,linguisticReview:'not-established-by-this-tool',browserAcceptance:'not-established-by-this-tool',
    sourceDigest:digest(JSON.stringify(messages.map(({key,en,kind})=>({key,en,kind})))),
    translationPacket:messages.map(({key,source,en,value,kind})=>({key,source,en,translation:validText(value)?value:'',kind,status:'requires-review'}))
  };
}
if(process.argv[1] && fileURLToPath(import.meta.url)===path.resolve(process.argv[1])) {
  const args=process.argv.slice(2), options={};
  for(let i=0;i<args.length;i+=2){if(!['--records','--common','--locale'].includes(args[i])||!args[i+1])throw new Error('Usage: node tools/catalog-audit.mjs --records FILE --common FILE --locale CODE');options[args[i].slice(2)]=args[i+1];}
  if(!options.records||!options.common||!options.locale)throw new Error('All three arguments are required');
  const report=auditCatalog({records:JSON.parse(fs.readFileSync(options.records,'utf8')),common:JSON.parse(fs.readFileSync(options.common,'utf8')),locale:options.locale});
  console.log(JSON.stringify(report,null,2));
  if(!report.contentComplete)process.exitCode=2;
}
