param([Parameter(Mandatory=$true)][string]$Variant,[Parameter(Mandatory=$true)][int]$Port)
$ErrorActionPreference='Continue'
$env:UV_THREADPOOL_SIZE='2'
$env:RAYON_NUM_THREADS='2'
$env:NEXT_TELEMETRY_DISABLED='1'
$env:SKIP_ENV_VALIDATION='true'
$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6622'
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6624'
$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6625'
$clientQaRoot='J:/cars/clients/excellent-cars'
$clientRuntime=$null
try {
  Set-Location J:/cars
  $clientRuntime = & J:/cars/scripts/start-preview.ps1 -Client excellent-cars -Template $Variant -Port $Port | ConvertFrom-Json
  if(-not $clientRuntime.PID){throw 'Preview did not start'}
  $clientRuntime | ConvertTo-Json | Set-Content "$clientQaRoot/qa/runtime-$Variant.json"
  $clientReady=$false
  for($attempt=0;$attempt -lt 45;$attempt++) { if(Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue){$clientReady=$true;break}; Start-Sleep -Seconds 2 }
  if(-not $clientReady){throw 'Preview readiness timeout'}
  & C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe "$clientQaRoot/qa-routes.mjs" $Variant *> "$clientQaRoot/qa/routes-$Variant.log"
  if($LASTEXITCODE -ne 0){throw "QA process failed: $LASTEXITCODE"}
  if($Variant -eq 'auto-best') { & C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe "$clientQaRoot/qa-auto-interactions.mjs" *> "$clientQaRoot/qa/interactions-$Variant.log" }
  else { & C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe "$clientQaRoot/qa-other-interactions.mjs" $Variant *> "$clientQaRoot/qa/interactions-$Variant.log" }
} finally {
  if($clientRuntime.PID){
    $clientRows=Get-CimInstance Win32_Process
    $clientParent=$clientRows | Where-Object ProcessId -eq $clientRuntime.PID
    if($clientParent -and $clientParent.CommandLine -match "--port $Port") {
      $clientStop=[Collections.Generic.HashSet[int]]::new(); [void]$clientStop.Add([int]$clientRuntime.PID)
      do{$more=$false;foreach($row in $clientRows){if($clientStop.Contains([int]$row.ParentProcessId) -and $clientStop.Add([int]$row.ProcessId)){$more=$true}}}while($more)
      $clientStop | Sort-Object -Descending | ForEach-Object {Stop-Process -Id $_ -ErrorAction SilentlyContinue}
    }
    $clientRuntime.Status='stopped-after-qa';$clientRuntime | ConvertTo-Json | Set-Content "$clientQaRoot/qa/runtime-$Variant.json"
  }
}
