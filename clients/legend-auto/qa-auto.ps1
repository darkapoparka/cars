$ErrorActionPreference='Continue'
$legendLaunch=$null
try {
 $legendLaunch=(& 'J:/cars/scripts/start-preview.ps1' -Client legend-auto -Template auto-best -Port 6671 | ConvertFrom-Json)
 if(-not $legendLaunch.PID){throw 'Preview launch failed'}
 $legendLaunch | ConvertTo-Json | Set-Content 'J:/cars/clients/legend-auto/qa-auto-runtime.json'
 Start-Sleep -Seconds 3
 node 'J:/cars/clients/legend-auto/qa.mjs' auto-best *> 'J:/cars/clients/legend-auto/qa-auto.log'
 $legendQaExit=$LASTEXITCODE
} finally {
 if($legendLaunch.PID){$legendOwned=Get-CimInstance Win32_Process | Where-Object {$_.ParentProcessId -eq $legendLaunch.PID}; foreach($legendChild in $legendOwned){Stop-Process -Id $legendChild.ProcessId -ErrorAction SilentlyContinue}; Stop-Process -Id $legendLaunch.PID -ErrorAction SilentlyContinue}
}
if($legendQaExit){throw 'Auto Best browser QA failed'}
