<script lang="ts">
  import { resolve } from '$app/paths';
  import { ChevronRight, Phone } from '@lucide/svelte';
  import { daynightTeam, daynightTeamDisclosure } from '$lib/data/daynight-team';
  import { daynightSite } from '$lib/data/daynight-site';
  const teamMembers = daynightTeam.slice(0, 4);
</script>
<div class="team-page">
  <section class="background-light mb-32"><div class="container"><ul class="breadcrumb"><li><a href={resolve('/')}>Начало</a></li><li aria-hidden="true"><ChevronRight size={14}/></li><li><span>Контакт с {daynightSite.shortName}</span></li></ul></div></section>
  <section class="pb-100"><div class="container"><h1>Контакт с {daynightSite.shortName}</h1><p class="team-disclosure">{daynightTeamDisclosure}</p></div><div class="tf-spacing-style3"></div><div class="container mb-40"><div class="cards">
    {#each teamMembers as member (member.slug)}
      <article class="sale-agent-box"><a class="card-top" href={resolve(`/team/${member.slug}`)}><img src={member.image} alt={member.name}/></a><div class="card-bottom"><div><a class="h5" href={resolve(`/team/${member.slug}`)}>{member.name}</a><p>{member.role}</p></div><a class="phone" href={`tel:${member.phone}`} aria-label={`Обади се на ${member.name}`}><Phone size={22}/></a></div></article>
    {/each}
  </div></div></section>
</div>
<style>
.team-page{color:#1c1c1c;font-family:var(--sa-font,'Manrope',ui-sans-serif,system-ui,sans-serif)}.container{width:min(100% - 48px,1320px);margin:0 auto;padding:0 15px}.background-light{background:#f5f7fb}.mb-32{margin-bottom:32px}.mb-40{margin-bottom:40px}.pb-100{padding-bottom:100px}.breadcrumb{display:flex;gap:8px;align-items:center;min-height:54px;padding:0;list-style:none}.breadcrumb a{text-decoration:none;color:inherit}.team-page h1{margin:0;color:#111827;font-size:clamp(32px,3.2vw,48px);line-height:1.08}.team-disclosure{margin-top:12px;color:#667085}.tf-spacing-style3{height:34px}.cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:30px}.sale-agent-box{min-width:0}.card-top{display:block;overflow:hidden;border-radius:18px;background:#f5f7fb}.card-top img{display:block;width:100%;aspect-ratio:1.05;object-fit:contain}.card-bottom{display:flex;align-items:center;justify-content:space-between;gap:16px;padding-top:20px}.h5{font-size:20px;font-weight:600;color:#111827;text-decoration:none}.card-bottom p{margin:4px 0 0;color:#667085}.phone{display:grid;width:44px;height:44px;place-items:center;border:1px solid #d7dce2;border-radius:999px;color:#111827}@media(max-width:1023px){.cards{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:640px){.container{width:min(100% - 24px,1320px);padding:0}.cards{grid-template-columns:1fr;gap:22px}.pb-100{padding-bottom:64px}}
</style>
