import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import ts from 'typescript';
const source=path.resolve('.qa/native-resource-reference/res/raw');
const target=path.resolve('src/lib/native-data');fs.mkdirSync(target,{recursive:true});
const load=name=>JSON.parse(fs.readFileSync(path.join(source,name),'utf8'));
const old=ts.transpileModule(fs.readFileSync('src/lib/filter-fields.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {filterSections}=await import('data:text/javascript;base64,'+Buffer.from(old).toString('base64'));
const byLabel=new Map(filterSections.flatMap(group=>group.fields).map(field=>[field.label,field.id]));
const aliases={any_used_quality_seal:'approved',used_car_seal:'programme',make_models:'make',category:'body',latitude_longitude:'location',exterior_colour:'color',first_registration:'year',fuel_type:'fuel',cubic_capacity:'capacity',fuel_tank_volume:'tank',cylinder:'cylinders',net_weight:'weight',seller_rating:'rating',seller_type:'seller',online_since:'online',previous_owners:'owners',frame_height:'frameSize',number_of_gears:'gears',ebike_battery_capacity_select:'batteryCapacity',leasing_rate:'leaseRate'};
const kinds={RANGE:'range',SINGLE_SELECT:'single',FREE_TEXT:'text',LOCATION:'location',MAKE_MODEL:'make'};
const keys=['car','motorbike','ebike','motorhome','truck_over_7500','van_up_to_7500','trailer','semi_trailer','semi_trailer_truck','bus','agricultural','construction_machine','forklift_truck'];
const definitions={};const provenance=[];
for(const category of keys){
 const filters=load('filters_'+category+'.json');const groups=load('categories_'+category+'.json');const map=new Map(filters.map(f=>[f.id,f]));
 definitions[category]=groups.map(group=>({title:group.label,constraint:group.constraint,fields:group.attributes.map(attr=>{
  const raw=map.get(attr.id);if(!raw)throw Error('Missing definition '+category+' '+attr.id);
  const values=raw.values||[];const power=raw.id==='power';
  const numbers=values.map(v=>power?String(Math.round(Number(v.value)*1.3596216173)):v.value).filter(v=>/^\d+(\.\d+)?$/.test(v));
  const kind=raw.type==='MULTI_SELECT'?(values.length===1?'toggle':undefined):kinds[raw.type];
  const id=aliases[raw.id]||byLabel.get(raw.label)||raw.id.replace(/_([a-z])/g,(_,c)=>c.toUpperCase());
  return {id,nativeId:raw.id,label:raw.label,kind,constraint:attr.constraint,unit:power?'hp':raw.unit==='EUR'?'€':raw.unit==='ccm'?'cm³':raw.unit,options:kind==='range'?undefined:values.map(v=>v.label),optionValues:values.map(v=>v.value),rangeChoices:kind==='range'?[...new Set(numbers)].sort((a,b)=>Number(a)-Number(b)):undefined,powerKwChoices:power?values.map(v=>v.value):undefined,max:kind==='range'?Math.max(1,...numbers.map(Number)):undefined,includeAny:raw.type==='SINGLE_SELECT'};
 })}));
 for(const name of ['filters_'+category+'.json','categories_'+category+'.json'])provenance.push({name,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(source,name))).digest('hex')});
 console.log('FILTERS',category,definitions[category].reduce((count,g)=>count+g.fields.length,0));
}
fs.writeFileSync(path.join(target,'filter-definitions.json'),JSON.stringify(definitions,null,2)+'\n');
const carMakes=load('makes_for_car').makes;const models={};
for(const make of carMakes){
 const records=load('models_for_make_'+make.i).models;
 models[make.n]=records.filter(model=>!model.p).map(model=>({name:model.n,children:model.g?records.filter(child=>child.p===model.i).map(child=>child.n):[]}));
}
fs.writeFileSync(path.join(target,'car-models.json'),JSON.stringify(models,null,2)+'\n');
const makes={};for(const category of keys)makes[category]=load('makes_for_'+(category === 'agricultural' ? 'agriculturalvehicle' : category.replaceAll('_',''))).makes.map(make=>({id:make.i,name:make.n}));
fs.writeFileSync(path.join(target,'makes.json'),JSON.stringify(makes,null,2)+'\n');
fs.writeFileSync(path.join(target,'checklist.json'),JSON.stringify(load('checklist_car.json'),null,2)+'\n');
fs.writeFileSync(path.join(target,'countries.json'),JSON.stringify(load('countries'),null,2)+'\n');
fs.mkdirSync('reference/android/pass4',{recursive:true});
fs.writeFileSync('reference/android/pass4/resource-provenance.json',JSON.stringify({package:'de.mobile.android.app',version:'10.26 (1707)',apkSha256:crypto.createHash('sha256').update(fs.readFileSync('reference/android/mobile-de-10.26.apk')).digest('hex'),at:new Date().toISOString(),inputs:provenance,carMakes:carMakes.length,modelRows:Object.values(models).flat().reduce((n,g)=>n+1+g.children.length,0)},null,2)+'\n');
console.log('CAR_TAXONOMY',carMakes.length,Object.values(models).flat().reduce((n,g)=>n+1+g.children.length,0));
