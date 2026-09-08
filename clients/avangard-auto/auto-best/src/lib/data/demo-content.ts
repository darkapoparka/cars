type DemoTeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
};

type DemoPartner = {
  id: string;
  name: string;
  image: string;
};

export const demoContentLabel = 'AVANGARD AUTO';

export const demoTeamIntro =
  'Контакт за автомобилите и съдействие според публикуваните обяви.';

export const demoPartnerIntro =
  'Избрани автомобили от публикуваните обяви.';

export const demoTeamMembers: DemoTeamMember[] = [{"id":"service-0","name":"Автомобили","role":"Публикувани предложения","image":"/assets/avangard/vehicle-01-1.webp"},{"id":"service-1","name":"Регистрация","role":"Съдействие в КАТ","image":"/assets/avangard/vehicle-02-1.webp"},{"id":"service-2","name":"Транспорт","role":"В България","image":"/assets/avangard/vehicle-03-1.webp"},{"id":"service-3","name":"Лизинг","role":"Индивидуални условия","image":"/assets/avangard/vehicle-04-1.webp"}];

export const demoPartners: DemoPartner[] = [{"id":"11785010475119627","name":"VW","image":"/assets/avangard/vehicle-01-1.webp"},{"id":"21783748809976935","name":"Volvo","image":"/assets/avangard/vehicle-02-1.webp"},{"id":"21766322242220471","name":"Volvo","image":"/assets/avangard/vehicle-03-1.webp"},{"id":"11782450720679744","name":"Peugeot","image":"/assets/avangard/vehicle-04-1.webp"},{"id":"11782462832415648","name":"Peugeot","image":"/assets/avangard/vehicle-05-1.webp"},{"id":"21776284342452600","name":"Nissan","image":"/assets/avangard/vehicle-06-1.webp"}];
