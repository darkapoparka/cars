param([string]$Variant='carwow')
$ErrorActionPreference='Stop'
$avRoot='J:\cars\clients\avangard-auto'
$avPort=@{'auto-best'=6626;'modern'=6627;'carwow'=6628}[$Variant]
$avNode=if($Variant -eq 'carwow'){'C:\Users\radev\AppData\Local\nvm\v24.20.0\node.exe'}else{'C:\Users\radev\AppData\Local\nvm\v22.23.2\node.exe'}
$env:SKIP_ENV_VALIDATION='true'
$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6627'
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6629'
$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6630'
$env:NEXT_TELEMETRY_DISABLED='1'
$avRuntime=$null
try {
 Set-Location J:\cars
 $avOutput=& ./scripts/start-preview.ps1 -Client avangard-auto -Template $Variant -Port $avPort -NodePath $avNode
 $avOutput | Set-Content "$avRoot\evidence\runtime-$Variant.json"
 $avRuntime=$avOutput | ConvertFrom-Json
 $avReady=$false
 for($avTry=0;$avTry -lt 45;$avTry++) {
  if(Get-NetTCPConnection -State Listen -LocalPort $avPort -ErrorAction SilentlyContinue){$avReady=$true;break}
  Start-Sleep -Seconds 2
 }
 if(-not $avReady){throw 'Preview did not listen within 90 seconds'}
 Get-CimInstance Win32_Process -Filter "ProcessId=$($avRuntime.PID)" | Select-Object ProcessId,ExecutablePath,CommandLine | ConvertTo-Json | Set-Content "$avRoot\evidence\ownership-$Variant.json"
 $ErrorActionPreference='Continue'
 & $avNode "$avRoot\qa.mjs" $Variant *> "$avRoot\evidence\qa-$Variant.log"
 if($LASTEXITCODE){throw "Browser QA failed: $Variant"}
 & $avNode "$avRoot\interactions.mjs" $Variant *> "$avRoot\evidence\interactions-$Variant.log"
 if($LASTEXITCODE){throw "Interaction QA failed: $Variant"}
} finally {
 if($avRuntime){
  $avProcess=Get-CimInstance Win32_Process -Filter "ProcessId=$($avRuntime.PID)" -ErrorAction SilentlyContinue
  if($avProcess -and $avProcess.CommandLine -like "*$avPort*"){
   $avChildren=Get-CimInstance Win32_Process -Filter "ParentProcessId=$($avRuntime.PID)" -ErrorAction SilentlyContinue
   $avChildren | ForEach-Object {Stop-Process -Id $_.ProcessId -ErrorAction SilentlyContinue}
   Stop-Process -Id $avRuntime.PID -ErrorAction SilentlyContinue
  }
  "Stopped owned preview PID $($avRuntime.PID) on port $avPort" | Set-Content "$avRoot\evidence\preview-$Variant-stopped.txt"
 }
}
