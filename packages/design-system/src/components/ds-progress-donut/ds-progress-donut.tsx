import { Progress } from '@ark-ui/react';
import classNames from 'classnames';

import { DsIcon } from '../ds-icon';
import styles from './ds-progress-donut.module.scss';
import type {
	DsProgressDonutProps,
	ProgressDonutSize,
	ProgressDonutVariant,
} from './ds-progress-donut.types';
import { getEffectiveValue } from './utils';

const sizeStyleMap: Record<ProgressDonutSize, string> = Object.freeze({
	small: styles.small,
	medium: styles.medium,
});

const variantStyleMap: Record<ProgressDonutVariant, string> = Object.freeze({
	default: styles.default,
	success: styles.success,
	failed: styles.failed,
});

const DsProgressDonut = ({
	value = 0,
	size = 'medium',
	variant = 'default',
	children,
	className,
	style,
	ref,
}: DsProgressDonutProps) => {
	const effectiveValue = getEffectiveValue(variant, value);

	const renderIcon = (iconName: 'check' | 'close', colorClass: string) => (
		<DsIcon
			variant="rounded"
			icon={iconName}
			size="large"
			className={classNames({ [styles.iconMediumSize]: size === 'medium' }, colorClass)}
		/>
	);

	const renderCenter = () => {
		if (children) {
			return children;
		}

		if (variant === 'success') {
			return renderIcon('check', styles.iconSuccess);
		}

		if (variant === 'failed') {
			return renderIcon('close', styles.iconFailed);
		}

		return (
			<span className={size === 'medium' ? styles.valueMedium : styles.valueSmall}>{effectiveValue}%</span>
		);
	};

	return (
		<Progress.Root
			ref={ref}
			value={effectiveValue}
			className={classNames(styles.root, sizeStyleMap[size], variantStyleMap[variant], className)}
			style={style}
		>
			<Progress.Circle className={styles.circle}>
				<Progress.CircleTrack className={styles.track} />
				<Progress.CircleRange className={styles.range} />
			</Progress.Circle>

			<div className={styles.center}>{renderCenter()}</div>
		</Progress.Root>
	);
};

export default DsProgressDonut;
