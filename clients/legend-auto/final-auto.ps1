node 'J:/cars/clients/legend-auto/svelte-audit.mjs' auto-best *> 'J:/cars/clients/legend-auto/svelte-audit-auto.log'
& 'J:/cars/clients/legend-auto/validate-auto.ps1'
if($LASTEXITCODE){throw 'Validation failed'}
& 'J:/cars/clients/legend-auto/qa-auto.ps1'
