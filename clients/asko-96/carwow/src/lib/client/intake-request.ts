export const INTAKE_TIMEOUT_MS = 15_000;
export type IntakeOptions = { signal?: AbortSignal; timeoutMs?: number };
export type IntakeFailure = { ok: false; status: number; error: string; details?: unknown };
export type IntakeResponse =
	| { ok: true; body: Record<string, unknown>; status: number }
	| IntakeFailure;

export function intakeErrorMessage(status: number) {
	if (status === 400 || status === 422) return 'Проверете въведените данни и опитайте отново.';
	if (status === 429) return 'Получихме твърде много заявки. Изчакайте малко и опитайте отново.';
	if (status === 0) return 'Няма връзка. Проверете интернет връзката си и опитайте отново.';
	return 'Заявката не беше изпратена. Опитайте отново или се свържете с екипа по телефона.';
}

export function invalidIntakeResponse(status = 200): IntakeFailure {
	return {
		ok: false,
		status,
		error: 'Не успяхме да потвърдим заявката. Свържете се с екипа, преди да я изпратите повторно.'
	};
}

/** Transport only; each intake client still owns its response contract. No automatic POST retry. */
export async function postIntake(
	url: string,
	payload: object,
	options: IntakeOptions = {}
): Promise<IntakeResponse> {
	const controller = new AbortController();
	let timedOut = false;
	const cancel = () => controller.abort();
	if (options.signal?.aborted) cancel();
	options.signal?.addEventListener('abort', cancel, { once: true });
	const timer = setTimeout(() => {
		timedOut = true;
		controller.abort();
	}, options.timeoutMs ?? INTAKE_TIMEOUT_MS);
	try {
		const response = await fetch(url, {
			method: 'POST',
			signal: controller.signal,
			headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});
		const parsed: unknown = await response.json().catch(() => null);
		const body =
			parsed && typeof parsed === 'object' && !Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: null;
		if (!response.ok)
			return {
				ok: false,
				status: response.status,
				error: intakeErrorMessage(response.status),
				details: body?.details
			};
		if (!body) return invalidIntakeResponse(response.status);
		return { ok: true, body, status: response.status };
	} catch {
		return {
			ok: false,
			status: 0,
			error: timedOut
				? 'Потвърждението се забави. Заявката може да е получена — свържете се с екипа, преди да изпратите отново.'
				: intakeErrorMessage(0)
		};
	} finally {
		clearTimeout(timer);
		options.signal?.removeEventListener('abort', cancel);
	}
}

export function hasResponseId<Key extends string>(
	body: Record<string, unknown>,
	key: Key
): body is Record<string, unknown> & Record<Key, string> {
	return typeof body[key] === 'string' && body[key].trim().length > 0;
}
