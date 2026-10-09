import { useLayoutEffect, useState, type RefObject } from 'react';

/**
 * Width the scroll container's vertical scrollbar takes from its content box.
 * `0` while nothing overflows vertically, or when the scrollbar overlays the
 * content instead of taking layout space.
 */
export const useVerticalScrollbarWidth = (containerRef: RefObject<HTMLElement | null>): number => {
	const [width, setWidth] = useState(0);

	useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) {
			return;
		}

		const read = () => {
			setWidth(Math.max(0, container.offsetWidth - container.clientWidth));
		};

		read();

		// A vertical scrollbar appearing or disappearing resizes the content box.
		const resizeObserver = new ResizeObserver(read);
		resizeObserver.observe(container);

		return () => resizeObserver.disconnect();
	}, [containerRef]);

	return width;
};
