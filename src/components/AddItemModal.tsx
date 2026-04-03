'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Category, Unit } from '@/types';
import { X, Plus } from 'lucide-react';

const UNITS: Unit[] = ['piece', 'kg', 'g', 'l', 'ml', 'pack', 'bottle'];

interface AddItemModalProps {
  categories: Category[];
  onClose: () => void;
  onAdd: (item: { category_id: string; name: string; unit: Unit; quantity: number }) => Promise<void>;
}

export function AddItemModal({ categories, onClose, onAdd }: AddItemModalProps) {
  const t = useTranslations('items');
  const tUnits = useTranslations('units');

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [unit, setUnit] = useState<Unit>('piece');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      await onAdd({ category_id: categoryId, name: name.trim(), unit, quantity });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Plus size={16} className="text-indigo-500" />
            <h2 className="font-semibold text-gray-800">{t('addItem')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t('itemName')} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder={t('itemName')}
              autoFocus
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t('category')}
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity + Unit */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {t('quantity')}
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={0.01}
                step={0.01}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {t('unit')}
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as Unit)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {tUnits(u)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '...' : t('addItem')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
