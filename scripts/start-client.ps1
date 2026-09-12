[CmdletBinding()]
param(
    [string]$Client,
    [ValidateSet('auto-best','modern','import','carwow','rencar')][string]$Template,
    [ValidateRange(1024,65531)][int]$BasePort=6631,
    [switch]$List,
    [switch]$Plan,
    [switch]$Prepare
)
$ErrorActionPreference='Stop'
$carRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$carIndex=Get-Content -LiteralPath (Join-Path $carRoot 'clients/index.json') -Raw | ConvertFrom-Json
if($List){$carIndex.projects | Select-Object slug,@{n='Designs';e={$_.variants -join ', '}},sourceState | Format-Table; return}
if(-not $Client -or $Client -notmatch '^[a-z0-9][a-z0-9-]*$'){throw 'Use -List, or provide -Client with a listed folder name.'}
$carEntry=@($carIndex.projects | Where-Object slug -eq $Client)
if($carEntry.Count -ne 1){throw "Unknown client: $Client. Run -List."}
$carKeys=@($carEntry[0].variants)
if($Template){if($Template -notin $carKeys){throw "No $Template app exists for $Client"};$carKeys=@($Template)}
if(-not $carKeys.Count){throw "$Client has research/brief files only; there are no apps to launch."}
$carPlans=foreach($carKey in $carKeys){
    $carOffset=switch($carKey){'auto-best'{0};'modern'{1};'import'{1};'carwow'{2};'rencar'{0}}
    $carProject=Join-Path $carRoot "clients/$Client/$carKey"
    if(-not(Test-Path -LiteralPath (Join-Path $carProject 'package.json'))){throw "Missing app: $carProject"}
    $carRuntime=if($carKey -eq 'modern'){'apps/web/node_modules/next/dist/bin/next'}else{'node_modules/vite/bin/vite.js'}
    $carVersion=if($carKey -eq 'carwow'){'v24.18.0'}else{'v22.23.2'}
    $carNode=Join-Path $env:LOCALAPPDATA "nvm/$carVersion/node.exe"
    if(-not(Test-Path -LiteralPath $carNode)){throw "Install the documented Node runtime $carVersion; expected $carNode"}
    [pscustomobject]@{Template=$carKey;Project=$carProject;Port=($BasePort+$carOffset);Node=$carNode;DependenciesPresent=(Test-Path -LiteralPath (Join-Path $carProject $carRuntime));Url="http://127.0.0.1:$($BasePort+$carOffset)$(if($carKey -eq 'modern'){'/cars'}else{'/'})"}
}
if($Plan){$carPlans | ConvertTo-Json;return}
# Check the whole requested set before starting any server or installing over a runtime.
foreach($carItem in $carPlans){
    $carListener=@(Get-NetTCPConnection -State Listen -LocalPort $carItem.Port -ErrorAction SilentlyContinue)
    if($carListener.Count){throw "Port $($carItem.Port) is occupied by PID $($carListener[0].OwningProcess). Check its project before stopping it."}
}
$carNames=@('PATH','CI','SKIP_ENV_VALIDATION','AUTOMARKET_PUBLIC_DATA_MODE','NEXT_PUBLIC_WEB_URL','NEXT_PUBLIC_API_URL','NEXT_PUBLIC_APP_URL')
$carSaved=@{};foreach($carName in $carNames){$carSaved[$carName]=[Environment]::GetEnvironmentVariable($carName,'Process')}
try{
    $env:SKIP_ENV_VALIDATION='true';$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
    $env:NEXT_PUBLIC_WEB_URL="http://127.0.0.1:$($BasePort+1)"
    $env:NEXT_PUBLIC_API_URL="http://127.0.0.1:$($BasePort+3)"
    $env:NEXT_PUBLIC_APP_URL="http://127.0.0.1:$($BasePort+4)"
    if($Prepare){
        foreach($carItem in $carPlans){
            $carNodeDir=Split-Path $carItem.Node
            $env:PATH=$carNodeDir+';'+$carSaved['PATH'];$env:CI='true'
            Push-Location -LiteralPath $carItem.Project
            try{
                if($carItem.Template -eq 'modern'){
                    $carPnpm=Join-Path $carNodeDir 'node_modules/corepack/dist/pnpm.js'
                    if(-not $carItem.DependenciesPresent){& $carItem.Node $carPnpm install --frozen-lockfile;if($LASTEXITCODE){throw 'Modern dependency installation failed'}}
                    & $carItem.Node $carPnpm --filter '@repo/database' build
                    if($LASTEXITCODE){throw 'Prisma client generation failed'}
                }elseif(-not $carItem.DependenciesPresent){
                    & $carItem.Node (Join-Path $carNodeDir 'node_modules/npm/bin/npm-cli.js') ci
                    if($LASTEXITCODE){throw "$($carItem.Template) dependency installation failed"}
                }
            }finally{Pop-Location}
        }
        Write-Output "Dependencies prepared for $Client. Run this command again without -Prepare to launch.";return
    }
    if(@($carPlans | Where-Object { -not $_.DependenciesPresent }).Count){throw "Dependencies are missing. Run ./scripts/start-client.ps1 -Client $Client -Prepare first."}
    $carStarted=foreach($carItem in $carPlans){
        $env:PATH=(Split-Path $carItem.Node)+';'+$carSaved['PATH']
        $carResult=& (Join-Path $PSScriptRoot 'start-preview.ps1') -Client $Client -Template $carItem.Template -Port $carItem.Port -NodePath $carItem.Node | ConvertFrom-Json
        $carResult.Url=$carItem.Url
        $carResult
    }
    $carRecord=Join-Path $carRoot "runtime/review-$Client.json"
    $carStarted | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $carRecord
    $carStarted | Select-Object Template,Project,PID,Url,Status | Format-Table
    Write-Output "Runtime record: $carRecord. Verify each page in the browser before calling it healthy."
}finally{foreach($carName in $carNames){[Environment]::SetEnvironmentVariable($carName,$carSaved[$carName],'Process')}}
