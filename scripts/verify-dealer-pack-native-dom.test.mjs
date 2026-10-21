import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {readDealerPackDom,assessPageSnapshot} from './verify-dealer-pack.mjs';

const stock=JSON.parse(fs.readFileSync(new URL('../dealers/millions-auto-cars/stock.json',import.meta.url),'utf8'));
const record=stock.records.find(row=>row.id==='public-listing-2'),title=record.title,origin='http://127.0.0.1:8787';
const facts={business:{name:'Millions Auto Cars'}},fleet={records:[{slug:'exclusive-auto-varna',names:['Exclusive Auto'],phones:['+359877733110']}]};
const variants=['auto-best','modern','import','app','mobile','karento-best'].map((key,index)=>({key,base:index?'/variant-'+(index+1):'',entry:index?'/variant-'+(index+1)+'/':'/'}));
const manifest={slug:'millions-auto-cars',variants};
const source=file=>fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');

// Small DOM fixture with general compound/descendant/child selector matching.
// Rendered text follows element layout and native details state independently
// of the verifier's traversal and ownership contracts.
function fixture(kind,{width=390}={}) {
  let document;
  const text=value=>({nodeType:3,nodeValue:String(value)});
  const compound=(element,selector)=>{
    for(const match of selector.matchAll(/:not\(([^)]+)\)/g))if(element.matches(match[1]))return false;
    selector=selector.replace(/:not\([^)]+\)/g,'');
    for(const [,name,operator,value]of selector.matchAll(/\[([\w-]+)(?:(\^=|\*=|=)"([^"]*)")?\]/g)){
      const actual=element.getAttribute(name);if(actual===null||operator==='='&&actual!==value||operator==='^='&&!actual.startsWith(value)||operator==='*='&&!actual.includes(value))return false;
    }
    selector=selector.replace(/\[[^\]]+\]/g,'');
    const tag=selector.match(/^[\w-]+|^\*/)?.[0];if(tag&&tag!=='*'&&tag.toUpperCase()!==element.tagName)return false;
    return [...selector.matchAll(/\.([\w-]+)/g)].every(([,name])=>element.className.split(/\s+/).includes(name));
  };
  const matches=(element,selector)=>selector.split(',').some(part=>{
    const tokens=part.trim().replace(/\s*>\s*/g,' > ').split(/\s+/);
    const walk=(node,index)=>{
      if(!node||!compound(node,tokens[index]))return false;
      if(index===0)return true;
      if(tokens[index-1]==='>')return walk(node.parentElement,index-2);
      for(let parent=node.parentElement;parent;parent=parent.parentElement)if(walk(parent,index-1))return true;
      return false;
    };
    return walk(element,tokens.length-1);
  });
  const descendants=node=>node.children.flatMap(child=>[child,...descendants(child)]);
  const rendered=node=>{
    if(node.nodeType===3)return node.nodeValue;
    if(node.style.display==='none'||node.style.visibility==='hidden'||['SCRIPT','STYLE','TEMPLATE','NOSCRIPT'].includes(node.tagName))return '';
    const children=node.tagName==='DETAILS'&&!node.open?node.children.filter(child=>child.tagName==='SUMMARY').slice(0,1):node.childNodes;
    const value=children.map(rendered).join('');
    return node.style.display==='inline'?value:'\n'+value+'\n';
  };
  const make=(tag,attributes={},children=[])=>{
    const node={nodeType:1,tagName:tag.toUpperCase(),attributes,childNodes:children,parentElement:null,
      style:{display:['a','span','strong','b','img'].includes(tag)?'inline':tag==='li'?'list-item':'block',visibility:'visible',opacity:'1'},
      getAttribute:name=>Object.hasOwn(attributes,name)?String(attributes[name]):null,
      getRootNode:()=>document,getBoundingClientRect:()=>({x:0,y:0,width:100,height:30}),getClientRects:()=>[{}],
      complete:true,naturalWidth:100,width:100,height:30,currentSrc:'',
    };
    for(const child of children)child.parentElement=node;
    for(const [name,get]of Object.entries({children:()=>node.childNodes.filter(child=>child.nodeType===1),className:()=>attributes.class??'',id:()=>attributes.id??'',open:()=>Object.hasOwn(attributes,'open'),innerText:()=>rendered(node).trim(),src:()=>attributes.src?new URL(attributes.src,origin).href:'',alt:()=>attributes.alt??''}))Object.defineProperty(node,name,{get,configurable:true});
    node.matches=selector=>matches(node,selector);
    node.closest=selector=>{for(let current=node;current;current=current.parentElement)if(current.matches(selector))return current;return null;};
    node.querySelectorAll=selector=>descendants(node).filter(child=>child.matches(selector));
    node.querySelector=selector=>node.querySelectorAll(selector)[0]??null;
    return node;
  };
  const photo=make('img',{src:record.images[0],alt:title}),heading=make(kind==='related'?'strong':kind==='import-mobile'?'h2':'h3',kind==='signature-mobile'?{class:'mobile-vehicle-title'}:{},[text(title)]);
  let card,link,factList;
  if(kind==='related'){
    link=card=make('a',{class:'dn-detail-related-card',href:'/en/listing-detail-v1/2'},[photo,make('span',{},[heading,text(' '),make('b',{},[text('£9,000')])])]);
  }else if(kind==='import-mobile'){
    factList=make('ul',{'aria-label':'Vehicle specifications'},[make('li',{},[text('2019')]),make('li',{},[text('Electric')])]);
    link=card=make('a',{class:'mobile-vehicle-card',href:'/variant-3/en/inventory/public-listing-2'},[make('div',{class:'mobile-vehicle-card__image'},[photo]),make('div',{class:'mobile-vehicle-card__body'},[heading,make('p',{},[text('£9,000')]),factList])]);
  }else if(kind==='discovery'){
    link=make('a',{href:'/variant-6/vehicle?id=public-listing-2&lang=en','aria-label':'View '+title},[make('div',{class:'car-photo'},[photo]),make('div',{class:'car-copy'},[heading,make('p',{class:'car-meta'},[text('2019 · 30,000 km')]),make('p',{class:'car-price'},[text('£9,000')])])]);
    card=make('article',{class:'discovery-card'},[link]);
  }else{
    assert.equal(kind,'signature-mobile');
    link=make('a',{class:'mobile-vehicle-link',href:'/variant-6/vehicle?id=public-listing-2&lang=en','aria-label':'View '+title},[make('div',{class:'mobile-vehicle-summary'},[heading]),make('p',{class:'mobile-vehicle-price'},[text('£9,000')])]);
    factList=make('ul',{class:'mobile-vehicle-facts','aria-label':'Vehicle facts'},[make('li',{},[make('span',{class:'visually-hidden'},[text('Mileage: ')]),text('30,000 km')])]);
    card=make('article',{class:'mobile-vehicle-card background-card'},[make('div',{class:'mobile-vehicle-photo'},[photo]),make('div',{class:'mobile-vehicle-copy'},[link]),factList]);
  }
  const summary=make('summary',{},[make('h6',{},[text('Explore')])]),hiddenLink=make('a',{href:'/variant-6/about'},[text('Home Vehicles About Us')]);
  const details=make('details',{class:'responsive-disclosure',...(kind==='signature-mobile'?{}:{open:''})},[summary,make('ul',{},[make('li',{},[hiddenLink])])]);
  const footer=make('footer',{},[details,make('p',{},[text('Listing snapshot. Confirm current availability with the dealer.')])]);
  const body=make('body',{},[make('h1',{},[text('Millions Auto Cars')]),card,footer]);
  document={body,title:'Millions Auto Cars',documentElement:{scrollWidth:width},querySelectorAll:selector=>[body,...descendants(body)].filter(node=>node.matches(selector))};
  const url=origin+(kind==='related'?'/en/listing-detail-v1/1':kind==='import-mobile'?'/variant-3/en/inventory':'/variant-6/vehicles?lang=en');
  const read=()=>vm.runInNewContext('('+readDealerPackDom.toString()+')()',{document,location:{href:url},innerWidth:width,URL,getComputedStyle:node=>node.style});
  const assess=()=>assessPageSnapshot({snapshot:{...read(),status:200,contentType:'text/html'},facts,stock,manifest,variant:variants[kind==='related'?0:kind==='import-mobile'?2:5],fleet});
  return {read,assess,make,text,body,card,link,photo,heading,factList,summary,details,hiddenLink,footer,document};
}

