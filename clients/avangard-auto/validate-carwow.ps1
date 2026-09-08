$ErrorActionPreference='Continue'
$env:PATH='C:\Users\radev\AppData\Local\nvm\v24.20.0;'+$env:PATH
$env:npm_config_script_shell='C:\Windows\System32\cmd.exe'
Set-Location J:\cars\clients\avangard-auto\carwow
npm.cmd run check *> ..\evidence\check-carwow.log
if($LASTEXITCODE){throw 'Carwow check failed'}
npm.cmd run build *> ..\evidence\build-carwow.log
if($LASTEXITCODE){throw 'Carwow build failed'}

