import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { UpdateOpportunityPayload } from '@/types';

/**
 * GET /api/opportunities/[id]
 * Returns a single opportunity.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = supabaseServer();
  const { data, error } = await db
    .from('opportunities')
    .select('*, shopping_item:shopping_items(*, category:categories(*))')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

/**
 * PUT /api/opportunities/[id]
 * Updates an existing opportunity.
 * Body: { name?, date_from?, date_to?, value_decimal?, value_percentage? }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: UpdateOpportunityPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const allowed = ['name', 'date_from', 'date_to', 'value_decimal', 'value_percentage'];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) {
      updates[key] = (body as Record<string, unknown>)[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  if (updates.date_from && updates.date_to) {
    if (new Date(updates.date_to as string) < new Date(updates.date_from as string)) {
      return NextResponse.json(
        { error: 'date_to must be greater than or equal to date_from' },
        { status: 400 }
      );
    }
  }

  const db = supabaseServer();
  const { data, error } = await db
    .from('opportunities')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * DELETE /api/opportunities/[id]
 * Deletes an opportunity.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = supabaseServer();
  const { error } = await db
    .from('opportunities')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
