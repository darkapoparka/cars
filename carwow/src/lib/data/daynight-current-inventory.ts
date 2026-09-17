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
    "id": "965722",
    "title": "2025 Mercedes-Benz CLA250 Premium + 2.0L",
    "sourceUrl": "https://www.dubicars.com/2025-mercedes-benz-cla250-premium-20l-965722.html",
    "priceEur": "AED 95,000",
    "priceBgn": "",
    "status": "Advertised; confirmation required",
    "date": "2025",
    "mileage": "22,000 km",
    "color": "Brown",
    "fuel": "Petrol",
    "power": "",
    "transmission": "Automatic",
    "body": "Sedan",
    "features": [
      "American specification"
    ],
    "image": "/variant-3/dealer/inventory/965722-1.webp"
  },
  {
    "id": "1005647",
    "title": "2023 Nissan Rogue Platinum",
    "sourceUrl": "https://www.dubicars.com/2023-nissan-rogue-1005647.html",
    "priceEur": "AED 45,000",
    "priceBgn": "",
    "status": "Advertised; confirmation required",
    "date": "2023",
    "mileage": "56,000 km",
    "color": "Grey",
    "fuel": "Petrol",
    "power": "",
    "transmission": "Automatic",
    "body": "SUV/Crossover",
    "features": [
      "American specification"
    ],
    "image": "/variant-3/dealer/inventory/1005647-1.webp"
  },
  {
    "id": "1010924",
    "title": "2011 Toyota Prado TX-L",
    "sourceUrl": "https://www.dubicars.com/2011-toyota-prado-1010924.html",
    "priceEur": "AED 56,000",
    "priceBgn": "",
    "status": "Advertised; confirmation required",
    "date": "2011",
    "mileage": "212,000 km",
    "color": "White",
    "fuel": "Petrol",
    "power": "",
    "transmission": "Automatic",
    "body": "SUV/Crossover",
    "features": [
      "GCC specification"
    ],
    "image": "/variant-3/dealer/inventory/1010924-1.webp"
  },
  {
    "id": "1018774",
    "title": "2022 Chevrolet Malibu LT",
    "sourceUrl": "https://www.dubicars.com/2022-chevrolet-malibu-1018774.html",
    "priceEur": "AED 32,000",
    "priceBgn": "",
    "status": "Advertised; confirmation required",
    "date": "2022",
    "mileage": "95,000 km",
    "color": "Silver",
    "fuel": "Petrol",
    "power": "",
    "transmission": "Automatic",
    "body": "Sedan",
    "features": [
      "GCC specification"
    ],
    "image": "/variant-3/dealer/inventory/1018774-1.webp"
  },
  {
    "id": "916417",
    "title": "2023 Toyota Rush EX 1.5L",
    "sourceUrl": "https://www.dubicars.com/2023-toyota-rush-15l-ex-916417.html",
    "priceEur": "AED 43,000",
    "priceBgn": "",
    "status": "Advertised; confirmation required",
    "date": "2023",
    "mileage": "121,000 km",
    "color": "White",
    "fuel": "Petrol",
    "power": "",
    "transmission": "Automatic",
    "body": "SUV/Crossover",
    "features": [
      "GCC specification"
    ],
    "image": "/variant-3/dealer/inventory/916417-1.webp"
  },
  {
    "id": "906007",
    "title": "2020 Chevrolet Trax LT 1.8L AWD",
    "sourceUrl": "https://www.dubicars.com/2020-chevrolet-trax-lt-18l-awd-906007.html",
    "priceEur": "AED 14,500",
    "priceBgn": "",
    "status": "Advertised; confirmation required",
    "date": "2020",
    "mileage": "106,000 km",
    "color": "Black",
    "fuel": "Petrol",
    "power": "",
    "transmission": "Automatic",
    "body": "SUV/Crossover",
    "features": [
      "American specification"
    ],
    "image": "/variant-3/dealer/inventory/906007-1.webp"
  },
  {
    "id": "1017078",
    "title": "2019 Ford Figo Ambiente",
    "sourceUrl": "https://www.dubicars.com/2019-ford-figo-1017078.html",
    "priceEur": "AED 13,500",
    "priceBgn": "",
    "status": "Advertised; confirmation required",
    "date": "2019",
    "mileage": "185,000 km",
    "color": "White",
    "fuel": "Petrol",
    "power": "",
    "transmission": "Automatic",
    "body": "Sedan",
    "features": [
      "GCC specification"
    ],
    "image": "/variant-3/dealer/inventory/1017078-1.webp"
  },
  {
    "id": "969234",
    "title": "2021 Nissan Sentra SV 1.6L",
    "sourceUrl": "https://www.dubicars.com/2021-nissan-sentra-sv-16l-113-hp-969234.html",
    "priceEur": "AED 23,000",
    "priceBgn": "",
    "status": "Advertised; confirmation required",
    "date": "2021",
    "mileage": "116,000 km",
    "color": "Blue",
    "fuel": "Petrol",
    "power": "",
    "transmission": "Automatic",
    "body": "Sedan",
    "features": [
      "American specification"
    ],
    "image": "/variant-3/dealer/inventory/969234-1.webp"
  }
] satisfies CurrentDayNightListing[];
