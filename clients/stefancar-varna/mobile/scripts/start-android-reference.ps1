$ErrorActionPreference = 'Stop'
$adb = 'I:\Android\Sdk\platform-tools\adb.exe'
$emulator = 'I:\Android\Sdk\emulator\emulator.exe'
$avd = 'Pawtreon_Reference_Pixel_9_Pro_API_36'
$avdHome = 'L:\Android\avd'
if (!(Test-Path -LiteralPath "$avdHome\$avd.avd\userdata-qemu.img.qcow2")) {
    throw 'The preserved Android reference is missing. Do not create or wipe an AVD.'
}
$device = & $adb devices
if (!($device -match '^emulator-5554\s+device')) {
    $running = Get-CimInstance Win32_Process | Where-Object {
        $_.Name -match 'emulator|qemu' -and $_.CommandLine -like "*$avd*"
    }
    if (!$running) {
        $env:ANDROID_AVD_HOME = $avdHome
        $env:ANDROID_SDK_ROOT = 'I:\Android\Sdk'
        Start-Process -FilePath $emulator -ArgumentList @('-avd', $avd, '-port', '5554', '-no-snapshot', '-no-boot-anim', '-no-metrics')
    }
}
$ready = $false
for ($attempt = 0; $attempt -lt 60; $attempt++) {
    $ErrorActionPreference = 'SilentlyContinue'
    $boot = & $adb -s emulator-5554 shell getprop sys.boot_completed 2>$null
    $ErrorActionPreference = 'Stop'
    if ($LASTEXITCODE -eq 0 -and $boot -match '^1') { $ready = $true; break }
    Start-Sleep -Seconds 2
}
if (!$ready) { throw 'Reference emulator did not finish booting; existing data was not modified.' }
if (!((& $adb -s emulator-5554 emu avd name) -contains $avd)) { throw 'Port 5554 belongs to a different AVD.' }
& $adb -s emulator-5554 shell am start -n 'de.mobile.android.app/.splash.Splash'
if ($LASTEXITCODE -ne 0) { throw 'mobile.de could not be opened.' }
Write-Output 'mobile.de is open on emulator-5554 using the preserved AVD on L:.'
