import React, { InputHTMLAttributes } from 'react';

export const textInputSizes = ['small', 'default'] as const;
export type TextInputSize = (typeof textInputSizes)[number];

export interface DsTextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
	/**
	 * The size of the input field
	 * @default default
	 */
	size?: TextInputSize;
	/**
	 * Callback when the value changes
	 */
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	/**
	 * Value change event handler (provides just the value)
	 */
	onValueChange?: (value: string) => void;
	/**
	 * Additional CSS class names
	 */
	className?: string;
	/**
	 * Additional styles to apply to the component
	 */
	style?: React.CSSProperties;
	/**
	 * The placeholder text
	 */
	placeholder?: string;
	/**
	 * The current value
	 */
	value?: string;
	/**
	 * The initial value of the input when rendered.
	 * Use when you don't need to control the value of the input.
	 */
	defaultValue?: string;
	/**
	 * Whether the input is disabled
	 */
	disabled?: boolean;
	/**
	 * Children components (Adornment, Input)
	 */
	children?: React.ReactNode;
}

export interface DsTextInputAdornmentProps {
	/**
	 * Position of the adornment
	 */
	position: 'start' | 'end';
	/**
	 * Additional CSS class names
	 */
	className?: string;
	/**
	 * Additional styles to apply to the component
	 */
	style?: React.CSSProperties;
	/**
	 * Children components
	 */
	children?: React.ReactNode;
}

export interface DsTextInputInputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
	/**
	 * Callback when the value changes
	 */
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	/**
	 * Value change event handler (provides just the value)
	 */
	onValueChange?: (value: string) => void;
	/**
	 * Additional CSS class names
	 */
	className?: string;
	/**
	 * Additional styles to apply to the component
	 */
	style?: React.CSSProperties;
	/**
	 * The placeholder text
	 */
	placeholder?: string;
	/**
	 * The current value
	 */
	value?: string;
	/**
	 * The initial value of the input when rendered.
	 * Use when you don't need to control the value of the input.
	 */
	defaultValue?: string;
	/**
	 * Whether the input is disabled
	 */
	disabled?: boolean;
}
