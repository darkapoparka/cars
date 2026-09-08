import fs from 'node:fs/promises';
const file='src/pages/index.svelte';
let code=await fs.readFile(file,'utf8');
const start=code.indexOf('      <div class="about-area py-120">');
const end=code.indexOf('      <div class="car-type-area bg py-90">',start);
if(start<0||end<0)throw new Error('Expected original Home 1 About boundaries missing');
const replacement=`      <section class="about-area about-centered py-120" aria-labelledby="about-heading">
        <div class="container">
          <div class="site-heading mb-3">
            <span class="site-title-tagline"><i class="far fa-car" aria-hidden="true"></i> За нас</span>
            <h3 class="site-title" id="about-heading">Автомобили и услуги от <span>Day &amp; Night</span></h3>
          </div>
          <p class="about-text">Разгледайте колекцията или обсъдете продажба, бартер и внос по заявка.</p>
          <div class="about-content">
            <div class="about-item">
              <div class="icon"><img src="/assets/img/icon/car-book.svg" alt=""></div>
              <div class="content">
                <h4>Вижте колекцията</h4>
                <p>Разгледайте автомобилите с удобни филтри.</p>
              </div>
            </div>
            <div class="about-item">
              <div class="icon"><img src="/assets/img/icon/money.svg" alt=""></div>
              <div class="content">
                <h4>Продажба или бартер</h4>
                <p>Получете оценка за продажба или бартер.</p>
              </div>
            </div>
            <div class="about-item">
              <div class="icon"><img src="/assets/img/icon/car-time.svg" alt=""></div>
              <div class="content">
                <h4>Внос по заявка</h4>
                <p>Споделете модел и бюджет за внос по заявка.</p>
              </div>
            </div>
          </div>
          <div class="about-action">
            <a href="/about.html" class="theme-btn">Повече за нас<i class="fas fa-arrow-right" aria-hidden="true"></i></a>
          </div>
        </div>
      </section>

      `;
await fs.writeFile(file,code.slice(0,start)+replacement+code.slice(end));
