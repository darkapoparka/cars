import fs from 'node:fs';import vm from 'node:vm';
const text=fs.readFileSync('karento/static/assets/js/main.js','utf8');let current='';const configs={};
const dollar=selector=>({length:0,each(fn){current=selector;fn.call({});}});
vm.runInNewContext(text.slice(text.indexOf("  $('.swiper-group-8')"),text.indexOf('  //Dropdown selected item')),{ $:dollar, Swiper:function(node,options){configs[typeof node==='string'?node:current]=options;return {}}});
fs.writeFileSync('src/lib/slider-config.json',JSON.stringify(configs,null,2));
const pkg=JSON.parse(fs.readFileSync('package.json'));pkg.engines={node:'26.10.0'};fs.writeFileSync('package.json',JSON.stringify(pkg,null,2));
