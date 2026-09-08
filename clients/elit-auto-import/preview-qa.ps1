param([ValidateSet('modern','carwow')][string]$Variant)
$ErrorActionPreference='Continue'
$env:SKIP_ENV_VALIDATION='true'
$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6662'
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6664'
$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6665'
$port=if($Variant -eq 'modern'){6662}else{6663}
$node=if($Variant -eq 'modern'){'C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe'}else{'C:/Users/radev/AppData/Local/nvm/v24.20.0/node.exe'}
Set-Location 'J:/cars'
$preview=$null
try {
 $preview=(& 'J:/cars/scripts/start-preview.ps1' -Client elit-auto-import -Template $Variant -Port $port -NodePath $node | ConvertFrom-Json)
 if(-not $preview.PID){throw 'Preview launcher failed'}
 $preview | ConvertTo-Json | Set-Content "clients/elit-auto-import/runtime-$Variant.json"
 & $node 'clients/elit-auto-import/qa-routes.mjs' $Variant *> "clients/elit-auto-import/qa-$Variant-routes.log"
 if($LASTEXITCODE -ne 0){throw 'Route QA runner failed'}
 if(Test-Path "clients/elit-auto-import/qa-$Variant-interactions.mjs"){
  & $node "clients/elit-auto-import/qa-$Variant-interactions.mjs" *> "clients/elit-auto-import/qa-$Variant-interactions.log"
  if($LASTEXITCODE -ne 0){throw 'Interaction QA runner failed'}
 }
} finally {
 if($preview){
  $all=@(Get-CimInstance Win32_Process);$owned=@([int]$preview.PID);$changed=$true
  while($changed){$changed=$false;foreach($process in $all){if($owned -contains [int]$process.ParentProcessId -and $owned -notcontains [int]$process.ProcessId){$owned+=[int]$process.ProcessId;$changed=$true}}}
  $proof=$all|Where-Object {$owned -contains [int]$_.ProcessId}
  $proof|Select-Object ProcessId,ParentProcessId,ExecutablePath,CommandLine|ConvertTo-Json|Set-Content "clients/elit-auto-import/stopped-$Variant-processes.json"
  [array]::Reverse($owned);foreach($ownedPid in $owned){Stop-Process -Id $ownedPid -ErrorAction SilentlyContinue}
  "$Variant preview stopped in finally after QA." | Add-Content 'clients/elit-auto-import/BUILD-STATUS.md'
 }
}
