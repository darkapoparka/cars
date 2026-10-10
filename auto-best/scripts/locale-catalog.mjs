/** Pure catalog compiler. Ambiguous prose is never a runtime translation key. */
export const normalizeCopy = value => value.replace(/\s+/g, ' ').trim();
const parameters = value => [...value.matchAll(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g)].map(m=>m[1]).sort().join('|');
export function compileCatalog(common, records) {
  const en = {}, bg = {}, candidates = new Map();
  function add(key, english, bulgarian) {
    if (typeof key !== 'string' || !/^[a-zA-Z][a-zA-Z0-9_.-]*$/.test(key)) throw Error('Invalid message key');
    if (typeof english !== 'string' || typeof bulgarian !== 'string' || !english.trim() || !bulgarian.trim() || /TODO|TRANSLATE_ME|MISSING_TRANSLATION/.test(english+bulgarian)) throw Error('Incomplete translation: '+key);
    if (parameters(english) !== parameters(bulgarian)) throw Error('Placeholder mismatch: '+key);
    if (Object.hasOwn(en,key)) throw Error('Duplicate message key: '+key);
    en[key] = english; bg[key] = bulgarian;
  }
  for (const [key,value] of Object.entries(common)) add(key,value.en,value.bg);
  for (const row of records) {
    if (row.disposition === 'not-ui') continue;
    add(row.key,row.en,row.bg);
    if (typeof row.source !== 'string' || !row.source.trim()) throw Error('Missing source: '+row.key);
    for (const value of [row.source,row.en,row.bg,...(row.aliases??[])]) {
      if (typeof value !== 'string' || !value.trim()) throw Error('Invalid alias: '+row.key);
      const alias = normalizeCopy(value);
      const entries = candidates.get(alias) ?? [];
      entries.push(row.key); candidates.set(alias,entries);
    }
  }
  const sourceKeys = {}, ambiguousAliases = [];
  for (const [alias,keys] of candidates) {
    const meanings = new Set(keys.map(key=>JSON.stringify([en[key],bg[key]])));
    if (meanings.size > 1) ambiguousAliases.push(alias);
    else sourceKeys[alias] = [...keys].sort()[0];
  }
  return { en, bg, sourceKeys, ambiguousAliases: ambiguousAliases.sort() };
}
