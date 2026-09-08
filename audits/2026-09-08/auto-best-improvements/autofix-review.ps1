$ErrorActionPreference='Stop'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
$templateRoot='J:/cars/templates/auto-best'
$evidenceRoot='J:/cars/audits/2026-09-08/auto-best-improvements'
$manifest=Get-Content "$evidenceRoot/before-manifest.json" -Raw | ConvertFrom-Json
$reviewResults=@()
Set-Location $templateRoot
foreach($componentFile in Get-ChildItem -LiteralPath "$templateRoot/src" -Filter '*.svelte' -Recurse) {
  $componentRelative=[IO.Path]::GetRelativePath($templateRoot,$componentFile.FullName).Replace('\','/')
  $baselineEntry=$manifest | Where-Object path -EQ $componentRelative
  if($baselineEntry -and (Get-FileHash -LiteralPath $componentFile.FullName).Hash.ToLower() -eq $baselineEntry.sha256) {continue}
  $reviewOutput=& npx.cmd --yes @sveltejs/mcp svelte-autofixer $componentFile.FullName --svelte-version 5 2>&1 | Out-String
  $reviewResults+=@{path=$componentRelative;exitCode=$LASTEXITCODE;output=$reviewOutput}
  $reviewResults | ConvertTo-Json -Depth 4 | Set-Content "$evidenceRoot/autofixer.json"
  Write-Output "Reviewed $componentRelative"
}
