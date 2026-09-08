param([string]$Client,[string]$Template,[int]$Port,[int]$StopPid=0)
$ErrorActionPreference='Stop'
if($StopPid){
 $rows=Get-CimInstance Win32_Process
 $owner=$rows|Where-Object ProcessId -eq $StopPid
 if($owner -and $owner.CommandLine -match "--port $Port(?:\s|$)"){
  $ids=[Collections.Generic.HashSet[int]]::new();[void]$ids.Add($StopPid)
  do{$more=$false;foreach($row in $rows){if($ids.Contains([int]$row.ParentProcessId)-and $ids.Add([int]$row.ProcessId)){$more=$true}}}while($more)
  foreach($id in ($ids|Sort-Object -Descending)){Stop-Process -Id $id -ErrorAction SilentlyContinue}
 }
 exit
}
$env:SKIP_ENV_VALIDATION='true';$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL="http://127.0.0.1:$Port"
$env:NEXT_PUBLIC_API_URL="http://127.0.0.1:$($Port+2)"
$env:NEXT_PUBLIC_APP_URL="http://127.0.0.1:$($Port+3)"
$env:NEXT_TELEMETRY_DISABLED='1';$env:UV_THREADPOOL_SIZE='2';$env:RAYON_NUM_THREADS='2'
& J:/cars/scripts/start-preview.ps1 -Client $Client -Template $Template -Port $Port
