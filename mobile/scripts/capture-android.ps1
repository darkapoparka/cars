param([Parameter(Mandatory=$true)][string]$Name)
$ErrorActionPreference = 'Stop'
if ($Name -notmatch '^[a-zA-Z0-9_-]+$') { throw 'Use a simple capture name.' }
$adb = 'I:\Android\Sdk\platform-tools\adb.exe'
$out = Join-Path $PSScriptRoot '../reference/android'
& $adb -s emulator-5554 shell uiautomator dump /sdcard/mobile-reference.xml | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'UI hierarchy capture failed.' }
& $adb -s emulator-5554 pull /sdcard/mobile-reference.xml (Join-Path $out ($Name + '.xml')) | Out-Null
& $adb -s emulator-5554 shell screencap -p /sdcard/mobile-reference.png
& $adb -s emulator-5554 pull /sdcard/mobile-reference.png (Join-Path $out ($Name + '.png')) | Out-Null
[xml]$xml = Get-Content -LiteralPath (Join-Path $out ($Name + '.xml')) -Raw
$xml.SelectNodes('//node') | Where-Object { $_.text -or $_.'content-desc' } | ForEach-Object { 'text=' + $_.text + ' | label=' + $_.'content-desc' + ' | bounds=' + $_.bounds }
