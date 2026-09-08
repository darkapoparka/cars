exec(open('J:/cars/audits/2026-09-08/auto-best-improvements/edit.py',encoding='utf-8').read().split("edit('src/app.css'")[0])
p='src/lib/components/listing/ListingResults.svelte'
edit(p,'import { listingFilterOptions,','import { activeFilterCount, listingHiddenFields, listingFilterOptions,')
transform(p,lambda s:re.sub(r'let activeCount = \$derived\(Object.entries.*?;', 'let activeCount = $derived(activeFilterCount(draftFilters));',s))
transform(p,lambda s:re.sub(r'  const hiddenFields = .*?\n  };',"  const hiddenFields = (filters: ListingFilters) => listingHiddenFields(filters, ['sort']);",s,flags=re.S))
p='src/lib/components/listing/ListingFilters.svelte'
edit(p,'import { listingFilterOptions,','import { activeFilterCount as countFilters, bodyLabel, listingParams, listingHiddenFields, removeListingFilter, listingFilterOptions,')
transform(p,lambda s:re.sub(r'  let activeFilterCount = .*?;','  let activeFilterCount = $derived(countFilters(filters));',s,count=1,flags=re.S))
transform(p,lambda s:re.sub(r'  const primaryHiddenFields = .*?\n  };',"  const primaryHiddenFields = (current: ListingFilters) => listingHiddenFields(current, ['q', 'make', 'model', 'body', 'fuel', 'sort']);",s,flags=re.S))
edit(p,'      condition: filters.condition', '      body: bodyLabel(filters.body),\n      condition: filters.condition')
edit(p,'return [...page.url.searchParams.entries()]','return [...listingParams(filters).entries()]')
edit(p,"const params = new URLSearchParams(page.url.searchParams);\n        params.delete(key, value);\n        if (key === 'make') params.delete('model');",'const params = removeListingFilter(filters, key, value);')
edit(p,"{option || 'Купе'}","{bodyLabel(option) || 'Купе'}")
p='src/lib/components/listing/QuickFilterSheet.svelte'
edit(p,'import { listingFilterOptions as options,','import { bodyLabel, listingParams, listingFilterOptions as options,')
transform(p,lambda s:re.sub(r'  const params = \$derived.by\(\(\) => \{.*?\n  \}\);','  const params = $derived(filters ? listingParams(filters) : page.url.searchParams);',s,count=1,flags=re.S))
edit(p,"const optionLabel = (option: string) => field === 'sort'", "const optionLabel = (option: string) => field === 'body' ? bodyLabel(option) || 'Всички' : field === 'sort'")
p='src/lib/components/listing/VehicleSearchDialog.svelte'
edit(p,'import { filterListingVehicles,','import { bodyLabel, filterListingVehicles,')
edit(p,"value: draftBody || 'Всички купета'","value: bodyLabel(draftBody) || 'Всички купета'")
edit(p,"{option || 'Купе'}","{bodyLabel(option) || 'Купе'}")
for field in ['YearMin','YearMax','PriceMin','PriceMax','MileageMax']:
 edit(p,f'current.{field[0].lower()+field[1:]} ? String(current.{field[0].lower()+field[1:]})',f'current.{field[0].lower()+field[1:]} !== null ? String(current.{field[0].lower()+field[1:]})')
p='src/lib/components/listing/VehicleDiscoveryForm.svelte'
edit(p,'import { listingFilterOptions,','import { bodyLabel, listingFilterOptions,')
edit(p,"listingFilterOptions.bodies as value (value)}<option {value}>{value || 'Всички'}","listingFilterOptions.bodies as value (value)}<option {value}>{bodyLabel(value) || 'Всички'}")
p='src/lib/data/home.ts'
edit(p,"import { brand }", "import { featuredVehicles } from './inventory';\nimport { bodyLabel } from './listing';\nimport { brand }")
edit(p,'export const bodyTypes = [','const bodyArtwork = [')
edit(p,'export const brands = [','const brandArtwork = [')
edit(p,'export const editorial = [',"""export const bodyTypes = [...new Set(featuredVehicles.map(vehicle => vehicle.body))].map(query => {
  const artwork = bodyArtwork.find(item => item.query === query) ?? bodyArtwork[0];
  return { ...artwork, query, label: bodyLabel(query), count: featuredVehicles.filter(vehicle => vehicle.body === query).length };
});
export const brands = brandArtwork.filter(item => featuredVehicles.some(vehicle => vehicle.make === item.label))
  .map(item => ({ ...item, count: featuredVehicles.filter(vehicle => vehicle.make === item.label).length }));

export const editorial = [""")
# Destination matches the actual question, not the general article index.
transform(p,lambda s:s.replace("href: '/blog'","href: '/contact'",1).replace("href: '/blog'","href: '/blog-detail/1'",1).replace("href: '/blog'","href: '/blog-detail/2'",1))
p='src/lib/components/home/BodyTypes.svelte'
edit(p,"new Set<string>(['Sedan', 'Hatchback', 'SUV', 'Crossover', 'Wagon'])","new Set<string>(bodyTypes.map(item => item.query))")
edit(p,'bodyTypes[7].image',"'/assets/images/icon-box/car-list8.png'")
edit(p,'<small class="dn-body-type__subtitle">Вижте автомобилите</small>','<small class="dn-body-type__subtitle">{item.count} {item.count === 1 ? \'автомобил\' : \'автомобила\'}</small>')
# Four active types fit naturally in the existing rail; maintain mobile tile dimensions.
edit(p,'grid-auto-columns: calc((100% - 150px) / 6);','grid-auto-columns: calc((100% - 90px) / 4);')
p='src/lib/data/navigation.ts'
edit(p,"  | '/blog'", "  | `/blog-detail/${number}`\n  | '/blog'")
edit(p,"title: 'Кросоувър', detail: 'Градска практичност'", "title: 'Комби', detail: 'Място за всеки ден'")
edit(p,"href: '/listing-grid?body=Crossover'","href: '/listing-grid?body=Wagon'")
edit(p,"label: 'Нови автомобили', href: '/listing-grid?condition=new'","label: 'Най-нови предложения', href: '/listing-grid?sort=newest'")
edit(p,"label: 'Седан', href: '/listing-grid?body=Sedan'","label: 'Комби', href: '/listing-grid?body=Wagon'")
edit(p,"label: 'Coupe'","label: 'Купе'")
for name,idx in [('inspection',1),('import',2),('leasing',3)]:
 transform(p,lambda s:re.sub(r"(id: 'guides-"+name+r"'.*?href: )'/blog'",r"\g<1>'/blog-detail/"+str(idx)+"'",s))
