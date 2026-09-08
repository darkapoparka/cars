[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][string]$Template,
    [Parameter(Mandatory=$true)][ValidateRange(1024,65535)][int]$Port,
    [string]$Client,
    [string]$NodePath
)
$ErrorActionPreference='Stop'
$carRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
if($Template -notmatch '^[a-z0-9][a-z0-9-]*$' -or ($Client -and $Client -notmatch '^[a-z0-9][a-z0-9-]*$')) {throw 'Use a catalog key and a simple client slug.'}
$carRelative=if($Client){"clients\$Client\$Template"}else{"templates\$Template"}
$carProject=[IO.Path]::GetFullPath((Join-Path $carRoot $carRelative))
if(-not $carProject.StartsWith($carRoot+'\',[StringComparison]::OrdinalIgnoreCase)){throw 'Project escaped Cars workspace.'}
if(-not(Test-Path -LiteralPath (Join-Path $carProject 'package.json'))){throw "No project at $carProject"}
$carExisting=@(Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue)
if($carExisting.Count){throw "Port $Port is already used by PID $($carExisting[0].OwningProcess). No process was stopped."}
if(-not $NodePath){
    $carPinned=Join-Path $env:LOCALAPPDATA 'nvm\v22.23.2\node.exe'
    $NodePath=if($Template -in @('auto-best','modern') -and (Test-Path -LiteralPath $carPinned)){$carPinned}else{(Get-Command node).Source}
}
$carLogs=Join-Path $carRoot 'runtime'
New-Item -ItemType Directory -Path $carLogs -Force | Out-Null
$carStamp=Get-Date -Format 'yyyyMMdd-HHmmss'
$carOut=Join-Path $carLogs "$Template-$Port-$carStamp.out.log"
$carErr=Join-Path $carLogs "$Template-$Port-$carStamp.err.log"
$carArgs=@()
$carWorking=$carProject
$carOldPort=$env:PORT;$carOldHost=$env:HOST
try {
    if($Template -eq 'autodeal') {
        $env:PORT=[string]$Port;$env:HOST='127.0.0.1';$carArgs=@('server.mjs')
    } elseif($Template -eq 'modern') {
        $carWorking=Join-Path $carProject 'apps\web'
        $carNext=Join-Path $carWorking 'node_modules\next\dist\bin\next'
        if(-not(Test-Path -LiteralPath $carNext)){throw 'Install modern dependencies with pnpm install --frozen-lockfile first; see its TEMPLATE.md.'}
        $carArgs=@('node_modules/next/dist/bin/next','dev','--hostname','127.0.0.1','--port',[string]$Port)
    } else {
        $carVite=Join-Path $carProject 'node_modules\vite\bin\vite.js'
        if(-not(Test-Path -LiteralPath $carVite)){throw 'Run npm ci in this project first.'}
        $carArgs=@('node_modules/vite/bin/vite.js','--host','127.0.0.1','--port',[string]$Port,'--strictPort')
    }
    $carStarted=Start-Process -FilePath $NodePath -ArgumentList $carArgs -WorkingDirectory $carWorking -WindowStyle Hidden -PassThru -RedirectStandardOutput $carOut -RedirectStandardError $carErr
    [pscustomobject]@{Template=$Template;Project=$carProject;PID=$carStarted.Id;Port=$Port;Url="http://127.0.0.1:$Port";Stdout=$carOut;Stderr=$carErr;Status='started-not-yet-browser-verified'} | ConvertTo-Json
} finally {$env:PORT=$carOldPort;$env:HOST=$carOldHost}
