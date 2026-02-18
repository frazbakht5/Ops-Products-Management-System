# Ops Products Management – Backend Server

This package contains the Express + TypeORM backend that powers the Ops Products Management System. It exposes secured REST APIs for managing products, product owners, seeding reference data, and serving interactive Swagger documentation.

## Getting Started

1. **Install dependencies**
	```bash
	npm install
	```
2. **Configure environment** – copy `.env.example` to `.env` and set Postgres connection variables plus any optional ports.
3. **Run database migrations / sync** – ensure the target database exists and is reachable.
4. **Seed sample data** (adds baseline product owners referenced in the UI):
	```bash
	npm run seed
	```
5. **Start the dev server**
	```bash
	npm run dev
	```
6. **Open Swagger docs** at [http://localhost:4000/api-docs](http://localhost:4000/api-docs) to explore and test every endpoint.

## Available Scripts

- `npm run dev` – start development server with auto-reload.
- `npm run build` – compile TypeScript into the `dist` folder.
- `npm start` – run the compiled server (after `npm run build`).
- `npm run seed` – populate the database with initial owners/products.
- `npm test` – execute Jest unit/integration tests.

## Project Structure

```
backend-server/
├─ src/
│  ├─ app.ts                # Express app wiring (middleware, routes, swagger)
│  ├─ server.ts             # HTTP server bootstrap
│  ├─ config/               # App configuration schemas & types
│  ├─ database/             # TypeORM datasource + seed script
│  ├─ modules/
│  │  ├─ products/
│  │  │  ├─ controller/     # ProductController + tests
│  │  │  ├─ service/        # ProductService + tests
│  │  │  ├─ product.entity.ts
│  │  │  ├─ product.interface.ts
│  │  │  ├─ product.routes.ts
│  │  │  └─ product.schema.ts (Joi validation + Swagger components)
│  │  └─ product-owners/
│  │     ├─ controller/     # ProductOwnerController + tests
│  │     ├─ service/        # ProductOwnerService + tests
│  │     ├─ product-owner.entity.ts
│  │     ├─ product-owner.interface.ts
│  │     ├─ product-owner.routes.ts
│  │     └─ product-owner.schema.ts
│  ├─ utils/                # Error handling, Joi helpers, responses
│  └─ logger.ts             # Winston configuration
├─ jest.config.js
├─ tsconfig.json
└─ package.json
```

## API Documentation

- **Swagger UI:** [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

These docs stay in sync via `swagger-jsdoc`, pulling descriptions from route annotations.

## Notes

- All product creation/update routes now support optional Base64 images plus MIME metadata.
- Every change is validated with Joi before reaching controllers.
- Tests (Jest + Supertest) cover services and controllers—run `npm test` after backend edits.
