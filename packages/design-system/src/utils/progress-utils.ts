export const clampValue = (value: number): number => Math.min(100, Math.max(0, value));

export const getEffectiveValue = (variant: string, value: number): number =>
	variant === 'success' ? 100 : clampValue(value);
