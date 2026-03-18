import classNames from 'classnames';

import { DsTypography } from '../ds-typography';
import styles from './ds-key-value-pair.module.scss';
import type { DsKeyValuePairProps } from './ds-key-value-pair.types';

const DsKeyValuePair = ({
	ref,
	label,
	value,
	readOnly = false,
	orientation = 'vertical',
	children,
	className,
	style,
}: DsKeyValuePairProps) => {
	const hasEditor = !readOnly && children !== undefined && children !== null;

	return (
		<div
			ref={ref}
			className={classNames(styles.root, className)}
			data-orientation={orientation}
			data-readonly={readOnly || undefined}
			style={style}
		>
			<DsTypography variant="body-sm-md" className={styles.label}>
				{label}
			</DsTypography>

			{/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- tabIndex enables keyboard focus which triggers :focus-within to reveal the editor */}
			<div
				className={styles.valueContainer}
				tabIndex={hasEditor ? 0 : undefined}
				data-editable={hasEditor || undefined}
			>
				{/* eslint-enable jsx-a11y/no-noninteractive-tabindex */}
				<DsTypography variant="body-sm-reg" asChild>
					<div className={styles.valueDisplay}>{value}</div>
				</DsTypography>

				{hasEditor && <div className={styles.editorSlot}>{children}</div>}
			</div>
		</div>
	);
};

export default DsKeyValuePair;
