$ErrorActionPreference='Continue'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v24.20.0;'+$env:PATH
foreach($slug in @('automarket-varna','elit-auto-import','legend-auto')) {
Set-Location "J:/cars/clients/$slug/carwow"
npm.cmd run check *> ../qa-final/carwow-contact-copy-check.log
if($LASTEXITCODE){throw "Final copy check failed $slug"}
foreach($rel in @('detail/mobile/MobileDetailPage.svelte','inventory/mobile/MobileInventoryTop.svelte','detail/desktop/DesktopDetailDealerPanel.svelte')){
$stem=$rel.Replace('/','-')
npx.cmd --yes @sveltejs/mcp svelte-autofixer "J:/cars/clients/$slug/carwow/src/lib/components/$rel" *> "J:/cars/clients/$slug/qa-final/contact-copy-$stem.log"
}
}
Set-Location J:/cars
node audits/2026-09-08/verify/contact-astra-last.mjs *> clients/legend-auto/qa-final/contact-copy-browser.log
if($LASTEXITCODE){throw 'Final contact copy browser failed'}
