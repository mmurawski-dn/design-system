import { RefObject, useLayoutEffect, useState } from 'react';

interface UseChipRowCalculationProps {
	chipsWrapperRef: RefObject<HTMLDivElement | null>;
	totalFilters: number;
}

/**
 * Custom hook to calculate how many chips can fit in 2 rows
 * Uses a simple approach: render all, measure positions, hide overflow
 */
export const useChipRowCalculation = ({ chipsWrapperRef, totalFilters }: UseChipRowCalculationProps) => {
	const [visibleCount, setVisibleCount] = useState(totalFilters);

	const calculateVisibleChips = () => {
		if (!chipsWrapperRef.current) return;

		const wrapper = chipsWrapperRef.current;
		const children = Array.from(wrapper.children) as HTMLElement[];

		if (children.length === 0) return;

		// setVisibleCount(10);
		// setVisibleCount(12);

		let index = 0;
		let line = 0;
		let total = 0;

		while (line < 2) {
			total = 0;
			if (index >= children.length) break;
			let current = children[index];
			while (total < wrapper.clientWidth) {
				const offset = current.offsetWidth === wrapper.clientWidth ? 0 : 8;
				const next = offset + current.offsetWidth;
				if (total + next >= wrapper.clientWidth) {
					line++;
					break;
				}
				total += next;
				index++;
				if (index >= children.length) break;
				current = children[index];
			}
		}

		// const result = Math.max(1, index - 1);
		const result = Math.max(1, line < 2 ? index : index - 1);
		console.log('calculateVisibleChips', result, line);
		setVisibleCount(result);
	};

	useLayoutEffect(() => {
		// Use requestAnimationFrame to ensure DOM is fully laid out
		const rafId = requestAnimationFrame(() => {
			calculateVisibleChips();
		});

		const resizeObserver = new ResizeObserver(() => {
			requestAnimationFrame(() => {
				calculateVisibleChips();
			});
		});

		if (chipsWrapperRef.current) {
			resizeObserver.observe(chipsWrapperRef.current);
		}

		return () => {
			cancelAnimationFrame(rafId);
			resizeObserver.disconnect();
		};
	}, [chipsWrapperRef]);

	useLayoutEffect(() => {
		const calculateVisibleChipsOld = () => {
			if (!chipsWrapperRef.current) return;

			const wrapper = chipsWrapperRef.current;
			const children = Array.from(wrapper.children) as HTMLElement[];

			if (children.length === 0) return;

			console.log('resize observer');

			// First child is "Filtered by:" label
			const labelElement = children[0];

			// Get chip elements (everything after label)
			const chipElements = children.slice(1);

			if (chipElements.length === 0) return;

			// Get the vertical position of the first chip (baseline for row 1)
			const firstChipTop = chipElements[0].offsetTop;

			// Calculate max allowed bottom position (2 rows)
			const firstChipHeight = chipElements[0].offsetHeight;
			const gap = 8; // var(--spacing-xs)
			const maxBottom = firstChipTop + firstChipHeight * 2 + gap;

			// Find how many chips fit within 2 rows
			let count = 0;
			const showAllWidth = 200; // Reserve space for "+X filters show all" chip
			const wrapperWidth = wrapper.offsetWidth;

			for (let i = 0; i < chipElements.length; i++) {
				const chip = chipElements[i];
				const chipBottom = chip.offsetTop + chip.offsetHeight;
				const chipRight = chip.offsetLeft + chip.offsetWidth;

				// Check if chip is within 2 rows
				if (chipBottom <= maxBottom) {
					// If this is the last chip, we're done
					if (i === chipElements.length - 1) {
						count = i + 1;
						break;
					}

					// Check if there's room for a "show all" chip on the same row or next row
					const nextChip = chipElements[i + 1];
					if (nextChip) {
						const nextChipBottom = nextChip.offsetTop + nextChip.offsetHeight;

						// If next chip would overflow 2 rows, we need to reserve space for show-all
						if (nextChipBottom > maxBottom) {
							// Check if show-all would fit after current chip
							const spaceAfterCurrent = wrapperWidth - (chipRight + gap);
							if (spaceAfterCurrent >= showAllWidth) {
								count = i + 1;
							} else {
								// Need to go back one chip to make room
								count = Math.max(1, i);
							}
							break;
						}
					}

					count = i + 1;
				} else {
					// This chip is on row 3+, so we stop at previous chip
					// But need to ensure room for show-all button
					const prevChip = chipElements[i - 1];
					if (prevChip) {
						const prevChipRight = prevChip.offsetLeft + prevChip.offsetWidth;
						const spaceAfterPrev = wrapperWidth - (prevChipRight + gap);

						if (spaceAfterPrev >= showAllWidth) {
							count = i;
						} else {
							count = Math.max(1, i - 1);
						}
					}
					break;
				}
			}

			// Only update if count changed to prevent infinite loop
			const newCount = count >= chipElements.length ? totalFilters : Math.max(1, count);
			setVisibleCount((prev) => (prev === newCount ? prev : newCount));

			// isCalculatingRef.current = false;
		};

		calculateVisibleChips();
	}, [chipsWrapperRef, totalFilters]);

	return visibleCount;
};
