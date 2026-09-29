$ErrorActionPreference = 'Stop'
Set-Location L:\cars-app
$nodeRoot = 'C:\Users\radev\AppData\Local\nvm\v22.20.0'
$node = Join-Path $nodeRoot 'node.exe'
$env:PATH = "$nodeRoot;$env:PATH"
$root = 'L:\cars-app\reference\2026-09-26-final-pass'
$sourcePath = 'L:\cars-app\components\ReferenceVideo.tsx'
$source = [System.IO.File]::ReadAllText($sourcePath)
if ($source.Contains('seek:{flex:1,')) {
  if ((Get-FileHash -Algorithm SHA256 -LiteralPath $sourcePath).Hash -ne '879f685cdb8a18435fc908a524144a87b3490301f682565e0a28c9e97d35d29d') { throw 'ReferenceVideo changed before bounded style correction' }
  [System.IO.File]::WriteAllText($sourcePath, $source.Replace('seek:{flex:1,', "seek:{flex:'1 1 0',"), [System.Text.UTF8Encoding]::new($false))
}
$connections = @(Get-NetTCPConnection -LocalPort 4173 -State Listen -ErrorAction SilentlyContinue)
foreach ($ownerId in ($connections.OwningProcess | Sort-Object -Unique)) {
  $owner = Get-CimInstance Win32_Process -Filter "ProcessId=$ownerId"
  if ($owner.ExecutablePath -ne $node -or $owner.CommandLine -notmatch 'node_modules[/\\]next[/\\]dist[/\\]bin[/\\]next start --hostname 0.0.0.0 --port 4173') { throw "Unrecognized port owner: $ownerId" }
  $response = Invoke-WebRequest -Uri 'http://127.0.0.1:4173/cars/2024-toyota-fortuner-exr' -UseBasicParsing -TimeoutSec 10
  if ($response.Content -notmatch 'Cars24 Reference') { throw 'Port is not the confirmed Cars24 preview' }
  Write-Output ($owner | Select-Object ProcessId,CreationDate,ExecutablePath,CommandLine | ConvertTo-Json -Compress)
  Stop-Process -Id $ownerId
}
Start-Sleep -Milliseconds 500
& cmd.exe /d /c 'npm.cmd run check > reference\2026-09-26-final-pass\check.log 2>&1'
$check = $LASTEXITCODE
[System.IO.File]::WriteAllText("$root\check-exit.txt", [string]$check)
Write-Output "CHECK_EXIT=$check"
if ($check -ne 0) { Get-Content "$root\check.log" -Tail 60; exit $check }
$preview = Start-Process -FilePath $node -ArgumentList @('node_modules/next/dist/bin/next','start','--hostname','0.0.0.0','--port','4173') -WorkingDirectory 'L:\cars-app' -RedirectStandardOutput "$root\preview.out.log" -RedirectStandardError "$root\preview.err.log" -PassThru
[System.IO.File]::WriteAllText("$root\preview.pid", [string]$preview.Id)
Write-Output "PREVIEW_PID=$($preview.Id)"
Start-Sleep -Seconds 2
Write-Output "PREVIEW_HTTP=$((Invoke-WebRequest -Uri 'http://127.0.0.1:4173' -UseBasicParsing -TimeoutSec 10).StatusCode)"
