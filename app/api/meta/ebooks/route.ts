import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const courseId = request.nextUrl.searchParams.get('courseId');
    const params: Array<number> = [];
    const where: string[] = [];

    if (courseId) {
      const parsedCourseId = Number(courseId);
      if (!Number.isInteger(parsedCourseId) || parsedCourseId <= 0) {
        return NextResponse.json({ error: 'courseId must be a positive integer.' }, { status: 400 });
      }

      params.push(parsedCourseId);
      where.push(`e.course_id = $${params.length}`);
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
    const result = await query(
      `SELECT
         e.ebook_id,
         e.title,
         e.author,
         e.isbn,
         e.edition,
         e.course_id,
         c.course_code,
         c.course_name
       FROM ebooks e
       JOIN courses c ON c.course_id = e.course_id
       ${whereClause}
       ORDER BY e.title ASC`,
      params
    );

    return NextResponse.json({ ebooks: result.rows });
  } catch (error) {
    console.error('Failed to fetch ebooks:', error);
    return NextResponse.json({ error: 'Failed to fetch ebooks.' }, { status: 500 });
  }
}
