$ErrorActionPreference='Continue'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
$env:SKIP_ENV_VALIDATION='true'
$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6672'
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6674'
$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6675'
$legendLaunch=$null
try {
 $legendLaunch=(& 'J:/cars/scripts/start-preview.ps1' -Client legend-auto -Template modern -Port 6672 | ConvertFrom-Json)
 if(-not $legendLaunch.PID){throw 'Preview launch failed'}
 $legendLaunch | ConvertTo-Json | Set-Content 'J:/cars/clients/legend-auto/qa-modern-runtime.json'
 Start-Sleep -Seconds 4
 node 'J:/cars/clients/legend-auto/qa.mjs' modern *> 'J:/cars/clients/legend-auto/qa-modern.log'
 $legendQaExit=$LASTEXITCODE
} finally {
 if($legendLaunch.PID){$legendOwned=Get-CimInstance Win32_Process | Where-Object {$_.ParentProcessId -eq $legendLaunch.PID}; foreach($legendChild in $legendOwned){Stop-Process -Id $legendChild.ProcessId -ErrorAction SilentlyContinue}; Stop-Process -Id $legendLaunch.PID -ErrorAction SilentlyContinue}
}
if($legendQaExit){throw 'Modern browser QA failed'}
