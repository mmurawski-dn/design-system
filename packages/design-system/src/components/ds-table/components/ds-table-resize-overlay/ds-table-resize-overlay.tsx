import { useLayoutEffect, useRef } from 'react';
import type { DsTableResizeOverlayProps } from './ds-table-resize-overlay.types';
import styles from './ds-table-resize-overlay.module.scss';

/**
 * Full-height divider that tracks the active column's right edge during hover
 * and drag resize. It follows the scroll container's vertical scroll so it
 * always spans the visible rows.
 */
export const DsTableResizeOverlay = ({ offset, phase }: DsTableResizeOverlayProps) => {
	const ref = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const overlay = ref.current;
		const container = overlay?.parentElement;
		if (!overlay || !container) {
			return;
		}

		const sync = () => {
			overlay.style.top = `${String(container.scrollTop)}px`;
		};

		sync();
		container.addEventListener('scroll', sync, { passive: true });

		return () => container.removeEventListener('scroll', sync);
	}, []);

	return (
		<div
			ref={ref}
			className={styles.resizeOverlay}
			style={{ left: offset }}
			data-resize-overlay
			data-resize-phase={phase}
			aria-hidden
		/>
	);
};
