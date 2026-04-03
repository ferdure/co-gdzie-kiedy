import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { CreateOpportunityPayload } from '@/types';

/**
 * GET /api/opportunities
 * Returns opportunities with optional filters.
 * Supports query params: shopping_item_id, name, active_on (date ISO string)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get('shopping_item_id');
  const name = searchParams.get('name');
  const activeOn = searchParams.get('active_on');

  const db = supabaseServer();
  let query = db
    .from('opportunities')
    .select('*, shopping_item:shopping_items(*, category:categories(*))')
    .order('created_at', { ascending: true });

  if (itemId) {
    query = query.eq('shopping_item_id', itemId);
  }
  if (name) {
    query = query.ilike('name', `%${name}%`);
  }
  if (activeOn) {
    query = query.lte('date_from', activeOn).gte('date_to', activeOn);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * POST /api/opportunities
 * Creates a new opportunity for a shopping item.
 * Body: { shopping_item_id, name, date_from, date_to, value_decimal?, value_percentage? }
 */
export async function POST(request: NextRequest) {
  let body: CreateOpportunityPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { shopping_item_id, name, date_from, date_to, value_decimal, value_percentage } = body;

  if (!shopping_item_id || !name || !date_from || !date_to) {
    return NextResponse.json(
      { error: 'Missing required fields: shopping_item_id, name, date_from, date_to' },
      { status: 400 }
    );
  }

  if (new Date(date_to) < new Date(date_from)) {
    return NextResponse.json(
      { error: 'date_to must be greater than or equal to date_from' },
      { status: 400 }
    );
  }

  const db = supabaseServer();
  const { data, error } = await db
    .from('opportunities')
    .insert({
      shopping_item_id,
      name,
      date_from,
      date_to,
      value_decimal: value_decimal ?? null,
      value_percentage: value_percentage ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
