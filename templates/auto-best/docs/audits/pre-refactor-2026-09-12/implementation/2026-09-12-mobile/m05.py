p = 'src/lib/data/listing.ts'
s = (root/p).read_text(encoding='utf8').replace('  priceMin: number | null;', '  priceMin: number | null;\n  priceMinExclusive: boolean;')
s = s.replace("    else if (value !== null", "    else if (typeof value === 'boolean') { if (value) params.set(name, '1'); }\n    else if (value !== null")
s = s.replace("listingHiddenFields(filters, ['q', 'sort']).length", "listingHiddenFields(filters, ['q', 'sort', 'price_min_exclusive']).length")
s = s.replace("  if (key === 'make') params.delete('model');", "  if (key === 'make') params.delete('model');\n  if (key === 'price_min') params.delete('price_min_exclusive');")
s = s.replace("    priceMin: integerParam(params, 'price_min'),", "    priceMin: integerParam(params, 'price_min'),\n    priceMinExclusive: params.get('price_min_exclusive') === '1' && integerParam(params, 'price_min') !== null,")
s = s.replace('vehicle.priceEur < filters.priceMin)', '(vehicle.priceEur < filters.priceMin || (filters.priceMinExclusive && vehicle.priceEur === filters.priceMin)))')
put(p, s)
p = 'src/lib/components/home/VehicleQuickSearch.svelte'
s = (root/p).read_text(encoding='utf8').replace('    priceMin: null,', '    priceMin: null,\n    priceMinExclusive: false,'); put(p, s)
p = 'src/lib/components/listing/VehicleSearchDialog.svelte'
s = (root/p).read_text(encoding='utf8').replace("  let draftPriceMin = $state('');", "  let draftPriceMin = $state('');\n  let draftPriceMinExclusive = $state(false);")
s = s.replace('    priceMin: draftPriceMin ?', '    priceMinExclusive: draftPriceMinExclusive,\n    priceMin: draftPriceMin ?')
s = s.replace("    draftPriceMin = current.priceMin", "    draftPriceMinExclusive = current.priceMinExclusive;\n    draftPriceMin = current.priceMin")
s = s.replace("    draftPriceMin = '';", "    draftPriceMin = '';\n    draftPriceMinExclusive = false;")
s = s.replace('bind:value={draftPriceMin}>', 'bind:value={draftPriceMin} onchange={() => draftPriceMinExclusive = false}>')
s = s.replace('<input type="hidden" name="sort"', '{#if draftPriceMinExclusive}<input type="hidden" name="price_min_exclusive" value="1" />{/if}\n      <input type="hidden" name="sort"')
put(p, s)
p = 'src/lib/components/listing/QuickFilterSheet.svelte'
s = (root/p).read_text(encoding='utf8').replace("    if (range) return key !== `${field}_min` && key !== `${field}_max`;", "    if (range) return key !== `${field}_min` && key !== `${field}_max` && !(field === 'price' && key === 'price_min_exclusive');"); put(p, s)
p = 'src/lib/components/listing/VehicleDiscoveryForm.svelte'
s = (root/p).read_text(encoding='utf8').replace("    ['price_min', filters.priceMin?.toString() ?? ''],", "    ['price_min_exclusive', filters.priceMinExclusive ? '1' : ''],\n    ['price_min', filters.priceMin?.toString() ?? ''],"); put(p, s)
p = 'src/lib/components/listing/ListingFilters.svelte'
s = (root/p).read_text(encoding='utf8').replace('price_min: `От ${filters.priceMin', "price_min: `${filters.priceMinExclusive ? 'Над' : 'От'} ${filters.priceMin"); put(p, s)
p = 'src/lib/components/home/MobileBudget.svelte'
s = (root/p).read_text(encoding='utf8').replace("  import { featuredVehicles }", "  import { budgetBands, budgetLabel, budgetCount, budgetHref } from '$data/discovery';\n  import { featuredVehicles }")
s = re.sub(r'  const budgetTiles = \[.*?\] as const;', '  const budgetTiles = budgetBands.map(band => ({\n    label: budgetLabel(band), detail: vehicleCount(budgetCount(featuredVehicles, band)),\n    href: budgetHref(band), artwork: vehicleArtwork[band.artwork]\n  }));', s, flags=re.S)
put(p, s)
p = 'src/lib/data/home.ts'
s = (root/p).read_text(encoding='utf8').replace("import { featuredVehicles }", "import { budgetBands, budgetHref, budgetLabel } from './discovery';\nimport { featuredVehicles }")
s += '\nexport const homeShortcuts = [\n  ...budgetBands.slice(0, 2).map(band => ({ label: budgetLabel(band), href: budgetHref(band) })),\n  ...[...new Set(featuredVehicles.map(vehicle => vehicle.make))].slice(0, mobileDiscoveryLimit).map(make => ({\n    label: make, href: `/listing-grid?${new URLSearchParams({ make })}` as `/listing-grid?${string}`\n  }))\n];\n'
put(p, s)
p = 'src/lib/components/home/SearchBox.svelte'
s = (root/p).read_text(encoding='utf8').replace("  import { resolve }", "  import { homeShortcuts } from '$data/home';\n  import { resolve }")
s, n = re.subn(r'(<nav class="dn-search__mobile-shortcuts"[^>]*>).*?(</nav>)', r'\1\n    {#each homeShortcuts as shortcut (shortcut.href)}<a href={resolve(shortcut.href)}>{shortcut.label}</a>{/each}\n  \2', s, flags=re.S)
assert n == 1
put(p, s)