for(const [kind,file,patterns,owner]of [
  ['related','templates/auto-best/src/routes/listing-detail-v1/[id]/+page.svelte',[/<a class="dn-detail-related-card"/,/<strong>\{vehicle\.title\}<\/strong>/],'auto-best'],
  ['import-mobile','templates/import/src/lib/components/common/MobileVehicleCard.svelte',[/class="mobile-vehicle-card"/,/class="mobile-vehicle-card__body"/,/<h2>\{card\.title\}<\/h2>/],'import'],
  ['discovery','templates/karento-best/src/lib/discovery/DiscoveryCard.svelte',[/<article class="discovery-card">/,/class="car-copy"/,/<h3 title=\{car\.title\}>\{car\.title\}<\/h3>/],'signature'],
])test('real '+kind+' markup binds the complete sourced title, native route and photograph',()=>{
  for(const pattern of patterns)assert.match(source(file),pattern);
  for(const width of kind==='discovery'?[320,390]:[390]){
    const f=fixture(kind,{width}),snapshot=f.read();
    assert.equal(snapshot.identityContext.status,'complete');
    assert.equal(snapshot.identityContext.segments.find(row=>row.channel==='vehicle-title')?.vehicleOwner,owner);
    assert(snapshot.text.includes(title),'The entire source title remains observed');
    assert.deepEqual(f.assess().leaks,[]);
    assert.equal(snapshot.images[0].vehicleOwner,owner);
    f.link.attributes.href='/variant-6/vehicle?id=other-record';assert(f.assess().leaks.some(row=>row.type==='name'),'A native-looking card must still bind the same source record');
  }
});

