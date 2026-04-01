# CS348 Stage 2 - Student Ebook Exchange Marketplace

This project is a database-backed web application for exchanging ebooks between students.

Stack:
- Next.js 14 + TypeScript
- PostgreSQL 16 (Docker)
- Raw SQL using `pg` (no ORM)

## Stage 2 Features

### Requirement 1 - Main Table CRUD
- Main table: `listings`
- Full create, update, delete from `/listings`
- Supports dynamic data from supporting tables:
  - `students`
  - `courses`
  - `ebooks`
- Dropdown values are loaded from database (not hard-coded)

### Requirement 2 - Report Interface
- Report page: `/report`
- Endpoint: `GET /api/reports/available-listings`
- Filters:
  - Course
  - Trade type
  - Book condition
  - Min/Max price
  - Date range
- Statistics:
  - `total_active`
  - `avg_price_sell`
  - `sell_count`
  - `swap_or_both_count`

## Database Design

Tables:
- `students(student_id PK, name, email UNIQUE, major)`
- `courses(course_id PK, course_code UNIQUE, course_name)`
- `ebooks(ebook_id PK, title, author, isbn UNIQUE, edition, course_id FK -> courses)`
- `listings(listing_id PK, ebook_id FK -> ebooks, seller_student_id FK -> students, trade_type, book_condition, price, status, posted_at, updated_at, note)`

Business rules:
- `trade_type = SWAP` -> `price IS NULL`
- `trade_type IN (SELL, BOTH)` -> `price > 0`

Indexes:
- `idx_listings_status_posted_at(status, posted_at DESC)`
- `idx_listings_trade_type(trade_type)`
- `idx_ebooks_course_id(course_id)`
- `idx_listings_seller_student_id(seller_student_id)`

Schema and seed files:
- `db/schema.sql`
- `db/seed.sql`

## API Endpoints

Meta endpoints:
- `GET /api/meta/students`
- `GET /api/meta/courses`
- `GET /api/meta/ebooks?courseId=`

Listings CRUD:
- `GET /api/listings`
- `POST /api/listings`
- `PUT /api/listings/{id}`
- `DELETE /api/listings/{id}`

Report:
- `GET /api/reports/available-listings?courseId=&tradeType=&condition=&minPrice=&maxPrice=&fromDate=&toDate=`

## Run Locally

1. Install dependencies:
```bash
npm install
```

2. Start PostgreSQL container:
```bash
docker compose up -d
```

3. Initialize schema + seed data:
```bash
npm run db:init
```

4. Run the app:
```bash
npm run dev
```

5. Open:
- `http://localhost:3000/`
- `http://localhost:3000/listings`
- `http://localhost:3000/report`

## Demo Checklist (Stage 2)

- Show schema (`db/schema.sql`) with PK/FK/indexes
- Show seed data (`db/seed.sql`)
- Demonstrate CRUD on `listings` page:
  - create a listing
  - update a listing
  - delete a listing
- Demonstrate report filters and statistics on `/report`
- Show at least one dynamic dropdown query/API call from DB
- Re-run report after data changes to show updated stats

## Notes

- This project intentionally avoids login/auth for Stage 2 scope control.
- Cloud deployment is not required for Stage 2.
