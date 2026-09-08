$ErrorActionPreference='Continue'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
$env:SKIP_ENV_VALIDATION='true'
$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6662'
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6664'
$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6665'
Set-Location 'J:/cars/clients/elit-auto-import/modern'
pnpm.cmd --filter web typecheck *> '../modern-typecheck.log'
if($LASTEXITCODE -ne 0){throw 'Modern typecheck failed'}
pnpm.cmd --filter web build *> '../modern-build.log'
if($LASTEXITCODE -ne 0){throw 'Modern build failed'}

