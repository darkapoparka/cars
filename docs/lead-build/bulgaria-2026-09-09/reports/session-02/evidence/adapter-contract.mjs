
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const imported=await import(pathToFileURL('J:/cars/templates/modern/node_modules/typescript/lib/typescript.js'));
const ts=imported.default ?? imported;
const input=JSON.parse(fs.readFileSync(0,'utf8'));
const report={method:'Executed isolated catalogue adapters in memory against their exact application JSON; no app server, bundler, browser, network or output files.',node:process.version,typescript:ts.version,results:[],errors:[]};
function loadModule(source,dealer){
  const result=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true},reportDiagnostics:true});
  const errors=(result.diagnostics ?? []).filter(d=>d.category===ts.DiagnosticCategory.Error);
  assert.equal(errors.length,0,'Adapter transpilation diagnostics');
  const module={exports:{}};
  const context=vm.createContext({module,exports:module.exports,require:(id)=>{assert.ok(id.endsWith('/dealer-stock.json'),'Only the assigned JSON input may be imported');return structuredClone(dealer);}});
  vm.runInContext(result.outputText,context,{timeout:1500});
  return module.exports;
}
for(const test of input){
  try{
    const {slug,key,dealer,source}=test; const exports=loadModule(source,dealer);
    const rows=key==='auto-best' ? exports.featuredVehicles : key==='modern' ? exports.mockListings : exports.cars;
    assert.equal(rows.length,dealer.inventory.length); assert.equal(rows.length,8);
    let notes=0;
    for(let i=0;i<rows.length;i++){
      const source=dealer.inventory[i]; const row=rows[i];
      const id=key==='auto-best' ? row.sourceId : key==='modern' ? row.id : row.lot;
      const price=key==='modern' ? row.price.amount : key==='auto-best' ? row.priceEur : row.price;
      const mileage=key==='modern' ? row.spec.mileageValue : key==='auto-best' ? row.mileageKm : row.mileageValue;
      const url=key==='auto-best' ? row.evidenceUrl : row.sourceUrl;
      assert.equal(id,source.id); assert.equal(price,source.price); assert.equal(mileage,source.mileage); assert.equal(url,source.sourceUrl);
      assert.ok(Number.isFinite(price)&&price>0);
      const note=key==='auto-best' ? row.description : row.description;
      assert.ok(note.includes(source.note));
      if(key==='modern'){
        assert.equal(row.price.currency,'EUR'); assert.equal(row.seller.verificationStatus,'unverified'); assert.equal(row.seller.displayName,dealer.name);
        assert.equal(row.spec.mileageUnit,'km'); assert.equal(row.promoted,false); assert.ok(!row.monthlyEstimate);
        assert.equal(row.images[0].url,source.image);
        if(source.fuel==='Газ')assert.equal(row.spec.fuelType,'lpg');
      } else if(key==='auto-best'){
        assert.equal(row.verification,'sample'); assert.equal(row.image,source.image);
        assert.equal(row.href,`/listing-detail-v1/${i+1}`);
      } else {
        assert.equal(row.image,source.image); assert.equal(exports.getDayNightVehicleBySlug(row.slug),row);
        assert.equal(exports.getDayNightVehicleAvailability(row),source.sourceStatus==='incoming'?'incoming':'unknown');
        assert.equal(exports.getDayNightVehicleCondition(row),'used');
      }
      notes++;
    }
    if(key==='auto-best'){
      assert.equal(exports.formatVehiclePrice(null),'Цена при запитване'); assert.equal(exports.formatVehiclePrice(0),'Цена при запитване');
    }
    report.results.push({slug,key,records:rows.length,originalAdLinks:rows.length,notesPreserved:notes,checks:'cardinality, IDs, source URLs, actual prices/EUR/km, dealer identity, source status, no false verification, no monthly estimates',passed:true});
  }catch(error){report.errors.push({slug:test.slug,key:test.key,message:error.message,stack:error.stack?.split('\n').slice(0,4)});}
}
process.stdout.write(JSON.stringify(report));process.exitCode=report.errors.length?1:0;
