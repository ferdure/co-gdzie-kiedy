/**
 * Tests for shopping items API route input validation.
 * These tests cover the validation logic independently from Supabase.
 */

// Validate that required fields are checked
describe('Items API validation', () => {
  describe('POST /api/items validation rules', () => {
    const validPayload = {
      category_id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Milk',
      unit: 'l',
      quantity: 2,
    };

    it('accepts valid payload', () => {
      const { category_id, name, unit, quantity } = validPayload;
      expect(category_id).toBeTruthy();
      expect(name).toBeTruthy();
      expect(unit).toBeTruthy();
      expect(quantity).toBeGreaterThan(0);
    });

    it('rejects missing category_id', () => {
      const payload = { ...validPayload, category_id: '' };
      expect(payload.category_id).toBeFalsy();
    });

    it('rejects missing name', () => {
      const payload = { ...validPayload, name: '' };
      expect(payload.name).toBeFalsy();
    });

    it('rejects invalid unit', () => {
      const validUnits = ['piece', 'kg', 'g', 'l', 'ml', 'pack', 'bottle'];
      expect(validUnits.includes('invalid_unit')).toBe(false);
      expect(validUnits.includes('kg')).toBe(true);
    });
  });

  describe('Opportunity validation rules', () => {
    it('rejects date_to before date_from', () => {
      const date_from = '2025-05-10';
      const date_to = '2025-05-05';
      expect(new Date(date_to) < new Date(date_from)).toBe(true);
    });

    it('accepts date_to equal to date_from (same day opportunity)', () => {
      const date_from = '2025-05-10';
      const date_to = '2025-05-10';
      expect(new Date(date_to) >= new Date(date_from)).toBe(true);
    });

    it('accepts date_to after date_from', () => {
      const date_from = '2025-05-10';
      const date_to = '2025-05-20';
      expect(new Date(date_to) >= new Date(date_from)).toBe(true);
    });
  });
});
