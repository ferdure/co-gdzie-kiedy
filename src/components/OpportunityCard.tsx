'use client';

import { useTranslations } from 'next-intl';
import { Opportunity } from '@/types';
import { getOpportunityStatus, formatDate } from '@/lib/opportunities';
import { Tag, Calendar, Percent, DollarSign } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

const statusConfig = {
  active: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  upcoming: {
    dot: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  expired: {
    dot: 'bg-gray-300',
    badge: 'bg-gray-50 text-gray-500 border border-gray-200',
  },
};

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const t = useTranslations('opportunities');
  const status = getOpportunityStatus(opportunity);
  const config = statusConfig[status];

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
      <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${config.dot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
            <Tag size={12} className="text-gray-400" />
            <span className="truncate">{opportunity.name}</span>
          </div>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${config.badge}`}>
            {t(status)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <Calendar size={11} />
          <span>
            {formatDate(opportunity.date_from)} – {formatDate(opportunity.date_to)}
          </span>
        </div>
        {(opportunity.value_decimal != null || opportunity.value_percentage != null) && (
          <div className="flex items-center gap-3 mt-1.5">
            {opportunity.value_decimal != null && (
              <div className="flex items-center gap-1 text-xs text-indigo-600 font-medium">
                <DollarSign size={11} />
                <span>{opportunity.value_decimal}</span>
              </div>
            )}
            {opportunity.value_percentage != null && (
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <Percent size={11} />
                <span>{opportunity.value_percentage}%</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
