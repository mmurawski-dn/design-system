import { SemanticVariant, TypographySize } from '@design-system/ui';
import React from 'react';

// Semantic element mapping for semantic variants
export const semanticElementMap: Record<SemanticVariant, React.ElementType> = {
	// Body variants
	'body-md-reg': 'p',
	'body-md-md': 'p',
	'body-md-semi-bold': 'p',
	'body-md-bold': 'p',
	'body-md-link': 'a',

	'body-sm-reg': 'span',
	'body-sm-md': 'span',
	'body-sm-semi-bold': 'span',
	'body-sm-bold': 'span',
	'body-sm-link': 'a',

	'body-xs-reg': 'span',
	'body-xs-md': 'span',
	'body-xs-semi-bold': 'span',
	'body-xs-bold': 'span',
	'body-xs-link': 'a',

	// Code variants
	'code-sm-reg': 'code',
	'code-sm-semi-bold': 'code',
	'code-xs-reg': 'code',
	'code-xs-semi-bold': 'code',

	// Heading variants
	heading1: 'h1',
	heading2: 'h2',
	heading3: 'h3',
	heading4: 'h4',
} as const;

// Element mapping for granular customization
export const granularElementMap: Record<TypographySize, React.ElementType> = {
	xs: 'span',
	sm: 'span',
	base: 'p',
	lg: 'p',
	xl: 'h3',
	'2xl': 'h2',
	'4xl': 'h1',
	'5xl': 'h1',
	'6xl': 'h1',
	'8xl': 'h1',
} as const;
