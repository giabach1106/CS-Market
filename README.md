# CS348 Semester Project: Student Ebook Exchange Marketplace

A database-backed web application for exchanging ebooks between students. Built with Next.js, TypeScript, and PostgreSQL using raw SQL queries.

**Live Demo:** https://cs348.kiroz.xyz

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 18, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes, Raw SQL |
| Database | PostgreSQL 16 |
| Deployment | AWS EC2, RDS PostgreSQL |

---

## Features

**Listings Management (`/listings`)**
- Create, update, and delete listings
- Dynamic dropdowns populated from database (students, courses, ebooks)
- Input validation with business rules (SWAP = no price, SELL/BOTH = price > 0)

**Browse & Report (`/report`)**
- Filter active listings by: course, trade type, condition, price range, date range
- Real-time aggregate statistics (total count, average price, type breakdown)
- Results update immediately when data changes

**SQL Injection Protection**
- All queries use parameterized statements (`$1`, `$2`, etc.)
- Input validation layer before database operations

**Database Indexes**
- 7 indexes optimized for report filtering, sorting, joins, price range queries

**Transactions**
- CRUD operations wrapped in transactions with READ COMMITTED isolation
- Atomic operations with automatic rollback on failure

---

## Database Design

### Entity-Relationship

```
courses (1) ──── (N) ebooks (1) ──── (N) listings (N) ──── (1) students
```

### Tables

| Table | Primary Key | Description |
|-------|-------------|-------------|
| `courses` | `course_id` | Academic courses |
| `students` | `student_id` | Marketplace users |
| `ebooks` | `ebook_id` | Books linked to courses |
| `listings` | `listing_id` | Main CRUD table - items for sale/swap |

### Indexes

| Index | Supports |
|-------|----------|
| `idx_listings_status_posted_at` | Report filtering + sorting |
| `idx_listings_trade_type` | Trade type filter + aggregates |
| `idx_listings_book_condition` | Condition filter |
| `idx_listings_price` | Price range queries |
| `idx_ebooks_course_id` | Course filter joins |
| `idx_listings_seller_student_id` | Seller info joins |
| `idx_listings_ebook_id` | Ebook info joins |

---

## API Endpoints

### Meta Endpoints
- `GET /api/meta/students` - All students for dropdown
- `GET /api/meta/courses` - All courses for dropdown
- `GET /api/meta/ebooks?courseId=` - Ebooks filtered by course

### Listings CRUD
- `GET /api/listings` - List all listings
- `POST /api/listings` - Create listing
- `PUT /api/listings/{id}` - Update listing
- `DELETE /api/listings/{id}` - Delete listing

### Report
- `GET /api/reports/available-listings?filters...` - Filtered report with stats

---

```bash
npm install
docker compose up -d
npm run db:init
npm run dev
```

## AI Usage

### Tools Used
- **Cursor IDE with Claude**

### Tasks AI Assisted With

1. **Project Scaffolding**
   - Generated initial Next.js project structure
   - Created TypeScript interfaces
   - Wrote boilerplate for API routes

2. **Mock Data Generation**
   - Generated realistic sample data for courses (CS180, CS251, CS348, etc.)
   - Generated ebook entries with real textbook titles, authors, and ISBNs
   - Created diverse listing entries with varying conditions, prices, and trade types

3. **Debugging**
   - Diagnosed foreign key constraint errors
   - Fixed TypeScript type mismatches

### How I Verified and Modified AI Output

1. **Code Review**
   - Manually reviewed all generated code
   - Tested each CRUD operation
   - Verified database constraints work correctly

2. **Testing**
   - Ran application locally and on AWS
   - Confirmed report filters produce correct results
   - Verified statistics update after data changes

3. **Learning Verification**
   - Cross-referenced with course lecture slides
   - Confirmed index choices align with B+ tree theory
   - Verified isolation level choice matches course concepts

---
