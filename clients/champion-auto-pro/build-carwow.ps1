$ErrorActionPreference='Continue'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v24.20.0;'+$env:PATH
Set-Location J:/cars/clients/champion-auto-pro/carwow
npm.cmd run build *> J:/cars/clients/champion-auto-pro/qa/build-carwow.log
$buildCode=$LASTEXITCODE
Set-Content J:/cars/clients/champion-auto-pro/qa/build-carwow-exit.txt $buildCode
exit $buildCode
