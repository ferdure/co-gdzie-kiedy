import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

/**
 * GET /api/categories
 * Returns all categories ordered by name.
 */
export async function GET() {
  const db = supabaseServer();
  const { data, error } = await db
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
