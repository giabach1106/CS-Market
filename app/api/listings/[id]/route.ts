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

function parseId(value: string): number | null {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

function resolveListingId(request: Request, rawParamId?: string): number | null {
  const fromParams = rawParamId ? parseId(rawParamId) : null;
  if (fromParams) {
    return fromParams;
  }

  const pathname = new URL(request.url).pathname;
  const fallback = pathname.split('/').pop();
  if (!fallback) {
    return null;
  }

  return parseId(fallback);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listingId = resolveListingId(request, id);
    if (!listingId) {
      return NextResponse.json({ error: 'Invalid listing id.' }, { status: 400 });
    }

    const body = await request.json();
    const { data, error } = parseListingInput(body);
    if (!data) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const result = await withTransaction(async (client) => {
      // parameterized update
      const updateResult = await client.query(
        `UPDATE listings
         SET
           ebook_id = $1,
           seller_student_id = $2,
           trade_type = $3,
           book_condition = $4,
           price = $5,
           status = $6,
           note = $7,
           updated_at = NOW()
         WHERE listing_id = $8
         RETURNING listing_id`,
        [
          data.ebookId,
          data.sellerStudentId,
          data.tradeType,
          data.bookCondition,
          data.price,
          data.status,
          data.note,
          listingId,
        ]
      );

      if (updateResult.rowCount === 0) {
        throw new Error('NOT_FOUND');
      }

      const listingResult = await client.query(
        `${LISTING_SELECT_SQL}
         WHERE l.listing_id = $1`,
        [listingId]
      );

      return listingResult.rows[0];
    });

    return NextResponse.json({ listing: result });
  } catch (error: any) {
    console.error('Failed to update listing:', error);

    if (error?.message === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    }

    if (error?.code === '23503') {
      return NextResponse.json(
        { error: 'ebookId or sellerStudentId does not reference an existing record.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to update listing.' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listingId = resolveListingId(request, id);
    if (!listingId) {
      return NextResponse.json({ error: 'Invalid listing id.' }, { status: 400 });
    }

    const success = await withTransaction(async (client) => {
      const result = await client.query(
        `DELETE FROM listings WHERE listing_id = $1`,
        [listingId]
      );
      
      if (result.rowCount === 0) {
        throw new Error('NOT_FOUND');
      }
      
      return true;
    });

    return NextResponse.json({ success });
  } catch (error: any) {
    console.error('Failed to delete listing:', error);
    
    if (error?.message === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Failed to delete listing.' }, { status: 500 });
  }
}
