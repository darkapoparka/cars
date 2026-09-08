param([Parameter(Mandatory=$true)][string]$Variant,[Parameter(Mandatory=$true)][int]$Port)
$ErrorActionPreference='Stop'
$base='J:/cars/clients/champion-auto-pro'
$node=if($Variant -eq 'carwow'){'C:/Users/radev/AppData/Local/nvm/v24.20.0/node.exe'}else{'C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe'}
$env:SKIP_ENV_VALIDATION='true'; $env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6632'; $env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6634'; $env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6635'
$server=$null
try {
 $server=(& J:/cars/scripts/start-preview.ps1 -Client champion-auto-pro -Template $Variant -Port $Port -NodePath $node | ConvertFrom-Json)
 $server | ConvertTo-Json | Set-Content "$base/qa/runtime-$Variant.json"
 $ready=$false
 for($i=0;$i -lt 60;$i++){if(Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue){$ready=$true;break};Start-Sleep -Seconds 1}
 if(-not $ready){throw 'Preview did not open its assigned port'}
 $ErrorActionPreference='Continue'
 & $node "$base/qa-routes.mjs" $Variant *> "$base/qa/browser-$Variant.log"
 if($LASTEXITCODE -ne 0){throw "Route QA failed: $LASTEXITCODE"}
 & $node "$base/qa-interactions.mjs" $Variant *> "$base/qa/interactions-$Variant.log"
 if($LASTEXITCODE -ne 0){throw "Interaction QA failed: $LASTEXITCODE"}
} finally {
 if($server){
  $processes=Get-CimInstance Win32_Process
  $owned=$processes | Where-Object ProcessId -eq $server.PID
  if($owned -and $owned.CommandLine -like "*--port*$Port*"){
   $ids=@($owned.ProcessId);$level=$ids
   while($level.Count){$next=@($processes | Where-Object {$_.ParentProcessId -in $level} | Select-Object -ExpandProperty ProcessId);$ids+=$next;$level=$next}
   [array]::Reverse($ids);foreach($id in $ids){Stop-Process -Id $id -ErrorAction SilentlyContinue}
  }
  Add-Content "$base/qa/runtime-$Variant-state.txt" 'Preview stopped in finally after QA.'
 }
}
