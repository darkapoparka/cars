param([string]$Variant,[int]$PreviewPort)
$ErrorActionPreference='Continue'
$env:SKIP_ENV_VALIDATION='true'
$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6652'
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6654'
$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6655'
$ivoStarted=$null
try {
  $ivoStarted=(& J:/cars/scripts/start-preview.ps1 -Client ivo-auto -Template $Variant -Port $PreviewPort | ConvertFrom-Json)
  if(-not $ivoStarted.PID){throw 'No owned server returned'}
  $ivoStarted | ConvertTo-Json | Set-Content "J:/cars/clients/ivo-auto/evidence/$Variant-runtime.json"
  $ivoReady=$false
  for($ivoAttempt=0;$ivoAttempt -lt 30;$ivoAttempt++){try { $ivoResponse=Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$PreviewPort" -TimeoutSec 3; $ivoReady=$true; break } catch { Start-Sleep -Milliseconds 500 }}
  if(-not $ivoReady){throw "Owned preview did not become ready"}
  Set-Location J:/cars
  & node.exe clients/ivo-auto/qa-routes.mjs $Variant
  if($LASTEXITCODE -ne 0){throw 'Route QA failed'}
  if($Variant -eq 'auto-best') { & node.exe clients/ivo-auto/qa-auto-interactions.mjs } else { & node.exe clients/ivo-auto/qa-other-interactions.mjs $Variant }; if($LASTEXITCODE -ne 0){throw 'Interaction QA failed'}
} finally {
  if($ivoStarted.PID){
    $ivoAll=@(Get-CimInstance Win32_Process)
    $ivoIds=[System.Collections.Generic.List[int]]::new();$ivoIds.Add([int]$ivoStarted.PID)
    for($ivoIndex=0;$ivoIndex -lt $ivoIds.Count;$ivoIndex++){foreach($ivoChild in $ivoAll | Where-Object ParentProcessId -eq $ivoIds[$ivoIndex]){$ivoIds.Add([int]$ivoChild.ProcessId)}}
    for($ivoIndex=$ivoIds.Count-1;$ivoIndex -ge 0;$ivoIndex--){Stop-Process -Id $ivoIds[$ivoIndex] -ErrorAction SilentlyContinue}
    "Stopped owned runtime tree $($ivoIds -join ',') after QA" | Set-Content "J:/cars/clients/ivo-auto/evidence/$Variant-runtime-stopped.txt"
  }
}
