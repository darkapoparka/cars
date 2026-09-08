$ErrorActionPreference='Continue'
& J:\cars\clients\avangard-auto\validate-auto-best.ps1
if($LASTEXITCODE){throw 'Auto validation failed'}
Set-Location J:\cars
& 'C:\Users\radev\AppData\Local\nvm\v22.23.2\node.exe' clients/avangard-auto/svelte-audit.mjs auto-best *> clients/avangard-auto/evidence/autofixer-auto-best.log
& 'C:\Users\radev\AppData\Local\nvm\v22.23.2\node.exe' C:/Users/radev/.codex/skills/clean-product-ui/scripts/scan-ai-ui.mjs clients/avangard-auto/auto-best/src --json *> clients/avangard-auto/evidence/ui-scan-auto-best.json
& J:\cars\clients\avangard-auto\qa-run.ps1 -Variant auto-best
