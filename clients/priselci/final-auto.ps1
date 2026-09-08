$ErrorActionPreference='Continue'
$env:PATH='C:\Users\radev\AppData\Local\nvm\v22.23.2;'+$env:PATH
Set-Location J:/cars/clients/priselci/auto-best
npm.cmd run validate *> ../evidence/auto-validate.log
$validationExit=$LASTEXITCODE
Set-Location J:/cars
node clients/priselci/autofixer.mjs auto-best *> clients/priselci/evidence/auto-autofixer-summary.log
& J:/cars/clients/priselci/qa-variant.ps1 -Variant auto-best -Port 6646
exit $validationExit
