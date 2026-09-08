import { defineConfig } from '../../../templates/carwow/node_modules/@playwright/test/index.mjs';
export default defineConfig({
 testDir: 'J:/cars/templates/carwow/tests/visual',
 testMatch: '**/*.visual.ts',
 snapshotPathTemplate: 'J:/cars/templates/carwow/tests/visual/__screenshots__/{arg}{ext}',
 outputDir: 'J:/cars/audits/2026-09-08/carwow-finalization/visual-results',
 workers:1,retries:0,timeout:90000,reporter:[['list']],
 use:{baseURL:'http://127.0.0.1:6463',reducedMotion:'reduce',channel:'chrome'},
 expect:{toHaveScreenshot:{maxDiffPixelRatio:0.002,threshold:0.2,animations:'disabled',caret:'hide',scale:'css'}}
});
