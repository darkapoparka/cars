/** Restore reviewed native presentation contracts without changing dealer facts. */
import {createHash} from 'node:crypto';
export const FAMILY_NODE = Object.freeze({'auto-best':'22.23.2',modern:'22.23.2',import:'24.21.0',app:'22.23.2',mobile:'22.23.2','karento-best':'24.21.0'});
const sha = text => createHash('sha256').update(text).digest('hex');
function once(text, before, after) {
  if (text.split(before).length !== 2) throw Error('Native presentation boundary changed: '+before.slice(0,70));
  return text.replace(before, after);
}
export function repairDealerTemplateContracts(files) {
  const inventory='auto-best/src/lib/data/inventory.ts';
  const wordmark='modern/packages/marketplace-ui/components/dealer-mobile-brand-bar.tsx';
  const pending=new Map(), receipts=[];
  for(const name of [inventory,wordmark]) {
    if(!files.has(name)) throw Error('Missing native contract: '+name);
    const input=files.get(name), source=String(input).replace(/\r\n/g,'\n');let output=source;
    if(name===inventory) {
      const boundary="export const formatVehiclePrice = (\n  amount: number,\n  locale: Locale = localeContract.defaultLocale\n) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');\n";
      if(!source.endsWith(boundary)||source.includes('export const formatVehiclePriceLabel')) throw Error('Auto Best generated inventory boundary changed');
      output=once(output,'  make: string;\n  title: string;', '  make: string;\n  cardBrand?: string;\n  cardNote?: Partial<Record<Locale, string>>;\n  title: string;');
      output+='\n/** Native price wrapping; no changes to amounts, currency, or grouping. */\nexport const formatVehiclePriceLabel = (amount: number, locale: Locale = localeContract.defaultLocale) =>\n  formatVehiclePrice(amount, locale).replace(/([A-Z]{3}|\\p{Sc})\\s+/u, \'$1 \').replace(/\\s+([A-Z]{3}|\\p{Sc})$/u, \' $1\');\n';
      const stock=/export const featuredVehicles: Vehicle\[\] = (\[\n[\s\S]*?\n\]);/;
      const before=source.match(stock)?.[1],after=output.match(stock)?.[1];
      if(!before||before!==after||!Array.isArray(JSON.parse(before))) throw Error('Dealer stock was changed');
    } else {
      output=once(output,'function DealerMobileWordmark({\n  clean,','function DealerMobileWordmark({\n  logoSource,\n  clean,');
      output=once(output,'  clean: boolean;\n  wordmarkTone: WordmarkTone;','  logoSource: string;\n  clean: boolean;\n  wordmarkTone: WordmarkTone;');
      output=once(output,'<DealerMobileWordmark clean={clean} wordmarkTone={wordmarkTone} />','<DealerMobileWordmark logoSource={logoSource} clean={clean} wordmarkTone={wordmarkTone} />');
      if(!output.includes('const logoSource = useOnLight ? leadSite.logoOnLight : leadSite.logoOnDark;'))throw Error('Native logo contrast policy changed');
    }
    pending.set(name,Buffer.isBuffer(input)?Buffer.from(output):output);
    receipts.push({path:name,beforeSha256:sha(input),afterSha256:sha(output),factsPreserved:true});
  }
  for(const [name,bytes]of pending)files.set(name,bytes);
  return {schemaVersion:1,kind:'native-presentation-contract-repair',changes:receipts,templateMastersChanged:false};
}
