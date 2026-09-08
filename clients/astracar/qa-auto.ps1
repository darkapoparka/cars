$ErrorActionPreference='Stop'
Set-Location J:/cars/clients/astracar
node svelte-review.mjs auto-best
if($LASTEXITCODE -ne 0){throw 'Svelte analysis failed'}
& ./preview-qa.ps1 -Variant auto-best
