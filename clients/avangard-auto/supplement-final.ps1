$ErrorActionPreference='Stop'
$env:QA_OUTPUT='J:/cars/clients/avangard-auto/qa-final/modern-stable'
$env:QA_TEMPLATE='modern'
& 'C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe' J:/cars/clients/avangard-auto/verify-final.mjs avangard-auto
Remove-Item Env:QA_TEMPLATE
& 'C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe' J:/cars/clients/avangard-auto/supplement-final.mjs
$env:PATH='C:/Users/radev/AppData/Local/nvm/v24.20.0;'+$env:PATH
Set-Location J:/cars/clients/avangard-auto/carwow
cmd /c "npm.cmd run check > ../qa-final/check-carwow.log 2>&1"
if($LASTEXITCODE){throw 'Carwow final check failed'}
cmd /c "npm.cmd run build > ../qa-final/build-carwow-final.log 2>&1"
if($LASTEXITCODE){throw 'Carwow final build failed'}

$env:QA_OUTPUT='J:/cars/clients/champion-auto-pro/qa-final/carwow-final'
$env:QA_TEMPLATE='carwow'
& 'C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe' J:/cars/clients/avangard-auto/verify-final.mjs champion-auto-pro
Remove-Item Env:QA_TEMPLATE
