$ErrorActionPreference='Continue'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
Set-Location 'J:/cars/clients/elit-auto-import/auto-best'
npm.cmd run validate *> '../validate-auto-final.log'
if($LASTEXITCODE -ne 0){throw 'Auto final validation failed'}
npx.cmd --yes @sveltejs/mcp svelte-autofixer 'src/lib/components/ui/HeroVehicles.svelte' *> '../svelte-autofixer-auto.log'
npx.cmd --yes @sveltejs/mcp svelte-autofixer 'src/lib/components/company/ContactIntent.svelte' *>> '../svelte-autofixer-auto.log'
npx.cmd --yes @sveltejs/mcp svelte-autofixer 'src/lib/components/home/VideoSection.svelte' *>> '../svelte-autofixer-auto.log'
Set-Location 'J:/cars'
$preview=$null
try {
 $preview=(& 'J:/cars/scripts/start-preview.ps1' -Client elit-auto-import -Template auto-best -Port 6661 | ConvertFrom-Json)
 $preview | ConvertTo-Json | Set-Content 'clients/elit-auto-import/runtime-auto-final.json'
 node 'clients/elit-auto-import/qa-routes.mjs' auto *> 'clients/elit-auto-import/qa-auto-routes.log'
 if($LASTEXITCODE -ne 0){throw 'Auto route QA failed'}
 node 'clients/elit-auto-import/qa-auto-interactions.mjs' *> 'clients/elit-auto-import/qa-auto-interactions.log'
 if($LASTEXITCODE -ne 0){throw 'Auto interaction QA failed'}
} finally {
 if($preview){$p=Get-CimInstance Win32_Process -Filter "ProcessId=$($preview.PID)";if($p.CommandLine -match '6661'){Stop-Process -Id $preview.PID; 'Stopped Auto own process' | Add-Content 'clients/elit-auto-import/BUILD-STATUS.md'}}
}
