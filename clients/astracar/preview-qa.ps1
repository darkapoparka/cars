param([string]$Variant,[switch]$InteractionsOnly)
$ErrorActionPreference='Stop'
$qaPort=@{'auto-best'=6636;'modern'=6637;'carwow'=6638}[$Variant]
$env:SKIP_ENV_VALIDATION='true';$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6637';$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6639';$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6640'
$qaRuntime=$null
try {
 $qaRuntime=(& J:/cars/scripts/start-preview.ps1 -Client astracar -Template $Variant -Port $qaPort) | ConvertFrom-Json
 $qaRuntime | ConvertTo-Json | Set-Content "J:/cars/clients/astracar/evidence/$Variant-runtime.json"
 $qaReady=$false
 for($qaTry=0;$qaTry -lt 60;$qaTry++) {if(Get-NetTCPConnection -State Listen -LocalPort $qaPort -ErrorAction SilentlyContinue){$qaReady=$true;break};Start-Sleep -Seconds 1}
 if(-not $qaReady){throw 'Preview did not listen within 60 seconds'}
 $qaProcess=Get-CimInstance Win32_Process -Filter "ProcessId=$($qaRuntime.PID)"
 $qaProcess | Select-Object ProcessId,ParentProcessId,ExecutablePath,CommandLine | ConvertTo-Json | Set-Content "J:/cars/clients/astracar/evidence/$Variant-listener.json"
 Set-Location J:/cars
 if(-not $InteractionsOnly){node clients/astracar/browser-qa.mjs $Variant}
 if($LASTEXITCODE -ne 0){throw 'Route QA failed'}
 if($Variant -eq 'auto-best'){node clients/astracar/auto-interactions.mjs;if($LASTEXITCODE -ne 0){throw 'Interaction QA failed'}}
 if($Variant -eq 'carwow'){node clients/astracar/carwow-interactions.mjs;if($LASTEXITCODE -ne 0){throw 'Interaction QA failed'}}
 if($Variant -eq 'modern'){node clients/astracar/modern-interactions.mjs;if($LASTEXITCODE -ne 0){throw 'Interaction QA failed'}}
} finally {
 if($qaRuntime){$qaOwned=Get-CimInstance Win32_Process -Filter "ProcessId=$($qaRuntime.PID)" -ErrorAction SilentlyContinue;if($qaOwned -and $qaOwned.CommandLine -match 'node_modules/(vite|next)' ){taskkill /PID $qaRuntime.PID /T /F | Out-Null};$qaRuntime.Status='stopped-after-qa';$qaRuntime | ConvertTo-Json | Set-Content "J:/cars/clients/astracar/evidence/$Variant-runtime.json"}
}

