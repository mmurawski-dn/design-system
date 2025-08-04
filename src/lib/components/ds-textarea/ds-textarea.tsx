import React from 'react';
import classNames from 'classnames';
import styles from './ds-textarea.module.scss';
import { DsTextareaProps } from './ds-textarea.types';

const DsTextarea: React.FC<DsTextareaProps> = ({
	onChange,
	onValueChange,
	className,
	style = {},
	tooltip,
	value,
	disabled = false,
	rows = 3,
	placeholder,
	...props
}) => {
	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = event.target.value;
		onChange?.(event);
		onValueChange?.(newValue);
	};

	return (
		<textarea
			className={classNames(styles.textarea, className)}
			style={style}
			title={tooltip}
			value={value}
			placeholder={placeholder}
			disabled={disabled}
			rows={rows}
			onChange={handleChange}
			{...props}
		/>
	);
};

export default DsTextarea;
