from pathlib import Path
import re
root=Path('J:/cars/templates/auto-best')
def edit(p,old,new):
 f=root/p;s=f.read_text(encoding='utf-8');assert old in s,(p,old[:80]);f.write_text(s.replace(old,new),encoding='utf-8')
def transform(p,fn):
 f=root/p;f.write_text(fn(f.read_text(encoding='utf-8')),encoding='utf-8')
edit('src/app.css',':root {',':root {\n  --dn-focus: #0b57d0;')
edit('src/lib/components/layout/SiteShell.svelte','  <Header />\n  <main>','  <a class="dn-skip-link" href="#main-content">Към съдържанието</a>\n  <Header />\n  <main id="main-content" tabindex="-1">')
transform('src/app.css',lambda s:s+'\n.dn-skip-link { position: fixed; top: 8px; left: 8px; z-index: 10000; padding: 12px 18px; border-radius: var(--dn-radius-control); background: #fff; color: #202329; transform: translateY(-200%); }\n.dn-skip-link:focus { transform: none; outline: 3px solid var(--dn-focus); }\n')
for route,key,fallback in [('listing-detail-v1','vehicle','/listing-grid'),('blog-detail','post','/blog')]:
 p=f'src/routes/{route}/[id]/+page.ts'
 edit(p,"import { error }", "import { listReturn } from '$data/journeys';\nimport { error }")
 edit(p,'({ params })','({ params, url })')
 edit(p,f'return {{ {key},',f"return {{ returnTo: listReturn(url.searchParams.get('return'), '{fallback}'), {key},")
 p=f'src/routes/{route}/[id]/+page.svelte'
 # Only visible back links change; all-items links retain their meaning.
 edit(p,f'href={{resolve(\'{fallback}\')}}'+(' aria-label="Назад към автомобилите"' if route=='listing-detail-v1' else ''), f'href={{data.returnTo}}'+(' aria-label="Назад към автомобилите"' if route=='listing-detail-v1' else ''))
 if route=='listing-detail-v1': edit(p,"<a href={resolve('/listing-grid')}>",'<a href={data.returnTo}>')
for component,record,route in [('vehicles/VehicleCard','vehicle','listing-detail-v1'),('editorial/BlogCard','post','blog-detail')]:
 p=f'src/lib/components/{component}.svelte'
 edit(p,"  import { resolve }", "  import { withListReturn } from '$data/journeys';\n  import { resolve }")
 edit(p,f"href={{resolve('/{route}/[id]', {{ id: String({record}.id) }})}}",f"href={{withListReturn(resolve('/{route}/[id]', {{ id: String({record}.id) }}), returnTo)}}")
 if record=='vehicle':
  edit(p,"    vehicle: Vehicle;","    vehicle: Vehicle;\n    returnTo?: string;")
  edit(p,"let { vehicle, showPrice", "let { vehicle, returnTo, showPrice")
  edit(p,'<article class:','<article id={`vehicle-${vehicle.id}`} class:')
 else:
  edit(p,'let { post, priority = false }: { post: BlogPost; priority?: boolean }','let { post, returnTo, priority = false }: { post: BlogPost; returnTo?: string; priority?: boolean }')
  edit(p,'<article class="dn-blog-card">','<article id={`article-${post.id}`} class="dn-blog-card">')
edit('src/lib/components/listing/ListingResults.svelte',"  import { resolve }", "  import { page } from '$app/state';\n  import { resolve }")
edit('src/lib/components/listing/ListingResults.svelte','<VehicleCard {vehicle} showPrice','<VehicleCard {vehicle} returnTo={`${page.url.pathname}${page.url.search}#vehicle-${vehicle.id}`} showPrice')
edit('src/routes/blog/+page.svelte',"  import './blog.css';", "  import './blog.css';\n  import { page } from '$app/state';")
edit('src/routes/blog/+page.svelte','<BlogCard {post} priority','<BlogCard {post} returnTo={`${page.url.pathname}${page.url.search}#article-${post.id}`} priority')
edit('src/routes/contact/+page.ts',"import { resolveContactTopic", "import { selectedVehicle } from '$data/journeys';\nimport { resolveContactTopic")
edit('src/routes/contact/+page.ts','  topic:',"  vehicle: ['inspection', 'leasing'].includes(url.searchParams.get('topic') ?? '') ? selectedVehicle(url.searchParams.get('vehicle')) : null,\n  topic:")
edit('src/routes/contact/+page.svelte','<ContactIntent topic={data.topic}','<ContactIntent vehicle={data.vehicle} topic={data.topic}')
edit('src/lib/components/company/ContactIntent.svelte',"  import Icon", "  import { resolve } from '$app/paths';\n  import { formatVehiclePrice, type Vehicle } from '$data/inventory';\n  import Icon")
edit('src/lib/components/company/ContactIntent.svelte','let { topic, importUrl = null }: { topic: ContactTopic; importUrl?: string | null }','let { topic, vehicle = null, importUrl = null }: { topic: ContactTopic; vehicle?: Vehicle | null; importUrl?: string | null }')
edit('src/lib/components/company/ContactIntent.svelte','    <div class="dn-contact-selected">','''    {#if vehicle}
      <a class="dn-contact-vehicle" href={resolve('/listing-detail-v1/[id]', { id: String(vehicle.id) })} aria-label={`Към ${vehicle.title}`}>
        <img src={vehicle.image} alt="" width="120" height="90" />
        <span><small>Избран автомобил</small><strong>{vehicle.title}</strong><span>{vehicle.year} · {formatVehiclePrice(vehicle.priceEur)}</span></span>
        <Icon name="arrow-right" size={18} />
      </a>
    {/if}
    <div class="dn-contact-selected">''')
