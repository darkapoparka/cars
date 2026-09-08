$ErrorActionPreference="Continue"
$env:PATH="C:/Users/radev/AppData/Local/nvm/v22.23.2;"+$env:PATH
Set-Location 'J:/cars/clients/champion-auto-pro/modern'
$env:SKIP_ENV_VALIDATION="true"
$env:AUTOMARKET_PUBLIC_DATA_MODE="demo"
$env:NEXT_PUBLIC_WEB_URL="http://127.0.0.1:6632"
$env:NEXT_PUBLIC_API_URL="http://127.0.0.1:6634"
$env:NEXT_PUBLIC_APP_URL="http://127.0.0.1:6635"
pnpm.cmd --filter '@repo/database' build *> 'J:/cars/clients/champion-auto-pro/qa/prisma-modern.log'
if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
pnpm.cmd --filter web typecheck *> 'J:/cars/clients/champion-auto-pro/qa/typecheck-modern.log'
if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
pnpm.cmd --filter web build *> 'J:/cars/clients/champion-auto-pro/qa/build-modern.log'
exit $LASTEXITCODE
