$ErrorActionPreference='Continue'
& 'J:/cars/clients/automarket-varna/check-carwow.ps1'
if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
$qaStarted=$null
try {
 & C:/nvm4w/nodejs/node.exe 'J:/cars/clients/automarket-varna/svelte-review.mjs' 'carwow' *> 'J:/cars/clients/automarket-varna/evidence/carwow-autofixer.log'
 $qaStarted = (& J:/cars/scripts/start-preview.ps1 -Client automarket-varna -Template carwow -Port 6658 | ConvertFrom-Json)
 if(-not $qaStarted.PID){throw 'Preview did not start'}
 $qaStarted | ConvertTo-Json | Set-Content 'J:/cars/clients/automarket-varna/evidence/carwow-runtime.json'
 Start-Sleep -Seconds 4
 Set-Location J:/cars
 & C:/nvm4w/nodejs/node.exe 'J:/cars/clients/automarket-varna/browser-qa.mjs' 'carwow' *> 'J:/cars/clients/automarket-varna/evidence/carwow-browser.log'
 $qaCode=$LASTEXITCODE
 & C:/nvm4w/nodejs/node.exe 'J:/cars/clients/automarket-varna/interact-other.mjs' 'carwow' *> 'J:/cars/clients/automarket-varna/evidence/carwow-interaction.log'
 if($LASTEXITCODE -ne 0){$qaCode=$LASTEXITCODE}
} finally {
 if($qaStarted.PID){
 $qaProcess=Get-CimInstance Win32_Process -Filter "ProcessId=$($qaStarted.PID)"
 if($qaProcess.CommandLine -match '--port 6658') { & taskkill /PID $qaStarted.PID /T /F | Out-Null }
 }
 Set-Content 'J:/cars/clients/automarket-varna/evidence/carwow-preview-state.txt' 'Stopped after serialized QA; see runtime record and logs.'
}
exit $qaCode
