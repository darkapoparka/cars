p = 'src/lib/components/home/BodyTypes.svelte'
s = original[p].decode('utf8')
s = s.replace("import { bodyTypes } from '$data/home';", "import { bodyTypes, mobileDiscoveryLimit } from '$data/home';\n  import DiscoveryToggle from '$components/ui/DiscoveryToggle.svelte';")
s = s.replace('slice(0, 3)', 'slice(0, mobileDiscoveryLimit)')
s = re.sub(r'  const mobileTypeArt: Record<string, string> = \{.*?\n  \};\n', '', s, flags=re.S).replace('mobileTypeArt[item.query]', 'item.mobileImage')
s = re.sub(r'        <button class="dn-discovery-toggle".*?</button>', '        <DiscoveryToggle bind:expanded controls="body-types-grid" label="Всички типове" />', s, flags=re.S)
a = s.index('  .dn-discovery-toggle { display: none; }', s.index('<style>'))
b = s.index('\n  .dn-body-types__heading', a)
s = s[:a] + '  .dn-body-type__baked-art { display: none; }\n  @media (max-width: 767px) {\n    .dn-body-type--additional { order: 2; }\n    .dn-body-type.dn-body-type--baked { min-height: 0; aspect-ratio: 10 / 7; }\n    .dn-body-type--baked > .dn-body-type__baked-art { display: block; width: 100%; height: 100%; object-fit: contain; }\n    .dn-body-type--baked .dn-body-type__image,\n    .dn-body-type--baked .dn-body-type__content { display: none; }\n  }\n' + s[b:]
s = s.replace('id="body-types-grid"', 'id="body-types-grid" data-initial-count={mobileBodyTypes.size} data-total-count={bodyTypes.length}')
s = s.replace('loading="eager" decoding="async"', 'width="180" height="126" loading="lazy" decoding="async"')
put(p, s)
p = 'src/lib/components/home/BrandSection.svelte'
s = original[p].decode('utf8').replace("import { brands } from '$data/home';", "import { brands, mobileDiscoveryLimit } from '$data/home';\n  import DiscoveryToggle from '$components/ui/DiscoveryToggle.svelte';").replace('slice(0, 3)', 'slice(0, mobileDiscoveryLimit)')
s = re.sub(r'<button class="dn-discovery-toggle".*?</button>', '<DiscoveryToggle bind:expanded controls="brands-grid" label="Всички марки" />', s, flags=re.S)
s = '\n'.join(line for line in s.split('\n') if '.dn-discovery-toggle' not in line)
s = s.replace('id="brands-grid"', 'id="brands-grid" data-initial-count={mobileBrands.size} data-total-count={brands.length}').replace('alt={`${brand.label} лого`}', 'alt=""')
put(p, s)
p = 'scripts/home-hierarchy-smoke.mjs'
s = (root/p).read_text(encoding='utf8')
s = s.replace("assert.equal(await types.count(), width < 768 ? 4 : 8);", "assert.equal(await types.count(), Number(await page.locator('#body-types-grid').getAttribute(width < 768 ? 'data-initial-count' : 'data-total-count')));")
s = s.replace("assert.equal(await brands.count(), width < 768 ? 4 : 12);", "assert.equal(await brands.count(), Number(await page.locator('#brands-grid').getAttribute(width < 768 ? 'data-initial-count' : 'data-total-count')));")
put(p, s)
pkg = json.loads((root/'package.json').read_text(encoding='utf8'))
pkg['scripts']['check'] = 'svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --fail-on-warnings'
pkg['scripts']['smoke'] += ' && node scripts/home-hierarchy-smoke.mjs'
put('package.json', json.dumps(pkg, indent=2) + '\n')
