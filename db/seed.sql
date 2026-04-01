BEGIN;

INSERT INTO courses (course_code, course_name)
VALUES
  ('CS180', 'Problem Solving and Object-Oriented Programming'),
  ('CS182', 'Foundations of Computer Science'),
  ('CS240', 'Programming in C'),
  ('CS250', 'Computer Architecture'),
  ('CS251', 'Data Structures and Algorithms'),
  ('CS348', 'Information Systems'),
  ('MA261', 'Multivariate Calculus'),
  ('STAT350', 'Introduction to Statistics');

INSERT INTO students (name, email, major)
VALUES
  ('Alice Nguyen', 'alice.nguyen@purdue.edu', 'Computer Science'),
  ('Brian Lee', 'brian.lee@purdue.edu', 'Data Science'),
  ('Cathy Tran', 'cathy.tran@purdue.edu', 'Computer Engineering'),
  ('David Park', 'david.park@purdue.edu', 'Computer Science'),
  ('Emily Pham', 'emily.pham@purdue.edu', 'Statistics'),
  ('Frank Chen', 'frank.chen@purdue.edu', 'Mathematics'),
  ('Grace Kim', 'grace.kim@purdue.edu', 'Computer Science'),
  ('Henry Vo', 'henry.vo@purdue.edu', 'Cybersecurity'),
  ('Iris Lam', 'iris.lam@purdue.edu', 'Data Science'),
  ('Jackie Huynh', 'jackie.huynh@purdue.edu', 'Computer Engineering');

INSERT INTO ebooks (title, author, isbn, edition, course_id)
VALUES
  ('Introduction to Programming in Java', 'Robert Sedgewick', '9780136102262', '6th', (SELECT course_id FROM courses WHERE course_code = 'CS180')),
  ('Think Java', 'Allen Downey', '9781492072508', '2nd', (SELECT course_id FROM courses WHERE course_code = 'CS180')),
  ('Discrete Mathematics and Its Applications', 'Kenneth Rosen', '9781259676512', '8th', (SELECT course_id FROM courses WHERE course_code = 'CS182')),
  ('Logic in Computer Science', 'Michael Huth', '9781107039955', '2nd', (SELECT course_id FROM courses WHERE course_code = 'CS182')),
  ('C Programming: A Modern Approach', 'K. N. King', '9780393979503', '2nd', (SELECT course_id FROM courses WHERE course_code = 'CS240')),
  ('C Programming Absolute Beginner''s Guide', 'Greg Perry', '9780789751980', '3rd', (SELECT course_id FROM courses WHERE course_code = 'CS240')),
  ('Computer Systems: A Programmer''s Perspective', 'Randal Bryant', '9780134092669', '3rd', (SELECT course_id FROM courses WHERE course_code = 'CS250')),
  ('Digital Design and Computer Architecture', 'David Harris', '9780128200643', '2nd', (SELECT course_id FROM courses WHERE course_code = 'CS250')),
  ('Data Structures and Algorithms in Java', 'Michael Goodrich', '9781118771334', '6th', (SELECT course_id FROM courses WHERE course_code = 'CS251')),
  ('Algorithm Design', 'Jon Kleinberg', '9780321295354', '1st', (SELECT course_id FROM courses WHERE course_code = 'CS251')),
  ('Database System Concepts', 'Abraham Silberschatz', '9781260084504', '7th', (SELECT course_id FROM courses WHERE course_code = 'CS348')),
  ('SQL Queries for Mere Mortals', 'John Viescas', '9780134858333', '4th', (SELECT course_id FROM courses WHERE course_code = 'CS348')),
  ('Calculus: Early Transcendentals', 'James Stewart', '9781285741550', '8th', (SELECT course_id FROM courses WHERE course_code = 'MA261')),
  ('Multivariable Calculus', 'Ron Larson', '9781337275347', '11th', (SELECT course_id FROM courses WHERE course_code = 'MA261')),
  ('Introduction to Probability and Statistics', 'William Mendenhall', '9781305080454', '14th', (SELECT course_id FROM courses WHERE course_code = 'STAT350')),
  ('Statistics', 'David Freedman', '9780393929720', '4th', (SELECT course_id FROM courses WHERE course_code = 'STAT350')),
  ('Operating System Concepts', 'Abraham Silberschatz', '9781119800361', '10th', (SELECT course_id FROM courses WHERE course_code = 'CS240')),
  ('Clean Code', 'Robert Martin', '9780132350884', '1st', (SELECT course_id FROM courses WHERE course_code = 'CS251')),
  ('Designing Data-Intensive Applications', 'Martin Kleppmann', '9781449373320', '1st', (SELECT course_id FROM courses WHERE course_code = 'CS348')),
  ('Practical PostgreSQL', 'John Worsley', '9781904811367', '1st', (SELECT course_id FROM courses WHERE course_code = 'CS348'));

