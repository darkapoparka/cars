$ErrorActionPreference='Continue'
Set-Location J:/cars
& C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe J:/cars/clients/excellent-cars/analyze-svelte.mjs *> J:/cars/clients/excellent-cars/qa/svelte-autofixer.log
if($LASTEXITCODE -ne 0){throw 'Svelte analysis failed'}
