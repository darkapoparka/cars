export const vehicleArtwork={
  silver:{src:'/dealer/stock/1.jpg',width:1200,height:800,bounds:[0,0,1200,800]},
  graphite:{src:'/dealer/stock/2.jpg',width:1200,height:800,bounds:[0,0,1200,800]},
  gclass:{src:'/dealer/stock/3.jpg',width:1200,height:800,bounds:[0,0,1200,800]},
  urus:{src:'/dealer/stock/4.jpg',width:1200,height:800,bounds:[0,0,1200,800]},
  golf:{src:'/dealer/stock/5.jpg',width:1200,height:800,bounds:[0,0,1200,800]},
  a45:{src:'/dealer/stock/6.jpg',width:1200,height:800,bounds:[0,0,1200,800]},
  porsche:{src:'/dealer/stock/7.jpg',width:1200,height:800,bounds:[0,0,1200,800]},
  amggt:{src:'/dealer/stock/8.jpg',width:1200,height:800,bounds:[0,0,1200,800]},
  m5:{src:'/dealer/stock/9.jpg',width:1200,height:800,bounds:[0,0,1200,800]},
  e63:{src:'/dealer/stock/10.jpg',width:1200,height:800,bounds:[0,0,1200,800]},
  m4:{src:'/dealer/stock/1.jpg',width:1200,height:800,bounds:[0,0,1200,800]},
  rs5:{src:'/dealer/stock/2.jpg',width:1200,height:800,bounds:[0,0,1200,800]}
} as const; export type Vehicle=keyof typeof vehicleArtwork; export const heroVehiclePairs={home:['gclass','urus'],inventory:['golf','a45'],about:['porsche','amggt'],blog:['m5','e63'],contact:['m4','rs5']} as const satisfies Record<string,readonly[Vehicle,Vehicle]>; export type HeroVehiclePair=keyof typeof heroVehiclePairs;
