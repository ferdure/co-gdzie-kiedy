'use client';

import { useTranslations } from 'next-intl';
import { Opportunity } from '@/types';
import { getOpportunityStatus, formatDate } from '@/lib/opportunities';
import { Tag, Calendar, Percent, DollarSign } from 'lucide-react';

interface OpportunityDotProps {
  opportunity: Opportunity;
}

const statusColors = {
  active: 'bg-emerald-500',
  upcoming: 'bg-amber-400',
  expired: 'bg-gray-300',
};

export function OpportunityDot({ opportunity }: OpportunityDotProps) {
  const t = useTranslations('opportunities');
  const status = getOpportunityStatus(opportunity);

  return (
    <div className="group relative inline-flex">
      <span
        className={`w-2.5 h-2.5 rounded-full ${statusColors[status]} cursor-pointer ring-2 ring-white`}
        aria-label={`${opportunity.name} (${t(status)})`}
      />
      {/* Tooltip */}
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <div className="bg-gray-900 text-white text-xs rounded-lg shadow-xl p-3 w-52">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Tag size={11} />
            <span className="font-semibold truncate">{opportunity.name}</span>
            <span
              className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full ${
                status === 'active'
                  ? 'bg-emerald-500/30 text-emerald-300'
                  : status === 'upcoming'
                  ? 'bg-amber-400/30 text-amber-300'
                  : 'bg-gray-500/30 text-gray-400'
              }`}
            >
              {t(status)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-300">
            <Calendar size={10} />
            <span>
              {formatDate(opportunity.date_from)} – {formatDate(opportunity.date_to)}
            </span>
          </div>
          {opportunity.value_decimal != null && (
            <div className="flex items-center gap-1.5 text-gray-300 mt-1">
              <DollarSign size={10} />
              <span>{opportunity.value_decimal}</span>
            </div>
          )}
          {opportunity.value_percentage != null && (
            <div className="flex items-center gap-1.5 text-gray-300 mt-1">
              <Percent size={10} />
              <span>{opportunity.value_percentage}%</span>
            </div>
          )}
        </div>
        {/* Arrow */}
        <div className="flex justify-center">
          <div className="w-2 h-2 bg-gray-900 rotate-45 -mt-1" />
        </div>
      </div>
    </div>
  );
}
