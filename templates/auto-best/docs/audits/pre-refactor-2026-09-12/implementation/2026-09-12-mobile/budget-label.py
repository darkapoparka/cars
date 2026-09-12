from pathlib import Path
p = Path('J:/cars/templates/auto-best/src/lib/data/discovery.ts')
s = p.read_text(encoding='utf-8')
lines = s.splitlines()
indices = [i for i,line in enumerate(lines) if line.startswith('  return `${number.format(band.minimum)}')]
assert len(indices) == 1, indices
lines[indices[0]:indices[0]+1] = [
  '  // Share the thousands suffix for exact-thousand intervals; keep the currency attached.',
  '  const minimum = band.minimum % 1000 === 0 && band.maximum % 1000 === 0',
  '    ? number.format(band.minimum / 1000) : number.format(band.minimum);',
  '  return `${minimum}\u2013${number.format(band.maximum)}\\u00a0\u20ac`;'
]
p.write_text('\n'.join(lines)+'\n', encoding='utf-8')
print('Budget label uses the original compact thousands notation, computed from its interval.')
