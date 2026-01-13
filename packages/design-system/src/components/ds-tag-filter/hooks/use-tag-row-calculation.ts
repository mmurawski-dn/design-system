import { type RefObject, useLayoutEffect, useState } from 'react';

interface UseTagRowCalculationProps {
	tagsWrapperRef: RefObject<HTMLDivElement | null>;
	totalItems: number;
	expanded: boolean;
}

// Extra space needed per row for animated delete button that appears on hover
const TAG_HOVER_BUTTON_SPACE = 20;

/**
 * Custom hook to calculate how many tags can fit in 2 rows
 * Measures actual vertical positions of elements to determine row placement.
 * Reserves space for the expand tag (when overflow) and clear button (always visible).
 */
export const useTagRowCalculation = ({ tagsWrapperRef, totalItems, expanded }: UseTagRowCalculationProps) => {
	const [firstRowLastVisibleIndex, setFirstRowLastVisibleIndex] = useState(totalItems);
	const [secondRowLastVisibleIndex, setSecondRowLastVisibleIndex] = useState(totalItems);
	const [hasOverflow, setHasOverflow] = useState(false);

	useLayoutEffect(() => {
		const calculateVisibleTags = () => {
			if (!tagsWrapperRef.current) {
				return;
			}

			const wrapper = tagsWrapperRef.current;
			const tags = Array.from(wrapper.querySelectorAll('[data-tag-item]'));

			if (tags.length === 0) {
				return;
			}

			const clearButton = wrapper.querySelector('[data-clear-button]');
			const expandTag = wrapper.querySelector('[data-expand-tag]');
			const label = wrapper.querySelector('[data-label-item]');

			// Get the wrapper's bounding rect for reference
			const wrapperRect = wrapper.getBoundingClientRect();

			// Get gap from computed styles
			const computedStyle = getComputedStyle(wrapper);
			const gap = parseFloat(computedStyle.gap) || 0;

			const clearButtonWidth = clearButton ? clearButton.getBoundingClientRect().width : 0;
			const expandTagWidth = expandTag ? expandTag.getBoundingClientRect().width : 0;
			const labelWidth = label ? label.getBoundingClientRect().width + gap : 0;

			const firstRowAvailableWidth =
				wrapperRect.width - clearButtonWidth - labelWidth - TAG_HOVER_BUTTON_SPACE;
			const secondRowAvailableWidth = wrapperRect.width - expandTagWidth - TAG_HOVER_BUTTON_SPACE;

			// Find how many items fit within the visible area (2 rows)
			let firstRowTakenWidth = 0;
			let secondRowTakenWidth = 0;
			let firstRowLastVisibleIndexTemp = 0;
			let secondRowLastVisibleIndexTemp = -1; // -1 indicates no items in second row yet
			let firstFullRow = false;
			let overflowDetected = false;

			for (let i = 0; i < tags.length; i++) {
				const child = tags[i];
				const childRect = child.getBoundingClientRect();

				// calculate how much space the child takes up, look at width of the rows, not height
				const childWidth = childRect.width + gap;
				if (!firstFullRow && firstRowTakenWidth + childWidth <= firstRowAvailableWidth) {
					firstRowTakenWidth += childWidth;
					firstRowLastVisibleIndexTemp = i;

					continue;
				} else {
					firstFullRow = true;
				}

				if (secondRowTakenWidth + childWidth <= secondRowAvailableWidth) {
					secondRowTakenWidth += childWidth;
					secondRowLastVisibleIndexTemp = i;
				} else {
					overflowDetected = true;
					break;
				}
			}

			// If no items were added to second row, use first row's last visible index
			const finalSecondRowIndex =
				secondRowLastVisibleIndexTemp === -1 ? firstRowLastVisibleIndexTemp : secondRowLastVisibleIndexTemp;

			setFirstRowLastVisibleIndex(firstRowLastVisibleIndexTemp);
			setSecondRowLastVisibleIndex(finalSecondRowIndex);
			setHasOverflow(overflowDetected);
		};

		// Use requestAnimationFrame to ensure DOM is fully laid out
		const rafId = requestAnimationFrame(() => {
			calculateVisibleTags();
		});

		const resizeObserver = new ResizeObserver(() => {
			requestAnimationFrame(() => {
				calculateVisibleTags();
			});
		});

		if (tagsWrapperRef.current) {
			resizeObserver.observe(tagsWrapperRef.current);
		}

		return () => {
			cancelAnimationFrame(rafId);
			resizeObserver.disconnect();
		};
	}, [tagsWrapperRef, totalItems, expanded, firstRowLastVisibleIndex, secondRowLastVisibleIndex]);

	return {
		firstRowLastVisibleIndex,
		secondRowLastVisibleIndex,
		hasOverflow,
	};
};
