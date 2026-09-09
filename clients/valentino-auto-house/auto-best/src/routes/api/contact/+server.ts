import { json } from '@sveltejs/kit';

export async function POST() {
  return json(
    {
      success: false,
      ok: false,
      demo: true,
      message: 'Демонстрационен сайт: запитването не е изпратено. Използвайте публикувания телефон за връзка.',
    },
    { status: 409 },
  );
}
