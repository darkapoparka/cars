# Inquiry database

The template supports an isolated, disposable Neon database for demonstrating a saved inquiry and admin triage. Each dealer must receive a separate database and credentials. No dealer data belongs in the template database.

## Configure

1. Copy `.env.example` to the ignored `.env` and supply `DATABASE_URL` (pooled application connection) and `DATABASE_URL_UNPOOLED` (direct migration connection).
2. Set a private `TEMPLATE_ADMIN_EMAIL` and unique `TEMPLATE_ADMIN_PASSWORD` of at least 16 characters.
3. Run `npm run db:migrate` against the intended disposable branch, then restart the dev server.
4. Submit a synthetic contact inquiry, sign in at `/admin/login`, and verify the record and status update at `/admin/inquiries`. Restart the server and confirm the record remains. Restarting expires the process-local admin session; sign in again.

The Drizzle schema is `src/lib/server/inquiry-schema.ts`; reviewed migrations live in `drizzle/`. After schema edits, run `npm run db:generate`, review the generated SQL, and apply with `npm run db:migrate`. Migrations use the direct URL and do not seed contact records automatically. Never run migrations against another dealer's database.

## Boundaries

- With `DATABASE_URL` configured, inquiries are saved to Postgres. A connection or schema failure returns an error; the application never silently falls back to memory.
- Without it, the original synthetic inquiry preview remains in memory and resets on restart. It is not proof of durable delivery.
- Durable inquiry reads and updates are admin-only. Prototype role query strings, prototype login passwords, agent roles, and customer accounts cannot unlock them. The configured template admin login uses an HTTP-only session cookie and random session tokens. Sessions remain process-local: this is a bounded template demonstrator, not a complete dealer identity system.
- Legacy account previews, agent badges, and user cards deliberately retain synthetic records; they never receive database contacts. Admin inquiry lists, overview lead counts, and triage use the database. Other CMS records and account interactions remain their existing prototypes.
- Saving an inquiry does not send email, SMS, or any dealer notification. No delivery promise should be inferred from a successful save. Configure and verify real notifications, identity, hosting, spam controls, retention, and legal copy before collecting real dealer contacts.
- For a dealer handoff, create an empty private database, apply the migrations, replace both connection strings and admin credentials, then verify submission, protected read/update, and restart persistence. Do not copy the disposable database or its environment file.

## Verification

Run `npm run test:unit -- --run src/lib/server/inquiry-flow.spec.ts`, `npm run check`, and `npm run build`. Live proof additionally requires the form → saved record → authenticated admin update → process restart roundtrip. A mocked unit test does not establish that the deployed database or notification channel works.

## Disposable demonstration configured on 2026-09-13

- Project: `cars-template-import-demo` (`summer-truth-40512866`), Frankfurt, Postgres 17.
- Empty base branch: `template-base`. Application branch: `template-demo` (`br-winter-sound-b2zyhwy1`), database `template_demo`.
- Local connection strings and generated administrator credentials live only in the ignored `.env`. They are not part of a release or dealer copy.
- Migration applied successfully. Synthetic vehicle, import, and contact enquiries were submitted through the browser and independently read from Neon. Authenticated admin read/update succeeded; the import status remained after an application process restart. Anonymous prototype-role access returned 401.
- Contact, service, vehicle, and import enquiry forms use durable inquiry storage when configured. Sell-car submissions remain a separate local demo backed by the ignored `.daynight-cms/` runtime directory, not the Neon inquiry table. Their success text identifies the demo. Other CMS/account data remains synthetic.

Create a new empty database for each dealer. Replace the connection strings and credentials in that dealer's environment; never point a dealer at this demonstration branch. No template enquiries are transferred. Provider publication and real notification delivery are separate verification steps.
