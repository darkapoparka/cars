from pathlib import Path
p=Path('J:/cars/templates/auto-best/src/lib/components/company/ContactIntent.svelte')
s=p.read_text(encoding='utf-8').replace('</style>\n\n<style>','');p.write_text(s,encoding='utf-8')
source=Path('J:/cars/audits/2026-09-08/auto-best-improvements/discovery.py').read_text(encoding='utf-8')
exec(source.splitlines()[0])
edit('src/lib/components/listing/ListingFilters.svelte',"listingFilterOptions.bodies as option (option)}\n              <option value={option}>{option || 'Всички'}","listingFilterOptions.bodies as option (option)}\n              <option value={option}>{bodyLabel(option) || 'Всички'}")
exec(source[source.index("p='src/lib/components/listing/QuickFilterSheet.svelte'"):])
