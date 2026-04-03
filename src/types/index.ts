export type Unit = 'piece' | 'kg' | 'g' | 'l' | 'ml' | 'pack' | 'bottle';

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface ShoppingItem {
  id: string;
  category_id: string;
  name: string;
  unit: Unit;
  quantity: number;
  is_bought: boolean;
  created_at: string;
  category?: Category;
  opportunities?: Opportunity[];
}

export interface Opportunity {
  id: string;
  shopping_item_id: string;
  name: string;
  date_from: string;
  date_to: string;
  value_decimal: number | null;
  value_percentage: number | null;
  created_at: string;
}

export interface CreateItemPayload {
  category_id: string;
  name: string;
  unit: Unit;
  quantity: number;
}

export interface CreateOpportunityPayload {
  shopping_item_id: string;
  name: string;
  date_from: string;
  date_to: string;
  value_decimal?: number | null;
  value_percentage?: number | null;
}

export interface UpdateOpportunityPayload {
  name?: string;
  date_from?: string;
  date_to?: string;
  value_decimal?: number | null;
  value_percentage?: number | null;
}

export type ViewMode = 'category' | 'opportunity';

export interface FilterState {
  date: string | null;
  opportunityName: string | null;
}
