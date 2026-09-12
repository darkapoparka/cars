from pathlib import Path
root=Path('J:/cars/templates/auto-best')
def edit(file,old,new):
    p=root/file; s=p.read_text(encoding='utf-8'); assert s.count(old)==1,(file,old[:60],s.count(old)); p.write_text(s.replace(old,new),encoding='utf-8')
f='src/lib/components/vehicles/VehicleCard.svelte'
edit(f,'  const image =', "  import VehicleImageFallback from './VehicleImageFallback.svelte';\n  let failedImage = $state<string | null>(null);\n  const image =")
edit(f,'      <img\n        src={image.src}', '      {#if failedImage === vehicle.image}<VehicleImageFallback />{:else}\n      <img\n        onerror={() => failedImage = vehicle.image}\n        src={image.src}')
edit(f,'      />\n      </div>', '      />\n      {/if}\n      </div>')
f='src/routes/listing-detail-v1/[id]/+page.svelte'
edit(f,"  import './detail.css';", "  import './detail.css';\n  import VehicleImageFallback from '$components/vehicles/VehicleImageFallback.svelte';\n  let failedImage = $state<string | null>(null);")
edit(f,'                <img\n                  src={imageMedia(data.vehicle.image).src}', '                {#if failedImage === data.vehicle.image}<VehicleImageFallback />{:else}\n                <img\n                  onerror={() => failedImage = data.vehicle.image}\n                  src={imageMedia(data.vehicle.image).src}')
edit(f,'                />\n              </figure>', '                />\n                {/if}\n              </figure>')
edit(f,'<section class="dn-detail-card dn-detail-finance-card" aria-label=', '<section id="financing" class="dn-detail-card dn-detail-finance-card" aria-label=')
f='src/lib/components/company/ContactIntent.svelte'
edit(f,'term: String(finance.termMonths) })}`}', 'term: String(finance.termMonths) })}#financing`}')
print('Vehicle cards and PDP have a shared non-interactive image-failure state; finance editing returns to the financing section.')
