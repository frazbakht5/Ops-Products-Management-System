# Ops Products Management System

A full-stack reference implementation for tracking products and owners, showcasing a React 19 + Vite frontend backed by an Express + TypeORM API. The system includes real-time validation, image uploads, Swagger-documented routes, and comprehensive Jest/Vitest coverage.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Material UI, RTK Query, Notistack, Vitest + Testing Library.
- **Backend**: Node.js (Express 5), TypeORM + PostgreSQL, Joi validation, Swagger (swagger-jsdoc + swagger-ui-express), Jest + Supertest.
- **Tooling**: ESLint (flat config), Tailwind (utilities), ts-node-dev, pnpm/npm scripts.

## Project Overview

- **Products module**: list, create/edit with Base64 image uploads + MIME metadata, owner assignment, thumbnails, and inline status chips.
- **Product Owners module**: debounced filters, detailed form with linked products, and CRUD operations synced with backend validations.
- **Shared layout**: responsive drawer/app bar, custom infinity logo, and instant light/dark theme toggling.
- **Error experience**: centralized helper surfaces API errors via snackbars, form validation feedback, and empty-state CTAs.
- **Documentation**: backend exposes interactive Swagger UI at `/docs`, while each package ships with dedicated READMEs describing setup, scripts, and folder structure.

## Repos & Structure

```
New Ops Products Management System/
├─ app/             # React client (see app/README.md for details)
├─ backend-server/  # Express API + TypeORM (see backend-server/README.md)
└─ README.md        # (this file)
```

## Development Workflow

1. Install dependencies in both `app` and `backend-server`.
2. Configure backend `.env`, run migrations/seeds, then `npm run dev` in `backend-server`.
3. Launch `npm run dev` in `app` and point `VITE_API_BASE_URL` to the backend origin.

For deeper setup notes, refer to the READMEs inside each package.
