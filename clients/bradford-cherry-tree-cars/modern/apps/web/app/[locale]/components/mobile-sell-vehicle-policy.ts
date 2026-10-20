import {
  mobileFormFocusClassName,
  mobileFormTextClassName,
} from "@repo/marketplace-ui/lib/mobile-form-control";
import {
  type SellVehicleCategory,
  sellCategoryLabels,
} from "../../../lib/sell-vehicle-draft";

export {
  isCompleteVehicleVin,
  normalizeVehicleVin,
} from "../../../lib/sell-vehicle-draft";
export const mobileSellVehicleCategoryOptions = {
  bg: Object.entries(sellCategoryLabels.bg).map(([value, label]) => ({
    value: value as SellVehicleCategory,
    label,
  })),
  en: Object.entries(sellCategoryLabels.en).map(([value, label]) => ({
    value: value as SellVehicleCategory,
    label,
  })),
};

export const mobileSellVehicleCopy = {
  bg: {
    backToSell: "Назад към автомобила",
    clearTitle: "Изчистване на данните",
    clearConfirm: "Да изчистим ли въведените данни?",
    clearAction: "Изчисти данните",
    keepAction: "Запази данните",
    resetAction: "Изчисти въведените данни",
    modelExample: "напр. X5",
    yearExample: "напр. 2022",
    mileageExample: "напр. 62 000",
    category: "Категория",
    close: "Затворете",
    description: "Въведете VIN или добавете данни",
    directCall: "Предпочитате разговор?",
    formDescription: "Добавете данни за контактния преглед. Демото не изпраща заявка и не извършва оценка.",
    formTitle: "Данни",
    howDescription: "Подгответе данни и потвърдете възможностите директно. Демото не изпраща заявка.",
    howEyebrow: "Вашият автомобил",
    howOpen: "Как работи?",
    howStart: "Въведете данните",
    howSteps: [
      {
        description:
          "VIN или марка, модел, година и пробег са достатъчни за начало.",
        title: "Подготви данните",
      },
      {
        description:
          "Попитайте дали автокъщата разглежда предложения за автомобил.",
        title: "Попитайте директно",
      },
      {
        description:
          "Изкупуване, бартер и оценка не са потвърдени услуги. Уточнете условията с автокъщата.",
        title: "Уточнете възможностите",
      },
    ],
    howTitle: "Какво да уточните",
    inventory: "Вижте наличностите",
    make: "Марка",
    mileage: "Пробег",
    model: "Модел",
    noVin: "Нямаш VIN? Въведи данните",
    noVinLabel: "Нямаш VIN?",
    openForm: "Отворете данните за автомобил",
    submit: "Преглед преди обаждане",
    title: "Вашият автомобил",
    vin: "VIN номер",
    vinEntry: "Въведи VIN номер",
    vinOptional: "VIN номер (по желание)",
    year: "Година",
  },
  en: {
    backToSell: "Back to your vehicle",
    clearTitle: "Clear vehicle details",
    clearConfirm: "Clear the details you entered?",
    clearAction: "Clear details",
    keepAction: "Keep details",
    resetAction: "Clear entered details",
    modelExample: "e.g. X5",
    yearExample: "e.g. 2022",
    mileageExample: "e.g. 62,000",
    category: "Category",
    close: "Close",
    description: "Enter a VIN or add vehicle details",
    directCall: "Prefer to speak directly?",
    formDescription: "Add details for the contact preview. This demo does not submit a request or perform an appraisal.",
    formTitle: "Details",
    howDescription:
      "Prepare details and confirm the options directly. This demo does not submit a request.",
    howEyebrow: "Your vehicle",
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
          "Ask whether the dealership considers vehicle offers.",
        title: "Ask directly",
      },
      {
        description:
          "Purchase, trade-in and appraisal services are unconfirmed. Ask the dealership about the terms.",
        title: "Confirm the options",
      },
    ],
    howTitle: "What to confirm",
    inventory: "Browse inventory",
    make: "Make",
    mileage: "Mileage",
    model: "Model",
    noVin: "No VIN? Enter the details",
    noVinLabel: "No VIN?",
    openForm: "Open vehicle details",
    submit: "Review before calling",
    title: "Your vehicle",
    vin: "VIN number",
    vinEntry: "Enter VIN number",
    vinOptional: "VIN number (optional)",
    year: "Year",
  },
} as const;

export const mobileSellInputClassName = `h-12 rounded-xl border-transparent bg-zinc-100 shadow-none ${mobileFormTextClassName} ${mobileFormFocusClassName}`;
export const mobileSellSelectClassName =
  "h-12 w-full rounded-xl border border-transparent bg-zinc-100 px-3 text-base outline-none transition-shadow focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";
