// Dealer listing snapshot normalized from the canonical Cars source pack.
export type CurrentDayNightListing = {
  id: string;
  title: string;
  sourceUrl: string;
  priceEur: string;
  priceBgn: string;
  status: string;
  date: string;
  mileage: string;
  color: string;
  fuel: string;
  power: string;
  transmission: string;
  body: string;
  features: string[];
  image: string;
};

export const currentDayNightListings = [
  {
    "id": "127361913",
    "title": "2008 Acura TL",
    "sourceUrl": "https://www.texasdriveauto.com/details/used-2008-acura-tl/127361913",
    "priceEur": "$4,500",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2008",
    "mileage": "176,729 mi",
    "color": "Gray",
    "fuel": "Gasoline",
    "power": "",
    "transmission": "Automatic 5-Speed",
    "body": "Sedan",
    "features": [],
    "image": "/stock/127361913-1.webp"
  },
  {
    "id": "128538336",
    "title": "2012 Audi Q5 2.0T quattro Premium Plus",
    "sourceUrl": "https://www.texasdriveauto.com/details/used-2012-audi-q5/128538336",
    "priceEur": "$6,500",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2012",
    "mileage": "104,710 mi",
    "color": "",
    "fuel": "Not published",
    "power": "",
    "transmission": "Automatic 8-Speed",
    "body": "SUV",
    "features": [],
    "image": "/media/photo-unavailable.svg"
  },
  {
    "id": "127361925",
    "title": "2013 Audi Q5 2.0T quattro Premium Plus",
    "sourceUrl": "https://www.texasdriveauto.com/details/used-2013-audi-q5/127361925",
    "priceEur": "$6,990",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2013",
    "mileage": "114,512 mi",
    "color": "White",
    "fuel": "Flex Fuel",
    "power": "",
    "transmission": "Automatic 8-Speed",
    "body": "SUV",
    "features": [],
    "image": "/stock/127361925-1.webp"
  },
  {
    "id": "127361924",
    "title": "2018 Audi A4 Premium",
    "sourceUrl": "https://www.texasdriveauto.com/details/used-2018-audi-a4/127361924",
    "priceEur": "$8,990",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2018",
    "mileage": "128,956 mi",
    "color": "",
    "fuel": "Not published",
    "power": "",
    "transmission": "Automatic 7-Speed",
    "body": "Sedan",
    "features": [],
    "image": "/media/photo-unavailable.svg"
  },
  {
    "id": "127361904",
    "title": "2014 BMW X5 xDrive35i",
    "sourceUrl": "https://www.texasdriveauto.com/details/used-2014-bmw-x5/127361904",
    "priceEur": "$7,990",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2014",
    "mileage": "177,873 mi",
    "color": "",
    "fuel": "Not published",
    "power": "",
    "transmission": "Automatic 8-Speed",
    "body": "SUV",
    "features": [],
    "image": "/stock/127361904-1.webp"
  },
  {
    "id": "127361891",
    "title": "2014 Buick Enclave Leather",
    "sourceUrl": "https://www.texasdriveauto.com/details/used-2014-buick-enclave/127361891",
    "priceEur": "$6,990",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2014",
    "mileage": "162,632 mi",
    "color": "",
    "fuel": "Not published",
    "power": "",
    "transmission": "Automatic 6-Speed",
    "body": "Crossover",
    "features": [],
    "image": "/media/photo-unavailable.svg"
  },
  {
    "id": "127361933",
    "title": "2007 Cadillac CTS HI FEATURE V6",
    "sourceUrl": "https://www.texasdriveauto.com/details/used-2007-cadillac-cts/127361933",
    "priceEur": "$4,990",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2007",
    "mileage": "119,529 mi",
    "color": "",
    "fuel": "Not published",
    "power": "",
    "transmission": "Automatic 5-Speed",
    "body": "Sedan",
    "features": [],
    "image": "/media/photo-unavailable.svg"
  },
  {
    "id": "127361883",
    "title": "2018 Cadillac Escalade Standard",
    "sourceUrl": "https://www.texasdriveauto.com/details/used-2018-cadillac-escalade/127361883",
    "priceEur": "$15,990",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2018",
    "mileage": "99,315 mi",
    "color": "",
    "fuel": "Not published",
    "power": "",
    "transmission": "Automatic 10-Speed",
    "body": "SUV",
    "features": [],
    "image": "/media/photo-unavailable.svg"
  }
] satisfies CurrentDayNightListing[];
