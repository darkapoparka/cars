param(
  [Parameter(Mandatory=$true)][ValidateSet('auto-best','modern','carwow')][string]$Variant,
  [Parameter(Mandatory=$true)][int]$Port
)

$ErrorActionPreference = 'Stop'
$env:UV_THREADPOOL_SIZE = '2'
$env:RAYON_NUM_THREADS = '2'
$env:NEXT_TELEMETRY_DISABLED = '1'
$env:SKIP_ENV_VALIDATION = 'true'
$env:AUTOMARKET_PUBLIC_DATA_MODE = 'demo'
$env:NEXT_PUBLIC_WEB_URL = 'http://127.0.0.1:6622'
$env:NEXT_PUBLIC_API_URL = 'http://127.0.0.1:6624'
$env:NEXT_PUBLIC_APP_URL = 'http://127.0.0.1:6625'
$root = 'J:/cars/clients/excellent-cars'
$runtime = $null

try {
  Set-Location 'J:/cars'
  $runtime = & 'J:/cars/scripts/start-preview.ps1' -Client excellent-cars -Template $Variant -Port $Port | ConvertFrom-Json
  if (-not $runtime.PID) { throw "Preview did not start for $Variant" }
  $runtime | ConvertTo-Json | Set-Content -LiteralPath "$root/qa/runtime-$Variant.json"

  $ready = $false
  for ($attempt = 0; $attempt -lt 60; $attempt++) {
    if (Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue) {
      $ready = $true
      break
    }
    Start-Sleep -Seconds 2
  }
  if (-not $ready) { throw "Preview readiness timeout on $Port" }

  & 'C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe' "$root/final-browser-qa.mjs" $Variant $Port *> "$root/qa/final-$Variant.log"
  if ($LASTEXITCODE -and $LASTEXITCODE -ne 0) { throw "Final browser QA returned exit code $LASTEXITCODE" }
}
finally {
  if ($runtime -and $runtime.PID) {
    $rows = Get-CimInstance Win32_Process
    $parent = $rows | Where-Object ProcessId -eq $runtime.PID
    $owned = $parent -and $parent.CommandLine -match "--port $Port"
    if ($owned) {
      $stop = [Collections.Generic.HashSet[int]]::new()
      [void]$stop.Add([int]$runtime.PID)
      do {
        $more = $false
        foreach ($row in $rows) {
          if ($stop.Contains([int]$row.ParentProcessId) -and $stop.Add([int]$row.ProcessId)) { $more = $true }
        }
      } while ($more)
      $stop | Sort-Object -Descending | ForEach-Object { Stop-Process -Id $_ -ErrorAction SilentlyContinue }
    }
    $runtime.Status = 'stopped-after-final-qa'
    $runtime | ConvertTo-Json | Set-Content -LiteralPath "$root/qa/runtime-$Variant.json"
  }
}
