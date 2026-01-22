import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // executing raw SQL query
    const result = await query('SELECT version()');
    
    // Return the version string from the first row
    return NextResponse.json({ 
      success: true, 
      version: result.rows[0].version 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to database' }, 
      { status: 500 }
    );
  }
}

