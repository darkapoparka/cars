[CmdletBinding()]
param([Parameter(Mandatory=$true)][string]$ScriptPath)
$ErrorActionPreference = 'Stop'
$batchScript = (Resolve-Path -LiteralPath $ScriptPath).Path
if (-not $batchScript.StartsWith('J:\cars\clients\', [StringComparison]::OrdinalIgnoreCase)) { throw 'Heavy-job script must be inside the assigned J: client folder.' }
$batchMutex = [Threading.Mutex]::new($false, 'Local\CarsVarna20260907HeavyBuild')
$batchAcquired = $false
try {
    Write-Output "Waiting for shared build slot: $batchScript"
    while (-not $batchAcquired) {
        try { $batchAcquired = $batchMutex.WaitOne(30000) }
        catch [Threading.AbandonedMutexException] { $batchAcquired = $true }
        if (-not $batchAcquired) { Write-Output 'Another Varna task is using the build slot; queued.' }
    }
    Write-Output "Build slot acquired: $batchScript"
    do {
        $batchMemory = Get-CimInstance Win32_OperatingSystem
        $batchMemoryReady = $batchMemory.FreeVirtualMemory -ge 6291456 -and $batchMemory.FreePhysicalMemory -ge 3145728
        if (-not $batchMemoryReady) {
            Write-Output "Waiting for memory headroom: free commit $([math]::Round($batchMemory.FreeVirtualMemory / 1024)) MB; free RAM $([math]::Round($batchMemory.FreePhysicalMemory / 1024)) MB."
            Start-Sleep -Seconds 15
        }
    } until ($batchMemoryReady)
    & $batchScript
    if ($LASTEXITCODE -and $LASTEXITCODE -ne 0) { throw "Heavy job returned exit code $LASTEXITCODE" }
} finally {
    if ($batchAcquired) { $batchMutex.ReleaseMutex() }
    $batchMutex.Dispose()
}
