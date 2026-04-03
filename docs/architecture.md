# Architectural Decisions – co-gdzie-kiedy

## Overview

**co-gdzie-kiedy** ("what-where-when") is a shopping list application that helps users find the best prices and deals for their shopping items. The key differentiator is the concept of **Opportunities** – structured metadata that can be attached to shopping items to track promotions, sales, and discounts.

---

## ADR-001: Technology Stack

### Status: Accepted

### Context
We needed a simple, maintainable full-stack web application with:
- A relational backend capable of filtering by date ranges
- A clean, responsive UI
- International support (Polish, English)
- Minimal infrastructure overhead

### Decision
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) with TypeScript
- **UI**: [Tailwind CSS v4](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/) for icons
- **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL + REST API + RLS)
- **i18n**: [next-intl v4](https://next-intl-docs.vercel.app/)
- **Testing**: Jest + React Testing Library

### Rationale
- Next.js App Router enables server-side rendering for fast initial loads and co-locates API routes
- Tailwind CSS v4 provides utility-first styling with near-zero bundle overhead
- Supabase provides a hosted PostgreSQL database with a JavaScript client, RLS policies, and an instant REST API
- next-intl integrates deeply with Next.js App Router for locale-based routing

---

## ADR-002: Database Schema

### Status: Accepted

### Entity Model

```
categories (id, name, created_at)
    │
    └── shopping_items (id, category_id, name, unit, quantity, is_bought, created_at)
            │
            └── opportunities (id, shopping_item_id, name, date_from, date_to,
                               value_decimal, value_percentage, created_at)
```

### Design Decisions
1. **Categories are flat** – no hierarchy needed for a shopping list. Name is a single string (not split by locale) because category names will typically be added in one language by the user.
2. **Units are enum-like** – stored as `TEXT` with a `CHECK` constraint to one of: `piece`, `kg`, `g`, `l`, `ml`, `pack`, `bottle`. Adding new units requires a migration.
3. **Opportunities use date ranges** – `date_from` and `date_to` are `DATE` columns with a constraint `date_to >= date_from`. This allows efficient index-based range queries.
4. **Optional opportunity values** – `value_decimal` and `value_percentage` are nullable, as not all promotions have a specific price or discount percentage.
5. **Soft-buy pattern** – `is_bought` is a boolean on the item; there is no separate purchase history table in v1.
6. **RLS enabled** – Row Level Security is enabled on all tables. The default policy allows all operations for simplicity; in production, this should be restricted to authenticated users.

---

## ADR-003: API Design

### Status: Accepted

### Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/items` | List all items with categories and opportunities |
| POST | `/api/items` | Create a new shopping item |
| GET | `/api/items/[id]` | Get a single item |
| PATCH | `/api/items/[id]` | Update item (e.g., toggle `is_bought`) |
| DELETE | `/api/items/[id]` | Delete an item (cascades to opportunities) |
| GET | `/api/categories` | List all categories |
| GET | `/api/opportunities` | List opportunities with filters |
| POST | `/api/opportunities` | Create a new opportunity |
| GET | `/api/opportunities/[id]` | Get a single opportunity |
| PUT | `/api/opportunities/[id]` | Update an opportunity |
| DELETE | `/api/opportunities/[id]` | Delete an opportunity |

### Design Decisions
1. **REST over GraphQL** – REST is simpler to implement and sufficient for this use case
2. **PATCH for partial updates** – Items support PATCH for partial updates (mainly `is_bought` toggling)
3. **PUT for full opportunity updates** – Opportunities use PUT since the full object is always sent on update
4. **Query parameters for filtering** – Opportunities support `active_on`, `name`, and `shopping_item_id` query params
5. **Cascade deletes** – Deleting an item deletes its opportunities via database CASCADE

---

## ADR-004: Frontend Architecture

### Status: Accepted

### Two-View System

The shopping list has two views selectable via tab control:

1. **Category View** (`CategoryView`): Items grouped by category with colored opportunity dots on each item. Dots use hover tooltips to show opportunity details without cluttering the list.

2. **Opportunity View** (`OpportunityView`): Items with at least one matching opportunity are shown with their opportunities listed as cards. Items without opportunities are hidden.

### Filter System

The `FilterBar` component provides two orthogonal filters:
- **Date filter**: Quick buttons for Today/Tomorrow plus a date picker for custom dates. Shows only items where at least one opportunity is active on the selected date.
- **Name filter**: Dropdown populated with all distinct opportunity names from the loaded data. Allows filtering to a specific promotion type.

Filters are combined with AND logic (both must match).

### Optimistic Updates

The mark-as-bought action uses optimistic UI updates:
1. The item's `is_bought` state is toggled immediately in local state
2. The PATCH request is sent to the API
3. On error, the state is reverted

This provides instant feedback without waiting for the network.

### Data Loading Strategy

Initial data (items + categories) is loaded server-side in the page component, passed as props to the client component. This ensures:
- No loading spinner on initial render
- SEO-friendly HTML
- Subsequent mutations are handled client-side with fetch calls

---

## ADR-005: Internationalisation (i18n)

### Status: Accepted

- **Supported locales**: `pl` (Polish, default) and `en` (English)
- **Locale detection**: URL-based (`/pl/...` and `/en/...`). The proxy (formerly middleware) redirects `/` to `/pl/`.
- **Message format**: JSON files under `src/messages/{locale}.json`
- **Server and client components**: `getTranslations` is used in server components, `useTranslations` in client components

### Why Polish as default?
The application name "co-gdzie-kiedy" is Polish ("what-where-when"), and the primary user base is Polish-speaking.

---

## ADR-006: Testing Strategy

### Status: Accepted

### Coverage Areas
1. **Business logic** (`src/lib/opportunities.ts`) – Fully unit tested. Covers date range checking, status calculation, filtering.
2. **API validation** – Tests cover input validation rules for items and opportunities.

### Not Tested (v1 scope)
- UI components (would require mocking next-intl and Supabase)
- API routes end-to-end (would require a test Supabase instance)
- Integration tests

### Testing Tools
- **Jest** with `next/jest.js` preset for handling Next.js module transforms
- **@testing-library/jest-dom** for DOM matchers

---

## ADR-007: Security Considerations

### Status: Accepted

1. **Environment variables** – Supabase credentials are stored in `.env.local` (gitignored). The `.env.example` file documents required variables without secrets.
2. **RLS** – Row Level Security is enabled. For production, restrict policies to authenticated users.
3. **Input validation** – API routes validate all required fields, unit enum values, and date range constraints before writing to the database.
4. **No secrets in code** – The Supabase service role key is optional and only used server-side.

---

## Future Improvements

- [ ] User authentication (Supabase Auth)
- [ ] Per-user data isolation with RLS
- [ ] Opportunity CRUD UI (currently API-only)
- [ ] Category management UI
- [ ] Push notifications for expiring opportunities
- [ ] Mobile PWA manifest
- [ ] E2E tests with Playwright
