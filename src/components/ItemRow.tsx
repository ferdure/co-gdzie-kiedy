'use client';

import { useTranslations } from 'next-intl';
import { ShoppingItem, FilterState } from '@/types';
import { OpportunityDot } from './OpportunityDot';
import { getActiveOpportunities } from '@/lib/opportunities';
import { Check, ShoppingCart, PackageOpen } from 'lucide-react';

interface ItemRowProps {
  item: ShoppingItem;
  filter: FilterState;
  onToggleBought: (id: string, is_bought: boolean) => void;
  showOpportunityDots?: boolean;
}

export function ItemRow({ item, filter, onToggleBought, showOpportunityDots = true }: ItemRowProps) {
  const t = useTranslations('items');
  const tUnits = useTranslations('units');

  const activeOpps = filter.date
    ? getActiveOpportunities(item.opportunities ?? [], filter.date)
    : (item.opportunities ?? []);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
        item.is_bought
          ? 'bg-gray-50 border-gray-100 opacity-60'
          : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100'
      }`}
    >
      {/* Toggle bought button */}
      <button
        onClick={() => onToggleBought(item.id, !item.is_bought)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          item.is_bought
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-gray-300 hover:border-indigo-400'
        }`}
        aria-label={item.is_bought ? t('markUnbought') : t('markBought')}
        title={item.is_bought ? t('markUnbought') : t('markBought')}
      >
        {item.is_bought && <Check size={12} strokeWidth={3} />}
      </button>

      {/* Item name and details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium truncate ${
              item.is_bought ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
          >
            {item.name}
          </span>
          {item.is_bought && (
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200 font-medium">
              {t('bought')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
          <ShoppingCart size={10} />
          <span>
            {item.quantity} {tUnits(item.unit)}
          </span>
        </div>
      </div>

      {/* Opportunity dots */}
      {showOpportunityDots && activeOpps.length > 0 && (
        <div className="flex items-center gap-1 flex-shrink-0">
          {activeOpps.slice(0, 5).map((opp) => (
            <OpportunityDot key={opp.id} opportunity={opp} />
          ))}
          {activeOpps.length > 5 && (
            <span className="text-xs text-gray-400">+{activeOpps.length - 5}</span>
          )}
        </div>
      )}

      {/* No opportunities indicator */}
      {showOpportunityDots && activeOpps.length === 0 && (item.opportunities?.length ?? 0) === 0 && (
        <PackageOpen size={14} className="text-gray-300 flex-shrink-0" />
      )}
    </div>
  );
}
