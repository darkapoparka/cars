$ErrorActionPreference='Continue'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v24.20.0;'+$env:PATH
Set-Location 'J:/cars/clients/elit-auto-import/carwow'
npm.cmd ci *> '../install-carwow.log'
if($LASTEXITCODE -ne 0){throw 'Carwow install failed'}
