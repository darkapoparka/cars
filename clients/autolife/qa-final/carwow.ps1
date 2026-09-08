$ErrorActionPreference='Continue'
$env:PATH='C:\nvm4w\nodejs;'+$env:PATH
Set-Location J:/cars/clients/autolife/carwow
npm.cmd run check *> ../qa-final/carwow-check.log
$check=$LASTEXITCODE
npm.cmd run build *> ../qa-final/carwow-build.log
@{check=$check;build=$LASTEXITCODE}|ConvertTo-Json|Set-Content ../qa-final/carwow-checks.json
exit 0
