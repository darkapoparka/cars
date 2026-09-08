$ErrorActionPreference='Continue'
$env:PATH='C:\Users\radev\AppData\Local\nvm\v22.23.2;'+$env:PATH
$env:SKIP_ENV_VALIDATION='true'
$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6647'
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6649'
$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6650'
Set-Location J:/cars/clients/priselci/modern
pnpm.cmd --filter @repo/database build *> ../evidence/modern-prisma.log
if ($LASTEXITCODE -ne 0) {exit $LASTEXITCODE}
pnpm.cmd --filter web typecheck *> ../evidence/modern-typecheck.log
if ($LASTEXITCODE -ne 0) {exit $LASTEXITCODE}
pnpm.cmd --filter web build *> ../evidence/modern-build.log
exit $LASTEXITCODE

