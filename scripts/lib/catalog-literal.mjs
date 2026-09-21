// Read data-only TypeScript catalog literals without evaluating repository code.
// Imports, calls, spreads, getters and computed expressions are intentionally rejected.
export function readCatalogLiteral(source, start = 0) {
  let at = start;
  const fail = message => { throw new Error(`Invalid catalog literal at ${at}: ${message}`); };
  if (typeof source !== 'string' || source.length > 16 * 1024 * 1024) fail('invalid size');
  function white() {
    for (;;) {
      while (/\s/.test(source[at] || '') && at < source.length) at++;
      if (source.slice(at, at + 2) === '//') { const end = source.indexOf('\n', at); at = end < 0 ? source.length : end + 1; }
      else if (source.slice(at, at + 2) === '/*') { const end = source.indexOf('*/', at + 2); if (end < 0) fail('unterminated comment'); at = end + 2; }
      else return;
    }
  }
  function string() {
    const quote = source[at++]; let result = '';
    while (at < source.length) {
      let char = source[at++];
      if (char === quote) return result;
      if (char === '\n' || char === '\r' || char.charCodeAt(0) < 32) fail('unescaped string control');
      if (quote === '`' && char === '$' && source[at] === '{') fail('computed template string');
      if (char !== '\\') { result += char; continue; }
      char = source[at++];
      const escapes = { n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', v: '\v', '0': '\0', "'": "'", '"': '"', '`': '`', '\\': '\\', '/': '/' };
      if (Object.hasOwn(escapes, char)) { result += escapes[char]; continue; }
      if (char === 'u' || char === 'x') {
        const count = char === 'u' ? 4 : 2, hex = source.slice(at, at + count);
        if (!new RegExp(`^[0-9a-fA-F]{${count}}$`).test(hex)) fail('invalid character escape');
        at += count; result += String.fromCharCode(parseInt(hex, 16)); continue;
      }
      fail('unsupported string escape');
    }
    fail('unterminated string');
  }
  function value(depth = 0) {
    if (depth > 64) fail('excessive nesting');
    white();
    if (['"', "'", '`'].includes(source[at])) return string();
    if (source[at] === '{' || source[at] === '[') {
      const object = source[at++] === '{', close = object ? '}' : ']';
      const result = object ? Object.create(null) : [], keys = new Set();
      for (;;) {
        white(); if (source[at] === close) { at++; return result; }
        if (object) {
          let key;
          if (['"', "'"].includes(source[at])) key = string();
          else { const match = source.slice(at).match(/^[\p{ID_Start}$_][\p{ID_Continue}$\u200C\u200D]*/u); if (!match) fail('expected a static key'); key = match[0]; at += key.length; }
          white(); if (source[at++] !== ':') fail('expected a data property');
          if (keys.has(key)) fail(`duplicate key ${key}`);
          keys.add(key); result[key] = value(depth + 1);
        } else result.push(value(depth + 1));
        white(); if (source[at] === close) { at++; return result; }
        if (source[at++] !== ',') fail('expected separator');
      }
    }
    const match = source.slice(at).match(/^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)(?![A-Za-z0-9_$])/);
    if (!match) fail('expected literal data, not executable source');
    at += match[0].length; return JSON.parse(match[0]);
  }
  const parsed = value(); return { value: parsed, end: at };
}
export function readTypeScriptCatalog(source, name) {
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)) throw new Error('Invalid catalog binding');
  const declarations = [...source.matchAll(new RegExp(`^(?:export\\s+)?const\\s+${name}(?:\\s*:[^=]+)?\\s*=\\s*`, 'gm'))];
  if (declarations.length !== 1) throw new Error(`Expected one static catalog binding: ${name}`);
  const item = declarations[0], parsed = readCatalogLiteral(source, item.index + item[0].length);
  if (!/^\s*(?:as\s+const\s*)?(?:satisfies\s+[^;]+)?;/.test(source.slice(parsed.end))) throw new Error(`Catalog ${name} must be an uncomputed literal`);
  return parsed.value;
}
