import React from 'react';
import classNames from 'classnames';
import styles from './ds-system-status.module.scss';
import { DsSystemStatusProps } from './ds-system-status.types';
import { DsIcon } from '../ds-icon';

const defaultLabels: Record<DsSystemStatusProps['status'], string> = {
	healthy: 'HEALTHY',
	neutral: 'NEUTRAL',
	error: 'ERROR',
	'in-progress': 'IN PROGRESS',
	pending: 'PENDING',
	alert: 'ALERT',
	disabled: 'DISABLED',
};

const DsSystemStatus: React.FC<DsSystemStatusProps> = ({
	status,
	label,
	className,
	varient = 'default',
	icon,
}) => {
	return (
		<div
			className={classNames(styles.container, styles[status], varient === 'badge' && styles.badge, className)}
		>
			{icon && <DsIcon icon={icon} size="small" filled />}
			{!icon && <span className={styles.dot} />}
			<span className={styles.label}>{label || defaultLabels[status]}</span>
		</div>
	);
};

export default DsSystemStatus;
