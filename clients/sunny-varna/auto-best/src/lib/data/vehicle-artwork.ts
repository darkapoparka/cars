import { dealer } from './dealer';

// Abstract client-owned decoration; not a photograph of dealer stock or premises.
const artwork={src:dealer.hero,width:1000,height:667,bounds:[0,0,1000,667]} as const;
export const vehicleArtwork={silver:artwork,graphite:artwork,gclass:artwork,urus:artwork,golf:artwork,a45:artwork,porsche:artwork,amggt:artwork,m5:artwork,e63:artwork,m4:artwork,rs5:artwork} as const;
export type Vehicle=keyof typeof vehicleArtwork;
export const heroVehiclePairs={home:['gclass','urus'],inventory:['golf','a45'],about:['porsche','amggt'],blog:['m5','e63'],contact:['m4','rs5']} as const satisfies Record<string,readonly [Vehicle,Vehicle]>;
export type HeroVehiclePair=keyof typeof heroVehiclePairs;
