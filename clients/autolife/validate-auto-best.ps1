$ErrorActionPreference='Continue'
$env:PATH='C:\Users\radev\AppData\Local\nvm\v22.23.2;'+$env:PATH
Set-Location J:/cars/clients/autolife/auto-best
npm.cmd run validate *> ../evidence/validate-auto.log
$autolifeCode=$LASTEXITCODE
if($autolifeCode -ne 0){exit $autolifeCode}
npx.cmd --yes @sveltejs/mcp svelte-autofixer 'src/routes/listing-detail-v1/[id]/+page.svelte' *> ../evidence/svelte-autofixer-auto.log
exit $LASTEXITCODE
