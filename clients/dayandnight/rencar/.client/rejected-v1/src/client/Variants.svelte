<script>
  import {homeVariants} from './data.js';
  const images=homeVariants.map(home=>`/daynight/variants/home-${home.id}.png`);
</script>
<section class="dn-page-intro"><div class="container"><div class="dn-breadcrumb"><a href="/">Начало</a><span>Варианти</span></div><h1>Една идентичност. <br /><span>Пет първи впечатления.</span></h1><p>Разгледайте петте начални страници на Day & Night. Основният избор е вариант 2.</p></div></section>
<section class="container dn-variants-grid">{#each homeVariants as home (home.id)}<a class="dn-variant-card" href={home.route}><div class:dark={home.id===1||home.id===4}><img src={images[home.id-1]} alt="" width="1000" height="667" /><span>0{home.id}</span></div><section><h2>{home.title}{#if home.id===2}<small>Основен</small>{/if}</h2><p>{home.description}</p><span>Разгледайте вариант {home.id} <i class="far fa-arrow-up-right" aria-hidden="true"></i></span></section></a>{/each}</section>
