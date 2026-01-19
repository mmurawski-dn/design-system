import { type RefObject, useCallback, useLayoutEffect, useState } from 'react';
import { fitTagsInRow, getContainerAvailableWidth, getElementMeasurements } from '../utils';

interface UseTagOverflowCalculationOptions {
	containerRef: RefObject<HTMLDivElement | null>;
	measurementRef: RefObject<HTMLDivElement | null>;
	totalItems: number;
	expanded: boolean;
}

interface UseTagOverflowCalculationResult {
	row1TagCount: number;
	row2TagCount: number;
	hasOverflow: boolean;
}

// Extra space needed per row for animated delete button that appears on hover
const TAG_HOVER_BUTTON_SPACE = 20;

/**
 * Custom hook to calculate how many tags can fit in 2 rows.
 *
 * Row 1: Label + Tags + Clear Button
 * Row 2: Remaining Tags + Expand Tag (only if overflow)
 *
 * Measures actual element widths to determine optimal placement.
 */
export const useTagOverflowCalculation = ({
	containerRef,
	measurementRef,
	totalItems,
	expanded,
}: UseTagOverflowCalculationOptions): UseTagOverflowCalculationResult => {
	const [row1TagCount, setRow1TagCount] = useState(0);
	const [row2TagCount, setRow2TagCount] = useState(0);
	const [hasOverflow, setHasOverflow] = useState(false);

	const calculateLayout = useCallback(() => {
		if (!containerRef.current || !measurementRef.current) {
			return;
		}

		const container = containerRef.current;
		const measurementContainer = measurementRef.current;

		const { tagWidths, labelWidth, clearButtonWidth, expandTagWidth, gap } =
			getElementMeasurements(measurementContainer);

		if (tagWidths.length === 0) {
			setRow1TagCount(0);
			setRow2TagCount(0);
			setHasOverflow(false);
			return;
		}

		const containerWidth = getContainerAvailableWidth(container);

		// Calculate Row 1 available space (Label + Tags + Clear Button)
		const row1AvailableWidth = containerWidth - labelWidth - clearButtonWidth - TAG_HOVER_BUTTON_SPACE;

		// Calculate how many tags fit in Row 1
		const row1Result = fitTagsInRow(tagWidths, row1AvailableWidth, gap);
		const remainingTags = tagWidths.slice(row1Result.count);

		if (remainingTags.length === 0) {
			// All tags fit in Row 1, no overflow
			setRow1TagCount(row1Result.count);
			setRow2TagCount(0);
			setHasOverflow(false);
			return;
		}

		// Calculate with expand tag reserved (pessimistic)
		const row2AvailableWithExpand = containerWidth - expandTagWidth - TAG_HOVER_BUTTON_SPACE;
		const row2WithExpandResult = fitTagsInRow(remainingTags, row2AvailableWithExpand, gap);

		// Check if there's overflow (more remaining tags than fit in Row 2 with expand)
		const overflowExists = remainingTags.length > row2WithExpandResult.count;

		if (overflowExists) {
			// Use the count with expand tag space reserved
			setRow1TagCount(row1Result.count);
			setRow2TagCount(row2WithExpandResult.count);
			setHasOverflow(true);
		} else {
			// No overflow - recalculate Row 2 without reserving expand tag space
			const row2AvailableWithoutExpand = containerWidth - TAG_HOVER_BUTTON_SPACE;
			const row2FullResult = fitTagsInRow(remainingTags, row2AvailableWithoutExpand, gap);

			// Double-check: if even without expand tag we can't fit all, we have overflow
			if (row2FullResult.count < remainingTags.length) {
				setRow1TagCount(row1Result.count);
				setRow2TagCount(row2WithExpandResult.count);
				setHasOverflow(true);
			} else {
				setRow1TagCount(row1Result.count);
				setRow2TagCount(row2FullResult.count);
				setHasOverflow(false);
			}
		}
	}, [containerRef, measurementRef]);

	useLayoutEffect(() => {
		// Use requestAnimationFrame to ensure DOM is fully laid out
		const rafId = requestAnimationFrame(() => {
			calculateLayout();
		});

		const resizeObserver = new ResizeObserver(() => {
			requestAnimationFrame(() => {
				calculateLayout();
			});
		});

		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		return () => {
			cancelAnimationFrame(rafId);
			resizeObserver.disconnect();
		};
	}, [containerRef, measurementRef, totalItems, expanded, calculateLayout]);

	// When expanded, show all tags
	if (expanded) {
		return {
			row1TagCount,
			row2TagCount: totalItems - row1TagCount,
			hasOverflow: true, // Keep expand button visible to allow collapse
		};
	}

	return {
		row1TagCount,
		row2TagCount,
		hasOverflow,
	};
};
