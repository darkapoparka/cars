import { daynightTeam } from './daynight-team';

export interface Agent {slug:string;name:string;title:string;phone:string;email:string;image:string;rating:number;sales:number;bio:string}
// The retained profile presentation is used for enquiry topics, not staff or sales claims.
export const agents:Agent[]=daynightTeam.map(member=>({
  slug:member.slug,name:member.name,title:member.role,phone:member.phone,email:member.email,
  image:member.image,rating:0,sales:0,bio:member.bio+' Няма публикувана оценка или данни за реализирани продажби.'
}));
export function getAgentBySlug(slug:string){
  return agents.find(agent=>agent.slug===slug)??(slug==='prodazhbi-daynight-auto'?agents[0]:undefined);
}
