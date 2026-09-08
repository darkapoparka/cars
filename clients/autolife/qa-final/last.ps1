$ErrorActionPreference='Continue'
$env:PATH='C:\nvm4w\nodejs;'+$env:PATH
foreach($c in 'autolife','priselci','ivo-auto'){
Set-Location "J:/cars/clients/$c/carwow"
npx.cmd --yes @sveltejs/mcp svelte-autofixer src/lib/components/home/mobile/MobileHome.svelte *> ../qa-final/mobile-home-autofixer.log
npm.cmd run check *> ../qa-final/carwow-check.log
$check=$LASTEXITCODE
npm.cmd run build *> ../qa-final/carwow-build.log
@{check=$check;build=$LASTEXITCODE}|ConvertTo-Json|Set-Content ../qa-final/carwow-checks.json
Set-Location J:/cars
node clients/autolife/qa-final/focused.mjs $c
}
exit 0
