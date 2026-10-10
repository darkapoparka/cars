import sharp from 'sharp';
const samples = [
  ['26-sell',{left:96,top:1600,width:1088,height:600}],
  ['17-home',{left:250,top:2120,width:280,height:90}],
];
for (const [file,rect] of samples) {
  const {data,info}=await sharp('reference/android/'+file+'.png').extract(rect).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const counts=new Map();
  for(let i=0;i<data.length;i+=info.channels){
    const [r,g,b]=data.subarray(i,i+3);
    if((b>r&&b>g&&r<150&&g<100)||(g>r&&g>b&&g<170)){
      const key=[r,g,b].join(',');counts.set(key,(counts.get(key)||0)+1);
    }
  }
  console.log(file,[...counts].sort((a,b)=>b[1]-a[1]).slice(0,8));
}
