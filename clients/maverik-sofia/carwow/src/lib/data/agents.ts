export interface Agent {
  slug: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  image: string;
  rating: number;
  sales: number;
  bio: string;
}

export const agents: Agent[] = [];

export function getAgentBySlug(slug: string) {
  return agents.find((agent) => agent.slug === slug);
}
