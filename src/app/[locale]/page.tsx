import { ShoppingList } from '@/components/ShoppingList';
import { supabaseServer } from '@/lib/supabase';
import { ShoppingItem, Category } from '@/types';

async function getInitialData(): Promise<{
  items: ShoppingItem[];
  categories: Category[];
}> {
  const db = supabaseServer();

  const [itemsResult, categoriesResult] = await Promise.all([
    db
      .from('shopping_items')
      .select('*, category:categories(*), opportunities(*)')
      .order('created_at', { ascending: true }),
    db.from('categories').select('*').order('name', { ascending: true }),
  ]);

  return {
    items: (itemsResult.data as ShoppingItem[]) ?? [],
    categories: (categoriesResult.data as Category[]) ?? [],
  };
}

export default async function HomePage() {
  const { items, categories } = await getInitialData();

  return <ShoppingList initialItems={items} initialCategories={categories} />;
}
