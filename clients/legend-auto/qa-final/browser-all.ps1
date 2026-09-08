$ErrorActionPreference='Continue'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
Set-Location J:/cars
foreach($slug in @('legend-auto','elit-auto-import','automarket-varna')) {
$env:QA_OUTPUT="J:/cars/clients/$slug/qa-final"
node audits/2026-09-08/verify/run-astra-last.mjs $slug *> "J:/cars/clients/$slug/qa-final/browser.log"
if($LASTEXITCODE){throw "Browser runner failed $slug"}
}
