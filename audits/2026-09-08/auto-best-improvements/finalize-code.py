exec(open('J:/cars/audits/2026-09-08/auto-best-improvements/edit.py',encoding='utf-8').read().split("edit('src/app.css'")[0])
p='src/lib/data/inventory.ts'
edit(p,'  id: number;','  id: number;\n  verification: \'sample\' | \'verified\';\n  evidenceUrl?: string;')
edit(p,'export const featuredVehicles: Vehicle[] = [',"const inventoryRecords: Omit<Vehicle, 'year' | 'mileage' | 'href' | 'verification'>[] = [")
transform(p,lambda s:re.sub(r" year: '\d{4}',",'',re.sub(r" mileage: '[^']*',",'',re.sub(r", href: '/listing-detail-v1/\d+'",'',s))))
edit(p,"category: 'Спортбек', body: 'Coupe'","category: 'Купе', body: 'Coupe'")
edit(p,'export const formatVehiclePrice',"""// Imported master fixtures are not VIN-verified stock. Preserve source media;
// client promotion requires replacing and verifying each record, including reused photos.
export const featuredVehicles: Vehicle[] = inventoryRecords.map(record => ({
  ...record,
  verification: 'sample',
  year: String(record.yearNumber),
  mileage: `${new Intl.NumberFormat('bg-BG').format(record.mileageKm)} км`,
  href: `/listing-detail-v1/${record.id}`
}));

export const formatVehiclePrice""")
p='src/lib/config/template.ts'
edit(p,'/** Master',"import { featuredVehicles } from '$data/inventory';\n\n/** Master")
edit(p,"  const origin = new URL(template.canonicalOrigin);", "  if (featuredVehicles.some(vehicle => vehicle.verification !== 'verified' || !vehicle.evidenceUrl)) throw new Error('Each vehicle requires record-level evidence before publishing.');\n  const origin = new URL(template.canonicalOrigin);")
p='src/lib/components/home/VehicleQuickSearch.svelte'
edit(p,'import { filterListingVehicles,', 'import { bodyLabel, filterListingVehicles,')
edit(p,"label: value || 'Всички купета'","label: bodyLabel(value) || 'Всички купета'")
transform(p,lambda s:s.replace("{body || 'Всички купета'}","{bodyLabel(body) || 'Всички купета'}"))
p='src/lib/components/home/BrandSection.svelte'
edit(p,'repeat(6, minmax(0, 1fr))','repeat(4, minmax(0, 1fr))')
edit(p,'<small>Вижте автомобилите</small>',"<small>{brand.count} {brand.count === 1 ? 'автомобил' : 'автомобила'}</small>")
p='src/lib/components/layout/Footer.svelte'
edit(p,"resolve('/listing-grid?condition=new')}>Нови автомобили","resolve('/listing-grid?sort=newest')}>Най-нови предложения")
p='src/lib/components/company/AboutTeam.svelte'
edit(p,"  import TeamSocialIcon from './TeamSocialIcon.svelte';\n",'')
edit(p,"  const socialIcons = ['facebook', 'twitter', 'linkedin', 'instagram'] as const;\n",'')
transform(p,lambda s:re.sub(r'            <div class="dn-about-team-card__socials".*?</div>\n','',s,flags=re.S))
transform(p,lambda s:re.sub(r'  \.dn-about-team-card__socials[^{}]*\{[^{}]*\}|  \.dn-about-team-card:hover \.dn-about-team-card__socials,\s*\.dn-about-team-card:focus-within \.dn-about-team-card__socials\s*\{[^{}]*\}','',s))
edit(p,'width: 38px;','width: 44px;');edit(p,'height: 38px;','height: 44px;')
p='src/routes/robots.txt/+server.ts'
edit(p,'import type',"import { template, canIndex } from '$config/template';\nimport type")
edit(p,"['User-agent: *', 'Allow: /', `Sitemap: ${url.origin}/sitemap.xml`, '']", "(canIndex() ? ['User-agent: *', 'Allow: /', `Sitemap: ${template.canonicalOrigin || url.origin}/sitemap.xml`, ''] : ['User-agent: *', 'Disallow: /', ''])")
p='src/routes/sitemap.xml/+server.ts'
edit(p,'import { featuredVehicles }',"import { template } from '$config/template';\nimport { featuredVehicles }")
edit(p,'new URL(pathname, url.origin)','new URL(pathname, template.canonicalOrigin || url.origin)')
# Retired assets stay inventoried for provenance but are not loaded by the application.
p='scripts/check-assets.mjs'
edit(p,'const guardedMediaCount = 98;',"const guardedMediaCount = 98;\nconst retainedSourceAssets = new Set(['/assets/images/lead/day-night-home-hero-v3.webp', '/assets/images/lead/day-night-home-black-v1.webp']);")
edit(p,'if (referencedAssets.size !== guardedMediaCount)', 'if (new Set([...referencedAssets, ...retainedSourceAssets]).size !== guardedMediaCount)')
edit(p,"!referencedAssets.has(publicPath))", "!referencedAssets.has(publicPath) && !retainedSourceAssets.has(publicPath))")
for name in ['enquiry-smoke','mobile-filter-smoke','desktop-discovery-smoke']:
 p=f'scripts/{name}.mjs'
 edit(p,"import { chromium } from 'playwright';", "import { launchBrowser, previewUrl } from './browser.mjs';")
 edit(p,"process.env.BASE_URL || 'http://127.0.0.1:5173'",'previewUrl()')
 transform(p,lambda s:re.sub(r'chromium.launch\([^\n]*\)', 'launchBrowser()',s))
 edit(p,'    results.push(' if name!='desktop-discovery-smoke' else '      results.push(', '    results.push(' if name!='desktop-discovery-smoke' else '      results.push(')
 # A failed assertion must be represented, even when the process exits nonzero.
 edit(p,'} finally {',"} catch (error) {\n  results.push({ passed: false, error: error.stack });\n  throw error;\n} finally {")
 if name=='enquiry-smoke': edit(p,'} finally { await browser.close(); }','} finally { await browser.close(); await writeFile(`${output}/report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), base, results }, null, 2)); }')
 # Durable progress after every completed viewport.
 edit(p,'    console.log(' if name!='desktop-discovery-smoke' else '      console.log(', '    await writeFile(`${output}/report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), base, results }, null, 2));\n    console.log(' if name!='desktop-discovery-smoke' else '      await writeFile(`${output}/report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), base, results }, null, 2));\n      console.log(')
