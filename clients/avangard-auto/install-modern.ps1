$ErrorActionPreference='Stop'
$env:PATH='C:\Users\radev\AppData\Local\nvm\v22.23.2;'+$env:PATH
$env:CI='true'
Set-Location J:\cars\clients\avangard-auto\modern
& 'C:\Users\radev\AppData\Local\nvm\v22.23.2\node.exe' 'C:\nvm4w\nodejs\node_modules\corepack\dist\pnpm.js' install --frozen-lockfile *> ..\evidence\install-modern.log
if($LASTEXITCODE){throw 'Modern install failed'}
