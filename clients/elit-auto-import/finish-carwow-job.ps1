& 'J:/cars/clients/elit-auto-import/validate-carwow.ps1'
if($LASTEXITCODE -ne 0){throw 'Carwow validation failed'}
& 'J:/cars/clients/elit-auto-import/preview-qa.ps1' -Variant carwow
