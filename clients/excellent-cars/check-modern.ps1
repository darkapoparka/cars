$ErrorActionPreference='Continue'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
$env:SKIP_ENV_VALIDATION='true'
$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6622'
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6624'
$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6625'
Set-Location 'J:/cars/clients/excellent-cars/modern'
& pnpm.cmd --filter @repo/database build *> 'J:/cars/clients/excellent-cars/prisma-modern.log'
if($LASTEXITCODE -ne 0){throw "Prisma failed: $LASTEXITCODE"}
& pnpm.cmd --filter web typecheck *> 'J:/cars/clients/excellent-cars/typecheck-modern.log'
if($LASTEXITCODE -ne 0){throw "Typecheck failed: $LASTEXITCODE"}
& pnpm.cmd --filter web build *> 'J:/cars/clients/excellent-cars/build-modern.log'
if($LASTEXITCODE -ne 0){throw "Build failed: $LASTEXITCODE"}

