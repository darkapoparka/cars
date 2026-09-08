$ErrorActionPreference='Stop'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
$env:SKIP_ENV_VALIDATION='true'
$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6637'
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6639'
$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6640'
Set-Location J:/cars/clients/astracar/modern
cmd /c "pnpm.cmd --filter @repo/database build > ../evidence/modern-prisma.log 2>&1"
if($LASTEXITCODE -ne 0){throw 'Prisma generate failed'}
cmd /c "pnpm.cmd --filter web typecheck > ../evidence/modern-typecheck.log 2>&1"
if($LASTEXITCODE -ne 0){throw 'Web typecheck failed'}
cmd /c "pnpm.cmd --filter web build > ../evidence/modern-build.log 2>&1"
if($LASTEXITCODE -ne 0){throw 'Web build failed'}

& J:/cars/clients/astracar/qa-modern.ps1
