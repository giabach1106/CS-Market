# CS348 Stage 2 Demo Script (Ready-to-Speak)

Use this script for a 8-10 minute demo video.

## Before Recording (30 seconds)
Run these commands in terminal:

```bash
docker compose up -d
npm run db:init
npm run dev
```

Open:
- `http://localhost:3000`
- VS Code with these files:
  - `db/schema.sql`
  - `app/api/listings/route.ts`
  - `app/api/reports/available-listings/route.ts`

## 0:00 - 1:00 Introduction
Screen:
- Browser on Home page (`/`)

Say:
> This project is a student ebook exchange marketplace built with Next.js, TypeScript, PostgreSQL, and raw SQL.  
> For CS348 Stage 2, my main CRUD table is listings.  
> I also implemented a report interface for available listings with dynamic filters and aggregate statistics.

## 1:00 - 2:00 Database Design
Screen:
- VS Code -> `db/schema.sql`

Say:
> My database has four tables: students, courses, ebooks, and listings.  
> Listings is the main table and has foreign keys to ebooks and students.  
> I added constraints for business rules: SWAP listings must have null price, and SELL or BOTH listings must have price greater than zero.  
> I also created indexes for reporting and filtering performance.

Point to:
- PK/FK definitions
- `listings_price_rule_chk`
- index definitions

## 2:00 - 5:30 Requirement 1: CRUD on Listings
Screen:
- Browser -> `/listings`

Say:
> This page supports create, update, and delete operations on the listings table.  
> The dropdowns for students, courses, and ebooks are loaded dynamically from the database.

### Create
Action:
1. Choose course, ebook, seller
2. Set trade type = SELL
3. Set condition, price, status
4. Click Create Listing

Say:
> I am creating a new listing record.  
> After submission, the new row appears in the listings table below.

### Update
Action:
1. Click Edit on the new row
2. Change price or status
3. Click Update Listing

Say:
> Now I am updating the same listing to show the update workflow.

### Delete
Action:
1. Click Delete on another row
2. Confirm delete

Say:
> Finally, I am deleting one listing record, and the table refreshes immediately.

## 5:30 - 6:30 Show Dynamic DB-driven UI
Screen:
- VS Code -> `app/api/meta/students/route.ts`
- `app/api/meta/courses/route.ts`
- `app/api/meta/ebooks/route.ts`

Say:
> These endpoints query PostgreSQL directly using raw SQL.  
> The UI dropdown options are generated from these API responses, so nothing is hard-coded.

## 6:30 - 8:30 Requirement 2: Report + Statistics
Screen:
- Browser -> `/report`

Say:
> This report page filters only active listings by course, trade type, condition, price range, and date range.

Action:
1. Show initial report with no filters
2. Apply filters: course + trade type + min/max price
3. Click Apply Filters

Say:
> The result table updates based on selected filters.  
> The statistics cards are computed with SQL aggregates, including total active listings, average sell price, sell count, and swap or both count.

### Show data change effect
Action:
1. Go back to `/listings`
2. Update one listing status or price
3. Return to `/report`
4. Apply same filters

Say:
> After changing listing data, I rerun the report and the results and statistics update accordingly.

## 8:30 - 9:30 SQL Proof for Report
Screen:
- VS Code -> `app/api/reports/available-listings/route.ts`

Say:
> This route builds SQL conditions from user filters and executes two queries: one for report rows and one for aggregate statistics.  
> This demonstrates raw SQL integration in application code for Stage 2 requirements.

## 9:30 - 10:00 Closing
Screen:
- Browser (either `/listings` or `/report`)

Say:
> This demo shows both required Stage 2 features: full CRUD on one main table and one dynamic report interface backed by database queries.

## Optional 60-second Short Version
Say:
> This is a student ebook exchange app built with Next.js and PostgreSQL using raw SQL.  
> My main CRUD table is listings, shown here on the listings page where I can create, update, and delete records.  
> The dropdown options are loaded dynamically from the database.  
> On the report page, I filter active listings and show SQL-based aggregate statistics.  
> This satisfies both Stage 2 requirements.
