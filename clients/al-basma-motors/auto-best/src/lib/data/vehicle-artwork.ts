export const vehicleArtwork={
  silver:{src:'/dealer/stock/cmtl6wllu000up1mcmlq0al57/1.webp',width:1200,height:800,bounds:[0,0,1200,800]},
  graphite:{src:'/dealer/stock/cmtl6pxpd000qp1mcvd0b9ktz/1.webp',width:1200,height:800,bounds:[0,0,1200,800]},
  gclass:{src:'/dealer/stock/cmqev42oy00i8p13h9qatx95x/1.webp',width:1200,height:800,bounds:[0,0,1200,800]},
  urus:{src:'/dealer/stock/cmtfwz86o011dp1we5d9fkdvp/1.webp',width:1200,height:800,bounds:[0,0,1200,800]},
  golf:{src:'/dealer/stock/cmte58re000ykp1we0fkcsw8e/1.webp',width:1200,height:800,bounds:[0,0,1200,800]},
  a45:{src:'/dealer/stock/cmtb7oa3k00rsp1weiw6cwm9m/1.webp',width:1200,height:800,bounds:[0,0,1200,800]},
  porsche:{src:'/dealer/stock/cmt6yyshu00ljp1wewaxpucal/1.webp',width:1200,height:800,bounds:[0,0,1200,800]},
  amggt:{src:'/dealer/stock/cmt4d2ajl00gsp1wehldp9v1e/1.webp',width:1200,height:800,bounds:[0,0,1200,800]},
  m5:{src:'/dealer/stock/cmt4czt2400gqp1weg7ck3qba/1.webp',width:1200,height:800,bounds:[0,0,1200,800]},
  e63:{src:'/dealer/stock/cms38d0r90058p1a10q2alud6/1.webp',width:1200,height:800,bounds:[0,0,1200,800]},
  m4:{src:'/dealer/stock/cmtl6wllu000up1mcmlq0al57/1.webp',width:1200,height:800,bounds:[0,0,1200,800]},
  rs5:{src:'/dealer/stock/cmtl6pxpd000qp1mcvd0b9ktz/1.webp',width:1200,height:800,bounds:[0,0,1200,800]}
} as const; export type Vehicle=keyof typeof vehicleArtwork; export const heroVehiclePairs={home:['gclass','urus'],inventory:['golf','a45'],about:['porsche','amggt'],blog:['m5','e63'],contact:['m4','rs5']} as const satisfies Record<string,readonly[Vehicle,Vehicle]>; export type HeroVehiclePair=keyof typeof heroVehiclePairs;
