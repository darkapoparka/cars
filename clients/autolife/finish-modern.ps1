$ErrorActionPreference='Continue'
& J:/cars/clients/autolife/validate-modern.ps1
$autolifeValidation=$LASTEXITCODE
@{variant='modern';exitCode=$autolifeValidation;at=(Get-Date -Format o)} | ConvertTo-Json | Set-Content J:/cars/clients/autolife/evidence/modern-validation-result.json
if($autolifeValidation -ne 0){exit $autolifeValidation}
& J:/cars/clients/autolife/preview-qa.ps1 -Variant 'modern'
exit $LASTEXITCODE