test('closed responsive footer disclosures preserve exact mobile text coverage and existing title ownership',()=>{
  assert.match(source('templates/karento-best/src/lib/components/ResponsiveDisclosure.svelte'),/<details[^>]+open=\{wide\.current\}>/);
  const f=fixture('signature-mobile'),snapshot=f.read();
  assert.equal(snapshot.identityContext.status,'complete');
  assert(snapshot.text.includes(title));assert(!snapshot.text.includes('Home Vehicles About Us'));
  assert.equal(snapshot.identityContext.segments.find(row=>row.channel==='vehicle-title')?.vehicleOwner,'signature-mobile');
  assert.deepEqual(f.assess().leaks,[]);
  f.details.attributes.open='';assert.equal(f.read().identityContext.status,'complete');assert(f.read().text.includes('Home Vehicles About Us'));
  f.hiddenLink.childNodes[0].nodeValue='Exclusive Auto';assert(f.assess().leaks.some(row=>row.context.channel==='body'),'Opened disclosure copy retains the strict branding check');
  delete f.details.attributes.open;f.summary.children[0].childNodes[0].nodeValue='Exclusive Auto';assert(f.assess().leaks.some(row=>row.context.channel==='body'),'A closed disclosure summary is visible branding');
});

test('native card selectors cannot hide changed titles, wrong photos, page metadata or ordinary branding',()=>{
  for(const kind of ['related','import-mobile','discovery','signature-mobile']){
    const f=fixture(kind);assert.deepEqual(f.assess().leaks,[]);
    f.heading.childNodes[0].nodeValue=title+' from Exclusive Auto';assert(f.assess().leaks.some(row=>row.type==='name'));f.heading.childNodes[0].nodeValue=title;
    f.photo.attributes.src='/dealer-stock/public-1.jpg';assert(f.assess().leaks.some(row=>row.context.channel==='image-alt'));f.photo.attributes.src=record.images[0];
    f.document.title='Exclusive Auto';assert(f.assess().leaks.some(row=>row.context.channel==='metadata'));f.document.title='Millions Auto Cars';
    const foreign=f.make('p',{},[f.text('Exclusive Auto')]);foreign.parentElement=f.footer;f.footer.childNodes.push(foreign);
    assert(f.assess().leaks.some(row=>row.context.channel==='body'));f.footer.childNodes.pop();
    const phone=f.make('a',{href:'tel:+359877733110'},[f.text('Call us')]);phone.parentElement=f.footer;f.footer.childNodes.push(phone);
    assert(f.assess().leaks.some(row=>row.type==='phone'));
  }
});

test('unexpected nested title markup and any unaccounted visible text retain strict fallback',()=>{
  const f=fixture('discovery'),foreign=f.make('a',{href:'https://foreign.example/'},[f.text('Exclusive Auto')]);
  foreign.parentElement=f.heading;f.heading.childNodes.push(foreign);
  assert.equal(f.read().identityContext.status,'unavailable');assert(f.assess().leaks.some(row=>row.type==='name'));
  f.heading.childNodes.pop();const original=f.body.innerText;
  Object.defineProperty(f.body,'innerText',{get:()=>original+'\nUnaccounted visible footer content'});
  assert.equal(f.read().identityContext.status,'incomplete');assert(f.assess().leaks.some(row=>row.context.owner==='whole observed text (strict fallback)'));
});
