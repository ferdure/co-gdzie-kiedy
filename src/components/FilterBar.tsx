'use client';

import { useTranslations } from 'next-intl';
import { FilterState } from '@/types';
import { getTodayISO, getTomorrowISO } from '@/lib/opportunities';
import { Calendar, Tag, X, Filter } from 'lucide-react';

interface FilterBarProps {
  filter: FilterState;
  opportunityNames: string[];
  onChange: (filter: FilterState) => void;
}

export function FilterBar({ filter, opportunityNames, onChange }: FilterBarProps) {
  const t = useTranslations('filters');
  const todayISO = getTodayISO();
  const tomorrowISO = getTomorrowISO();

  const hasFilter = filter.date !== null || filter.opportunityName !== null;

  const setDate = (date: string | null) => {
    onChange({ ...filter, date });
  };

  const setOpportunityName = (opportunityName: string | null) => {
    onChange({ ...filter, opportunityName });
  };

  const clearFilters = () => {
    onChange({ date: null, opportunityName: null });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter size={14} className="text-indigo-500" />
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-widest">
          {t('title')}
        </span>
        {hasFilter && (
          <button
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            <X size={12} />
            {t('clearFilters')}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Date filter */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar size={11} />
            {t('date')}
          </label>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setDate(filter.date === todayISO ? null : todayISO)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter.date === todayISO
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('today')}
            </button>
            <button
              onClick={() => setDate(filter.date === tomorrowISO ? null : tomorrowISO)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter.date === tomorrowISO
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('tomorrow')}
            </button>
            <input
              type="date"
              value={
                filter.date && filter.date !== todayISO && filter.date !== tomorrowISO
                  ? filter.date
                  : ''
              }
              onChange={(e) => setDate(e.target.value || null)}
              className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              aria-label={t('pickDate')}
            />
          </div>
        </div>

        {/* Opportunity name filter */}
        {opportunityNames.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1 text-xs text-gray-500">
              <Tag size={11} />
              {t('opportunityName')}
            </label>
            <select
              value={filter.opportunityName ?? ''}
              onChange={(e) => setOpportunityName(e.target.value || null)}
              className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white min-w-[160px]"
            >
              <option value="">{t('allOpportunities')}</option>
              {opportunityNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
