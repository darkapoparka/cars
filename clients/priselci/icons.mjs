import fs from 'node:fs/promises';
import sharp from './modern/apps/web/node_modules/sharp/dist/index.mjs';
const root='J:/cars/clients/priselci', m=root+'/modern';
for(const p of [`${m}/apps/web/app/-/icon.png`,`${m}/apps/web/app/-/apple-icon.png`,`${m}/apps/web/public/lead-logo.png`])await sharp(`${root}/assets/favicon.svg`).resize(192,192).png().toFile(p);
await sharp(`${root}/assets/favicon.svg`).resize(32,32).png().toFile(`${m}/apps/web/app/-/favicon.ico`);
await fs.writeFile(`${root}/BUILD-STATUS.md`,'# Priselci Fast Skin build\n\n2026-09-07. All three current masters cloned and personalized with 16 listings / 64 photos.\n- Auto Best: content ready; queued validation and rendered QA next.\n- Modern: frozen install passed; queued Prisma/typecheck/build and rendered QA next.\n- Carwow: content ready; queued install, checks and rendered QA next.\n- Temporary text wordmark; official logo/hours/social channels unverified.\n- Previews all stopped. Assigned ports: 6646/6647/6648, Modern config 6649/6650.\n- No deployment, outreach or CRM writes.\n');
