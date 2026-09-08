$ErrorActionPreference='Continue'
$env:PATH='C:\Users\radev\AppData\Local\nvm\v22.23.2;'+$env:PATH
$env:SKIP_ENV_VALIDATION='true';$env:AUTOMARKET_PUBLIC_DATA_MODE='demo';$env:NEXT_TELEMETRY_DISABLED='1'
foreach($row in @(@('autolife',6642),@('priselci',6647),@('ivo-auto',6652))){
$c=$row[0];$port=$row[1]
$env:NEXT_PUBLIC_WEB_URL="http://127.0.0.1:$port";$env:NEXT_PUBLIC_API_URL="http://127.0.0.1:$($port+2)";$env:NEXT_PUBLIC_APP_URL="http://127.0.0.1:$($port+3)"
Set-Location "J:/cars/clients/$c/modern"
pnpm.cmd --filter web typecheck *> ../qa-final/modern-typecheck.log
$check=$LASTEXITCODE
pnpm.cmd --filter web build *> ../qa-final/modern-build.log
@{typecheck=$check;build=$LASTEXITCODE}|ConvertTo-Json|Set-Content ../qa-final/modern-checks.json
Write-Output "$c modern validation completed"
}
Set-Location J:/cars/clients/autolife/auto-best
npm.cmd run validate *> ../qa-final/auto-validate.log
@{validate=$LASTEXITCODE}|ConvertTo-Json|Set-Content ../qa-final/auto-checks.json
foreach($f in 'MobileBudget.svelte','SearchBox.svelte'){ npx.cmd --yes @sveltejs/mcp svelte-autofixer "src/lib/components/home/$f" *> "../qa-final/autofixer-$f.log" }
$env:PATH='C:\nvm4w\nodejs;'+$env:PATH
foreach($c in 'autolife','priselci','ivo-auto'){
Set-Location "J:/cars/clients/$c/carwow"
foreach($f in 'detail/mobile/MobileDetailPage.svelte','chat/ChatLauncher.svelte','financing/DesktopFinancingPage.svelte','detail/desktop/DesktopDetailLocationMap.svelte','admin/dashboard/DesktopDashboardProfile.svelte'){ npx.cmd --yes @sveltejs/mcp svelte-autofixer "src/lib/components/$f" >> ../qa-final/carwow-autofixer.log 2>&1 }
npm.cmd run check *> ../qa-final/carwow-check.log
$check=$LASTEXITCODE
npm.cmd run build *> ../qa-final/carwow-build.log
@{check=$check;build=$LASTEXITCODE}|ConvertTo-Json|Set-Content ../qa-final/carwow-checks.json
}
Set-Location J:/cars
foreach($c in 'autolife','priselci','ivo-auto'){
$env:QA_OUTPUT="J:/cars/clients/$c/qa-final"
node clients/autolife/qa-final/run.mjs $c
}
exit 0




