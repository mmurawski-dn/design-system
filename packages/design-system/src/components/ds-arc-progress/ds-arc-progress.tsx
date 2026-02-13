import classNames from 'classnames';

import { DsIcon } from '../ds-icon';
import styles from './ds-arc-progress.module.scss';
import type { ArcProgressSize, ArcProgressVariant, DsArcProgressProps } from './ds-arc-progress.types';

const ARC_DEGREES = 270;
const FULL_CIRCLE = 360;
const ARC_RATIO = ARC_DEGREES / FULL_CIRCLE;
const START_ROTATION = 135;

const containerSizeMap: Record<ArcProgressSize, number> = Object.freeze({
	small: 80,
	medium: 120,
});

const strokeWidthMap: Record<ArcProgressSize, number> = Object.freeze({
	small: 4,
	medium: 6,
});

const variantStyleMap: Record<ArcProgressVariant, string> = Object.freeze({
	default: styles.default,
	success: styles.success,
	error: styles.error,
});

const clampValue = (value: number): number => Math.min(100, Math.max(0, value));

const DsArcProgress = ({
	value = 0,
	size = 'medium',
	variant = 'default',
	icon,
	className,
	style,
	ref,
	...props
}: DsArcProgressProps) => {
	const containerSize = containerSizeMap[size];
	const strokeWidth = strokeWidthMap[size];
	const radius = (containerSize - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const arcLength = ARC_RATIO * circumference;

	const effectiveValue = variant === 'success' ? 100 : clampValue(value);
	const progressLength = (effectiveValue / 100) * arcLength;

	const trackDasharray = `${String(arcLength)} ${String(circumference)}`;
	const progressDasharray = `${String(progressLength)} ${String(circumference)}`;

	const center = containerSize / 2;

	const renderIcon = (iconName: 'check' | 'close', colorClass: string) => {
		if (size === 'medium') {
			return <DsIcon icon={iconName} className={classNames(styles.iconCustomSize, colorClass)} />;
		}

		return <DsIcon icon={iconName} size="large" className={colorClass} />;
	};

	const renderCenter = () => {
		if (icon) {
			return icon;
		}

		if (variant === 'success') {
			return renderIcon('check', styles.iconSuccess);
		}

		if (variant === 'error') {
			return renderIcon('close', styles.iconError);
		}

		return (
			<span className={size === 'medium' ? styles.valueMedium : styles.valueSmall}>{effectiveValue}%</span>
		);
	};

	return (
		<div
			{...props}
			className={classNames(styles.root, styles[size], className)}
			style={style}
			ref={ref}
			role="progressbar"
			aria-valuenow={effectiveValue}
			aria-valuemin={0}
			aria-valuemax={100}
		>
			<svg
				className={styles.svg}
				width={containerSize}
				height={containerSize}
				viewBox={`0 0 ${String(containerSize)} ${String(containerSize)}`}
			>
				<circle
					className={styles.track}
					cx={center}
					cy={center}
					r={radius}
					fill="none"
					strokeWidth={strokeWidth}
					strokeDasharray={trackDasharray}
					strokeLinecap="round"
					transform={`rotate(${String(START_ROTATION)} ${String(center)} ${String(center)})`}
				/>

				<circle
					className={classNames(styles.progress, variantStyleMap[variant])}
					cx={center}
					cy={center}
					r={radius}
					fill="none"
					strokeWidth={strokeWidth}
					strokeDasharray={progressDasharray}
					strokeLinecap="round"
					transform={`rotate(${String(START_ROTATION)} ${String(center)} ${String(center)})`}
				/>
			</svg>

			<div className={styles.center}>{renderCenter()}</div>
		</div>
	);
};

export default DsArcProgress;
