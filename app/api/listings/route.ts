import { NextResponse } from 'next/server';
import { query, withTransaction } from '@/lib/db';
import { parseListingInput } from '@/lib/listingValidation';

export const dynamic = 'force-dynamic';

const LISTING_SELECT_SQL = `SELECT
  l.listing_id,
  l.ebook_id,
  e.title AS ebook_title,
  e.author AS ebook_author,
  e.isbn AS ebook_isbn,
  e.edition AS ebook_edition,
  c.course_id,
  c.course_code,
  c.course_name,
  l.seller_student_id,
  s.name AS seller_name,
  s.email AS seller_email,
  s.major AS seller_major,
  l.trade_type,
  l.book_condition,
  l.price,
  l.status,
  l.posted_at,
  l.updated_at,
  l.note
FROM listings l
JOIN ebooks e ON e.ebook_id = l.ebook_id
JOIN courses c ON c.course_id = e.course_id
JOIN students s ON s.student_id = l.seller_student_id`;

export async function GET() {
  try {
    const result = await query(
      `${LISTING_SELECT_SQL}
       ORDER BY l.posted_at DESC, l.listing_id DESC`
    );
    return NextResponse.json({ listings: result.rows });
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    return NextResponse.json({ error: 'Failed to fetch listings.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { data, error } = parseListingInput(body);
    if (!data) {
      return NextResponse.json({ error }, { status: 400 });
    }

    // transaction ensures atomic insert + fetch
    const listing = await withTransaction(async (client) => {
      // parameterized query prevents sql injection
      const insertResult = await client.query(
        `INSERT INTO listings (
           ebook_id,
           seller_student_id,
           trade_type,
           book_condition,
           price,
           status,
           note
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING listing_id`,
        [
          data.ebookId,
          data.sellerStudentId,
          data.tradeType,
          data.bookCondition,
          data.price,
          data.status,
          data.note,
        ]
      );

      const listingId = insertResult.rows[0]?.listing_id;

      const listingResult = await client.query(
        `${LISTING_SELECT_SQL}
         WHERE l.listing_id = $1`,
        [listingId]
      );

      return listingResult.rows[0];
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create listing:', error);

    if (error?.code === '23503') {
      return NextResponse.json(
        { error: 'ebookId or sellerStudentId does not reference an existing record.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to create listing.' }, { status: 500 });
  }
}
