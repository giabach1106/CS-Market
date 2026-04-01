import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { BOOK_CONDITIONS, TRADE_TYPES } from '@/lib/listingValidation';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const courseIdRaw = searchParams.get('courseId');
    const tradeTypeRaw = searchParams.get('tradeType');
    const conditionRaw = searchParams.get('condition');
    const minPriceRaw = searchParams.get('minPrice');
    const maxPriceRaw = searchParams.get('maxPrice');
    const fromDateRaw = searchParams.get('fromDate');
    const toDateRaw = searchParams.get('toDate');

    const values: Array<number | string> = ['ACTIVE'];
    const whereClauses: string[] = ['l.status = $1'];

    if (courseIdRaw) {
      const courseId = Number(courseIdRaw);
      if (!Number.isInteger(courseId) || courseId <= 0) {
        return NextResponse.json({ error: 'courseId must be a positive integer.' }, { status: 400 });
      }
      values.push(courseId);
      whereClauses.push(`e.course_id = $${values.length}`);
    }

    if (tradeTypeRaw) {
      const tradeType = tradeTypeRaw.toUpperCase();
      if (!TRADE_TYPES.includes(tradeType as (typeof TRADE_TYPES)[number])) {
        return NextResponse.json(
          { error: 'tradeType must be one of SELL, SWAP, BOTH.' },
          { status: 400 }
        );
      }
      values.push(tradeType);
      whereClauses.push(`l.trade_type = $${values.length}`);
    }

    if (conditionRaw) {
      const condition = conditionRaw.toUpperCase();
      if (!BOOK_CONDITIONS.includes(condition as (typeof BOOK_CONDITIONS)[number])) {
        return NextResponse.json(
          { error: 'condition must be one of NEW, LIKE_NEW, GOOD, FAIR.' },
          { status: 400 }
        );
      }
      values.push(condition);
      whereClauses.push(`l.book_condition = $${values.length}`);
    }

    if (minPriceRaw) {
      const minPrice = Number(minPriceRaw);
      if (!Number.isFinite(minPrice) || minPrice < 0) {
        return NextResponse.json({ error: 'minPrice must be a valid non-negative number.' }, { status: 400 });
      }
      values.push(minPrice);
      whereClauses.push(`l.price IS NOT NULL AND l.price >= $${values.length}`);
    }

    if (maxPriceRaw) {
      const maxPrice = Number(maxPriceRaw);
      if (!Number.isFinite(maxPrice) || maxPrice < 0) {
        return NextResponse.json({ error: 'maxPrice must be a valid non-negative number.' }, { status: 400 });
      }
      values.push(maxPrice);
      whereClauses.push(`l.price IS NOT NULL AND l.price <= $${values.length}`);
    }

    if (fromDateRaw) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fromDateRaw)) {
        return NextResponse.json({ error: 'fromDate must be in YYYY-MM-DD format.' }, { status: 400 });
      }
      values.push(fromDateRaw);
      whereClauses.push(`l.posted_at::date >= $${values.length}::date`);
    }

    if (toDateRaw) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(toDateRaw)) {
        return NextResponse.json({ error: 'toDate must be in YYYY-MM-DD format.' }, { status: 400 });
      }
      values.push(toDateRaw);
      whereClauses.push(`l.posted_at::date <= $${values.length}::date`);
    }

    const baseFromAndWhere = `
      FROM listings l
      JOIN ebooks e ON e.ebook_id = l.ebook_id
      JOIN courses c ON c.course_id = e.course_id
      JOIN students s ON s.student_id = l.seller_student_id
      WHERE ${whereClauses.join(' AND ')}
    `;

    const rowsResult = await query(
      `SELECT
         l.listing_id,
         l.trade_type,
         l.book_condition,
         l.price,
         l.status,
         l.posted_at,
         l.note,
         e.title AS ebook_title,
         e.author AS ebook_author,
         c.course_code,
         c.course_name,
         s.name AS seller_name,
         s.email AS seller_email
       ${baseFromAndWhere}
       ORDER BY l.posted_at DESC, l.listing_id DESC`,
      values
    );

    const statsResult = await query(
      `SELECT
         COUNT(*)::int AS total_active,
         COALESCE(
           ROUND(AVG(CASE WHEN l.trade_type IN ('SELL', 'BOTH') THEN l.price END)::numeric, 2),
           0
         ) AS avg_price_sell,
         COUNT(*) FILTER (WHERE l.trade_type = 'SELL')::int AS sell_count,
         COUNT(*) FILTER (WHERE l.trade_type IN ('SWAP', 'BOTH'))::int AS swap_or_both_count
       ${baseFromAndWhere}`,
      values
    );

    const rawStats = statsResult.rows[0];
    const stats = {
      total_active: Number(rawStats.total_active || 0),
      avg_price_sell: Number(rawStats.avg_price_sell || 0),
      sell_count: Number(rawStats.sell_count || 0),
      swap_or_both_count: Number(rawStats.swap_or_both_count || 0),
    };

    return NextResponse.json({ rows: rowsResult.rows, stats });
  } catch (error) {
    console.error('Failed to generate available listings report:', error);
    return NextResponse.json(
      { error: 'Failed to generate available listings report.' },
      { status: 500 }
    );
  }
}
