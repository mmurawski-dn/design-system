import { useLayoutEffect, useState, type RefObject } from 'react';

/**
 * Offset of the body from the top of its scroll container (the header height),
 * kept in sync while the header resizes (e.g. column groups, wrapping labels).
 */
export const useBodyOffsetTop = (bodyRef: RefObject<HTMLTableSectionElement | null>): number => {
	const [offsetTop, setOffsetTop] = useState(0);

	useLayoutEffect(() => {
		const body = bodyRef.current;
		const header = body?.parentElement?.querySelector('thead');
		if (!body) {
			return;
		}

		const sync = () => setOffsetTop(body.offsetTop);
		sync();

		if (!header) {
			return;
		}

		const resizeObserver = new ResizeObserver(sync);
		resizeObserver.observe(header);

		return () => resizeObserver.disconnect();
	}, [bodyRef]);

	return offsetTop;
};
