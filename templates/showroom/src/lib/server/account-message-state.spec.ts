import { describe, expect, it } from 'vitest';
import { accountContext } from './account-dashboard-state';
import {
	accountMessageContactsData,
	accountMessageThreadData,
	getAccountMessageThreadData
} from './account-message-state';

describe('account-message-state', () => {
	it('builds customer message contacts from Eliqauto threads', () => {
		const context = accountContext('message.html', {
			routePath: 'account/messages',
			searchParams: new URLSearchParams('role=customer')
		});
		const contacts = accountMessageContactsData(context);

		expect(contacts.length).toBeGreaterThan(0);
		expect(contacts.filter((contact) => contact.active)).toHaveLength(1);
		expect(contacts[0]?.name).toContain('Eliqauto');
		expect(JSON.stringify(contacts)).not.toContain('john');
	});

	it('builds customer thread data with public contact context', () => {
		const thread = getAccountMessageThreadData('message.html', {
			routePath: 'account/messages',
			searchParams: new URLSearchParams('role=customer')
		});

		expect(thread.heading).toBe('Messages');
		expect(thread.contextHref).toBe('/contact');
		expect(thread.messages.at(-1)?.id).toBe('eliqauto-thread-response');
		expect(thread.messages.at(-1)?.sent).toBe(true);
		expect(thread.messages.some((message) => message.text.includes('Eliqauto'))).toBe(true);
	});

	it('builds admin inquiry threads with admin context and triage contacts', () => {
		const thread = getAccountMessageThreadData('message.html', {
			routePath: 'admin/inquiries',
			searchParams: new URLSearchParams('role=admin')
		});

		expect(thread.heading).toBe('Inquiries & Messages');
		expect(thread.contextHref).toBe('/admin/inquiries');
		expect(thread.contacts.length).toBeGreaterThan(1);
		expect(thread.activeContact.active).toBe(true);
		expect(thread.messages.length).toBeGreaterThan(1);
		expect(JSON.stringify(thread)).not.toContain('Eliqauto follow-up is ready');
	});

	it('keeps agent admin routes scoped to admin inquiry context', () => {
		const thread = getAccountMessageThreadData('message.html', {
			routePath: 'admin/messages',
			searchParams: new URLSearchParams('role=agent')
		});

		expect(thread.heading).toBe('Inquiries & Messages');
		expect(thread.contextHref).toBe('/admin/inquiries');
		expect(thread.contacts.filter((contact) => contact.active)).toHaveLength(1);
	});

	it('keeps direct context and exported helper output aligned', () => {
		const context = accountContext('message.html', {
			routePath: 'admin/messages',
			searchParams: new URLSearchParams('role=admin')
		});

		expect(accountMessageThreadData(context)).toEqual(
			getAccountMessageThreadData('message.html', {
				routePath: 'admin/messages',
				searchParams: new URLSearchParams('role=admin')
			})
		);
	});
});
