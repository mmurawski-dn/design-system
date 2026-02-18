import { describe, expect, it } from 'vitest';

import { clampValue, getEffectiveValue } from './progress-utils';

describe('progress-utils', () => {
	describe('clampValue', () => {
		it('should return value within 0-100 unchanged', () => {
			expect(clampValue(50)).toBe(50);
		});

		it('should clamp value below 0 to 0', () => {
			expect(clampValue(-10)).toBe(0);
		});

		it('should clamp value above 100 to 100', () => {
			expect(clampValue(150)).toBe(100);
		});

		it('should handle boundary values', () => {
			expect(clampValue(0)).toBe(0);
			expect(clampValue(100)).toBe(100);
		});
	});

	describe('getEffectiveValue', () => {
		it('should return 100 for success variant regardless of value', () => {
			expect(getEffectiveValue('success', 0)).toBe(100);
			expect(getEffectiveValue('success', 50)).toBe(100);
		});

		it('should return clamped value for non-success variants', () => {
			expect(getEffectiveValue('default', 50)).toBe(50);
			expect(getEffectiveValue('default', -10)).toBe(0);
			expect(getEffectiveValue('default', 200)).toBe(100);
		});

		it('should return clamped value for failed variant', () => {
			expect(getEffectiveValue('failed', 75)).toBe(75);
			expect(getEffectiveValue('failed', -5)).toBe(0);
		});
	});
});
