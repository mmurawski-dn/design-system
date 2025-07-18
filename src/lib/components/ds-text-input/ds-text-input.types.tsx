import React from 'react';

export const textInputSizes = ['small', 'default'] as const;
export type TextInputSize = (typeof textInputSizes)[number];

export interface DsTextInputProps {
	/**
	 * Unique identifier for the input field
	 */
	id?: string;
	/**
	 * The ref to the input field
	 */
	ref?: React.Ref<HTMLInputElement>;
	/**
	 * The name of the input field
	 */
	name?: string;
	/**
	 * The size of the input field
	 * @default default
	 */
	size?: TextInputSize;
	/**
	 * The type of the input field
	 * @default text
	 */
	type?: string;
	/**
	 * Event handler called when the input field loses focus
	 *
	 * @param event
	 */
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
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
	 * Adornment to display at the start of the input
	 */
	startAdornment?: React.ReactNode;
	/**
	 * Adornment to display at the end of the input
	 */
	endAdornment?: React.ReactNode;
}
