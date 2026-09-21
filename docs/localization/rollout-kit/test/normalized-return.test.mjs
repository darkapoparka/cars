import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createLocalePolicy} from '../dist/policy.js';
const policy=createLocalePolicy(JSON.parse(fs.readFileSync(new URL('../config/al-reef.json',import.meta.url),'utf8')));
const origin='https://dealer.example';
const vectors=['/x/..//evil.example/path','/%2e%2e//evil.example/','/..//evil.example/path?x=1'];
for(const returnTo of vectors) for(const action of ['save','dismiss']) for(const format of ['json','form']) {
 test(`normalized destination rejection: ${action} ${format} ${returnTo}`,async()=>{
  const data={action,locale:'bg',country:'DE',returnTo};
  assert.equal(policy.safeReturnPath(returnTo,origin),null);
  const response=await policy.preferenceResponse(new Request(origin+'/api/preferences',{method:'POST',headers:{origin,'content-type':format==='json'?'application/json':'application/x-www-form-urlencoded'},body:format==='json'?JSON.stringify(data):new URLSearchParams(data).toString()}));
  assert.equal(response.status,400);assert.equal(response.headers.has('location'),false);assert.equal(response.headers.has('set-cookie'),false);
 });
}
