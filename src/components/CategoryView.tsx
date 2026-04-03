'use client';

import { useTranslations } from 'next-intl';
import { ShoppingItem, Category, FilterState } from '@/types';
import { ItemRow } from './ItemRow';
import { getActiveOpportunities } from '@/lib/opportunities';
import { FolderOpen } from 'lucide-react';

interface CategoryViewProps {
  items: ShoppingItem[];
  categories: Category[];
  filter: FilterState;
  onToggleBought: (id: string, is_bought: boolean) => void;
}

export function CategoryView({ items, categories, filter, onToggleBought }: CategoryViewProps) {
  const t = useTranslations('items');
  const tCat = useTranslations('categories');

  // Filter items based on filter state
  const filteredItems = items.filter((item) => {
    if (filter.date || filter.opportunityName) {
      const opps = item.opportunities ?? [];
      let relevant = opps;
      if (filter.date) {
        relevant = getActiveOpportunities(relevant, filter.date);
      }
      if (filter.opportunityName) {
        relevant = relevant.filter(
          (o) => o.name.toLowerCase() === filter.opportunityName!.toLowerCase()
        );
      }
      return relevant.length > 0;
    }
    return true;
  });

  // Group items by category
  const grouped: Record<string, ShoppingItem[]> = {};
  for (const item of filteredItems) {
    const catId = item.category_id;
    if (!grouped[catId]) grouped[catId] = [];
    grouped[catId].push(item);
  }

  const sortedCategories = categories.filter((cat) => grouped[cat.id]?.length > 0);

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <FolderOpen size={48} strokeWidth={1} />
        <p className="mt-3 text-sm">{t('noItems')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedCategories.map((category) => (
        <div key={category.id}>
          <div className="flex items-center gap-2 mb-3">
            <FolderOpen size={15} className="text-indigo-400" />
            <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">
              {category.name}
            </h3>
            <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
              {grouped[category.id].length}
            </span>
          </div>
          <div className="space-y-2 pl-5 border-l-2 border-indigo-50">
            {grouped[category.id].map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                filter={filter}
                onToggleBought={onToggleBought}
                showOpportunityDots
              />
            ))}
          </div>
        </div>
      ))}

      {/* Items without a matched category */}
      {grouped['uncategorized'] && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FolderOpen size={15} className="text-gray-400" />
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              {tCat('noCategory')}
            </h3>
          </div>
          <div className="space-y-2 pl-5 border-l-2 border-gray-100">
            {grouped['uncategorized'].map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                filter={filter}
                onToggleBought={onToggleBought}
                showOpportunityDots
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
