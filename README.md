# Haven House Safe Service Navigation Assistant

A Next.js (React + Node.js) website for Haven House, including a safety-first
service-navigation chatbot.

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

Requires Node.js 18.17+ (Next.js 14 requirement).

## What's in here

- **`app/`** — Next.js App Router pages (Home, Services, Find Support,
  Resources, About, Contact, Privacy, Accessibility) and two API routes
  (`/api/chat`, `/api/contact`), all running on the Node.js server.
- **`components/`** — React components: header, footer, crisis banner,
  service cards, FAQ accordion, the chat widget, and the contact form.
- **`content/`** — The five permitted data entities as plain JS modules:
  `services.js` (SERVICE), `eligibility.js` (ELIGIBILITY_CRITERIA),
  `faqs.js` (FAQ), `resources.js` (RESOURCE), `safetyTriggers.js`
  (SAFETY_TRIGGER). No database is required for v1 — edit these files and
  redeploy. This can be swapped for a headless CMS later without touching
  the components.
- **`lib/chatEngine.js`** — All chatbot logic: safety-trigger detection
  (checked first, every turn), then FAQ/service/contact matching, with a
  neutral fallback if nothing matches. Deterministic keyword matching —
  no LLM call, nothing for it to "decide" to say that isn't pre-approved
  content.
- **`lib/siteConfig.js`** — Every placeholder phone number, email, and
  address in one file. **Replace these before launch.**

## What's deliberately NOT in here

- No `CHAT_SESSION` / `CHAT_MESSAGE` tables or any persistence of chat
  content — `/api/chat` is stateless per request.
- No user accounts, login, or `USER_ACCOUNT` table.
- No admin dashboard or CMS UI.
- No content approval/review workflow.
- No live chat or staff hand-off — the chatbot's only response to a
  request to speak to a person, or to a detected safety trigger, is the
  static approved contact number.

## Before going live

1. Replace every `[PLACEHOLDER]` value in `lib/siteConfig.js` and in
   `content/*.js` with Haven House–approved content.
2. Have a qualified reviewer expand and validate
   `content/safetyTriggers.js` — the shipped list is a small illustrative
   starting point, not a clinically validated detection set.
3. Wire up a real email provider in `app/api/contact/route.js`.
4. Run an accessibility audit (automated + manual keyboard/screen-reader
   pass) against WCAG 2.1 AA.
5. Confirm hosting does not log full request bodies for `/api/chat` at
   the infrastructure level (e.g. reverse proxy / CDN access logs),
   since that would undermine the "no chat history" commitment even
   though the application code itself stores nothing.
# HavenHouse
# HavenHouse
# HavenHouse
