$ErrorActionPreference='Continue'
& 'J:/cars/clients/automarket-varna/check-auto-best.ps1'
if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
$qaStarted=$null
try {
 & C:/nvm4w/nodejs/node.exe 'J:/cars/clients/automarket-varna/svelte-review.mjs' 'auto-best' *> 'J:/cars/clients/automarket-varna/evidence/auto-best-autofixer.log'
 $qaStarted = (& J:/cars/scripts/start-preview.ps1 -Client automarket-varna -Template auto-best -Port 6656 | ConvertFrom-Json)
 if(-not $qaStarted.PID){throw 'Preview did not start'}
 $qaStarted | ConvertTo-Json | Set-Content 'J:/cars/clients/automarket-varna/evidence/auto-best-runtime.json'
 Start-Sleep -Seconds 4
 Set-Location J:/cars
 & C:/nvm4w/nodejs/node.exe 'J:/cars/clients/automarket-varna/browser-qa.mjs' 'auto-best' *> 'J:/cars/clients/automarket-varna/evidence/auto-best-browser.log'
 $qaCode=$LASTEXITCODE
 & C:/nvm4w/nodejs/node.exe 'J:/cars/clients/automarket-varna/interact-auto.mjs' 'auto-best' *> 'J:/cars/clients/automarket-varna/evidence/auto-best-interaction.log'
 if($LASTEXITCODE -ne 0){$qaCode=$LASTEXITCODE}
} finally {
 if($qaStarted.PID){
 $qaProcess=Get-CimInstance Win32_Process -Filter "ProcessId=$($qaStarted.PID)"
 if($qaProcess.CommandLine -match '--port 6656') { & taskkill /PID $qaStarted.PID /T /F | Out-Null }
 }
 Set-Content 'J:/cars/clients/automarket-varna/evidence/auto-best-preview-state.txt' 'Stopped after serialized QA; see runtime record and logs.'
}
exit $qaCode
