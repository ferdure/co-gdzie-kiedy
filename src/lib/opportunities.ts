import { format, isToday, isTomorrow, isWithinInterval, parseISO } from 'date-fns';
import { Opportunity } from '@/types';

export function isOpportunityActive(opportunity: Opportunity, date?: Date): boolean {
  const checkDate = date ?? new Date();
  const from = parseISO(opportunity.date_from);
  const to = parseISO(opportunity.date_to);
  try {
    return isWithinInterval(checkDate, { start: from, end: to });
  } catch {
    return false;
  }
}

export function getOpportunityStatus(opportunity: Opportunity): 'active' | 'upcoming' | 'expired' {
  const now = new Date();
  const from = parseISO(opportunity.date_from);
  const to = parseISO(opportunity.date_to);
  if (now > to) return 'expired';
  if (now < from) return 'upcoming';
  return 'active';
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd.MM.yyyy');
}

export function getTodayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getTomorrowISO(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return format(tomorrow, 'yyyy-MM-dd');
}

export function getActiveOpportunities(opportunities: Opportunity[], dateISO?: string): Opportunity[] {
  const date = dateISO ? parseISO(dateISO) : undefined;
  return opportunities.filter((opp) => isOpportunityActive(opp, date));
}

export function getDateLabel(dateISO: string): string {
  const date = parseISO(dateISO);
  if (isToday(date)) return 'today';
  if (isTomorrow(date)) return 'tomorrow';
  return dateISO;
}
