$ErrorActionPreference='Continue'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
$env:SKIP_ENV_VALIDATION='true'
$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6672'
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6674'
$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6675'
Set-Location 'J:/cars/clients/legend-auto/modern'
pnpm.cmd --filter '@repo/database' build *> '../prisma-modern.log'
if($LASTEXITCODE){throw 'Prisma generation failed'}
pnpm.cmd --filter web typecheck *> '../typecheck-modern.log'
if($LASTEXITCODE){throw 'Modern typecheck failed'}
pnpm.cmd --filter web build *> '../build-modern.log'
if($LASTEXITCODE){throw 'Modern build failed'}
