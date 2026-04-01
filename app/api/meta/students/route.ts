import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await query(
      `SELECT student_id, name, email, major
       FROM students
       ORDER BY name ASC`
    );

    return NextResponse.json({ students: result.rows });
  } catch (error) {
    console.error('Failed to fetch students:', error);
    return NextResponse.json({ error: 'Failed to fetch students.' }, { status: 500 });
  }
}