transform('src/lib/components/company/ContactIntent.svelte',lambda s:s+'''\n<style>
  .dn-contact-vehicle { display: flex; gap: 12px; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--dn-border, #e1e4e9); color: inherit; }
  .dn-contact-vehicle img { width: 88px; height: 66px; object-fit: cover; border-radius: 8px; }
  .dn-contact-vehicle > span { display: grid; gap: 3px; flex: 1; min-width: 0; }
  .dn-contact-vehicle small, .dn-contact-vehicle span span { font-size: 12px; color: #666d77; }
  .dn-contact-vehicle strong { font-size: 15px; line-height: 1.35; }
  .dn-contact-vehicle:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 3px; }
</style>\n''')
p='src/lib/components/vehicles/VehicleFinanceCalculator.svelte'
edit(p,"  import { resolve }", "  import { vehicleContactHref } from '$data/journeys';\n  import { resolve }")
edit(p,'vehicleTitle','vehicleId');edit(p,'vehicleId: string','vehicleId: number')
edit(p,'resolve(`/contact?topic=leasing&vehicle=${encodeURIComponent(vehicleId)}`)',"resolve(vehicleContactHref(vehicleId, 'leasing'))")
edit(p,'Получете реална оферта','Обсъдете финансиране')
p='src/routes/listing-detail-v1/[id]/+page.svelte'
edit(p,"  import './detail.css';", "  import './detail.css';\n  import { vehicleContactHref } from '$data/journeys';\n  import { bodyLabel } from '$data/listing';")
edit(p,'value: data.vehicle.body','value: bodyLabel(data.vehicle.body)')
edit(p,"resolve('/contact?topic=inspection')","resolve(vehicleContactHref(data.vehicle.id))")
edit(p,'vehicleTitle={data.vehicle.title}','vehicleId={data.vehicle.id}')
edit(p,'Изпратете запитване','Обсъдете автомобила')
edit(p,'''                <div class="dn-detail-gallery__count" aria-hidden="true">
                  <span></span><span></span><span></span>
                </div>
''','')
edit('src/lib/components/layout/Header.svelte',"  import { brand }", "  import { vehicleContactHref, selectedVehicle } from '$data/journeys';\n  import { brand }")
edit('src/lib/components/layout/Header.svelte',"const vehicleDetailHeader = $derived(page.url.pathname.startsWith('/listing-detail-v1/'));", "const detailVehicle = $derived(page.status === 200 && page.url.pathname.startsWith('/listing-detail-v1/') ? selectedVehicle(page.params.id ?? null) : null);\n  const vehicleDetailHeader = $derived(Boolean(detailVehicle));")
edit('src/lib/components/layout/Header.svelte',"resolve('/contact?topic=inspection')", "resolve(detailVehicle ? vehicleContactHref(detailVehicle.id) : '/contact?topic=inspection')")
for p in ['src/routes/sitemap.xml/+server.ts']:
 edit(p,'import type',"import { featuredVehicles } from '$data/inventory';\nimport { blogPosts } from '$data/editorial';\nimport type")
 edit(p,'...Array.from({ length: 8 }, (_, index) => `/listing-detail-v1/${index + 1}`)','...featuredVehicles.map(vehicle => `/listing-detail-v1/${vehicle.id}`)')
 edit(p,'...Array.from({ length: 9 }, (_, index) => `/blog-detail/${index + 1}`)','...blogPosts.map(post => `/blog-detail/${post.id}`)')
