& J:/cars/clients/automarket-varna/check-modern.ps1
if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
& J:/cars/clients/automarket-varna/qa-modern.ps1
exit $LASTEXITCODE
