

export type LeadSubmitPayload = {
	customerName: string;
	contact: string;
	email: string | null;
	phone: string | null;
	source: string;
	message: string;
	vehicleId?: string | null;
	value?: number | null;
	/** Honeypot — leave empty; only bots populate it. Dropped server-side when filled. */
	companyWebsite?: string | null;
};

export type LeadSubmitResult =
	| {
			ok: true;
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

export async function submitLead(payload: LeadSubmitPayload): Promise<LeadSubmitResult> {
 return { ok: false, status: 503, error: "Демонстрационна форма. Обадете се на 0877 800 921." };
}
