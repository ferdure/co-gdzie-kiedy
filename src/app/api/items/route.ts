import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { CreateItemPayload } from '@/types';

/**
 * GET /api/items
 * Returns all shopping items with their categories and opportunities.
 * Supports optional query params: category_id, is_bought
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('category_id');
  const isBought = searchParams.get('is_bought');

  const db = supabaseServer();
  let query = db
    .from('shopping_items')
    .select('*, category:categories(*), opportunities(*)')
    .order('created_at', { ascending: true });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  if (isBought !== null) {
    query = query.eq('is_bought', isBought === 'true');
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * POST /api/items
 * Creates a new shopping item.
 * Body: { category_id, name, unit, quantity }
 */
export async function POST(request: NextRequest) {
  let body: CreateItemPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { category_id, name, unit, quantity } = body;

  if (!category_id || !name || !unit || quantity == null) {
    return NextResponse.json(
      { error: 'Missing required fields: category_id, name, unit, quantity' },
      { status: 400 }
    );
  }

  const validUnits = ['piece', 'kg', 'g', 'l', 'ml', 'pack', 'bottle'];
  if (!validUnits.includes(unit)) {
    return NextResponse.json(
      { error: `Invalid unit. Must be one of: ${validUnits.join(', ')}` },
      { status: 400 }
    );
  }

  const db = supabaseServer();
  const { data, error } = await db
    .from('shopping_items')
    .insert({ category_id, name, unit, quantity })
    .select('*, category:categories(*), opportunities(*)')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
