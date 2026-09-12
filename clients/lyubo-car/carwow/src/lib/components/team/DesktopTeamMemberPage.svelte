<script lang="ts">
  import { resolve } from '$app/paths';
  import { ChevronRight, MapPin, Phone } from '@lucide/svelte';
  import type { DayNightTeamMember } from '$lib/data/daynight-team';
  import { daynightTeamDisclosure } from '$lib/data/daynight-team';
  import { daynightSite } from '$lib/data/daynight-site';
  let { member }: { member: DayNightTeamMember } = $props();
</script>
<div class="team-member-page">
  <section class="background-light"><div class="container"><ul class="breadcrumb"><li><a href={resolve('/')}>Начало</a></li><li aria-hidden="true"><ChevronRight size={14}/></li><li><a href={resolve('/team')}>Бизнес контакт</a></li><li aria-hidden="true"><ChevronRight size={14}/></li><li>{member.name}</li></ul></div></section>
  <section class="profile"><div class="container profile-grid"><div class="portrait"><img src={member.image} alt={member.name}/></div><div><p class="eyebrow">Контакт на автокъщата</p><h1>{member.name}</h1><p class="disclosure">{daynightTeamDisclosure}</p><h2>{member.role}</h2><p>{member.bio}</p><p>{member.detail}</p><div class="actions"><a href={`tel:${member.phone}`}><Phone size={20}/> {daynightSite.phoneLabel}</a><a href={daynightSite.mapUrl} target="_blank" rel="noreferrer"><MapPin size={20}/> Местоположение</a></div></div></div></section>
</div>
<style>
.team-member-page{font-family:var(--sa-font,'Manrope',ui-sans-serif,system-ui,sans-serif);color:#1c1c1c}.container{width:min(100% - 48px,1120px);margin:0 auto}.background-light{background:#f5f7fb}.breadcrumb{display:flex;flex-wrap:wrap;gap:8px;align-items:center;min-height:54px;padding:0;list-style:none}.breadcrumb a{color:inherit;text-decoration:none}.profile{padding:56px 0 100px}.profile-grid{display:grid;grid-template-columns:minmax(260px,420px) 1fr;gap:56px;align-items:start}.portrait{overflow:hidden;border-radius:20px;background:#f5f7fb}.portrait img{display:block;width:100%;aspect-ratio:4/5;object-fit:contain}.eyebrow{margin:0 0 10px;color:#667085;text-transform:uppercase;letter-spacing:.08em}.team-member-page h1{margin:0;font-size:clamp(34px,4vw,54px);line-height:1.05}.team-member-page h2{margin:26px 0 10px;font-size:20px}.disclosure{color:#667085}.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}.actions a{display:inline-flex;gap:8px;align-items:center;min-height:46px;padding:0 16px;border:1px solid #d8dde3;border-radius:999px;color:#111827;text-decoration:none}@media(max-width:760px){.container{width:min(100% - 24px,1120px)}.profile-grid{grid-template-columns:1fr;gap:28px}.profile{padding:32px 0 72px}.portrait{max-width:420px}}
</style>
