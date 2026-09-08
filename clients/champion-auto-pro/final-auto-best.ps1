$ErrorActionPreference='Continue'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
$clientRoot='J:/cars/clients/champion-auto-pro'
& "$clientRoot/validate-auto-best.ps1"
if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
node "$clientRoot/autofix.mjs" auto-best *> "$clientRoot/qa/autofix-auto-best.log"
& "$clientRoot/run-qa.ps1" -Variant auto-best -Port 6631
