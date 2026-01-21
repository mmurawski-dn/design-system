import type { CSSProperties } from 'react';
import classNames from 'classnames';
import type { DsSkeletonTextProps } from './ds-skeleton.types';
import { typographyHeightMap, DEFAULT_LINE_GAP, radiusMap } from './ds-skeleton.config';
import styles from './ds-skeleton.module.scss';

/**
 * Text skeleton component - matches typography variants
 * It renders pill-shaped lines that match the height of text content
 */
const DsSkeletonText = ({
	typographyVariant = 'body-sm-reg',
	variant = 'grey',
	lines = 1,
	width,
	radius = 'default',
	className,
	style,
}: DsSkeletonTextProps) => {
	const height = typographyHeightMap[typographyVariant];
	const borderRadius = typeof radius === 'number' ? radius : radiusMap[radius];

	const getLineWidth = (): string | number => {
		if (width !== undefined) {
			return width;
		}

		return '100%';
	};

	const lineClassName = classNames(styles.skeleton, styles.text, styles[variant], className);

	const createLineStyle = (lineWidth: string | number): CSSProperties => ({
		height,
		width: typeof lineWidth === 'number' ? String(lineWidth) + 'px' : lineWidth,
		borderRadius,
		...style,
	});

	const renderLine = (index: number) => {
		const lineWidth = getLineWidth();

		return (
			<span key={index} className={lineClassName} style={createLineStyle(lineWidth)} aria-hidden="true" />
		);
	};

	if (lines === 1) {
		return renderLine(0);
	}

	return (
		<div className={styles.container} style={{ gap: DEFAULT_LINE_GAP }}>
			{Array.from({ length: lines }, (_, i) => renderLine(i))}
		</div>
	);
};

export default DsSkeletonText;
