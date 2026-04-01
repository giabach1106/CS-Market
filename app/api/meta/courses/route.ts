import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await query(
      `SELECT course_id, course_code, course_name
       FROM courses
       ORDER BY course_code ASC`
    );

    return NextResponse.json({ courses: result.rows });
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses.' }, { status: 500 });
  }
}
