Set-Location J:/cars
& C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe audits/2026-09-08/verify/contact-astra-last.mjs *> clients/legend-auto/qa-final/contact-copy-final-retry.log
if ($LASTEXITCODE) { throw 'Targeted verification failed' }
