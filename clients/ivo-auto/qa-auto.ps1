& J:/cars/clients/ivo-auto/validate-auto.ps1
if($LASTEXITCODE -ne 0){throw 'Validation failed'}
& J:/cars/clients/ivo-auto/qa-preview.ps1 -Variant auto-best -PreviewPort 6651
& node.exe J:/cars/clients/ivo-auto/svelte-review.mjs
if($LASTEXITCODE -ne 0){throw 'Svelte review failed'}
& node.exe C:/Users/radev/.codex/skills/clean-product-ui/scripts/scan-ai-ui.mjs J:/cars/clients/ivo-auto/auto-best/src J:/cars/clients/ivo-auto/carwow/src J:/cars/clients/ivo-auto/modern/apps/web/app --json > J:/cars/clients/ivo-auto/evidence/ui-scan.json