INSERT INTO listings (
  ebook_id,
  seller_student_id,
  trade_type,
  book_condition,
  price,
  status,
  posted_at,
  updated_at,
  note
)
VALUES
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9780136102262'), (SELECT student_id FROM students WHERE email = 'alice.nguyen@purdue.edu'), 'SELL', 'GOOD', 24.99, 'ACTIVE', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', 'Used for one semester, no water damage.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9781492072508'), (SELECT student_id FROM students WHERE email = 'brian.lee@purdue.edu'), 'SWAP', 'LIKE_NEW', NULL, 'ACTIVE', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', 'Looking to swap for a CS250 textbook.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9781259676512'), (SELECT student_id FROM students WHERE email = 'cathy.tran@purdue.edu'), 'BOTH', 'GOOD', 18.00, 'ACTIVE', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', 'Can sell or swap for MA261 material.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9781107039955'), (SELECT student_id FROM students WHERE email = 'david.park@purdue.edu'), 'SELL', 'FAIR', 12.50, 'RESERVED', NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days', 'Highlighted but still readable.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9780393979503'), (SELECT student_id FROM students WHERE email = 'emily.pham@purdue.edu'), 'SELL', 'GOOD', 20.00, 'ACTIVE', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', 'Includes practice files PDF.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9780789751980'), (SELECT student_id FROM students WHERE email = 'frank.chen@purdue.edu'), 'SWAP', 'FAIR', NULL, 'ACTIVE', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days', 'Swap for any CS251 book.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9780134092669'), (SELECT student_id FROM students WHERE email = 'grace.kim@purdue.edu'), 'BOTH', 'LIKE_NEW', 30.00, 'CLOSED', NOW() - INTERVAL '15 days', NOW() - INTERVAL '12 days', 'Already closed but kept for history.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9780128200643'), (SELECT student_id FROM students WHERE email = 'henry.vo@purdue.edu'), 'SELL', 'NEW', 35.00, 'ACTIVE', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', 'Unused code included.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9781118771334'), (SELECT student_id FROM students WHERE email = 'iris.lam@purdue.edu'), 'SELL', 'GOOD', 22.00, 'ACTIVE', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days', 'No annotations.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9780321295354'), (SELECT student_id FROM students WHERE email = 'jackie.huynh@purdue.edu'), 'SWAP', 'GOOD', NULL, 'ACTIVE', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days', 'Need database book in return.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9781260084504'), (SELECT student_id FROM students WHERE email = 'alice.nguyen@purdue.edu'), 'SELL', 'LIKE_NEW', 28.00, 'ACTIVE', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', 'Great condition, purchased new this semester.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9780134858333'), (SELECT student_id FROM students WHERE email = 'brian.lee@purdue.edu'), 'BOTH', 'FAIR', 10.00, 'RESERVED', NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days', 'Some pages have notes.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9781285741550'), (SELECT student_id FROM students WHERE email = 'cathy.tran@purdue.edu'), 'SELL', 'GOOD', 15.00, 'ACTIVE', NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days', 'Good for MA261 review.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9781337275347'), (SELECT student_id FROM students WHERE email = 'david.park@purdue.edu'), 'SELL', 'LIKE_NEW', 18.00, 'CLOSED', NOW() - INTERVAL '20 days', NOW() - INTERVAL '18 days', 'Sold already.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9781305080454'), (SELECT student_id FROM students WHERE email = 'emily.pham@purdue.edu'), 'SWAP', 'GOOD', NULL, 'ACTIVE', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days', 'Want to swap for CS180 book.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9780393929720'), (SELECT student_id FROM students WHERE email = 'frank.chen@purdue.edu'), 'SELL', 'FAIR', 9.00, 'ACTIVE', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days', 'Lower price due to wear.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9781119800361'), (SELECT student_id FROM students WHERE email = 'grace.kim@purdue.edu'), 'BOTH', 'GOOD', 19.00, 'ACTIVE', NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days', 'Flexible for swap or sale.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9780132350884'), (SELECT student_id FROM students WHERE email = 'henry.vo@purdue.edu'), 'SELL', 'LIKE_NEW', 26.00, 'ACTIVE', NOW() - INTERVAL '16 days', NOW() - INTERVAL '16 days', 'No marks, almost new.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9781449373320'), (SELECT student_id FROM students WHERE email = 'iris.lam@purdue.edu'), 'SELL', 'NEW', 32.00, 'ACTIVE', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', 'Bought by mistake, never used.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9781904811367'), (SELECT student_id FROM students WHERE email = 'jackie.huynh@purdue.edu'), 'SWAP', 'FAIR', NULL, 'ACTIVE', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days', 'Need CS182 discrete math book.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9780136102262'), (SELECT student_id FROM students WHERE email = 'brian.lee@purdue.edu'), 'BOTH', 'GOOD', 21.00, 'ACTIVE', NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days', 'Second copy, open to negotiation.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9781259676512'), (SELECT student_id FROM students WHERE email = 'david.park@purdue.edu'), 'SELL', 'GOOD', 17.00, 'CLOSED', NOW() - INTERVAL '21 days', NOW() - INTERVAL '20 days', 'Closed listing for report history.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9780393979503'), (SELECT student_id FROM students WHERE email = 'grace.kim@purdue.edu'), 'SWAP', 'LIKE_NEW', NULL, 'RESERVED', NOW() - INTERVAL '22 days', NOW() - INTERVAL '21 days', 'Reserved swap request.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9781260084504'), (SELECT student_id FROM students WHERE email = 'henry.vo@purdue.edu'), 'SELL', 'FAIR', 14.00, 'ACTIVE', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days', 'Older copy but complete.'),
  ((SELECT ebook_id FROM ebooks WHERE isbn = '9781449373320'), (SELECT student_id FROM students WHERE email = 'emily.pham@purdue.edu'), 'BOTH', 'LIKE_NEW', 29.00, 'ACTIVE', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', 'Can trade for CS250 materials.');

COMMIT;
