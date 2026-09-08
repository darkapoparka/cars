$ErrorActionPreference='Continue'
$env:SKIP_ENV_VALIDATION='true'
$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6657'
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6659'
$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6660'
$qaStarted=$null
try {
 $qaStarted = (& J:/cars/scripts/start-preview.ps1 -Client automarket-varna -Template modern -Port 6657 | ConvertFrom-Json)
 if(-not $qaStarted.PID){throw 'Preview did not start'}
 $qaStarted | ConvertTo-Json | Set-Content 'J:/cars/clients/automarket-varna/evidence/modern-runtime.json'
 Start-Sleep -Seconds 4
 Set-Location J:/cars
 & C:/nvm4w/nodejs/node.exe 'J:/cars/clients/automarket-varna/browser-qa.mjs' 'modern' *> 'J:/cars/clients/automarket-varna/evidence/modern-browser.log'
 $qaCode=$LASTEXITCODE
 & C:/nvm4w/nodejs/node.exe 'J:/cars/clients/automarket-varna/interact-other.mjs' 'modern' *> 'J:/cars/clients/automarket-varna/evidence/modern-interaction.log'
 if($LASTEXITCODE -ne 0){$qaCode=$LASTEXITCODE}
} finally {
 if($qaStarted.PID){
 $qaProcess=Get-CimInstance Win32_Process -Filter "ProcessId=$($qaStarted.PID)"
 if($qaProcess.CommandLine -match '--port 6657') { & taskkill /PID $qaStarted.PID /T /F | Out-Null }
 }
 Set-Content 'J:/cars/clients/automarket-varna/evidence/modern-preview-state.txt' 'Stopped after serialized QA; see runtime record and logs.'
}
exit $qaCode
