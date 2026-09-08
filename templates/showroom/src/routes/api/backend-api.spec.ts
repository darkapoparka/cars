import { describe, expect, it } from 'vitest';
import { agents } from '$lib/data/agents';
import { vehicles } from '$lib/data/vehicles';
import { resolveEliqautoApiSession } from '$lib/server/auth';
import { GET as agentsGet, PATCH as agentsPatch } from './agents/+server';
import { POST as loginPost } from './auth/login/+server';
import { POST as logoutPost } from './auth/logout/+server';
import { POST as recoveryPost } from './auth/recovery/+server';
import { POST as registerPost } from './auth/register/+server';
import { GET as garageGet, POST as garagePost } from './account/garage/+server';
import { POST as passwordPost } from './account/password/+server';
import { POST as profilePost } from './account/profile/+server';
import { GET as inquiryGet, PATCH as inquiryPatch, POST as inquiryPost } from './inquiries/+server';
import {
	DELETE as listingDelete,
	GET as listingGet,
	PATCH as listingPatch,
	POST as listingPost
} from './inventory/listings/+server';
import {
	GET as submissionGet,
	PATCH as submissionPatch,
	POST as submissionPost
} from './inventory/submissions/+server';
import { GET as messageGet, PATCH as messagePatch, POST as messagePost } from './messages/+server';
import { GET as usersGet, PATCH as usersPatch } from './users/+server';

const jsonRequest = (
	url: string,
	body: object,
	method = 'POST',
	headers: Record<string, string> = {}
) =>
	new Request(url, {
		body: JSON.stringify(body),
		headers: { 'content-type': 'application/json', ...headers },
		method
	});

const routeEvent = (url: string, headers: Record<string, string> = {}) => ({
	request: new Request(url, { headers }),
	url: new URL(url)
});

const prototypeHeaders = (role: 'admin' | 'agent' | 'customer') => ({
	'x-eliqauto-prototype-role': role
});

const readJson = async <Data>(response: Response) =>
	(await response.json()) as { data: Data; ok: boolean };

