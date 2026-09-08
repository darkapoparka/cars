$ErrorActionPreference="Continue"
$env:PATH="C:/Users/radev/AppData/Local/nvm/v22.23.2;"+$env:PATH
Set-Location 'J:/cars/clients/automarket-varna/modern'
$env:SKIP_ENV_VALIDATION="true"
$env:AUTOMARKET_PUBLIC_DATA_MODE="demo"
$env:NEXT_PUBLIC_WEB_URL="http://127.0.0.1:6657"
$env:NEXT_PUBLIC_API_URL="http://127.0.0.1:6659"
$env:NEXT_PUBLIC_APP_URL="http://127.0.0.1:6660"
& C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe C:/nvm4w/nodejs/node_modules/corepack/dist/pnpm.js --filter web typecheck *> 'J:/cars/clients/automarket-varna/evidence/modern-typecheck.log'
if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
& C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe C:/nvm4w/nodejs/node_modules/corepack/dist/pnpm.js --filter web build *> 'J:/cars/clients/automarket-varna/evidence/modern-build.log'
exit $LASTEXITCODE

