param([string]$Variant='auto-best')
$ErrorActionPreference='Continue'
$autolifeRoot='J:/cars/clients/autolife'
$autolifePorts=@{'auto-best'=6641;'modern'=6642;'carwow'=6643}
$autolifePort=$autolifePorts[$Variant]
$autolifeNode=if($Variant -eq 'carwow'){'C:/nvm4w/nodejs/node.exe'}else{'C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe'}
$env:SKIP_ENV_VALIDATION='true';$env:AUTOMARKET_PUBLIC_DATA_MODE='demo';$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6642';$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6644';$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6645'
$autolifeServer=$null
$autolifeExit=1
try {
 Set-Location J:/cars
 $autolifeServer=(& J:/cars/scripts/start-preview.ps1 -Client autolife -Template $Variant -Port $autolifePort -NodePath $autolifeNode | ConvertFrom-Json)
 if(-not $autolifeServer.PID){throw 'Preview did not return owned PID'}
 $autolifeServer | ConvertTo-Json | Set-Content "$autolifeRoot/evidence/$Variant-runtime.json"
 Start-Sleep -Seconds 3
 & $autolifeNode "$autolifeRoot/qa-routes.mjs" $Variant *> "$autolifeRoot/evidence/$Variant-browser.log"
 $autolifeExit=$LASTEXITCODE
 if($autolifeExit -eq 0){
  if($Variant -eq 'auto-best'){& $autolifeNode "$autolifeRoot/qa-auto-final.mjs" *> "$autolifeRoot/evidence/auto-interactions.log"}else{& $autolifeNode "$autolifeRoot/qa-interactions.mjs" $Variant *> "$autolifeRoot/evidence/$Variant-interactions.log"}
  $autolifeExit=$LASTEXITCODE
 }
} finally {
 if($autolifeServer.PID){
  $autolifeProcesses=Get-CimInstance Win32_Process
  $autolifeOwned=@([int]$autolifeServer.PID)
  do { $autolifeNew=@($autolifeProcesses | Where-Object { $_.ParentProcessId -in $autolifeOwned -and $_.ProcessId -notin $autolifeOwned } | Select-Object -ExpandProperty ProcessId); $autolifeOwned+=$autolifeNew } while($autolifeNew.Count)
  foreach($autolifeOwnedId in ($autolifeOwned | Sort-Object -Descending)){Stop-Process -Id $autolifeOwnedId -ErrorAction SilentlyContinue}
  @{variant=$Variant;serverPID=$autolifeServer.PID;ownedTree=$autolifeOwned;status='stopped';exitCode=$autolifeExit;at=(Get-Date -Format o)} | ConvertTo-Json | Set-Content "$autolifeRoot/evidence/$Variant-teardown.json"
 }
}
exit $autolifeExit
