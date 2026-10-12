/** Derive exact required facts from immutable source, never require an absent stock file. */
export function assertModernFactualInputInventory({declared,original,current}) {
  const allow=['business-facts.json','dealer.json','stock.json'];
  const valid=(names)=>Array.isArray(names)&&names.every(n=>allow.includes(n))&&new Set(names).size===names.length;
  if(!valid(original)||!valid(current)||!Array.isArray(declared)||!declared.every(r=>r&&typeof r==='object'&&typeof r.path==='string'))throw Error('Exact original Modern factual input inventory required');
  const required=['business-facts.json','dealer.json'];
  const expected=[...original].sort(),observed=[...current].sort(),provided=declared.map(r=>r.path).sort();
  if(!required.every(n=>original.includes(n))||JSON.stringify(expected)!==JSON.stringify(observed)||JSON.stringify(expected)!==JSON.stringify(provided))throw Error('Exact original Modern factual input inventory required');
  return expected;
}
