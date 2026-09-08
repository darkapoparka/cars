$ErrorActionPreference='Stop'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
Set-Location J:/cars/clients/astracar/auto-best
cmd /c "npm.cmd run validate > ../evidence/auto-validate.log 2>&1"
if($LASTEXITCODE -ne 0){throw 'auto validate failed'}

node ../svelte-review.mjs auto-best
if($LASTEXITCODE -ne 0){throw 'Svelte analysis failed'}
& J:/cars/clients/astracar/preview-qa.ps1 -Variant auto-best
