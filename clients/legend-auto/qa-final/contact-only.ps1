$ErrorActionPreference='Continue'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v24.20.0;'+$env:PATH
foreach($slug in @('elit-auto-import','legend-auto')) {
Set-Location "J:/cars/clients/$slug/carwow"
npm.cmd run check *> ../qa-final/carwow-numeric-check.log
if($LASTEXITCODE){throw "$slug numeric check failed; build skipped"}
npm.cmd run build *> ../qa-final/carwow-numeric-build.log
if($LASTEXITCODE){throw "$slug numeric build failed"}
}
Set-Location J:/cars
& C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe clients/legend-auto/qa-final/numbers-proof.mjs *> clients/legend-auto/qa-final/numbers-proof.log
if($LASTEXITCODE){throw 'Numeric source proof failed'}
& C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe audits/2026-09-08/verify/contact-astra-last.mjs *> clients/legend-auto/qa-final/contact-copy-browser-retry.log
if($LASTEXITCODE){throw 'Contact-only check failed'}
