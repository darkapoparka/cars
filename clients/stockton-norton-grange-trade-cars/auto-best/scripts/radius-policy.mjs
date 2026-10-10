/** Inspect CSS declarations without matching custom properties or comments. */
export function radiusPolicyErrors(source) {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, match => match.replace(/[^\n]/g, ' '));
  const errors = [];
  const pattern = /\bborder(?:-(?:top-left|top-right|bottom-left|bottom-right|start-start|start-end|end-start|end-end))?-radius\s*:\s*([^;}]+)(?:;|(?=}))/g;
  for (const match of css.matchAll(pattern)) {
    const value = match[1].trim();
    if (/^(?:inherit|initial|unset|revert|revert-layer)$/.test(value)) continue;
    const references = [...value.matchAll(/var\(\s*(--[\w-]+)/g)].map(reference => reference[1]);
    const governed = references.every(name => name === '--dn-pill' || /^--dn-[\w-]*radius(?:-[\w-]+)?$/.test(name));
    // One-pixel border/focus offsets may derive from a radius token.
    const remainder = value.replace(/var\(\s*--[\w-]+\s*\)/g, 'TOKEN')
      .replace(/calc\(TOKEN\s*[+-]\s*1px\)/g, 'TOKEN')
      .replace(/TOKEN|\b0(?:px|rem|%)?\b|\s|\//g, '');
    if (!governed || remainder) errors.push({ line: css.slice(0, match.index).split('\n').length, value });
  }
  return errors;
}