describe('Eliqauto API endpoints', () => {
	it('creates and clears role-aware login sessions', async () => {
		const response = await loginPost({
			request: jsonRequest('http://localhost/api/auth/login', {
				email: 'agent@eliqauto.local',
				password: 'eliqauto prototype',
				role: 'agent'
			})
		});
		const body = await readJson<{ session: { role: string; token: string } }>(response);

		expect(response.status).toBe(200);
		expect(body.ok).toBe(true);
		expect(body.data.session.role).toBe('agent');
		expect(body.data.session.token).toContain('session-');
		expect(response.headers.get('set-cookie')).toContain('eliqauto_session=');

		const logoutResponse = logoutPost({
			request: jsonRequest('http://localhost/api/auth/logout', {}, 'POST', {
				authorization: `Bearer ${body.data.session.token}`
			})
		});
		const logoutBody = await readJson<{ cleared: boolean; status: string }>(logoutResponse);
		const staleSession = resolveEliqautoApiSession(
			new Request('http://localhost/api/users', {
				headers: {
					authorization: `Bearer ${body.data.session.token}`
				}
			})
		);

		expect(logoutResponse.status).toBe(200);
		expect(logoutBody.data.status).toBe('signed-out');
		expect(logoutBody.data.cleared).toBe(true);
		expect(logoutResponse.headers.get('set-cookie')).toContain('Max-Age=0');
		expect(staleSession).toBeUndefined();
	});

	it('supports preserved auth modal login, sign-up, and recovery fields', async () => {
		const modalLogin = await loginPost({
			request: jsonRequest('http://localhost/api/auth/login', {
				'Password-login': 'eliqauto prototype',
				'email-login': 'customer@eliqauto.local',
				role: 'customer'
			})
		});
		const registerResponse = await registerPost({
			request: jsonRequest('http://localhost/api/auth/register', {
				'ConfirmPassword-SignUp': 'eliqauto modal password',
				'Password-SignUp': 'eliqauto modal password',
				'SignUp-login': 'modal-customer@example.com'
			})
		});
		const recoveryResponse = await recoveryPost({
			request: jsonRequest('http://localhost/api/auth/recovery', {
				'email-forgot-password': 'modal-customer@example.com'
			})
		});
		const modalLoginBody = await readJson<{ session: { email: string; role: string } }>(modalLogin);
		const registerBody = await readJson<{
			session: { email: string; role: string; token: string };
			status: string;
		}>(registerResponse);
		const recoveryBody = await readJson<{
			message: { authorEmail: string; message: string; threadId: string };
			status: string;
		}>(recoveryResponse);

		expect(modalLogin.status).toBe(200);
		expect(modalLoginBody.data.session.email).toBe('customer@eliqauto.local');
		expect(modalLoginBody.data.session.role).toBe('customer');
		expect(registerResponse.status).toBe(201);
		expect(registerResponse.headers.get('set-cookie')).toContain('eliqauto_session=');
		expect(registerBody.data.status).toBe('registered');
		expect(registerBody.data.session.email).toBe('modal-customer@example.com');
		expect(registerBody.data.session.role).toBe('customer');
		expect(registerBody.data.session.token).toContain('session-');
		expect(recoveryResponse.status).toBe(201);
		expect(recoveryBody.data.status).toBe('recovery-request-recorded');
		expect(recoveryBody.data.message.authorEmail).toBe('modal-customer@example.com');
		expect(recoveryBody.data.message.threadId).toBe('eliqauto-auth');
		expect(recoveryBody.data.message.message).toContain('Password recovery request');
	});

	it('persists inquiry and sell-car submission records', async () => {
		const vehicle = vehicles[0];
		const inquiryResponse = await inquiryPost({
			request: jsonRequest('http://localhost/api/inquiries', {
				email: 'lead@example.com',
				message: 'Please confirm source history.',
				name: 'Lead Example',
				routePath: `/inventory/${vehicle.slug}`,
				source: 'vehicle-detail',
				vehicleSlug: vehicle.slug
			})
		});
		const submissionResponse = await submissionPost({
			request: jsonRequest('http://localhost/api/inventory/submissions', {
				email: 'seller@example.com',
				expectedPrice: '25000 EUR',
				mileage: '120000 km',
				name: 'Seller Example',
				source: 'sell-your-car',
				title: 'Client BMW',
				vin: 'WBATEST'
			})
		});
		const inquiryBody = await readJson<{
			inquiry: { assignedAgentSlug: string; vehicleTitle: string };
		}>(inquiryResponse);
		const submissionBody = await readJson<{ submission: { status: string; title: string } }>(
			submissionResponse
		);

		expect(inquiryResponse.status).toBe(201);
		expect(inquiryBody.data.inquiry.vehicleTitle).toBe(vehicle.title);
		expect(inquiryBody.data.inquiry.assignedAgentSlug).toBe(vehicle.agentSlug);
		expect(submissionResponse.status).toBe(201);
		expect(submissionBody.data.submission.status).toBe('submitted');
		expect(submissionBody.data.submission.title).toBe('Client BMW');
	});

	it('captures template send-inquiry fields and assigns consultant leads', async () => {
		const agent = agents[1];
		const inquiryResponse = await inquiryPost({
			request: jsonRequest('http://localhost/api/inquiries', {
				SendInquiryemail: 'consultant-lead@example.com',
				SendInquiryname: 'Consultant Lead',
				SendInquiryphone: '+359 222 222',
				message2: 'Please review a possible Import & leasing.',
				routePath: `/agents/${agent.slug}`,
				source: 'agent-detail'
			})
		});
		const body = await readJson<{
			inquiry: {
				assignedAgentSlug: string;
				contactName: string;
				contactPhone: string;
				message: string;
				routePath: string;
			};
		}>(inquiryResponse);

		expect(inquiryResponse.status).toBe(201);
		expect(body.data.inquiry.assignedAgentSlug).toBe(agent.slug);
		expect(body.data.inquiry.contactName).toBe('Consultant Lead');
		expect(body.data.inquiry.contactPhone).toBe('+359 222 222');
		expect(body.data.inquiry.message).toBe('Please review a possible Import & leasing.');
		expect(body.data.inquiry.routePath).toBe(`/agents/${agent.slug}`);
	});

	it('preserves service request context from template support forms', async () => {
		const inquiryResponse = await inquiryPost({
			request: jsonRequest('http://localhost/api/inquiries', {
				date: '2026-06-02',
				email: 'service-lead@example.com',
				name: 'Service Lead',
				phone: '+359 333 333',
				routePath: '/services',
				service: 'Import Import Planning',
				source: 'send-inquiry eliqauto-service-form',
				vehicle: 'BMW X5 or VIN WBATEST'
			})
		});
		const body = await readJson<{
			inquiry: { message: string; routePath: string; source: string };
		}>(inquiryResponse);

		expect(inquiryResponse.status).toBe(201);
		expect(body.data.inquiry.message).toBe(
			'Service: Import Import Planning | Preferred date: 2026-06-02 | Vehicle or VIN: BMW X5 or VIN WBATEST'
		);
		expect(body.data.inquiry.routePath).toBe('/services');
		expect(body.data.inquiry.source).toBe('send-inquiry eliqauto-service-form');
	});

	it('keeps contact-page name and vehicle context in inquiry records', async () => {
		const inquiryResponse = await inquiryPost({
			request: jsonRequest('http://localhost/api/inquiries', {
				Firstname: 'Contact',
				Lastname: 'Buyer',
				SendInquiryemail: 'contact-buyer@example.com',
				SendInquiryphone: '+359 444 444',
				inquiryType: 'Import & leasing',
				message: 'I need a realistic landed-cost estimate.',
				routePath: '/contact',
				source: 'eliqauto-contact-form',
				vehicle: 'Porsche Cayenne, 45k EUR budget'
			})
		});
		const body = await readJson<{
			inquiry: { contactName: string; contactPhone: string; message: string; routePath: string };
		}>(inquiryResponse);

		expect(inquiryResponse.status).toBe(201);
		expect(body.data.inquiry.contactName).toBe('Contact Buyer');
		expect(body.data.inquiry.contactPhone).toBe('+359 444 444');
		expect(body.data.inquiry.message).toBe(
			'I need a realistic landed-cost estimate. | Inquiry type: Import & leasing | Vehicle or VIN: Porsche Cayenne, 45k EUR budget'
		);
		expect(body.data.inquiry.routePath).toBe('/contact');
	});

	it('captures template blog comments as message records', async () => {
		const messageResponse = await messagePost({
			request: jsonRequest('http://localhost/api/messages', {
				comment: 'This registration article answered my document question.',
				'email-comment': 'reader@example.com',
				'name-review': 'Blog Reader',
				routePath: '/blog/gotov-za-registracia',
				source: 'eliqauto-blog-comment-form'
			})
		});
		const body = await readJson<{
			message: { authorEmail: string; authorName: string; message: string; routePath: string };
		}>(messageResponse);

		expect(messageResponse.status).toBe(201);
		expect(body.data.message.authorEmail).toBe('reader@example.com');
		expect(body.data.message.authorName).toBe('Blog Reader');
		expect(body.data.message.message).toBe(
			'This registration article answered my document question.'
		);
		expect(body.data.message.routePath).toBe('/blog/gotov-za-registracia');
	});

	it('captures preserved footer newsletter forms as message records', async () => {
		const messageResponse = await messagePost({
			request: jsonRequest('http://localhost/api/messages', {
				'footer-email': 'footer-reader@example.com',
				message: 'Newsletter signup',
				routePath: '/',
				source: 'form-footer relative'
			})
		});
		const body = await readJson<{
			message: { authorEmail: string; message: string; routePath: string };
		}>(messageResponse);

		expect(messageResponse.status).toBe(201);
		expect(body.data.message.authorEmail).toBe('footer-reader@example.com');
		expect(body.data.message.message).toBe('Newsletter signup');
		expect(body.data.message.routePath).toBe('/');
	});

	it('updates sell-your-car submission review status', async () => {
		const submissionResponse = await submissionPost({
			request: jsonRequest('http://localhost/api/inventory/submissions', {
				email: 'review-seller@example.com',
				expectedPrice: '18000 EUR',
				mileage: '88000 km',
				name: 'Review Seller',
				source: 'sell-your-car',
				title: 'Review Submission BMW X3',
				vin: 'REVIEW-X3'
			})
		});
		const submissionBody = await readJson<{ submission: { id: string; status: string } }>(
			submissionResponse
		);
		const patchResponse = await submissionPatch({
			request: jsonRequest(
				'http://localhost/api/inventory/submissions',
				{
					actorRole: 'agent',
					id: submissionBody.data.submission.id,
					note: 'Agent has started valuation review.',
					status: 'reviewing'
				},
				'PATCH',
				prototypeHeaders('agent')
			)
		});
		const patchBody = await readJson<{ submission: { message: string; status: string } }>(
			patchResponse
		);

		expect(submissionResponse.status).toBe(201);
		expect(submissionBody.data.submission.status).toBe('submitted');
		expect(patchResponse.status).toBe(200);
		expect(patchBody.data.submission.status).toBe('reviewing');
		expect(patchBody.data.submission.message).toBe('Agent has started valuation review.');
	});

	it('updates inquiry queue status and message thread state for role-aware workflows', async () => {
		const anonymousInquiries = inquiryGet(routeEvent('http://localhost/api/inquiries'));
		const anonymousMessages = messageGet(routeEvent('http://localhost/api/messages'));
		const inquiryResponse = await inquiryPost({
			request: jsonRequest('http://localhost/api/inquiries', {
				email: 'workflow-lead@example.com',
				message: 'Please assign this lead to inspection.',
				name: 'Workflow Lead',
				source: 'vehicle-detail',
				vehicleSlug: vehicles[0].slug
			})
		});
		const inquiryBody = await readJson<{ inquiry: { id: string; status: string } }>(
			inquiryResponse
		);
		const inquiryPatchResponse = await inquiryPatch({
			request: jsonRequest(
				'http://localhost/api/inquiries',
				{
					agentSlug: 'eliqauto-inspection',
					id: inquiryBody.data.inquiry.id,
					role: 'agent',
					status: 'contacted'
				},
				'PATCH',
				prototypeHeaders('agent')
			)
		});
		const inquiryPatchBody = await readJson<{
			inquiry: { assignedAgentSlug: string; status: string };
		}>(inquiryPatchResponse);
		const messageResponse = await messagePost({
			request: jsonRequest('http://localhost/api/messages', {
				email: 'workflow-lead@example.com',
				message: 'I am waiting for an inspection slot.',
				name: 'Workflow Lead',
				threadId: 'workflow-lead-thread'
			})
		});
		const messageBody = await readJson<{ message: { id: string; status: string } }>(
			messageResponse
		);
		const messagePatchResponse = await messagePatch({
			request: jsonRequest(
				'http://localhost/api/messages',
				{
					id: messageBody.data.message.id,
					role: 'agent',
					status: 'read'
				},
				'PATCH',
				prototypeHeaders('agent')
			)
		});
		const anonymousPatchResponse = await messagePatch({
			request: jsonRequest(
				'http://localhost/api/messages',
				{
					id: messageBody.data.message.id,
					status: 'closed'
				},
				'PATCH',
				prototypeHeaders('agent')
			)
		});
		const messagePatchBody = await readJson<{ message: { status: string } }>(messagePatchResponse);
		const agentMessagesBody = await readJson<{ messages: { id: string; status: string }[] }>(
			messageGet(routeEvent('http://localhost/api/messages?role=agent'))
		);

		expect(anonymousInquiries.status).toBe(401);
		expect(anonymousMessages.status).toBe(401);
		expect(inquiryResponse.status).toBe(201);
		expect(inquiryBody.data.inquiry.status).toBe('new');
		expect(inquiryPatchResponse.status).toBe(200);
		expect(inquiryPatchBody.data.inquiry.status).toBe('contacted');
		expect(inquiryPatchBody.data.inquiry.assignedAgentSlug).toBe('eliqauto-inspection');
		expect(messageResponse.status).toBe(201);
		expect(messageBody.data.message.status).toBe('open');
		expect(anonymousPatchResponse.status).toBe(401);
		expect(messagePatchResponse.status).toBe(200);
		expect(messagePatchBody.data.message.status).toBe('read');
		expect(
			agentMessagesBody.data.messages.some(
				(message) => message.id === messageBody.data.message.id && message.status === 'read'
			)
		).toBe(true);
	});

	it('exposes managed agent status and live inquiry assignment counts', async () => {
		const inquiryResponse = await inquiryPost({
			request: jsonRequest('http://localhost/api/inquiries', {
				email: 'agent-count@example.com',
				message: 'Please route this to inspection.',
				name: 'Agent Count Lead',
				source: 'vehicle-detail',
				vehicleSlug: vehicles[0].slug
			})
		});
		const inquiryBody = await readJson<{ inquiry: { id: string } }>(inquiryResponse);

		await inquiryPatch({
			request: jsonRequest(
				'http://localhost/api/inquiries',
				{
					agentSlug: 'eliqauto-inspection',
					id: inquiryBody.data.inquiry.id,
					role: 'agent',
					status: 'assigned'
				},
				'PATCH',
				prototypeHeaders('agent')
			)
		});

		const agentsBody = await readJson<{
			agents: {
				assignedInquiryIds: string[];
				note: string;
				openInquiries: number;
				slug: string;
				status: string;
			}[];
		}>(agentsGet());
		const inspectionAgent = agentsBody.data.agents.find(
			(agent) => agent.slug === 'eliqauto-inspection'
		);
		const patchResponse = await agentsPatch({
			request: jsonRequest(
				'http://localhost/api/agents',
				{
					actorRole: 'admin',
					note: 'Working import queue by appointment.',
					slug: 'eliqauto-import',
					status: 'paused'
				},
				'PATCH',
				prototypeHeaders('admin')
			)
		});
		const patchBody = await readJson<{
			agent: { note: string; slug: string; status: string };
		}>(patchResponse);
		const invalidResponse = await agentsPatch({
			request: jsonRequest(
				'http://localhost/api/agents',
				{
					actorRole: 'admin',
					slug: 'eliqauto-import',
					status: 'offline'
				},
				'PATCH',
				prototypeHeaders('admin')
			)
		});

		expect(inquiryResponse.status).toBe(201);
		expect(inspectionAgent?.assignedInquiryIds).toContain(inquiryBody.data.inquiry.id);
		expect(inspectionAgent?.openInquiries).toBeGreaterThan(0);
		expect(patchResponse.status).toBe(200);
		expect(patchBody.data.agent.slug).toBe('eliqauto-import');
		expect(patchBody.data.agent.status).toBe('paused');
		expect(patchBody.data.agent.note).toBe('Working import queue by appointment.');
		expect(invalidResponse.status).toBe(400);
	});

	it('protects admin user management and persists managed user status changes', async () => {
		const deniedResponse = usersGet({
			request: new Request('http://localhost/api/users?role=customer'),
			url: new URL('http://localhost/api/users?role=customer')
		});
		const listResponse = usersGet({
			request: new Request('http://localhost/api/users?role=admin'),
			url: new URL('http://localhost/api/users?role=admin')
		});
		const listBody = await readJson<{
			users: { email: string; id: string; kind: string; roleLabel: string; status: string }[];
		}>(listResponse);
		const patchResponse = await usersPatch({
			request: jsonRequest(
				'http://localhost/api/users',
				{
					actorRole: 'admin',
					id: 'user-customer',
					name: 'Paused Eliqauto Customer',
					phone: '+359 899 555 000',
					status: 'paused'
				},
				'PATCH',
				prototypeHeaders('admin')
			)
		});
		const patchBody = await readJson<{
			user: { name: string; phone: string; status: string; statusLabel: string };
		}>(patchResponse);
		const invalidResponse = await usersPatch({
			request: jsonRequest(
				'http://localhost/api/users',
				{
					actorRole: 'admin',
					id: 'user-customer',
					status: 'sleeping'
				},
				'PATCH',
				prototypeHeaders('admin')
			)
		});

		expect(deniedResponse.status).toBe(403);
		expect(listResponse.status).toBe(200);
		expect(listBody.data.users.some((user) => user.email === 'admin@eliqauto.local')).toBe(true);
		expect(listBody.data.users.some((user) => user.kind === 'lead')).toBe(true);
		expect(patchResponse.status).toBe(200);
		expect(patchBody.data.user.name).toBe('Paused Eliqauto Customer');
		expect(patchBody.data.user.phone).toBe('+359 899 555 000');
		expect(patchBody.data.user.status).toBe('paused');
		expect(patchBody.data.user.statusLabel).toBe('Paused');
		expect(invalidResponse.status).toBe(400);
	});

	it('supports pragmatic admin inventory listing create, update, and archive', async () => {
		const spoofedCreateResponse = await listingPost({
			request: jsonRequest('http://localhost/api/inventory/listings', {
				actorRole: 'admin',
				title: 'Payload Only Admin Listing'
			})
		});
		const adminLoginResponse = await loginPost({
			request: jsonRequest('http://localhost/api/auth/login', {
				email: 'admin@eliqauto.local',
				password: 'eliqauto prototype',
				role: 'admin'
			})
		});
		const adminLoginBody = await readJson<{ session: { token: string } }>(adminLoginResponse);
		const authHeaders = {
			authorization: `Bearer ${adminLoginBody.data.session.token}`
		};
		const createResponse = await listingPost({
			request: jsonRequest(
				'http://localhost/api/inventory/listings',
				{
					EnterVIN: 'ADMIN-DRAFT-001',
					PriceListing: '31 500 EUR',
					doors: 4,
					mileage: '91 000 km',
					price: 31500,
					seats: 5,
					status: 'draft',
					title: 'Admin Draft BMW 530d',
					year: 2021
				},
				'POST',
				authHeaders
			)
		});
		const createBody = await readJson<{
			listing: {
				doors: number;
				id: string;
				price: number;
				seats: number;
				status: string;
				title: string;
				year: number;
			};
		}>(createResponse);
		const updateResponse = await listingPatch({
			request: jsonRequest(
				'http://localhost/api/inventory/listings',
				{
					actorRole: 'admin',
					EnterVIN: 'ADMIN-PUBLISHED-001',
					id: createBody.data.listing.id,
					PriceListing: '32 000 EUR',
					status: 'published',
					title: 'Published Admin BMW 530d'
				},
				'PATCH',
				authHeaders
			)
		});
		const updateBody = await readJson<{
			listing: { priceLabel: string; status: string; title: string; vin: string };
		}>(updateResponse);
		const listResponse = listingGet(
			routeEvent('http://localhost/api/inventory/listings?role=admin')
		);
		const listBody = await readJson<{ listings: { id: string; source: string; title: string }[] }>(
			listResponse
		);
		const deleteResponse = await listingDelete({
			request: jsonRequest(
				'http://localhost/api/inventory/listings',
				{ actorRole: 'admin', id: createBody.data.listing.id },
				'DELETE',
				authHeaders
			)
		});
		const deleteBody = await readJson<{ listing: { status: string } }>(deleteResponse);
		const afterDeleteBody = await readJson<{
			listings: { id: string; source: string; title: string }[];
		}>(listingGet(routeEvent('http://localhost/api/inventory/listings?role=admin')));

		expect(adminLoginResponse.status).toBe(200);
		expect(createResponse.status).toBe(201);
		expect(createBody.data.listing).toMatchObject({
			doors: 4,
			price: 31500,
			seats: 5,
			year: 2021
		});
		expect(createBody.data.listing.status).toBe('draft');
		expect(updateResponse.status).toBe(200);
		expect(updateBody.data.listing.status).toBe('published');
		expect(updateBody.data.listing.title).toBe('Published Admin BMW 530d');
		expect(updateBody.data.listing.priceLabel).toBe('32 000 EUR');
		expect(updateBody.data.listing.vin).toBe('ADMIN-PUBLISHED-001');
		expect(
			listBody.data.listings.some((listing) => listing.title === 'Published Admin BMW 530d')
		).toBe(true);
		expect(deleteResponse.status).toBe(200);
		expect(deleteBody.data.listing.status).toBe('archived');
		expect(
			afterDeleteBody.data.listings.some((listing) => listing.id === createBody.data.listing.id)
		).toBe(false);
		expect(spoofedCreateResponse.status).toBe(401);
	});

	it('turns admin add-listing submissions into draft admin inventory records', async () => {
		const submissionResponse = await submissionPost({
			request: jsonRequest(
				'http://localhost/api/inventory/submissions',
				{
					actorRole: 'admin',
					expectedPrice: '42 000 EUR',
					mileage: '44 000 km',
					source: 'admin-listing',
					title: 'Admin Template Audi Q7',
					vin: 'ADMIN-TEMPLATE-001'
				},
				'POST',
				prototypeHeaders('admin')
			)
		});
		const submissionBody = await readJson<{
			submission: { id: string; status: string; title: string };
		}>(submissionResponse);
		const listBody = await readJson<{ listings: { status: string; title: string }[] }>(
			listingGet(routeEvent('http://localhost/api/inventory/listings?role=admin'))
		);
		const listing = listBody.data.listings.find(
			(candidate) => candidate.title === submissionBody.data.submission.title
		);

		expect(submissionResponse.status).toBe(201);
		expect(submissionBody.data.submission.status).toBe('draft');
		expect(listing?.status).toBe('draft');
	});

	it('syncs published admin submissions back to admin inventory records', async () => {
		const submissionResponse = await submissionPost({
			request: jsonRequest(
				'http://localhost/api/inventory/submissions',
				{
					actorRole: 'admin',
					expectedPrice: '52 000 EUR',
					mileage: '37 000 km',
					source: 'admin-listing',
					title: 'Publishable Admin Porsche Macan',
					vin: 'ADMIN-PUBLISH-001'
				},
				'POST',
				prototypeHeaders('admin')
			)
		});
		const submissionBody = await readJson<{
			submission: { id: string; title: string };
		}>(submissionResponse);

		await submissionPatch({
			request: jsonRequest(
				'http://localhost/api/inventory/submissions',
				{
					actorRole: 'admin',
					id: submissionBody.data.submission.id,
					status: 'published'
				},
				'PATCH',
				prototypeHeaders('admin')
			)
		});

		const listBody = await readJson<{ listings: { status: string; title: string }[] }>(
			listingGet(routeEvent('http://localhost/api/inventory/listings?role=admin'))
		);
		const listing = listBody.data.listings.find(
			(candidate) => candidate.title === submissionBody.data.submission.title
		);

		expect(listing?.status).toBe('published');
	});

	it('protects admin submission review lists from customer sessions', async () => {
		const denied = submissionGet(
			routeEvent('http://localhost/api/inventory/submissions?role=customer')
		);
		const allowed = submissionGet(
			routeEvent('http://localhost/api/inventory/submissions?role=agent')
		);

		expect(denied.status).toBe(403);
		expect(allowed.status).toBe(200);
	});

	it('persists account garage state against real vehicle slugs only', async () => {
		const vehicle = vehicles[0];
		const anonymousResponse = await garagePost({
			request: jsonRequest('http://localhost/api/account/garage', {
				compare: [vehicle.slug],
				favorites: [vehicle.slug]
			})
		});
		const postResponse = await garagePost({
			request: jsonRequest(
				'http://localhost/api/account/garage',
				{
					compare: [vehicle.slug, 'missing'],
					favorites: [vehicle.slug, 'missing'],
					role: 'customer'
				},
				'POST',
				prototypeHeaders('customer')
			)
		});
		const getResponse = garageGet(routeEvent('http://localhost/api/account/garage?role=customer'));
		const postBody = await readJson<{ compare: string[]; favorites: string[] }>(postResponse);
		const getBody = await readJson<{ compare: string[]; favorites: string[] }>(getResponse);

		expect(anonymousResponse.status).toBe(401);
		expect(postBody.data.compare).toEqual([vehicle.slug]);
		expect(postBody.data.favorites).toEqual([vehicle.slug]);
		expect(getBody.data.compare).toEqual([vehicle.slug]);
	});

	it('keeps saved garage state scoped to authenticated account sessions', async () => {
		const customerLogin = await loginPost({
			request: jsonRequest('http://localhost/api/auth/login', {
				email: 'customer@eliqauto.local',
				password: 'eliqauto prototype',
				role: 'customer'
			})
		});
		const agentLogin = await loginPost({
			request: jsonRequest('http://localhost/api/auth/login', {
				email: 'agent@eliqauto.local',
				password: 'eliqauto prototype',
				role: 'agent'
			})
		});
		const customerBody = await readJson<{ session: { token: string } }>(customerLogin);
		const agentBody = await readJson<{ session: { token: string } }>(agentLogin);
		const customerHeaders = {
			authorization: `Bearer ${customerBody.data.session.token}`
		};
		const agentHeaders = {
			authorization: `Bearer ${agentBody.data.session.token}`
		};

		await garagePost({
			request: jsonRequest(
				'http://localhost/api/account/garage',
				{
					compare: [vehicles[0].slug],
					favorites: [vehicles[0].slug]
				},
				'POST',
				customerHeaders
			)
		});
		await garagePost({
			request: jsonRequest(
				'http://localhost/api/account/garage',
				{
					compare: [vehicles[1].slug],
					favorites: [vehicles[1].slug]
				},
				'POST',
				agentHeaders
			)
		});

		const customerGarage = await readJson<{ compare: string[]; favorites: string[] }>(
			garageGet(routeEvent('http://localhost/api/account/garage', customerHeaders))
		);
		const agentGarage = await readJson<{ compare: string[]; favorites: string[] }>(
			garageGet(routeEvent('http://localhost/api/account/garage', agentHeaders))
		);

		expect(customerGarage.data.compare).toEqual([vehicles[0].slug]);
		expect(customerGarage.data.favorites).toEqual([vehicles[0].slug]);
		expect(agentGarage.data.compare).toEqual([vehicles[1].slug]);
		expect(agentGarage.data.favorites).toEqual([vehicles[1].slug]);
	});

	it('can intentionally clear saved account garage state', async () => {
		const postResponse = await garagePost({
			request: jsonRequest(
				'http://localhost/api/account/garage',
				{
					compare: [],
					favorites: [],
					role: 'customer'
				},
				'POST',
				prototypeHeaders('customer')
			)
		});
		const getResponse = garageGet(routeEvent('http://localhost/api/account/garage?role=customer'));
		const postBody = await readJson<{ compare: string[]; favorites: string[] }>(postResponse);
		const getBody = await readJson<{ compare: string[]; favorites: string[] }>(getResponse);

		expect(postBody.data.compare).toEqual([]);
		expect(postBody.data.favorites).toEqual([]);
		expect(getBody.data.compare).toEqual([]);
		expect(getBody.data.favorites).toEqual([]);
	});

	it('persists profile edits and validates preserved template password fields', async () => {
		const profileResponse = await profilePost({
			request: jsonRequest(
				'http://localhost/api/account/profile',
				{
					EmailAddress: 'customer@eliqauto.local',
					Phone: '+359 899 000 001',
					first_name: 'Eliqauto',
					last_name: 'Customer',
					role: 'customer'
				},
				'POST',
				prototypeHeaders('customer')
			)
		});
		const mismatchResponse = await passwordPost({
			request: jsonRequest(
				'http://localhost/api/account/password',
				{
					Email: 'customer@eliqauto.local',
					NewPassword: 'eliqauto-2026',
					RetypeNewPassword: 'different-value',
					role: 'customer'
				},
				'POST',
				prototypeHeaders('customer')
			)
		});
		const passwordResponse = await passwordPost({
			request: jsonRequest(
				'http://localhost/api/account/password',
				{
					Email: 'customer@eliqauto.local',
					NewPassword: 'eliqauto-2026',
					RetypeNewPassword: 'eliqauto-2026',
					role: 'customer'
				},
				'POST',
				prototypeHeaders('customer')
			)
		});
		const profileBody = await readJson<{
			phone: string;
			status: string;
			user: { role: string };
		}>(profileResponse);
		const passwordBody = await readJson<{ role: string; status: string }>(passwordResponse);

		expect(profileResponse.status).toBe(200);
		expect(profileBody.data.status).toBe('saved');
		expect(profileBody.data.phone).toBe('+359 899 000 001');
		expect(profileBody.data.user.role).toBe('customer');
		expect(mismatchResponse.status).toBe(400);
		expect(passwordResponse.status).toBe(200);
		expect(passwordBody.data.status).toBe('password-change-recorded');
		expect(passwordBody.data.role).toBe('customer');
	});

	it('uses authenticated account sessions over spoofed profile and password payload roles', async () => {
		const customerLogin = await loginPost({
			request: jsonRequest('http://localhost/api/auth/login', {
				email: 'customer@eliqauto.local',
				password: 'eliqauto prototype',
				role: 'customer'
			})
		});
		const customerBody = await readJson<{ session: { token: string } }>(customerLogin);
		const authHeaders = {
			authorization: `Bearer ${customerBody.data.session.token}`
		};
		const profileResponse = await profilePost({
			request: jsonRequest(
				'http://localhost/api/account/profile',
				{
					EmailAddress: 'admin@eliqauto.local',
					Phone: '+359 899 123 456',
					first_name: 'Session',
					last_name: 'Scoped',
					role: 'admin'
				},
				'POST',
				authHeaders
			)
		});
		const passwordResponse = await passwordPost({
			request: jsonRequest(
				'http://localhost/api/account/password',
				{
					Email: 'admin@eliqauto.local',
					NewPassword: 'customer-session-only',
					RetypeNewPassword: 'customer-session-only',
					role: 'admin'
				},
				'POST',
				authHeaders
			)
		});
		const profileBody = await readJson<{
			email: string;
			role: string;
			user: { email: string; role: string };
		}>(profileResponse);
		const passwordBody = await readJson<{ email: string; role: string }>(passwordResponse);

		expect(customerLogin.status).toBe(200);
		expect(profileResponse.status).toBe(200);
		expect(profileBody.data.email).toBe('customer@eliqauto.local');
		expect(profileBody.data.role).toBe('customer');
		expect(profileBody.data.user.email).toBe('customer@eliqauto.local');
		expect(profileBody.data.user.role).toBe('customer');
		expect(passwordResponse.status).toBe(200);
		expect(passwordBody.data.email).toBe('customer@eliqauto.local');
		expect(passwordBody.data.role).toBe('customer');
	});
});
