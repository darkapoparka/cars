$ErrorActionPreference='Continue'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v24.20.0;'+$env:PATH
foreach($slug in @('elit-auto-import','legend-auto')) {
Set-Location "J:/cars/clients/$slug/carwow"
npm.cmd run check *> ../qa-final/carwow-final-label-check.log
if($LASTEXITCODE){throw "$slug label check failed"}
}
Set-Location J:/cars
& C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe audits/2026-09-08/verify/contact-astra-last.mjs *> clients/legend-auto/qa-final/contact-copy-final-retry.log
if($LASTEXITCODE){throw 'Targeted check failed'}
