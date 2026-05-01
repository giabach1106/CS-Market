# CS348 Semester Project: Student Ebook Exchange Marketplace

**Live Demo:** [Your deployed URL here]  
**GitHub:** [Your repository URL here]

---

## Project Overview

This marketplace allows students to list, sell, or swap textbooks for their courses. The application demonstrates core database concepts including CRUD operations, dynamic reporting with filtering, SQL injection protection, database indexing, and transaction management.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes, Raw SQL |
| Database | PostgreSQL 16 |
| Deployment | AWS EC2, RDS PostgreSQL |

---

## Features

### Stage 2 Requirements

**Requirement 1 - CRUD Operations (`/listings`)**
- Create, update, and delete listings
- Dynamic dropdowns populated from database (students, courses, ebooks)
- Input validation with business rules (SWAP = no price, SELL/BOTH = price > 0)

**Requirement 2 - Report Interface (`/report`)**
- Filter active listings by: course, trade type, condition, price range, date range
- Real-time aggregate statistics (total count, average price, type breakdown)
- Results update immediately when data changes

### Stage 3 Requirements

**SQL Injection Protection**
- All queries use parameterized statements (`$1`, `$2`, etc.)
- Input validation layer before database operations
- See: `lib/db.ts`, `app/api/listings/route.ts`

**Database Indexes**
- 7 strategically placed indexes with documented justifications
- Optimizes: report filtering, sorting, joins, price range queries
- See: `db/schema.sql` (lines 60-110)

**Transactions & Isolation Levels**
- CRUD operations wrapped in transactions
- Uses READ COMMITTED isolation (PostgreSQL default)
- Atomic operations with automatic rollback on failure
- See: `lib/db.ts` (withTransaction function)

---

## Database Design

### Entity-Relationship Summary

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

### Indexes and Their Purpose

| Index | Columns | Supports |
|-------|---------|----------|
| `idx_listings_status_posted_at` | (status, posted_at DESC) | Report filtering + sorting |
| `idx_listings_trade_type` | trade_type | Trade type filter + aggregates |
| `idx_listings_book_condition` | book_condition | Condition filter |
| `idx_listings_price` | price (WHERE NOT NULL) | Price range queries |
| `idx_ebooks_course_id` | course_id | Course filter joins |
| `idx_listings_seller_student_id` | seller_student_id | Seller info joins |
| `idx_listings_ebook_id` | ebook_id | Ebook info joins |

---

## API Endpoints

### Meta Endpoints (Dynamic UI)
- `GET /api/meta/students` - All students for dropdown
- `GET /api/meta/courses` - All courses for dropdown
- `GET /api/meta/ebooks?courseId=` - Ebooks filtered by course

### Listings CRUD
- `GET /api/listings` - List all listings
- `POST /api/listings` - Create listing (with transaction)
- `PUT /api/listings/{id}` - Update listing (with transaction)
- `DELETE /api/listings/{id}` - Delete listing (with transaction)

### Report
- `GET /api/reports/available-listings?filters...` - Filtered report with stats

---

## Local Development

### Prerequisites
- Node.js 20+
- Docker and Docker Compose
- Git

### Setup

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/CS-Market.git
cd CS-Market

# Install dependencies
npm install

# Start PostgreSQL container
docker compose up -d

# Initialize database (schema + seed data)
npm run db:init

# Start development server
npm run dev
```

### Access

- Home: http://localhost:3000
- Listings CRUD: http://localhost:3000/listings
- Report: http://localhost:3000/report

---

## AWS Deployment (Extra Credit)

The application is deployed to AWS using:
- **EC2** (t3.micro) - Runs Next.js application
- **RDS PostgreSQL** (db.t3.micro) - Managed database
- **Custom domain** via Namecheap DNS

See `AWS_DEPLOYMENT.md` for detailed deployment instructions.

---

## AI Usage

### Tools Used
- **Cursor IDE with Claude** - AI-powered code editor

### Tasks AI Assisted With

1. **Code Generation & Scaffolding**
   - Generated initial Next.js project structure
   - Created TypeScript interfaces for type safety
   - Wrote boilerplate for API routes

2. **SQL Query Construction**
   - Helped write complex JOIN queries for report
   - Suggested index creation syntax
   - Assisted with transaction wrapper implementation

3. **Documentation**
   - Generated inline code comments explaining concepts
   - Created README structure and deployment guide
   - Wrote demo script outline

4. **Debugging & Troubleshooting**
   - Diagnosed foreign key constraint errors
   - Fixed TypeScript type mismatches
   - Resolved async/await issues in transaction handling

### How I Verified and Modified AI Output

1. **Code Review**
   - Manually reviewed all generated code for correctness
   - Verified SQL syntax against PostgreSQL documentation
   - Tested each CRUD operation manually

2. **Testing**
   - Ran the application locally and tested all features
   - Verified database constraints work as expected
   - Confirmed report filters produce correct results

3. **Modifications Made**
   - Adjusted generated queries to match exact table/column names
   - Modified transaction isolation levels based on course material
   - Rewrote some validation logic for edge cases
   - Updated styling to match project design

4. **Learning Verification**
   - Cross-referenced AI suggestions with course lecture slides
   - Confirmed index choices align with B+ tree theory from class
   - Verified isolation level choice matches course concepts

### Conclusion

AI tools accelerated development of boilerplate code and documentation, but all database concepts (indexes, transactions, SQL injection protection) were implemented based on understanding from CS348 lectures. Every line of code was reviewed, tested, and modified as needed to ensure correctness and alignment with course requirements.

---

## Project Structure

```
CS-Market/
├── app/
│   ├── api/
│   │   ├── health/route.ts        # DB connection check
│   │   ├── listings/
│   │   │   ├── route.ts           # GET/POST listings
│   │   │   └── [id]/route.ts      # PUT/DELETE listing
│   │   ├── meta/
│   │   │   ├── courses/route.ts   # Dynamic dropdown data
│   │   │   ├── ebooks/route.ts
│   │   │   └── students/route.ts
│   │   └── reports/
│   │       └── available-listings/route.ts
│   ├── listings/page.tsx          # CRUD interface
│   ├── report/page.tsx            # Report interface
│   ├── page.tsx                   # Home page
│   └── layout.tsx
├── db/
│   ├── schema.sql                 # Tables + indexes
│   └── seed.sql                   # Sample data
├── lib/
│   ├── db.ts                      # DB connection + transactions
│   ├── listingValidation.ts       # Input validation
│   └── types.ts                   # TypeScript interfaces
├── scripts/
│   └── init-db.js                 # DB initialization script
├── AWS_DEPLOYMENT.md              # Cloud deployment guide
├── docker-compose.yml             # Local PostgreSQL
└── README.md
```

---

## License

This project was created for CS348 (Information Systems) at Purdue University.
For educational purposes only.
