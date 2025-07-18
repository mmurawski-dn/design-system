import React from 'react';
import { DsTextInputProps } from '../ds-text-input';
import { DsTextareaProps } from '../ds-textarea';
import { DsSelectProps } from '../ds-select';
import { DsNumberInputProps } from '../ds-number-input';
import { DsPasswordInputProps } from '../ds-password-input';

export const controlSchemas = ['info', 'success', 'error', 'warning'] as const;
export type ControlSchema = (typeof controlSchemas)[number];

export interface DsFormControlProps extends React.PropsWithChildren {
	/**
	 * Unique identifier for the control
	 */
	id?: string;
	/**
	 * Visual schema
	 */
	schema?: ControlSchema;
	/**
	 * Label text
	 */
	label: string;
	/**
	 * Marks the field as required
	 */
	required?: boolean;
	/**
	 * Show help icon next to the label
	 */
	showHelpIcon?: boolean;
	/**
	 * Callback when help icon is clicked
	 */
	onHelpClick?: () => void;
	/**
	 * Message under the control
	 */
	message?: string;
	/**
	 * Icon shown next to message
	 */
	messageIcon?: string;
	/**
	 * Additional CSS class names
	 */
	className?: string;
	/**
	 * Additional styles to apply to the component
	 */
	style?: React.CSSProperties;
}

export interface DsFormControlDescriptionProps {
	/**
	 * The description content
	 */
	children: React.ReactNode;
	/**
	 * Additional CSS class names
	 */
	className?: string;
}

export interface DsFormControlCompound extends React.FC<DsFormControlProps> {
	/**
	 * Text input component
	 */
	TextInput: React.FC<Omit<DsTextInputProps, 'id'>>;
	/**
	 * Number input component
	 */
	NumberInput: React.FC<Omit<DsNumberInputProps, 'id'>>;
	/**
	 * Password input component
	 */
	PasswordInput: React.FC<Omit<DsPasswordInputProps, 'id'>>;
	/**
	 * Textarea component
	 */
	Textarea: React.FC<Omit<DsTextareaProps, 'id'>>;
	/**
	 * Select component
	 */
	Select: React.FC<Omit<DsSelectProps, 'id'>>;
	/**
	 * Description component
	 */
	Description: React.FC<DsFormControlDescriptionProps>;
}
