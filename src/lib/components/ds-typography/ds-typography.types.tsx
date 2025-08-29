import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import styles from './ds-typography.module.scss';

// Semantic variant mapping - these are your existing classes
const semanticVariants = {
	// Body variants
	'body-md-reg': styles['body-md-reg'],
	'body-md-md': styles['body-md-md'],
	'body-md-semi-bold': styles['body-md-semi-bold'],
	'body-md-bold': styles['body-md-bold'],
	'body-md-link': styles['body-md-link'],

	'body-sm-reg': styles['body-sm-reg'],
	'body-sm-md': styles['body-sm-md'],
	'body-sm-semi-bold': styles['body-sm-semi-bold'],
	'body-sm-bold': styles['body-sm-bold'],
	'body-sm-link': styles['body-sm-link'],

	'body-xs-reg': styles['body-xs-reg'],
	'body-xs-md': styles['body-xs-md'],
	'body-xs-semi-bold': styles['body-xs-semi-bold'],
	'body-xs-bold': styles['body-xs-bold'],
	'body-xs-link': styles['body-xs-link'],

	// Code variants
	'code-sm-reg': styles['code-sm-reg'],
	'code-sm-semi-bold': styles['code-sm-semi-bold'],
	'code-xs-reg': styles['code-xs-reg'],
	'code-xs-semi-bold': styles['code-xs-semi-bold'],

	// Heading variants
	heading1: styles['heading1'],
	heading2: styles['heading2'],
	heading3: styles['heading3'],
	heading4: styles['heading4'],
} as const;

const typographySizes = {
	xs: styles['text-xs'],
	sm: styles['text-sm'],
	base: styles['text-base'],
	lg: styles['text-lg'],
	xl: styles['text-xl'],
	'2xl': styles['text-2xl'],
	'4xl': styles['text-4xl'],
	'5xl': styles['text-5xl'],
	'6xl': styles['text-6xl'],
	'8xl': styles['text-8xl'],
};

const fontWeights = {
	light: styles['weight-light'],
	regular: styles['weight-regular'],
	medium: styles['weight-medium'],
	'semi-bold': styles['weight-semi-bold'],
	bold: styles['weight-bold'],
	'extra-bold': styles['weight-extra-bold'],
};

const fontAligns = {
	left: styles['align-left'],
	center: styles['align-center'],
	right: styles['align-right'],
	justify: styles['align-justify'],
};

// Granular customization variants
export const typographyVariants = cva('', {
	variants: {
		// Semantic variants - when provided, they override size/weight but allow alignment
		variant: semanticVariants,

		// Granular customization - only used when variant is not provided
		size: typographySizes,
		weight: fontWeights,
		align: fontAligns,
	},
});

export type FontAlign = keyof typeof fontAligns;
export type FontWeight = keyof typeof fontWeights;
export type TypographySize = keyof typeof typographySizes;
export type SemanticVariant = keyof typeof semanticVariants;

export interface DsTypographyProps
	extends React.HTMLAttributes<HTMLElement>,
		VariantProps<typeof typographyVariants> {
	/**
	 * The component to render as, if not provided, uses semantic default based on variant
	 */
	as?: React.ElementType;
	/**
	 * When true, renders as Slot component for composition without extra DOM nodes
	 */
	asChild?: boolean;
	/**
	 * The content of the component
	 */
	children: React.ReactNode;
}
