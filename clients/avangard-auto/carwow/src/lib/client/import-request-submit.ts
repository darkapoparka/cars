

export type ImportRequestSubmitPayload = {
	customerName: string;
	contact: string;
	email: string | null;
	phone: string | null;
	originCountry: string;
	destinationCountry: string;
	desiredMake: string | null;
	desiredModel: string | null;
	desiredYearMin: number | null;
	desiredYearMax: number | null;
	budgetMin: number | null;
	budgetMax: number | null;
	fuel: string | null;
	transmission: string | null;
	notes: string;
	/** Honeypot — leave empty; only bots populate it. Dropped server-side when filled. */
	companyWebsite?: string | null;
};

export type ImportRequestSubmitResult =
	| {
			ok: true;
			importRequestId: string;
			leadId: string;
			conversationId: string;
			status: string;
	  }
	| {
			ok: false;
			status: number;
			error: string;
			details?: unknown;
	  };

export async function submitImportRequest(
	payload: ImportRequestSubmitPayload
): Promise<ImportRequestSubmitResult> {
 return { ok: false, status: 503, error: "Демонстрационна форма. Обадете се на 0877 800 921." };
}
