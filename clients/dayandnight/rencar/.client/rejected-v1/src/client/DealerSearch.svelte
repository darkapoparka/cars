<script>
  import { vehicles } from './data.js';
  let {compact=false}=$props();
  const makes=[...new Set(vehicles.map(v=>v.make))];
  const bodies=[...new Set(vehicles.map(v=>v.body))];
</script>
<form class:compact class="dn-dealer-search" action="/car.html" method="get">
  <div class="dn-search-heading"><i class="fal fa-car" aria-hidden="true"></i><span>Намерете своя автомобил</span></div>
  <div class="dn-search-fields">
    <label>Марка<select name="make"><option value="">Всички марки</option>{#each makes as make (make)}<option value={make}>{make}</option>{/each}</select></label>
    <label>Тип автомобил<select name="body"><option value="">Всички типове</option>{#each bodies as body (body)}<option value={body}>{body}</option>{/each}</select></label>
    <label>Модел<input type="search" name="q" placeholder="Напр. RS 6, GLE, X6" /></label>
    <button class="theme-btn" type="submit">Разгледай <i class="far fa-arrow-up-right" aria-hidden="true"></i></button>
  </div>
</form>
