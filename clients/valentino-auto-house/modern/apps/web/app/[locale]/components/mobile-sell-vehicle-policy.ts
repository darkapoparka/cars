import { mobileFormFocusClassName } from "@repo/marketplace-ui/lib/mobile-form-control";
export const mobileSellVehicleCategoryOptions = {
  bg: [
    { label: "Автомобил", value: "car" },
    { label: "Камион", value: "truck" },
    { label: "Мотоциклет", value: "motorbike" },
    { label: "Бус", value: "van" },
  ],
  en: [
    { label: "Car", value: "car" },
    { label: "Truck", value: "truck" },
    { label: "Motorbike", value: "motorbike" },
    { label: "Van", value: "van" },
  ],
} as const;

export const mobileSellVehicleCopy = {
  bg: {
    category: "Категория",
    close: "Затворете",
    description: "Въведете VIN или добавете данни",
    directCall: "Предпочитате разговор?",
    formDescription: "Въведете VIN или марка, модел, година и пробег.",
    formTitle: "Данни за автомобила",
    howDescription: "Подготовка за разговор, без автоматично изпращане или обещана оферта.",
    howEyebrow: "Продажба на автомобил",
    howOpen: "Как работи?",
    howStart: "Въведете данните",
    howSteps: [
      {
        description:
          "VIN или марка, модел, година и пробег са достатъчни за начало.",
        title: "Подготвяте основните данни",
      },
      {
        description: "Обадете се и проверете дали продавачът разглежда предложения за вашия автомобил.",
        title: "Свързвате се с продавача",
      },
      {
        description:
          "Оглед, оценка, изкупуване или бартер се уговарят само след потвърждение от продавача.",
        title: "Уточнявате възможностите",
      },
    ],
    howTitle: "Как да подготвите разговор",
    inventory: "Вижте наличностите",
    make: "Марка",
    mileage: "Пробег",
    model: "Модел",
    noVin: "Нямате VIN? Въведете данните",
    openForm: "Отворете формата за данни",
    submit: "Продължете към контакт",
    title: "Предложете автомобил",
    vin: "VIN номер",
    vinOptional: "VIN номер (по желание)",
    year: "Година",
  },
  en: {
    category: "Category",
    close: "Close",
    description: "Enter a VIN or add vehicle details",
    directCall: "Prefer to speak directly?",
    formDescription: "Enter a VIN or the make, model, year and mileage.",
    formTitle: "Vehicle details",
    howDescription:
      "Prepare for a conversation, without automatic delivery or a promised offer.",
    howEyebrow: "Propose your vehicle",
    howOpen: "How does it work?",
    howStart: "Enter vehicle details",
    howSteps: [
      {
        description:
          "A VIN or make, model, year and mileage is enough to begin.",
        title: "Prepare the essentials",
      },
      {
        description:
          "Call and check whether the seller considers proposals for your vehicle.",
        title: "Contact the seller",
      },
      {
        description:
          "Any inspection, appraisal, purchase or trade-in requires confirmation from the seller.",
        title: "Confirm the possibilities",
      },
    ],
    howTitle: "Preparing a conversation",
    inventory: "Browse inventory",
    make: "Make",
    mileage: "Mileage",
    model: "Model",
    noVin: "No VIN? Enter the details",
    openForm: "Open the vehicle details form",
    submit: "Continue to contact",
    title: "Propose your vehicle",
    vin: "VIN number",
    vinOptional: "VIN number (optional)",
    year: "Year",
  },
} as const;

const invalidVinCharactersPattern = /[^A-HJ-NPR-Z0-9]/g;

export const normalizeVehicleVin = (value: string) =>
  value.toUpperCase().replace(invalidVinCharactersPattern, "").slice(0, 17);

export const isCompleteVehicleVin = (value: string) =>
  normalizeVehicleVin(value).length === 17;

export const mobileSellInputClassName = `h-12 rounded-xl border-transparent bg-zinc-100 text-base shadow-none ${mobileFormFocusClassName}`;
export const mobileSellSelectClassName =
  "h-12 w-full rounded-xl border border-transparent bg-zinc-100 px-3 text-base outline-none transition-shadow focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";
