exec(open('J:/cars/audits/2026-09-08/auto-best-improvements/edit.py',encoding='utf-8').read().split("edit('src/app.css'")[0])
p='src/lib/components/home/BodyTypes.svelte'
edit(p,"  import BrowseAllCard from './BrowseAllCard.svelte';\n",'')
edit(p,'        <BrowseAllCard compact label="Виж всички" image="/assets/images/icon-box/car-list8.png" />\n','')
edit(p,'    .dn-body-types__all {\n      display: none;\n    }','    .dn-body-types__all {\n      display: inline-flex;\n      min-height: 44px;\n      align-items: center;\n    }')
p='src/lib/components/home/BrandSection.svelte'
edit(p,"  import BrowseAllCard from './BrowseAllCard.svelte';\n",'')
edit(p,'        <BrowseAllCard compact label="Всички" />\n','')
edit(p,'grid-template-columns: repeat(3, minmax(0, 1fr));\n      gap: 8px;','grid-template-columns: repeat(2, minmax(0, 1fr));\n      gap: 8px;')
edit(p,'.dn-brand-hero__cta { display: none; }','.dn-brand-hero__cta { display: inline-flex; }')
