export type VehicleCondition = 'new' | 'used';
export type VehicleEquipment =
  | '4x4' | '360° камера' | 'Панорамен покрив' | 'Подгряване на седалки'
  | 'Навигация' | 'Парктроник' | 'Безключов достъп' | 'Адаптивен круиз контрол';
export type Vehicle = {
  id:number; verification:'verified'; evidenceUrl?:string; image:string; gallery:string[]; sourceUrl:string;
  category:string; body:string; make:string; title:string; year:string; yearNumber:number;
  mileage:string; mileageKm:number; fuel:string; transmission:string; equipment:readonly VehicleEquipment[];
  condition:VehicleCondition; priceEur:number; href:`/listing-detail-v1/${number}`;
};

const inventoryRecords: Omit<Vehicle, 'year' | 'mileage' | 'href' | 'verification'>[] = [
  {
    "id": 1,
    "image": "/dealer/inventory/21783937913461083-1.webp",
    "gallery": [
      "/dealer/inventory/21783937913461083-1.webp",
      "/dealer/inventory/21783937913461083-2.webp",
      "/dealer/inventory/21783937913461083-3.webp",
      "/dealer/inventory/21783937913461083-4.webp"
    ],
    "sourceUrl": "https://tesicar.mobile.bg/obiava-21783937913461083-nissan-juke-1-6i-tekna-117k-c",
    "category": "\u0414\u0436\u0438\u043f",
    "body": "\u0414\u0436\u0438\u043f",
    "make": "Nissan",
    "title": "Nissan Juke 1.6i tekna 117k.c.",
    "yearNumber": 2015,
    "mileageKm": 169200,
    "fuel": "\u0411\u0435\u043d\u0437\u0438\u043d\u043e\u0432",
    "transmission": "\u0420\u044a\u0447\u043d\u0430",
    "equipment": [],
    "condition": "used",
    "priceEur": 6799.0
  },
  {
    "id": 2,
    "image": "/dealer/inventory/21786378692115915-1.webp",
    "gallery": [
      "/dealer/inventory/21786378692115915-1.webp",
      "/dealer/inventory/21786378692115915-2.webp",
      "/dealer/inventory/21786378692115915-3.webp",
      "/dealer/inventory/21786378692115915-4.webp"
    ],
    "sourceUrl": "https://tesicar.mobile.bg/obiava-21786378692115915-suzuki-grand-vitara-2-4i-shveytsariya",
    "category": "\u0414\u0436\u0438\u043f",
    "body": "\u0414\u0436\u0438\u043f",
    "make": "Suzuki",
    "title": "Suzuki Grand vitara 2.4i \u0428\u0412\u0415\u0419\u0426\u0410\u0420\u0418\u042f",
    "yearNumber": 2014,
    "mileageKm": 90700,
    "fuel": "\u0411\u0435\u043d\u0437\u0438\u043d\u043e\u0432",
    "transmission": "\u0420\u044a\u0447\u043d\u0430",
    "equipment": [
      "4x4",
      "\u0411\u0435\u0437\u043a\u043b\u044e\u0447\u043e\u0432 \u0434\u043e\u0441\u0442\u044a\u043f"
    ],
    "condition": "used",
    "priceEur": 9399.0
  },
  {
    "id": 3,
    "image": "/dealer/inventory/11787674075681544-1.webp",
    "gallery": [
      "/dealer/inventory/11787674075681544-1.webp",
      "/dealer/inventory/11787674075681544-2.webp",
      "/dealer/inventory/11787674075681544-3.webp",
      "/dealer/inventory/11787674075681544-4.webp"
    ],
    "sourceUrl": "https://tesicar.mobile.bg/obiava-11787674075681544-audi-a7-3-0-tfsi",
    "category": "\u0425\u0435\u0447\u0431\u0435\u043a",
    "body": "\u0425\u0435\u0447\u0431\u0435\u043a",
    "make": "Audi",
    "title": "Audi A7 3.0 TFSI",
    "yearNumber": 2011,
    "mileageKm": 270000,
    "fuel": "\u0411\u0435\u043d\u0437\u0438\u043d\u043e\u0432",
    "transmission": "\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u043d\u0430",
    "equipment": [
      "4x4"
    ],
    "condition": "used",
    "priceEur": 14900.0
  },
  {
    "id": 4,
    "image": "/dealer/inventory/21781003069917784-1.webp",
    "gallery": [
      "/dealer/inventory/21781003069917784-1.webp",
      "/dealer/inventory/21781003069917784-2.webp",
      "/dealer/inventory/21781003069917784-3.webp",
      "/dealer/inventory/21781003069917784-4.webp"
    ],
    "sourceUrl": "https://tesicar.mobile.bg/obiava-21781003069917784-mitsubishi-asx-2-2did-4wd-automatic",
    "category": "\u0414\u0436\u0438\u043f",
    "body": "\u0414\u0436\u0438\u043f",
    "make": "Mitsubishi",
    "title": "Mitsubishi ASX 2.2DiD 4WD Automatic",
    "yearNumber": 2015,
    "mileageKm": 110000,
    "fuel": "\u0414\u0438\u0437\u0435\u043b\u043e\u0432",
    "transmission": "\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u043d\u0430",
    "equipment": [
      "4x4"
    ],
    "condition": "used",
    "priceEur": 9499.0
  },
  {
    "id": 5,
    "image": "/dealer/inventory/11779806013316184-1.webp",
    "gallery": [
      "/dealer/inventory/11779806013316184-1.webp",
      "/dealer/inventory/11779806013316184-2.webp",
      "/dealer/inventory/11779806013316184-3.webp",
      "/dealer/inventory/11779806013316184-4.webp"
    ],
    "sourceUrl": "https://tesicar.mobile.bg/obiava-11779806013316184-toyota-yaris-1-33-99k-s",
    "category": "\u0425\u0435\u0447\u0431\u0435\u043a",
    "body": "\u0425\u0435\u0447\u0431\u0435\u043a",
    "make": "Toyota",
    "title": "Toyota Yaris 1.33 99\u043a.\u0441.",
    "yearNumber": 2009,
    "mileageKm": 208000,
    "fuel": "\u0411\u0435\u043d\u0437\u0438\u043d\u043e\u0432",
    "transmission": "\u0420\u044a\u0447\u043d\u0430",
    "equipment": [],
    "condition": "used",
    "priceEur": 6150.0
  },
  {
    "id": 6,
    "image": "/dealer/inventory/21782292613523387-1.webp",
    "gallery": [
      "/dealer/inventory/21782292613523387-1.webp",
      "/dealer/inventory/21782292613523387-2.webp",
      "/dealer/inventory/21782292613523387-3.webp",
      "/dealer/inventory/21782292613523387-4.webp"
    ],
    "sourceUrl": "https://tesicar.mobile.bg/obiava-21782292613523387-nissan-juke-1-6i-shveytsariya",
    "category": "\u0414\u0436\u0438\u043f",
    "body": "\u0414\u0436\u0438\u043f",
    "make": "Nissan",
    "title": "Nissan Juke 1.6i \u0428\u0412\u0415\u0419\u0426\u0410\u0420\u0418\u042f",
    "yearNumber": 2015,
    "mileageKm": 184200,
    "fuel": "\u0411\u0435\u043d\u0437\u0438\u043d\u043e\u0432",
    "transmission": "\u0420\u044a\u0447\u043d\u0430",
    "equipment": [],
    "condition": "used",
    "priceEur": 7499.0
  },
  {
    "id": 7,
    "image": "/dealer/inventory/11779452412819500-1.webp",
    "gallery": [
      "/dealer/inventory/11779452412819500-1.webp",
      "/dealer/inventory/11779452412819500-2.webp",
      "/dealer/inventory/11779452412819500-3.webp",
      "/dealer/inventory/11779452412819500-4.webp"
    ],
    "sourceUrl": "https://tesicar.mobile.bg/obiava-11779452412819500-mitsubishi-colt-1-3i-95k-c",
    "category": "\u0425\u0435\u0447\u0431\u0435\u043a",
    "body": "\u0425\u0435\u0447\u0431\u0435\u043a",
    "make": "Mitsubishi",
    "title": "Mitsubishi Colt 1.3i 95k.c.",
    "yearNumber": 2005,
    "mileageKm": 223000,
    "fuel": "\u0411\u0435\u043d\u0437\u0438\u043d\u043e\u0432",
    "transmission": "\u0420\u044a\u0447\u043d\u0430",
    "equipment": [],
    "condition": "used",
    "priceEur": 1999.0
  },
  {
    "id": 8,
    "image": "/dealer/inventory/21783600164931772-1.webp",
    "gallery": [
      "/dealer/inventory/21783600164931772-1.webp",
      "/dealer/inventory/21783600164931772-2.webp",
      "/dealer/inventory/21783600164931772-3.webp",
      "/dealer/inventory/21783600164931772-4.webp"
    ],
    "sourceUrl": "https://tesicar.mobile.bg/obiava-21783600164931772-toyota-rav4-2-2d-4-d-177-ps",
    "category": "\u0414\u0436\u0438\u043f",
    "body": "\u0414\u0436\u0438\u043f",
    "make": "Toyota",
    "title": "Toyota Rav4 2.2D-4 D 177 PS",
    "yearNumber": 2006,
    "mileageKm": 203000,
    "fuel": "\u0414\u0438\u0437\u0435\u043b\u043e\u0432",
    "transmission": "\u0420\u044a\u0447\u043d\u0430",
    "equipment": [
      "4x4",
      "\u0411\u0435\u0437\u043a\u043b\u044e\u0447\u043e\u0432 \u0434\u043e\u0441\u0442\u044a\u043f"
    ],
    "condition": "used",
    "priceEur": 4490.0
  }
];
export const featuredVehicles: Vehicle[] = inventoryRecords.map(record => ({
  ...record, verification:'verified', year:String(record.yearNumber),
  mileage:`${new Intl.NumberFormat('bg-BG').format(record.mileageKm)} км`, href:`/listing-detail-v1/${record.id}`
}));
export const formatVehiclePrice=(priceEur:number)=>`${new Intl.NumberFormat('bg-BG').format(priceEur)} €`;
