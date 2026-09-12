from pathlib import Path
p = Path(r'J:\cars\templates\auto-best\src\lib\components\home\BodyTypes.svelte')
s = p.read_text(encoding='utf-8')
s = s.replace(
"  const mobileBodyTypes = new Set<string>(bodyTypes.filter(item => item.count > 0).slice(0, 3).map(item => item.query));\n  let expanded = $state(false);",
"  const mobileBodyTypes = new Set<string>(bodyTypes.filter(item => item.count > 0).slice(0, 3).map(item => item.query));\n  const mobileTypeArt: Record<string, string> = {\n    SUV: '/assets/images/generated/body-suv-mobile.png',\n    Wagon: '/assets/images/generated/body-wagon-mobile.png',\n    Coupe: '/assets/images/generated/body-coupe-mobile.png'\n  };\n  let expanded = $state(false);"
)
old = '''          <a class="dn-body-type" class:dn-body-type--additional={!mobileBodyTypes.has(item.query)} class:dn-body-type--secondary={!expanded && !mobileBodyTypes.has(item.query)} data-stock-count={item.count} href={resolve(`/listing-grid?body=${encodeURIComponent(item.query)}`)}>
            <span class="dn-body-type__image">'''
new = '''          <a class="dn-body-type" class:dn-body-type--baked={Boolean(mobileTypeArt[item.query])} class:dn-body-type--additional={!mobileBodyTypes.has(item.query)} class:dn-body-type--secondary={!expanded && !mobileBodyTypes.has(item.query)} data-stock-count={item.count} href={resolve(`/listing-grid?body=${encodeURIComponent(item.query)}`)}>
            {#if mobileTypeArt[item.query]}
              <img class="dn-body-type__baked-art" src={mobileTypeArt[item.query]} alt={item.label} loading="lazy" decoding="async" />
            {/if}
            <span class="dn-body-type__image">'''
s = s.replace(old, new)
old = '''        <button class="dn-discovery-toggle" aria-expanded={expanded} aria-controls="body-types-grid" onclick={() => expanded = !expanded}>
          <span class="dn-discovery-toggle__visual" aria-hidden="true">
            <span class="dn-discovery-toggle__dots"><i></i><i></i><i></i><i></i></span>
          </span>
          <strong>{expanded ? 'Покажи по-малко' : 'Всички типове'}</strong>
        </button>'''
new = '''        <button class="dn-discovery-toggle" aria-expanded={expanded} aria-controls="body-types-grid" onclick={() => expanded = !expanded}>
          <img class="dn-discovery-toggle__baked-art" src="/assets/images/generated/body-all-mobile.png" alt="Всички типове" loading="lazy" decoding="async" />
          <strong class="sr-only">{expanded ? 'Покажи по-малко' : 'Всички типове'}</strong>
        </button>'''
s = s.replace(old, new)
insert = '''
    .dn-body-type__baked-art,
    .dn-discovery-toggle__baked-art { display: none; }
    .dn-body-type--baked .dn-body-type__baked-art,
    .dn-discovery-toggle__baked-art { display: block; width: 100%; height: 100%; object-fit: cover; }
    .dn-body-type--baked .dn-body-type__image,
    .dn-body-type--baked .dn-body-type__content { display: none; }
'''
s = s.replace("    .dn-body-type--additional { order: 2; }\n", "    .dn-body-type--additional { order: 2; }\n" + insert, 1)
p.write_text(s, encoding='utf-8')
