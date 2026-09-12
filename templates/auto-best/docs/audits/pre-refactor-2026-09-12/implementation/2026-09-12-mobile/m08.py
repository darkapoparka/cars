p = 'src/lib/components/ui/FeatureArtwork.svelte'
s = (root/p).read_text(encoding='utf8').replace('<script lang="ts">', '<script lang="ts">\n  import { imageMedia } from \'$data/image-media\';')
s = s.replace('</script>', '  const image = $derived(imageMedia(artwork.src));\n</script>').replace('src={artwork.src}', 'src={image.src} srcset={image.srcset} sizes="(max-width: 767px) 50vw, 360px" loading="lazy"'); put(p, s)
p = 'src/lib/components/ui/HeroVehicles.svelte'
s = (root/p).read_text(encoding='utf8').replace('<ArtworkRegion artwork={mobileHeroRegions.home} />', '<ArtworkRegion artwork={mobileHeroRegions.home} priority sizes="100vw" />'); put(p, s)
for p, variable, sizes in [('src/lib/components/vehicles/VehicleCard.svelte', 'vehicle', "{layout === 'listing' ? '(max-width: 767px) 40vw, (max-width: 1279px) 33vw, 25vw' : '(max-width: 767px) 80vw, 33vw'}"), ('src/lib/components/editorial/BlogCard.svelte', 'post', '"(max-width: 767px) 35vw, 33vw"')]:
    s = (root/p).read_text(encoding='utf8').replace('<script lang="ts">', '<script lang="ts">\n  import { imageMedia } from \'$data/image-media\';')
    s = s.replace('</script>', f'  const image = $derived(imageMedia({variable}.image));\n</script>').replace(f'src={{{variable}.image}}', f'src={{image.src}} srcset={{image.srcset}} sizes={sizes}')
    put(p, s)
p = 'src/lib/components/home/Editorial.svelte'
s = (root/p).read_text(encoding='utf8').replace('<script lang="ts">', '<script lang="ts">\n  import { imageMedia } from \'$data/image-media\';').replace('{#each editorial as item (item.title)}', '{#each editorial as item (item.title)}\n          {@const image = imageMedia(item.image)}').replace('src={item.image}', 'src={image.src} srcset={image.srcset} sizes="(max-width: 767px) 80vw, 33vw"'); put(p, s)
p = 'src/lib/components/home/InventorySection.svelte'
s = (root/p).read_text(encoding='utf8').replace(' as vehicle, index (vehicle.id)', ' as vehicle (vehicle.id)').replace(' priority={index < 4}', ''); put(p, s)
p = 'src/lib/components/listing/ListingResults.svelte'
s = (root/p).read_text(encoding='utf8').replace('priority={index < 4}', 'priority={index === 0}'); put(p, s)
for file in (root/'static/assets/images/lead').glob('*video*.jpg'):
    assert Image.open(file).format == 'WEBP'
    file.with_suffix('.webp').write_bytes(file.read_bytes())
    destination = root/'provenance/superseded-mobile-2026-09-12'/file.relative_to(root/'static')
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.move(str(file), str(destination))
    p = 'src/lib/data/videos.ts'
    s = (root/p).read_text(encoding='utf8').replace(file.name, file.with_suffix('.webp').name); put(p, s)
file = root/'static/assets/images/generated/all-card-centered-v2.webp'
shutil.move(str(file), str(root/'provenance/superseded-mobile-2026-09-12/assets/images/generated'/file.name))
print('Responsive media integrated; original mislabeled video WebP files preserved and correctly named.')
