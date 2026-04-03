import {
  isOpportunityActive,
  getOpportunityStatus,
  formatDate,
  getTodayISO,
  getTomorrowISO,
  getActiveOpportunities,
} from '@/lib/opportunities';
import { Opportunity } from '@/types';
import { format, addDays, subDays } from 'date-fns';

const makeOpp = (overrides: Partial<Opportunity> = {}): Opportunity => ({
  id: '1',
  shopping_item_id: 'item-1',
  name: 'Test Sale',
  date_from: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
  date_to: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
  value_decimal: null,
  value_percentage: null,
  created_at: new Date().toISOString(),
  ...overrides,
});

describe('isOpportunityActive', () => {
  it('returns true for an opportunity active today', () => {
    const opp = makeOpp();
    expect(isOpportunityActive(opp)).toBe(true);
  });

  it('returns false for an expired opportunity', () => {
    const opp = makeOpp({
      date_from: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
      date_to: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    });
    expect(isOpportunityActive(opp)).toBe(false);
  });

  it('returns false for a future opportunity', () => {
    const opp = makeOpp({
      date_from: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
      date_to: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
    });
    expect(isOpportunityActive(opp)).toBe(false);
  });

  it('returns true when checking a specific date within range', () => {
    const opp = makeOpp({
      date_from: '2025-01-01',
      date_to: '2025-01-31',
    });
    const checkDate = new Date('2025-01-15');
    expect(isOpportunityActive(opp, checkDate)).toBe(true);
  });

  it('returns false when checking a specific date outside range', () => {
    const opp = makeOpp({
      date_from: '2025-01-01',
      date_to: '2025-01-10',
    });
    const checkDate = new Date('2025-02-01');
    expect(isOpportunityActive(opp, checkDate)).toBe(false);
  });
});

describe('getOpportunityStatus', () => {
  it('returns "active" for current opportunities', () => {
    const opp = makeOpp();
    expect(getOpportunityStatus(opp)).toBe('active');
  });

  it('returns "expired" for past opportunities', () => {
    const opp = makeOpp({
      date_from: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
      date_to: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    });
    expect(getOpportunityStatus(opp)).toBe('expired');
  });

  it('returns "upcoming" for future opportunities', () => {
    const opp = makeOpp({
      date_from: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
      date_to: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
    });
    expect(getOpportunityStatus(opp)).toBe('upcoming');
  });
});

describe('formatDate', () => {
  it('formats ISO date to dd.MM.yyyy format', () => {
    expect(formatDate('2025-06-15')).toBe('15.06.2025');
    expect(formatDate('2025-01-01')).toBe('01.01.2025');
  });
});

describe('getTodayISO / getTomorrowISO', () => {
  it('returns today in YYYY-MM-DD format', () => {
    const today = getTodayISO();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(today).toBe(format(new Date(), 'yyyy-MM-dd'));
  });

  it('returns tomorrow in YYYY-MM-DD format', () => {
    const tomorrow = getTomorrowISO();
    const expected = format(addDays(new Date(), 1), 'yyyy-MM-dd');
    expect(tomorrow).toBe(expected);
  });
});

describe('getActiveOpportunities', () => {
  it('returns only active opportunities for today', () => {
    const active = makeOpp({ name: 'Active', id: '1' });
    const expired = makeOpp({
      name: 'Expired',
      id: '2',
      date_from: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
      date_to: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    });
    const upcoming = makeOpp({
      name: 'Upcoming',
      id: '3',
      date_from: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
      date_to: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
    });

    const result = getActiveOpportunities([active, expired, upcoming]);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Active');
  });

  it('returns opportunities active on a specific date', () => {
    const opp1 = makeOpp({ id: '1', date_from: '2025-03-01', date_to: '2025-03-31' });
    const opp2 = makeOpp({ id: '2', date_from: '2025-04-01', date_to: '2025-04-30' });

    const result = getActiveOpportunities([opp1, opp2], '2025-03-15');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('returns empty array when no opportunities are active', () => {
    const expired = makeOpp({
      date_from: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
      date_to: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    });
    expect(getActiveOpportunities([expired])).toHaveLength(0);
  });
});
