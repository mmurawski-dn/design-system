import React from 'react';
import clsx from 'clsx';
import { Slot } from '@radix-ui/react-slot';
import { DsTypographyProps, typographyVariants } from './ds-typography.types';
import { granularElementMap, semanticElementMap } from './ds-typography.config';

/*
 * Design system Typography component that provides consistent text styling.
 *
 * Supports two modes:
 * 1. Semantic variants: Use predefined combinations (e.g., 'body-md-reg', 'code-xs-semi-bold')
 * 2. Granular customization: Mix and match size, weight, and alignment
 *
 * @example
 * // Semantic variant usage
 * <Typography variant="body-md-reg">Regular body text</Typography>
 * <Typography variant="code-xs-semi-bold">Code snippet</Typography>
 * <Typography variant="heading1">Page title</Typography>
 *
 * @example
 * // Granular customization
 * <Typography size="lg" weight="bold" align="center">Custom styled text</Typography>
 * <Typography size="2xl" weight="semi-bold">Large heading</Typography>
 *
 * @example
 * // Custom element
 * <Typography variant="body-sm-reg" as="label">Form Label</Typography>
 *
 * @example
 * // Zero-overhead composition
 * <Typography variant="body-md-link" asChild>
 *   <Link href="/about">About Us</Link>
 * </Typography>
 */
const DsTypography: React.FC<DsTypographyProps & { ref?: React.Ref<HTMLElement> }> = ({
	variant,
	size,
	weight,
	align,
	as,
	asChild = false,
	className,
	children,
	ref,
	...props
}) => {
	// Determine if we're using semantic variant or granular customization
	const isSemanticVariant = variant && semanticElementMap[variant];

	// Determine the component to render
	let Component: React.ElementType;
	if (asChild) {
		Component = Slot;
	} else if (as) {
		Component = as;
	} else if (isSemanticVariant) {
		Component = semanticElementMap[variant];
	} else {
		Component = granularElementMap[size || 'base'];
	}

	// Generate classes based on the approach
	const classes = clsx(
		typographyVariants({
			variant,
			size,
			weight,
			align,
		}),
		className,
	);

	return (
		<Component ref={ref} className={classes} {...props}>
			{children}
		</Component>
	);
};

export default DsTypography;
