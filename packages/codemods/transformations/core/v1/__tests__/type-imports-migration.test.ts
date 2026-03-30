import { defineInlineTest } from 'jscodeshift/src/testUtils';
import transform from '../type-imports-migration';

describe('Type imports migration', () => {
	defineInlineTest(
		transform,
		{},
		'import { DsButtonUnifiedProps } from "@drivenets/design-system";',
		'import { DsButtonProps } from "@drivenets/design-system";',
		'should rename DsButtonUnifiedProps to DsButtonProps',
	);

	defineInlineTest(
		transform,
		{},
		'import { DsButtonV3Props } from "@drivenets/design-system";',
		'import { DsButtonProps } from "@drivenets/design-system";',
		'should rename DsButtonV3Props to DsButtonProps',
	);

	defineInlineTest(
		transform,
		{},
		'import { buttonV3Variants } from "@drivenets/design-system";',
		'import { buttonVariants } from "@drivenets/design-system";',
		'should rename buttonV3Variants to buttonVariants',
	);

	defineInlineTest(
		transform,
		{},
		'import { buttonV3Colors, buttonV3Sizes } from "@drivenets/design-system";',
		'import { buttonColors, buttonSizes } from "@drivenets/design-system";',
		'should rename buttonV3Colors and buttonV3Sizes',
	);

	defineInlineTest(
		transform,
		{},
		'import { ButtonV3Variant, ButtonV3Color, ButtonV3Size } from "@drivenets/design-system";',
		'import { ButtonVariant, ButtonColor, ButtonSize } from "@drivenets/design-system";',
		'should rename ButtonV3* type aliases',
	);

	defineInlineTest(
		transform,
		{},
		'import { DsButton } from "@drivenets/design-system";',
		'import { DsButton } from "@drivenets/design-system";',
		'should not touch unrelated imports',
	);

	defineInlineTest(
		transform,
		{},
		'import { DsButtonV3Props as MyProps } from "@drivenets/design-system";',
		'import { DsButtonProps as MyProps } from "@drivenets/design-system";',
		'should rename but keep alias',
	);
});
