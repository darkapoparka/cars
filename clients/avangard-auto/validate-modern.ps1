$ErrorActionPreference='Continue'
$env:PATH='C:\Users\radev\AppData\Local\nvm\v22.23.2;'+$env:PATH
$env:SKIP_ENV_VALIDATION='true'
$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6627'
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6629'
$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6630'
$env:NEXT_TELEMETRY_DISABLED='1'
$env:npm_config_script_shell='C:\Windows\System32\cmd.exe'
Set-Location J:\cars\clients\avangard-auto\modern
& 'C:\Users\radev\AppData\Local\nvm\v22.23.2\node.exe' 'C:\nvm4w\nodejs\node_modules\corepack\dist\pnpm.js' --filter @repo/database build *> ..\evidence\prisma-modern.log
if($LASTEXITCODE){throw 'Prisma failed'}
& 'C:\Users\radev\AppData\Local\nvm\v22.23.2\node.exe' 'C:\nvm4w\nodejs\node_modules\corepack\dist\pnpm.js' --filter web typecheck *> ..\evidence\typecheck-modern.log
if($LASTEXITCODE){throw 'Modern typecheck failed'}
& 'C:\Users\radev\AppData\Local\nvm\v22.23.2\node.exe' 'C:\nvm4w\nodejs\node_modules\corepack\dist\pnpm.js' --filter web build *> ..\evidence\build-modern.log
if($LASTEXITCODE){throw 'Modern build failed'}

