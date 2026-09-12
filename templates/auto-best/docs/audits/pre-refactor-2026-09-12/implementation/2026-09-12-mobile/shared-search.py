from pathlib import Path
root=Path('J:/cars/templates/auto-best')
def edit(file,old,new):
    p=root/file; s=p.read_text(encoding='utf-8'); assert s.count(old)==1,(file,old[:60],s.count(old)); p.write_text(s.replace(old,new),encoding='utf-8')
f='src/lib/components/home/SearchBox.svelte'
edit(f,'    <div class="dn-search">','    <div class="dn-search">\n      <VehicleSearchDialog filters={desktopFilters}>\n      {#snippet children(openFilters, filtersOpen)}')
edit(f,'<VehicleQuickSearch />','<VehicleQuickSearch {openFilters} {filtersOpen} />')
edit(f,'        <VehicleSearchDialog filters={desktopFilters}>\n          {#snippet children(openFilters, filtersOpen)}\n            <VehicleDiscoveryForm filters={desktopFilters} {openFilters} {filtersOpen} onDraftChange={(filters) => desktopFilters = filters} showFilterAction={false} />\n          {/snippet}\n        </VehicleSearchDialog>','        <VehicleDiscoveryForm filters={desktopFilters} {openFilters} {filtersOpen} onDraftChange={(filters) => desktopFilters = filters} showFilterAction={false} />')
edit(f,'      </div>\n    </div>\n\n  </div>','      </div>\n      {/snippet}\n      </VehicleSearchDialog>\n    </div>\n\n  </div>')
edit(f,'Продължи към контакт <Icon','Продължи <Icon')
edit(f,'        </form>\n      </div>','          <a class="dn-search__import-alternative" href={resolve(\'/contact?topic=import\')}>Нямам обява</a>\n        </form>\n      </div>')
edit(f,'<style>','<style>\n  .dn-search__import-alternative { display: flex; min-height: 44px; align-items: center; justify-content: center; margin: 4px auto 0; color: var(--dn-ink); font-size: var(--dn-text-meta); font-weight: 600; }')
f='src/lib/components/listing/VehicleSearchDialog.svelte'
edit(f,'  const openFilters = (event: MouseEvent, field?: string) => {','  const openFilters = (event: MouseEvent, field?: string) => {\n    if (filterDialog?.open) return;')
edit(f,'      const target = field ? filterDialog?.querySelector<HTMLSelectElement>(`select[name="${field}"]`) : dialogSearch;\n      target?.focus();','      const target = window.matchMedia(\'(max-width: 767px)\').matches\n        ? filterDialog?.querySelector<HTMLHeadingElement>(\'h2\')\n        : field ? filterDialog?.querySelector<HTMLSelectElement>(`select[name="${field}"]`) : dialogSearch;\n      target?.focus({ preventScroll: true });')
edit(f,'<h2 id="dn-listing-filter-title">','<h2 id="dn-listing-filter-title" tabindex="-1">')
edit(f,'    releaseScroll?.();\n    if (returnFocus','    releaseScroll?.();\n    releaseScroll = undefined;\n    if (returnFocus')
for name in ['scripts/mobile-quality.mjs','docs/implementation/2026-09-12-mobile/stage1-smoke.mjs']:
    p=root/name; s=p.read_text(encoding='utf-8').replace('dn-quick-search-dialog','dn-listing-filter-dialog'); p.write_text(s,encoding='utf-8')
print('Homepage and inventory now use the same search dialog, draft rules and nested pickers; removed the duplicated 770-line implementation.')
