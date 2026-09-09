import { daynightSite } from './daynight-site';
export const daynightTeamDisclosure = `Показан е публикуваният бизнес контакт на ${daynightSite.name}, а не профил или портрет на конкретен служител. Имена и роли на служители не са потвърдени.`;
export type DayNightTeamMember = { slug:string; name:string; role:string; phone:string; email:string; image:string; bio:string; detail:string };
export const daynightTeam: DayNightTeamMember[] = [{
 slug:'showroom-contact', name:daynightSite.name, role:'Публикуван контакт на автокъщата', phone:daynightSite.phone, email:daynightSite.email, image:daynightSite.logoDark,
 bio:'Контакт за въпроси по конкретна обява. Текущата наличност, мястото на автомобила и часът за оглед се уточняват директно с дилъра.',
 detail:'Това е бизнес контактът от публичния профил на автокъщата. Не са предоставени потвърдени имена, индивидуални контакти или портрети на служители. Демо формите не резервират автомобил и не потвърждават изпращане на съобщение.'
}];
export const legacyDaynightTeamSlugs: readonly string[] = ['prodazhbi-showroom','barter-i-ocenka','dokumenti-finansirane','klientski-zapitvania','prodazhbi-daynight-auto'];
export const getDayNightTeamMemberBySlug=(slug:string)=>daynightTeam.find(member=>member.slug===slug)??(legacyDaynightTeamSlugs.includes(slug)?daynightTeam[0]:undefined);
