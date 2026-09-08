$ErrorActionPreference='Continue'
& J:\cars\clients\avangard-auto\validate-carwow.ps1
if($LASTEXITCODE){throw 'Carwow validation failed'}
Set-Location J:\cars
& 'C:\Users\radev\AppData\Local\nvm\v24.20.0\node.exe' clients/avangard-auto/svelte-audit.mjs carwow *> clients/avangard-auto/evidence/autofixer-carwow.log
& 'C:\Users\radev\AppData\Local\nvm\v24.20.0\node.exe' C:/Users/radev/.codex/skills/clean-product-ui/scripts/scan-ai-ui.mjs clients/avangard-auto/carwow/src --json *> clients/avangard-auto/evidence/ui-scan-carwow.json
& J:\cars\clients\avangard-auto\qa-run.ps1 -Variant carwow
