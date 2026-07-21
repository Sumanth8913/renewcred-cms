# RenewCred CMS

A production-oriented, headless CMS for the RenewCred website: an authenticated
**Admin CMS** manages every piece of content as structured blocks, and a
**Public Website** renders that content dynamically — nothing is hardcoded.

Watch the complete project demonstration on YouTube:

▶️ https://youtu.be/7fddjK27B9M

## Project Structure

```text
renewcred-cms/
├── docker-compose.yml
├── README.md
├── .env.example
├── BLOCKS.md
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── uploads/
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
│
├── admin/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── store/
│   │   └── lib/
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
│
└── public-web/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   └── lib/
    ├── package.json
    ├── .env.example
    └── Dockerfile
```

## 1. Architecture Overview

**Headless, three-service architecture.** The backend owns all data and business
logic behind a REST API (`/api/v1`); neither frontend talks to MySQL directly.

- **Backend** — layered: `routes → controllers → services → Prisma → MySQL`.
  Controllers only parse the request and call a service; all business logic
  (slug generation, audit logging, pagination) lives in `services/`. Every
  response uses one consistent envelope (`{ success, message, data, errors }`),
  produced by `utils/apiResponse.js`, and every error funnels through a single
  `errorHandler` middleware.
- **Content model** — a `Page` is the one content primitive for the whole
  site: a full page (Home), a "Standard" (EV, Biochar, Methane, Renewable
  Energy), or a documentation page (Impartiality Policy). Content is stored as
  an ordered array of typed JSON **blocks**, never raw HTML — see
  [`BLOCKS.md`](./BLOCKS.md). This is what lets rich content (nested lists,
  tables, LaTeX equations, mixed content) live in one predictable structure
  instead of a pile of one-off fields.
