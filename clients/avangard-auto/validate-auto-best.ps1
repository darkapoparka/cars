$ErrorActionPreference='Continue'
$env:PATH='C:\Users\radev\AppData\Local\nvm\v22.23.2;'+$env:PATH
$env:npm_config_script_shell='C:\Windows\System32\cmd.exe'
Set-Location J:\cars\clients\avangard-auto\auto-best
npm.cmd run validate *> ..\evidence\validate-auto-best.log
if($LASTEXITCODE){throw 'Auto validate failed'}

