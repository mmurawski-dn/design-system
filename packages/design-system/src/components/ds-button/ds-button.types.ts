import type { ButtonHTMLAttributes, Ref } from 'react';
import type { DsIconProps, IconType } from '../ds-icon';

export const buttonVariants = ['primary', 'secondary', 'tertiary'] as const;
export type ButtonVariant = (typeof buttonVariants)[number];

export const buttonColors = ['default', 'error', 'light'] as const;
export type ButtonColor = (typeof buttonColors)[number];

export const buttonSizes = ['large', 'medium', 'small', 'tiny'] as const;
export type ButtonSize = (typeof buttonSizes)[number];

export interface DsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	ref?: Ref<HTMLButtonElement>;

	/**
	 * - `default` — standard light-UI palette
	 * - `error` — destructive / danger palette (red tones)
	 * - `light` — palette for dark-background surfaces (Figma **Type** onDark)
	 * @default 'default'
	 */
	color?: ButtonColor;

	/**
	 * @default 'primary'
	 */
	variant?: ButtonVariant;

	/**
	 * @default 'medium'
	 */
	size?: ButtonSize;

	/**
	 * @default false
	 */
	selected?: boolean;

	/**
	 * Leading icon. When set without children, renders as icon-only (square) layout.
	 */
	icon?: IconType;

	/**
	 * Shows a spinner as the leading element and disables interaction.
	 * @default false
	 */
	loading?: boolean;

	/**
	 * Props forwarded to internal slots. Use to override defaults on the leading icon.
	 */
	slotProps?: {
		icon?: Omit<Partial<DsIconProps>, 'icon'>;
	};
}
