$ErrorActionPreference='Continue'
& J:/cars/clients/autolife/validate-auto-best.ps1
$autolifeValidation=$LASTEXITCODE
@{variant='auto-best';exitCode=$autolifeValidation;at=(Get-Date -Format o)} | ConvertTo-Json | Set-Content J:/cars/clients/autolife/evidence/auto-best-validation-result.json
if($autolifeValidation -ne 0){exit $autolifeValidation}
& J:/cars/clients/autolife/preview-qa.ps1 -Variant 'auto-best'
exit $LASTEXITCODE
