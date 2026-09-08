$ErrorActionPreference='Stop'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
Set-Location 'J:/cars/clients/legend-auto/auto-best'
npm.cmd ci *> '../install-auto.log'
if($LASTEXITCODE){throw 'Auto Best install failed'}
