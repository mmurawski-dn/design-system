import type { ProgressArcVariant } from '../components/ds-progress-arc';
import type { ProgressDonutVariant } from '../components/ds-progress-donut';

export const clampValue = (value: number): number => Math.min(100, Math.max(0, value));

export const getEffectiveValue = (
	// We want to keep both variants, in case one changes
	// eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
	variant: ProgressArcVariant | ProgressDonutVariant,
	value: number,
): number => (variant === 'success' ? 100 : clampValue(value));
