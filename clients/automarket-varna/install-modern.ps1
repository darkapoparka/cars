$ErrorActionPreference="Stop"
$env:PATH="C:/Users/radev/AppData/Local/nvm/v22.23.2;"+$env:PATH
Set-Location 'J:/cars/clients/automarket-varna/modern'
& C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe C:/nvm4w/nodejs/node_modules/corepack/dist/pnpm.js install --frozen-lockfile *> 'J:/cars/clients/automarket-varna/evidence/install-modern.log'
if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}

