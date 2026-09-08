import fs from 'node:fs/promises';
const path='src/pages/index.svelte';let code=await fs.readFile(path,'utf8');
code=code.replace('class="header header-2"','class="header header-2 header-contained"');
const topStart=code.indexOf('      <div class="header-top">');const topEnd=code.indexOf('      <div class="main-navigation">',topStart);
if(topStart<0||topEnd<0)throw new Error('Header boundaries missing');
code=code.slice(0,topStart)+`      <div class="header-top">
        <div class="container">
          <div class="header-top-wrap">
            <a href="tel:+359877733110"><i class="far fa-phone-volume" aria-hidden="true"></i> 0877 733 110</a>
            <span>София<span class="header-location-detail"> · Студентски град</span></span>
            <span class="header-appointment">Оглед по уговорка</span>
          </div>
        </div>
      </div>

`+code.slice(topEnd);
const heroStart=code.indexOf('      <div class="hero-section hs-1 hs-1-1">');const heroEnd=code.indexOf('      <div class="booking-form ng-mt">',heroStart);
if(heroStart<0||heroEnd<0)throw new Error('Hero boundaries missing');
let hero=code.slice(heroStart,heroEnd).replace('hero-section hs-1 hs-1-1','hero-section hs-1 hs-1-1 hero-centered');
hero=hero.replace(/        <div class="hero-shape">[^\n]*<\/div>\r?\n/,'').replace(/            <div class="shape">[^\n]*<\/div>\r?\n/g,'');
hero=hero.replace(/\s*<h4 class="hero-sub-title"[^>]*>[\s\S]*?<\/h4>/g,'').replace(/\s*<p data-animation="fadeInUp"[^>]*>[\s\S]*?<\/p>/g,'').replace(/\s*<div class="hero-btn"[^>]*>[\s\S]*?<\/div>/g,'');
await fs.writeFile(path,code.slice(0,heroStart)+hero+code.slice(heroEnd));
