import type { VehicleListing } from "@repo/marketplace-domain";
const dealer = { id:"dealer-al-basma-motors", type:"dealer" as const, displayName:"Al Basma Motors", verificationStatus:"unverified" as const, city:"Sharjah" };
const location = { city:"Sharjah", region:"Souq Al Haraj", country:"United Arab Emirates" };
const rows = [
  ["cmtl6wllu000up1mcmlq0al57","Lexus","CT200h","Platinum",2018,"hatchback","hybrid",168000,64000,"/dealer/stock/cmtl6wllu000up1mcmlq0al57/1.webp"],
  ["cmtl6pxpd000qp1mcvd0b9ktz","Lexus","IS300","Platinum",2023,"sedan","gasoline",40000,105000,"/dealer/stock/cmtl6pxpd000qp1mcvd0b9ktz/1.webp"],
  ["cmqev42oy00i8p13h9qatx95x","Lexus","RC-F","5.0",2020,"coupe","gasoline",140000,150000,"/dealer/stock/cmqev42oy00i8p13h9qatx95x/1.webp"],
  ["cmtfwz86o011dp1we5d9fkdvp","Lexus","IS350","F-Sport",2024,"sedan","gasoline",151000,140000,"/dealer/stock/cmtfwz86o011dp1we5d9fkdvp/1.webp"],
  ["cmte58re000ykp1we0fkcsw8e","Lexus","GS250","Platinum",2015,"sedan","gasoline",52000,65000,"/dealer/stock/cmte58re000ykp1we0fkcsw8e/1.webp"],
  ["cmtb7oa3k00rsp1weiw6cwm9m","Lexus","RC350","F-Sport",2021,"coupe","gasoline",120000,80000,"/dealer/stock/cmtb7oa3k00rsp1weiw6cwm9m/1.webp"],
  ["cmt6yyshu00ljp1wewaxpucal","Lexus","ES350","F-Sport",2023,"sedan","gasoline",77000,145000,"/dealer/stock/cmt6yyshu00ljp1wewaxpucal/1.webp"],
  ["cmt4d2ajl00gsp1wehldp9v1e","Lexus","LX570","Signature",2016,"suv","gasoline",228000,175000,"/dealer/stock/cmt4d2ajl00gsp1wehldp9v1e/1.webp"],
  ["cmt4czt2400gqp1weg7ck3qba","Lexus","TX350","Platinum",2024,"suv","gasoline",53000,185000,"/dealer/stock/cmt4czt2400gqp1weg7ck3qba/1.webp"],
  ["cms38d0r90058p1a10q2alud6","Lexus","RX350","Premier",2024,"suv","gasoline",12000,165000,"/dealer/stock/cms38d0r90058p1a10q2alud6/1.webp"]
] as const;
export const leadListings: VehicleListing[] = rows.map((row,index) => ({
  id:`al-basma-${index+1}`, slug:`al-basma-${index+1}`, category:"car", dealerOrgId:dealer.id, status:"active",
  title:`${row[4]} ${row[1]} ${row[2]} ${row[3]}`, description:"Dated public Al Basma listing sample. Confirm availability and specifications directly with the showroom.",
  price:{amount:row[8],currency:"AED"}, priceType:"fixed", images:[{url:row[9],alt:`${row[1]} ${row[2]}`}], badges:["used"], location,
  spec:{make:row[1],model:row[2],trim:row[3],year:row[4],bodyType:row[5],fuelType:row[6],transmission:"automatic",mileageValue:row[7],mileageUnit:"km"},
  seller:dealer, publishedAt:"2026-09-08T12:00:00.000Z", promoted:index<3
}));
