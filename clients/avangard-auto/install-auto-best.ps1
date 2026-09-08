$ErrorActionPreference='Stop'
$env:PATH='C:\Users\radev\AppData\Local\nvm\v22.23.2;'+$env:PATH
Set-Location J:\cars\clients\avangard-auto\auto-best
npm.cmd ci *> ..\evidence\install-auto-best.log
if($LASTEXITCODE){throw 'Auto install failed'}
