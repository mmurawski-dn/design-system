import React from 'react';
import classNames from 'classnames';
import styles from './ds-text-input.module.scss';
import { DsTextInputAdornmentProps, DsTextInputInputProps, DsTextInputProps } from './ds-text-input.types';

const Adornment: React.FC<DsTextInputAdornmentProps> = ({ position, className, style, children }) => {
	const adornmentClass = classNames(
		styles.adornment,
		{
			[styles.start]: position === 'start',
			[styles.end]: position === 'end',
		},
		className,
	);

	return (
		<div className={adornmentClass} style={style}>
			{children}
		</div>
	);
};

const Input: React.FC<DsTextInputInputProps> = ({ onChange, onValueChange, className, style, ...props }) => {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		onChange?.(event);
		onValueChange?.(newValue);
	};

	return (
		<input className={classNames(styles.input, className)} style={style} onChange={handleChange} {...props} />
	);
};

const DsTextInput: React.FC<DsTextInputProps> & {
	Adornment: typeof Adornment;
	Input: typeof Input;
} = ({
	size = 'default',
	onChange,
	onValueChange,
	className,
	style = {},
	value,
	defaultValue,
	placeholder,
	disabled = false,
	children,
	...props
}) => {
	const containerClass = classNames(
		styles.textInputContainer,
		{
			[styles.small]: size === 'small',
			[styles.default]: size === 'default',
		},
		className,
	);

	if (children) {
		return (
			<div className={containerClass} style={style}>
				{children}
			</div>
		);
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		onChange?.(event);
		onValueChange?.(newValue);
	};

	return (
		<div className={containerClass} style={style}>
			<input
				className={classNames(styles.input)}
				value={value}
				defaultValue={defaultValue}
				placeholder={placeholder}
				disabled={disabled}
				onChange={handleChange}
				{...props}
			/>
		</div>
	);
};

DsTextInput.Adornment = Adornment;
DsTextInput.Input = Input;

export default DsTextInput;