- **Admin CMS** — Next.js (App Router) + Redux Toolkit. Redux holds
  cross-cutting state that many components need without prop-drilling —
  auth/session and page-list/dashboard data. Form-local state (the block
  editor's in-progress edits, individual form fields) stays in component
  state via `react-hook-form` and doesn't pollute the global store; that
  split is a deliberate answer to the assignment's "how much belongs in
  Redux" question, not an oversight.
- **Public website** — Next.js Server Components fetch published content
  directly from the API on every request (`cache: 'no-store'`), so publishing
  a change in the admin is visible on the next page load with no rebuild.
  A single `BlockRenderer` component switches on block type and renders each
  one independently; an unrecognized block type degrades to a small notice
  instead of crashing the page.

## 2. Tech Stack

| Layer      | Choice |
|------------|--------|
| Frontend (both apps) | Next.js 14 (App Router), Redux Toolkit, Tailwind CSS, Axios, React Hook Form |
| Rich text  | TipTap (admin editor) |
| Math       | KaTeX / react-katex (admin preview + public render) |
| Backend    | Node.js, Express.js |
| ORM / DB   | Prisma ORM, MySQL 8 |
| Auth       | JWT (jsonwebtoken) + bcrypt |
| Security   | Helmet, CORS, express-rate-limit, Zod validation |
| Infra      | Docker, Docker Compose |

All dependencies are free and open-source; no paid APIs or services are required.

## 3. Getting Started

### Option A — Docker Compose (recommended, one command)

Requires Docker Desktop / Docker Engine only.

```bash
git clone <your-repo-url> renewcred-cms
cd renewcred-cms
docker-compose up --build
```

This builds and starts four containers: MySQL, backend (runs migrations +
seed automatically on boot), admin CMS, and the public site.

- Public website → http://localhost:3000
- Admin CMS → http://localhost:3001
- Backend API → http://localhost:5000/api/v1
- Health check → http://localhost:5000/health

Default admin login (seeded automatically):

```
Email:    admin@renewcred.local
Password: Admin@123
```

**Note:** The default admin account is created by the seed script for demonstration purposes. 
Change the credentials before deploying the application to production.

### Option B — Run each service locally (no Docker)

Requires Node.js 18+/20 and a running MySQL 8 instance.

```bash
# 1. Backend
cd backend
cp .env.example .env        # edit DATABASE_URL / JWT_SECRET as needed
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev                  # http://localhost:5000

# 2. Admin CMS (new terminal)
cd admin
cp .env.example .env.local
npm install
npm run dev                  # http://localhost:3001

# 3. Public website (new terminal)
cd public-web
cp .env.example .env.local
npm install
npm run dev                  # http://localhost:3000
```

## 4. Environment Variables

See the root [`.env.example`](./.env.example) for a summary, and each
service's own `.env.example` for the authoritative list. No secrets are
committed — `JWT_SECRET` in the example files is a placeholder and must be
replaced for any real deployment.

## 5. API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| POST | `/api/v1/auth/login` | Public | Admin login, returns JWT |
| POST | `/api/v1/auth/logout` | Admin | Client-side token discard |
| GET  | `/api/v1/auth/me` | Admin | Current admin profile |
| GET  | `/api/v1/pages` | Admin | List/search/filter pages |
| GET  | `/api/v1/pages/:id` | Admin | Get one page (full detail, any status) |
| POST | `/api/v1/pages` | Admin/Editor | Create page |
| PUT  | `/api/v1/pages/:id` | Admin/Editor | Update page |
| DELETE | `/api/v1/pages/:id` | Admin | Delete page |
| POST | `/api/v1/pages/:id/duplicate` | Admin/Editor | Duplicate page as draft |
| GET  | `/api/v1/pages/dashboard/stats` | Admin | Dashboard counters + recent pages |
| GET  | `/api/v1/pages/public/slug/:slug` | Public | Fetch one **published** page |
| GET  | `/api/v1/categories` | Public | List standards categories |
| POST/PUT/DELETE | `/api/v1/categories` | Admin/Editor | Manage categories |
| GET/POST | `/api/v1/media`, `/api/v1/media/upload` | Admin | Media library |
| POST | `/api/v1/forms/submit` | Public | Buyer/Supplier/Contact/Newsletter forms |
| GET  | `/api/v1/forms/submissions` | Admin | View submissions |

Every response uses the envelope `{ success, message, data, errors }`.
Validation errors return `400` with an `errors` array of `{ field, message }`.
Authentication failures return `401` (no/invalid token) or `403` (wrong role).

## 6. Key Assumptions & Scope Decisions

The assignment intentionally leaves architecture, block types, and project
structure open. Decisions made, and why:

- **Database: MySQL via Prisma**, not MongoDB. The content is genuinely
  relational (pages ↔ categories ↔ authors ↔ audit logs), and Prisma's
  migrations give a clear, reviewable schema history — a better fit than a
  schemaless document store for this shape of data.
- **Block types implemented: heading, richtext, list, table, equation,
  image, callout, divider.** This covers every content requirement called
  out in the assignment (long-form text, paragraphs, lists, nested lists,
  tables, math equations, structured docs, mixed content) with block types
  that are genuinely reusable across the whole site, rather than shipping
  shallow stubs for dozens of narrowly-specific block types. The system is
  built to make adding a new type a 3-file, additive change — see
  [`BLOCKS.md`](./BLOCKS.md) — so growing the block library later doesn't
  require touching existing content or code.
- **One `Page` model, not separate models per page type.** A `pageType`
  field (`page` / `standard` / `doc`) plus optional fields (`version`,
  `publicationDate`, `consultationStart/End`) cover Home pages, Standards
  (EV/Biochar/Methane/Renewable Energy), and documentation pages (like
  Impartiality Policy) without duplicating the block-rendering pipeline
  three times.
- **Stateless JWT, no refresh tokens.** Sufficient for the assignment's
  "login/logout" requirement; a refresh-token rotation flow is noted under
  Future Improvements rather than added speculatively.
- **Redux Toolkit holds auth session + page list/dashboard data only.**
  Everything else (form drafts, block editor state, modal open/close) is
  local component state — see the Architecture section above for the
  reasoning.
- **Public site re-fetches on every request** (no ISR/static generation) so
  admin edits are visible immediately, matching "the public frontend should
  never contain hardcoded content." This trades some raw performance for
  correctness/simplicity; adding ISR with on-publish revalidation is a
  natural next step at higher traffic (see below).
- **Design fidelity**: the public site's Standards listing/detail pages and
  footer are built to match the provided screenshots and reference document
  structurally and visually (typography, layout, sticky TOC + version panel,
  newsletter footer), rather than a pixel-for-pixel Figma trace, since the
  Figma file wasn't accessible from this environment.

## 7. Future Improvements

- Refresh-token rotation and a server-side token blocklist for real logout revocation.
- ISR (`revalidate`) with an on-publish webhook from the admin to the public site, instead of `no-store` on every request, once traffic warrants it.
- Full-text search (e.g. MySQL `FULLTEXT` index or a search service) backing the "Global Search" in both apps.
- Drag-and-drop block reordering (currently up/down buttons) and drag-and-drop between blocks.
- Automated tests: the layered backend and the block-registry pattern on both frontends are structured specifically so unit tests (services, validators) and component tests (block editors/renderers) can be added without refactoring.
- Scheduled publishing (`publishAt` field already fits naturally into the existing `Page` model).

## 8. Seed Data

Running `npm run seed` (or the automatic seed on `docker-compose up`) creates:

- One default admin account
- Four default categories:
  - EV
  - Biochar
  - Methane
  - Renewable Energy
- Demo pages, including:
  - Home page
  - One published Standard page for each category
  - One sample documentation page (Impartiality Policy)
- Sample content blocks for the demo pages, including headings, rich text, lists, tables, images, and other supported block types required to demonstrate the CMS functionality.

The seeded data allows the application to be explored immediately after setup without requiring manual content creation.
