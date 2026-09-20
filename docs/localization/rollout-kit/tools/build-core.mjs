import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLocalePolicy } from '../dist/policy.js';

export function buildCore(source, configuration) {
  createLocalePolicy(configuration); // Validate before generating any output.
  if (configuration.enabledLocales.some(locale => !['en','bg'].includes(locale))) {
    throw new Error('The current Al Reef catalog/UI adapters are released for en/bg only. Do not enable a planned language through this emitter.');
  }
  const marker = '/* CARS_DEFAULT_PUBLIC_BINDINGS */';
  if (source.split(marker).length !== 2) throw new Error('Expected one reviewed binding boundary');
  const publicBindings = `const defaultLocaleConfiguration = ${JSON.stringify(configuration,null,2).replaceAll('<','\\u003c')} as const;
export type Locale = typeof defaultLocaleConfiguration.enabledLocales[number];
export type LocaleState = ResolvedLocale<Locale>;
const defaultRouting = createLocaleRouting<Locale>(defaultLocaleConfiguration);
export const localeContract = defaultRouting.contract;
export const { isLocale, intlLocale, formatPrice, routeParts, isResource, unsupportedLocale, localeHref, safeReturnPath } = defaultRouting;`;
  const requestBindings = `\nconst defaultRequestPolicy = createLocalePolicy<Locale>(defaultLocaleConfiguration);
export const { preferredLanguage, resolveLocale, preferenceResponse } = defaultRequestPolicy;\n`;
  const output = '// Generated adoption candidate. Framework and production acceptance are still required.\n' + source.replace(marker,publicBindings) + requestBindings;
  const boundary = output.indexOf('export function cookieValue(');
  if (boundary < 0) throw new Error('Existing locale-FAB compiler boundary was lost');
  const publicSource = output.slice(0,boundary);
  if (/preferenceResponse|Set-Cookie|request\.body/.test(publicSource)) throw new Error('Server preference logic leaked into the FAB source');
  return output;
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const check=process.argv.includes('--check');
  if(process.argv.slice(2).some(a=>a!=='--check')) throw new Error('Usage: node tools/build-core.mjs [--check]');
  const configuration=JSON.parse(fs.readFileSync(path.join(root,'config/al-reef.json'),'utf8'));
  const output=buildCore(fs.readFileSync(path.join(root,'src/policy.ts'),'utf8'),configuration);
  const target=path.join(root,'candidate/alreef-core.ts');
  if(check) {if(fs.readFileSync(target,'utf8')!==output)throw new Error('Generated core drift');}
  else fs.writeFileSync(target,output);
  console.log(JSON.stringify({status:check?'checked':'generated',path:target,enabledLocales:configuration.enabledLocales,installed:false}));
}
