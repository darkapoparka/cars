$ErrorActionPreference='Stop'
$carRoot=(Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path.TrimEnd('\')
if($carRoot -ne 'J:\cars'){throw 'This one-time relocation is scoped to J:\cars.'}
$carMoves=@(@{key='boxcar';port=6450},@{key='rencar';port=6430},@{key='nusavo';port=6420},@{key='motoria';port=6440})
$carEvidence=@()
foreach($carMove in $carMoves){
    $carSource=(Resolve-Path -LiteralPath (Join-Path $carRoot $carMove.key)).Path.TrimEnd('\')
    $carDestination=[IO.Path]::GetFullPath((Join-Path $carRoot "templates\$($carMove.key)"))
    if($carSource -ne "J:\cars\$($carMove.key)" -or -not $carDestination.StartsWith('J:\cars\templates\') -or (Test-Path -LiteralPath $carDestination)){throw 'Unsafe or occupied move destination.'}
    $carListeners=@(Get-NetTCPConnection -State Listen -LocalPort $carMove.port -ErrorAction Stop)
    $carProcessId=$carListeners[0].OwningProcess
    $carIdentity=& (Join-Path $PSScriptRoot 'process-cwd.ps1') -ProcessIds $carProcessId
    if($carIdentity.Cwd.TrimEnd('\') -ne $carSource -or $carIdentity.CommandLine -notmatch 'vite'){throw 'Listener does not own the expected source.'}
    $carBefore=(Get-FileHash -LiteralPath (Join-Path $carSource 'package.json') -Algorithm SHA256).Hash
    Stop-Process -Id $carProcessId -ErrorAction Stop
    Start-Sleep -Milliseconds 400
    Move-Item -LiteralPath $carSource -Destination $carDestination -ErrorAction Stop
    $carAfter=(Get-FileHash -LiteralPath (Join-Path $carDestination 'package.json') -Algorithm SHA256).Hash
    if($carBefore -ne $carAfter){throw 'Moved package failed integrity check.'}
    $carRestart=& (Join-Path $PSScriptRoot 'start-preview.ps1') -Template $carMove.key -Port $carMove.port | ConvertFrom-Json
    $carEvidence+=[pscustomobject]@{key=$carMove.key;source=$carSource;destination=$carDestination;oldPID=$carProcessId;packageSHA256=$carAfter;restart=$carRestart}
    $carEvidence | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $carRoot 'audits\2026-09-06\relocations.json') -Encoding utf8
    $carRestart | ConvertTo-Json
}
