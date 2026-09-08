$ErrorActionPreference='Stop'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
$env:SKIP_ENV_VALIDATION='true'; $env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6667'; $env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6669'; $env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6670'
Set-Location J:/cars/clients/legend-auto/modern
pnpm.cmd --filter web typecheck *> ../qa-final/modern-typecheck.log
if($LASTEXITCODE){throw 'typecheck failed'}
pnpm.cmd --filter web build *> ../qa-final/modern-build.log
if($LASTEXITCODE){throw 'build failed'}
