'use client';

import { useTranslations } from 'next-intl';
import { ShoppingItem, FilterState } from '@/types';
import { OpportunityCard } from './OpportunityCard';
import { getActiveOpportunities } from '@/lib/opportunities';
import { ShoppingCart, Layers } from 'lucide-react';

interface OpportunityViewProps {
  items: ShoppingItem[];
  filter: FilterState;
  onToggleBought: (id: string, is_bought: boolean) => void;
}

export function OpportunityView({ items, filter, onToggleBought }: OpportunityViewProps) {
  const t = useTranslations('items');
  const tUnits = useTranslations('units');

  // Only show items with opportunities matching the filter
  const filteredItems = items.filter((item) => {
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
  });

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <Layers size={48} strokeWidth={1} />
        <p className="mt-3 text-sm">{t('noItemsWithOpportunities')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredItems.map((item) => {
        let visibleOpps = item.opportunities ?? [];
        if (filter.date) {
          visibleOpps = getActiveOpportunities(visibleOpps, filter.date);
        }
        if (filter.opportunityName) {
          visibleOpps = visibleOpps.filter(
            (o) => o.name.toLowerCase() === filter.opportunityName!.toLowerCase()
          );
        }

        return (
          <div
            key={item.id}
            className={`rounded-2xl border shadow-sm overflow-hidden transition-all ${
              item.is_bought
                ? 'bg-gray-50 border-gray-100 opacity-70'
                : 'bg-white border-gray-100 hover:shadow-md'
            }`}
          >
            {/* Item header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50">
              <button
                onClick={() => onToggleBought(item.id, !item.is_bought)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  item.is_bought
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-gray-300 hover:border-indigo-400'
                }`}
                aria-label={item.is_bought ? t('markUnbought') : t('markBought')}
              >
                {item.is_bought && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              <div className="flex-1">
                <span
                  className={`text-sm font-semibold ${
                    item.is_bought ? 'line-through text-gray-400' : 'text-gray-800'
                  }`}
                >
                  {item.name}
                </span>
                {item.category && (
                  <span className="ml-2 text-[10px] text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-full border border-indigo-100">
                    {item.category.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <ShoppingCart size={11} />
                <span>
                  {item.quantity} {tUnits(item.unit)}
                </span>
              </div>
            </div>

            {/* Opportunities list */}
            <div className="p-3 space-y-2">
              {visibleOpps.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
