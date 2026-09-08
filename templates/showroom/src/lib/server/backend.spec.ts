import { describe, expect, it } from 'vitest';
import { agents } from '$lib/data/agents';
import { vehicles } from '$lib/data/vehicles';
import {
	authenticateEliqautoUser,
	canAccessEliqautoRoute,
	requireEliqautoPageSession
} from './auth';
import { createInquiry, listInquiriesForRole } from './inquiries';
import { createVehicleSubmission, listVehicleSubmissions } from './inventory';
import { createMessage, listMessagesForRole } from './messages';
import { canRoleAccessEliqautoRoute } from './roles';

describe('Eliqauto backend prototype modules', () => {
	it('authenticates known role-aware users without exposing template credentials', () => {
		const session = authenticateEliqautoUser({
			email: 'admin@eliqauto.local',
			password: 'eliqauto prototype',
			role: 'admin'
		});
		const denied = authenticateEliqautoUser({
			email: 'admin@eliqauto.local',
			password: 'short',
			role: 'admin'
		});

		expect(session?.role).toBe('admin');
		expect(session?.token).toContain('session-');
		expect(denied).toBeUndefined();
		expect(canAccessEliqautoRoute(session!, 'admin/users')).toBe(true);
		expect(canRoleAccessEliqautoRoute('agent', 'admin/inquiries')).toBe(true);
		expect(canRoleAccessEliqautoRoute('agent', 'admin/users')).toBe(false);
	});

	it('resolves and authorizes protected page sessions in one server helper', () => {
		const accountRequest = new Request('https://eliqauto.test/account');
		const customerAdminRequest = new Request('https://eliqauto.test/admin?role=customer');
		const agentInquiryRequest = new Request('https://eliqauto.test/admin/inquiries?role=agent');
		const captureThrown = (run: () => unknown) => {
			try {
				run();
				return undefined;
			} catch (thrown) {
				return thrown as { body?: { message?: string }; status?: number };
			}
		};
		const defaultSession = requireEliqautoPageSession(
			accountRequest,
			'account',
			new URLSearchParams()
		);
		const deniedSession = captureThrown(() =>
			requireEliqautoPageSession(
				customerAdminRequest,
				'admin',
				new URLSearchParams('role=customer')
			)
		);

		expect(defaultSession.role).toBe('customer');
		expect(deniedSession).toMatchObject({
			body: { message: 'Eliqauto account role cannot access this route' },
			status: 403
		});
		expect(
			requireEliqautoPageSession(
				agentInquiryRequest,
				'admin/inquiries',
				new URLSearchParams('role=agent')
			).role
		).toBe('agent');
	});

	it('stores inquiries with vehicle, contact, agent, route, role, status, and timestamp context', () => {
		const vehicle = vehicles[0];
		const inquiry = createInquiry({
			email: 'lead@example.com',
			message: 'Please confirm source history.',
			name: 'Lead Example',
			phone: '+359 000 000',
			routePath: `/inventory/${vehicle.slug}`,
			source: 'vehicle-detail',
			userRole: 'customer',
			vehicleSlug: vehicle.slug
		});

		expect(inquiry.vehicleTitle).toBe(vehicle.title);
		expect(inquiry.assignedAgentSlug).toBe(vehicle.agentSlug);
		expect(inquiry.contactEmail).toBe('lead@example.com');
		expect(inquiry.status).toBe('new');
		expect(inquiry.createdAt).toMatch(/T/);
		expect(listInquiriesForRole('admin')[0].id).toBe(inquiry.id);
	});

	it('assigns consultant page inquiries to the contacted Eliqauto agent', () => {
		const agent = agents[1];
		const inquiry = createInquiry({
			email: 'agent-lead@example.com',
			message: 'Can you help check a Import & leasing candidate?',
			name: 'Agent Lead',
			routePath: `/agents/${agent.slug}`,
			source: 'agent-detail',
			userRole: 'customer'
		});

		expect(inquiry.assignedAgentSlug).toBe(agent.slug);
		expect(inquiry.contactName).toBe('Agent Lead');
		expect(inquiry.routePath).toBe(`/agents/${agent.slug}`);
		expect(inquiry.vehicleSlug).toBeUndefined();
	});

	it('stores messages and vehicle submissions for account/admin flows', () => {
		const message = createMessage({
			email: 'customer@example.com',
			message: 'Can I get the appointment options?',
			name: 'Customer Example',
			routePath: '/account/messages',
			threadId: 'eliqauto-sales',
			vehicleSlug: vehicles[0].slug
		});
		const submission = createVehicleSubmission({
			email: 'seller@example.com',
			expectedPrice: '25000 EUR',
			message: 'Client vehicle with service history.',
			mileage: '120000 km',
			name: 'Seller Example',
			phone: '+359 111 111',
			routePath: '/sell-your-car',
			source: 'sell-your-car',
			title: 'Client BMW',
			vin: 'WBATEST'
		});

		expect(listMessagesForRole('customer')[0].id).toBe(message.id);
		expect(submission.status).toBe('submitted');
		expect(listVehicleSubmissions()[0].id).toBe(submission.id);
	});
});
