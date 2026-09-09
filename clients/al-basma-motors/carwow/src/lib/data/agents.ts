export interface Agent { slug:string; name:string; title:string; phone:string; email:string; image:string; rating:number; sales:number; bio:string }
// No invented staff profiles are exposed for this prospect demo.
export const agents:Agent[]=[];
export function getAgentBySlug(slug:string){return agents.find((agent)=>agent.slug===slug)}
