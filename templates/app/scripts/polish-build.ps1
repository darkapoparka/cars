$ErrorActionPreference = 'Stop'
Set-Location L:\cars-app
$nodeRoot = 'C:\Users\radev\AppData\Local\nvm\v22.20.0'
$node = Join-Path $nodeRoot 'node.exe'
$env:PATH = "$nodeRoot;$env:PATH"
$root = 'L:\cars-app\reference\2026-09-26-polish'
New-Item -ItemType Directory -Path $root -Force | Out-Null
$connections = @(Get-NetTCPConnection -LocalPort 4173 -State Listen -ErrorAction SilentlyContinue)
foreach ($ownerId in ($connections.OwningProcess | Sort-Object -Unique)) {
  $owner = Get-CimInstance Win32_Process -Filter "ProcessId=$ownerId"
  if ($owner.ExecutablePath -ne $node -or $owner.CommandLine -notmatch 'node_modules[/\\]next[/\\]dist[/\\]bin[/\\]next start --hostname 0.0.0.0 --port 4173') { throw "Unrecognized preview owner: $ownerId" }
  $response = Invoke-WebRequest -Uri 'http://127.0.0.1:4173/cars/2024-toyota-fortuner-exr' -UseBasicParsing -TimeoutSec 10
  if ($response.Content -notmatch 'Cars24 Reference') { throw 'Port is not the Cars24 preview' }
  $owner | Select-Object ProcessId,CreationDate,ExecutablePath,CommandLine | ConvertTo-Json | Set-Content "$root\previous-preview.json"
  Stop-Process -Id $ownerId
}
Start-Sleep -Milliseconds 500
& cmd.exe /d /c 'npm.cmd run check > reference\2026-09-26-polish\check.log 2>&1'
$check = $LASTEXITCODE
[IO.File]::WriteAllText("$root\check-exit.txt",[string]$check)
Write-Output "CHECK_EXIT=$check"
if ($check -ne 0) { Get-Content "$root\check.log" -Tail 60; exit $check }
$preview = Start-Process -FilePath $node -ArgumentList @('node_modules/next/dist/bin/next','start','--hostname','0.0.0.0','--port','4173') -WorkingDirectory 'L:\cars-app' -RedirectStandardOutput "$root\preview.out.log" -RedirectStandardError "$root\preview.err.log" -PassThru
[IO.File]::WriteAllText("$root\preview.pid",[string]$preview.Id)
Write-Output "PREVIEW_PID=$($preview.Id)"
Start-Sleep -Seconds 2
Write-Output "PREVIEW_HTTP=$((Invoke-WebRequest -Uri 'http://127.0.0.1:4173' -UseBasicParsing -TimeoutSec 10).StatusCode)"
