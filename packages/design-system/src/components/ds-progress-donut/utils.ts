import type { ProgressDonutSize } from './ds-progress-donut.types';

export { getEffectiveValue } from '../../utils/progress-utils';

export const containerSizeMap: Record<ProgressDonutSize, number> = Object.freeze({
	small: 80,
	medium: 120,
});

export const strokeWidthMap: Record<ProgressDonutSize, number> = Object.freeze({
	small: 4,
	medium: 6,
});
