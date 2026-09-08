$ErrorActionPreference='Continue'
$env:PATH='C:\Users\radev\AppData\Local\nvm\v22.23.2;'+$env:PATH
Set-Location J:/cars/clients/ivo-auto/auto-best
& npm.cmd run validate *> ../evidence/auto-validate.log
if($LASTEXITCODE -ne 0){throw 'Auto validation failed'}
