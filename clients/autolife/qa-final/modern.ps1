$ErrorActionPreference='Continue'
$env:PATH='C:\Users\radev\AppData\Local\nvm\v22.23.2;'+$env:PATH
$env:SKIP_ENV_VALIDATION='true';$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6642';$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6644';$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6645'
Set-Location J:/cars/clients/autolife/modern
pnpm.cmd --filter web typecheck *> ../qa-final/modern-typecheck.log
$check=$LASTEXITCODE
pnpm.cmd --filter web build *> ../qa-final/modern-build.log
@{typecheck=$check;build=$LASTEXITCODE}|ConvertTo-Json|Set-Content ../qa-final/modern-checks.json
exit 0
