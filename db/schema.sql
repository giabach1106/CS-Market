BEGIN;

DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS ebooks;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS courses;

CREATE TABLE courses (
  course_id BIGSERIAL PRIMARY KEY,
  course_code VARCHAR(20) NOT NULL UNIQUE,
  course_name VARCHAR(150) NOT NULL
);

CREATE TABLE students (
  student_id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  major VARCHAR(120) NOT NULL
);

CREATE TABLE ebooks (
  ebook_id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(150) NOT NULL,
  isbn VARCHAR(20) NOT NULL UNIQUE,
  edition VARCHAR(40) NOT NULL,
  course_id BIGINT NOT NULL REFERENCES courses(course_id)
);

CREATE TABLE listings (
  listing_id BIGSERIAL PRIMARY KEY,
  ebook_id BIGINT NOT NULL REFERENCES ebooks(ebook_id),
  seller_student_id BIGINT NOT NULL REFERENCES students(student_id),
  trade_type VARCHAR(10) NOT NULL CHECK (trade_type IN ('SELL', 'SWAP', 'BOTH')),
  book_condition VARCHAR(15) NOT NULL CHECK (book_condition IN ('NEW', 'LIKE_NEW', 'GOOD', 'FAIR')),
  price NUMERIC(10, 2),
  status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'RESERVED', 'CLOSED')),
  posted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  note TEXT,
  CONSTRAINT listings_price_rule_chk CHECK (
    (trade_type = 'SWAP' AND price IS NULL) OR
    (trade_type IN ('SELL', 'BOTH') AND price IS NOT NULL AND price > 0)
  )
);

-- indexes

-- report: WHERE status='ACTIVE' ORDER BY posted_at DESC
CREATE INDEX idx_listings_status_posted_at ON listings(status, posted_at DESC);

-- report: filter by trade_type, aggregate stats
CREATE INDEX idx_listings_trade_type ON listings(trade_type);

-- report: filter by course (join optimization)
CREATE INDEX idx_ebooks_course_id ON ebooks(course_id);

-- listing display: join with students table
CREATE INDEX idx_listings_seller_student_id ON listings(seller_student_id);

-- report: price range filter (partial index, excludes null)
CREATE INDEX idx_listings_price ON listings(price) WHERE price IS NOT NULL;

-- report: filter by condition
CREATE INDEX idx_listings_book_condition ON listings(book_condition);

-- listing display: join with ebooks table
CREATE INDEX idx_listings_ebook_id ON listings(ebook_id);

COMMIT;
