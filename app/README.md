# Ops Products Management – Web Client

React 19 + TypeScript + Vite front‑end for the Ops Products Management System. It delivers responsive dashboards, owner/product CRUD workflows, and real-time validation with global error handling.

## Highlights

- **Rich page set**: product listing + inline previews, product create/edit form (image upload + owner insights), product-owner list with debounced filters, owner form with related products, and About page.
- **Light/Dark theme support**: `ThemeContext` + `useThemeMode()` hook wire up the MUI theme, allowing instant palette switching from the app bar.
- **Advanced error surfacing**: shared helpers (`utils/getErrorMessage`, `notistack` snackbars, form validation helpers) turn API errors into friendly user feedback.
- **Reusable UI kit**: generic `FormField`, `DataTable`, `FilterBar`, `ConfirmDialog`, etc. keep pages lean and consistent.
- **Testing strategy**: Vitest + Testing Library cover helper logic (form builders, filters) with utilities under `src/test` and `src/pages/**/helper.test.ts`.

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Create a `.env` (or `.env.local`) if you need to override Vite variables (e.g., `VITE_API_BASE_URL`).
3. Start the dev server
   ```bash
   npm run dev
   ```
4. Run type check + production build
   ```bash
   npm run build
   ```
5. Execute unit tests
   ```bash
   npm test
   ```

Default dev server runs at [http://localhost:5173](http://localhost:5173).

## Folder Structure

```
app/
├─ src/
│  ├─ App.tsx                    # Routes + layout shell
│  ├─ main.tsx                   # Entry, ThemeProvider, React.StrictMode
│  ├─ theme.ts                   # Shared palette + typography tokens
│  ├─ components/
│  │  ├─ common/                 # FormField, DataTable, FilterBar, etc.
│  │  └─ layout/AppLayout.tsx    # Drawer, app bar, theme toggle, logo
│  ├─ context/                   # ThemeContext definition/value helpers
│  ├─ hooks/                     # useThemeMode, useDebounce, useUrlParams
│  ├─ pages/
│  │  ├─ products/
│  │  │  ├─ list/                # ProductListPage + helper + tests
│  │  │  └─ form/                # ProductFormPage + helper + tests
│  │  ├─ product-owners/
│  │  │  ├─ list/                # Owner list with search/filter + tests
│  │  │  └─ form/                # Owner form + owner-product sidebar + tests
│  │  └─ about/                  # AboutPage + snapshot test
│  ├─ store/                     # RTK Query api slice + store hooks
│  ├─ types/                     # Shared TS interfaces (Product, Owner, API)
│  ├─ utils/                     # getErrorMessage, misc helpers
│  └─ test/                      # Testing utilities (providers, renderers)
├─ public/                       # Static assets
├─ package.json                  # Scripts + dependencies
└─ vite.config.ts                # Vite + React plugin configuration
```

## Pages & Interactions

- **/products** – Data table with sorting, filters, inline thumbnails, and bulk actions.
- **/products/new & /products/:id** – Two-column form (fields + image upload + owner insights) with optimistic toasts.
- **/product-owners** – Debounced email filter, search by name, and row actions.
- **/product-owners/new & /product-owners/:id** – Form on the left, owner-product list on the right with deep links into product edit pages.
- **/about** – Static info + team/mission copy.

## Testing

- `npm test` runs Vitest suites (helper logic, hooks) via `vitest.config.ts`.
- Helper-focused specs live next to the modules they cover (e.g., `src/pages/products/form/helper.test.ts`).
- `src/test/test-utils.tsx` centralizes render helpers (ThemeProvider, Router, Redux).

## Error Handling & UX

- All RTK Query endpoints funnel errors through `utils/getErrorMessage` → `notistack` snackbars.
- Forms run local validation helpers before hitting the API, showing field-level errors immediately.
- Data tables show graceful empty states with actionable CTAs when no results are found.

## Theming

- `ThemeContext` + `ThemeProvider` swap between light/dark palettes.
- App bar includes a gradient logotype and theme toggle button (sun/moon icons).
- Component spacing + typography align with `theme.ts` tokens for consistency.
