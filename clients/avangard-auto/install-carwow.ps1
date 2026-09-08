$ErrorActionPreference='Continue'
$env:PATH='C:\Users\radev\AppData\Local\nvm\v24.20.0;'+$env:PATH
Set-Location J:\cars\clients\avangard-auto\carwow
npm.cmd ci *> ..\evidence\install-carwow.log
if($LASTEXITCODE){throw 'Carwow install failed'}

