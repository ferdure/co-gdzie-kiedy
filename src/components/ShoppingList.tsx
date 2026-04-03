'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ShoppingItem, Category, FilterState, ViewMode, Unit } from '@/types';
import { CategoryView } from './CategoryView';
import { OpportunityView } from './OpportunityView';
import { FilterBar } from './FilterBar';
import { LanguageSwitch } from './LanguageSwitch';
import { AddItemModal } from './AddItemModal';
import { FolderOpen, Layers, Plus, ShoppingCart } from 'lucide-react';

interface ShoppingListProps {
  initialItems: ShoppingItem[];
  initialCategories: Category[];
}

export function ShoppingList({ initialItems, initialCategories }: ShoppingListProps) {
  const t = useTranslations('app');
  const tNav = useTranslations('nav');

  const [items, setItems] = useState<ShoppingItem[]>(initialItems);
  const [categories] = useState<Category[]>(initialCategories);
  const [viewMode, setViewMode] = useState<ViewMode>('category');
  const [filter, setFilter] = useState<FilterState>({ date: null, opportunityName: null });
  const [showAddModal, setShowAddModal] = useState(false);

  // Collect unique opportunity names for the filter dropdown
  const opportunityNames = Array.from(
    new Set(
      items.flatMap((item) => item.opportunities?.map((o) => o.name) ?? [])
    )
  ).sort();

  const toggleBought = useCallback(async (id: string, is_bought: boolean) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_bought } : item))
    );
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_bought }),
      });
      if (!res.ok) {
        // Revert on error
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, is_bought: !is_bought } : item))
        );
      }
    } catch {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_bought: !is_bought } : item))
      );
    }
  }, []);

  const handleAddItem = async (payload: {
    category_id: string;
    name: string;
    unit: Unit;
    quantity: number;
  }) => {
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? 'Failed to add item');
    }
    const newItem: ShoppingItem = await res.json();
    setItems((prev) => [...prev, newItem]);
  };

  const totalItems = items.length;
  const boughtItems = items.filter((i) => i.is_bought).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <ShoppingCart size={20} className="text-indigo-600" />
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-none">{t('title')}</h1>
              <p className="text-[10px] text-gray-400">{t('subtitle')}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="font-medium text-indigo-600">{boughtItems}</span>
            <span>/</span>
            <span>{totalItems}</span>
          </div>

          <LanguageSwitch />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 p-1 shadow-sm">
          <button
            onClick={() => setViewMode('category')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'category'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <FolderOpen size={14} />
            {tNav('categoryView')}
          </button>
          <button
            onClick={() => setViewMode('opportunity')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'opportunity'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Layers size={14} />
            {tNav('opportunityView')}
          </button>
        </div>

        {/* Filters */}
        <FilterBar
          filter={filter}
          opportunityNames={opportunityNames}
          onChange={setFilter}
        />

        {/* List */}
        {viewMode === 'category' ? (
          <CategoryView
            items={items}
            categories={categories}
            filter={filter}
            onToggleBought={toggleBought}
          />
        ) : (
          <OpportunityView
            items={items}
            filter={filter}
            onToggleBought={toggleBought}
          />
        )}
      </main>

      {/* FAB - Add item */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all flex items-center justify-center z-30 active:scale-95"
        aria-label="Add item"
      >
        <Plus size={24} />
      </button>

      {/* Add Item Modal */}
      {showAddModal && (
        <AddItemModal
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddItem}
        />
      )}
    </div>
  );
}
