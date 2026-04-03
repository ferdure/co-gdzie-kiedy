# co-gdzie-kiedy

> **co-gdzie-kiedy** ("what-where-when") – A smart shopping list that tracks promotions and deals for your items.

## Features

- 🛒 **Shopping list** with categories and items (various units: kg, g, l, ml, pcs, pack, bottle)
- 🏷️ **Opportunities** – attach promotions/deals to items with date ranges, prices, and discount percentages
- 📅 **Filters** – filter by date (today / tomorrow / custom date) and opportunity name
- 👁️ **Two views** – category view with opportunity dots on hover, opportunity-focused view
- ✅ **Mark as bought** – track what's already in your cart
- 🌐 **Bilingual** – Polish 🇵🇱 and English 🇬🇧
- 🔌 **REST API** – full CRUD for shopping items and opportunities

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, Lucide React icons |
| Backend | Supabase (PostgreSQL) |
| i18n | next-intl v4 |
| Testing | Jest, @testing-library/react |

## Getting Started

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run the database migration

In your Supabase SQL editor, run the contents of:
```
supabase/migrations/001_initial_schema.sql
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in your Supabase URL and anon key from **Project Settings → API**.

### 4. Install dependencies and run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000` (redirects to `/pl/`).

## API Reference

### Shopping Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/items` | List all items (with categories and opportunities) |
| `POST` | `/api/items` | Create a new shopping item |
| `GET` | `/api/items/:id` | Get a single item |
| `PATCH` | `/api/items/:id` | Update item (e.g., `{ "is_bought": true }`) |
| `DELETE` | `/api/items/:id` | Delete item and its opportunities |

#### POST /api/items body
```json
{
  "category_id": "uuid",
  "name": "Milk",
  "unit": "l",
  "quantity": 2
}
```

Valid units: `piece`, `kg`, `g`, `l`, `ml`, `pack`, `bottle`

### Opportunities

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/opportunities` | List opportunities (supports `active_on`, `name`, `shopping_item_id` filters) |
| `POST` | `/api/opportunities` | Create a new opportunity |
| `GET` | `/api/opportunities/:id` | Get a single opportunity |
| `PUT` | `/api/opportunities/:id` | Update an opportunity |
| `DELETE` | `/api/opportunities/:id` | Delete an opportunity |

#### POST /api/opportunities body
```json
{
  "shopping_item_id": "uuid",
  "name": "Weekend Sale",
  "date_from": "2025-04-05",
  "date_to": "2025-04-07",
  "value_decimal": 3.99,
  "value_percentage": 20
}
```

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/categories` | List all categories |

## Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

## Architecture

See [docs/architecture.md](docs/architecture.md) for detailed architectural decisions.

## Project Structure

```
src/
├── app/
│   ├── [locale]/         # Locale-aware pages
│   │   ├── layout.tsx    # Root locale layout with i18n provider
│   │   └── page.tsx      # Main shopping list page (server component)
│   ├── api/              # REST API routes
│   │   ├── items/        # Shopping items CRUD
│   │   ├── opportunities/# Opportunities CRUD
│   │   └── categories/   # Category list
│   └── globals.css
├── components/           # React UI components
│   ├── ShoppingList.tsx  # Main client component (state management)
│   ├── CategoryView.tsx  # Category-grouped list view
│   ├── OpportunityView.tsx # Opportunity-focused view
│   ├── FilterBar.tsx     # Date + name filters
│   ├── ItemRow.tsx       # Single item row
│   ├── OpportunityDot.tsx# Dot indicator with hover tooltip
│   ├── OpportunityCard.tsx# Opportunity detail card
│   ├── AddItemModal.tsx  # Add item modal form
│   └── LanguageSwitch.tsx# PL/EN toggle
├── lib/
│   ├── supabase.ts       # Supabase client
│   └── opportunities.ts  # Date/opportunity utilities
├── messages/
│   ├── en.json           # English translations
│   └── pl.json           # Polish translations
└── types/
    └── index.ts          # TypeScript type definitions

supabase/
└── migrations/
    └── 001_initial_schema.sql

docs/
└── architecture.md       # Architectural decision records
```

