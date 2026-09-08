param([string]$Variant,[int]$Port,[switch]$InteractionsOnly)
$ErrorActionPreference='Continue'
$env:SKIP_ENV_VALIDATION='true'
$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6647'
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6649'
$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6650'
Set-Location J:/cars
$preview=$null
try {
 $preview=(& J:/cars/scripts/start-preview.ps1 -Client priselci -Template $Variant -Port $Port | ConvertFrom-Json)
 if(-not $preview.PID){throw 'No owned preview manifest returned'}
 $preview | ConvertTo-Json | Set-Content "clients/priselci/evidence/$Variant-runtime.json"
 $ready=$false
 for($i=0;$i -lt 40;$i++){if(Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue){$ready=$true;break}; Start-Sleep -Milliseconds 500}
 if(-not $ready){throw 'Preview listener did not appear'}
 & C:/Users/radev/AppData/Local/npm-cache/_npx/170db8242178d1e5/node_modules/.bin/agent-browser.cmd --session priselci open "http://127.0.0.1:$Port/"
 & C:/Users/radev/AppData/Local/npm-cache/_npx/170db8242178d1e5/node_modules/.bin/agent-browser.cmd --session priselci snapshot -i *> "clients/priselci/evidence/$Variant-agent-snapshot.txt"
 & C:/Users/radev/AppData/Local/npm-cache/_npx/170db8242178d1e5/node_modules/.bin/agent-browser.cmd --session priselci close
 if(-not $InteractionsOnly){
  node clients/priselci/qa-routes.mjs $Variant
  if($LASTEXITCODE -ne 0){throw 'Route QA failed'}
 }
 node clients/priselci/qa-interactions.mjs $Variant
 if($LASTEXITCODE -ne 0){throw 'Interaction QA failed'}
} finally {
 & C:/Users/radev/AppData/Local/npm-cache/_npx/170db8242178d1e5/node_modules/.bin/agent-browser.cmd --session priselci close
 if($preview.PID -and $preview.Project -eq "J:\cars\clients\priselci\$Variant"){
  $process=Get-CimInstance Win32_Process -Filter "ProcessId=$($preview.PID)"
  if($process.CommandLine -match "(vite|next).*($Port)"){Stop-Process -Id $preview.PID; Add-Content "clients/priselci/evidence/$Variant-runtime-state.txt" "Stopped verified owned PID $($preview.PID) on $Port after QA."}
  $listener=Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue
  foreach($item in $listener){$child=Get-CimInstance Win32_Process -Filter "ProcessId=$($item.OwningProcess)";if($child.ParentProcessId -eq $preview.PID){Stop-Process -Id $child.ProcessId; Add-Content "clients/priselci/evidence/$Variant-runtime-state.txt" "Stopped verified child listener $($child.ProcessId)."}}
 }
}
