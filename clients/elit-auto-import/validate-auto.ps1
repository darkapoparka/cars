$ErrorActionPreference='Continue'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
Set-Location 'J:/cars/clients/elit-auto-import/auto-best'
npm.cmd run validate *> '../validate-auto.log'
if($LASTEXITCODE -ne 0){throw 'Auto validation failed'}
