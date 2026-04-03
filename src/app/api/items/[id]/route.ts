import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

/**
 * GET /api/items/[id]
 * Returns a single shopping item with category and opportunities.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = supabaseServer();
  const { data, error } = await db
    .from('shopping_items')
    .select('*, category:categories(*), opportunities(*)')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

/**
 * PATCH /api/items/[id]
 * Updates a shopping item. Used primarily to toggle is_bought.
 * Body: { is_bought?, name?, unit?, quantity?, category_id? }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const allowed = ['is_bought', 'name', 'unit', 'quantity', 'category_id'];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) {
      updates[key] = body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const db = supabaseServer();
  const { data, error } = await db
    .from('shopping_items')
    .update(updates)
    .eq('id', id)
    .select('*, category:categories(*), opportunities(*)')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * DELETE /api/items/[id]
 * Deletes a shopping item and its related opportunities.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = supabaseServer();
  const { error } = await db
    .from('shopping_items')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
