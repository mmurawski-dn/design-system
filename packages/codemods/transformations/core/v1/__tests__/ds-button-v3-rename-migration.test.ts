import { defineInlineTest } from 'jscodeshift/src/testUtils';
import transform from '../ds-button-v3-rename-migration';

describe('DsButtonV3 rename migration', () => {
	defineInlineTest(
		transform,
		{},
		'import { DsButtonV3 } from "@drivenets/design-system";\nconst el = <DsButtonV3 variant="primary" />;',
		'import { DsButton } from "@drivenets/design-system";\nconst el = <DsButton variant="primary" />;',
		'should rename DsButtonV3 to DsButton in import and JSX',
	);

	defineInlineTest(
		transform,
		{},
		'import { DsButtonV3 } from "@drivenets/design-system";\nconst el = <DsButtonV3>Click</DsButtonV3>;',
		'import { DsButton } from "@drivenets/design-system";\nconst el = <DsButton>Click</DsButton>;',
		'should rename DsButtonV3 in self-closing and closing tags',
	);

	defineInlineTest(
		transform,
		{},
		'import { DsButtonV3 as MyBtn } from "@drivenets/design-system";\nconst el = <MyBtn />;',
		'import { DsButton as MyBtn } from "@drivenets/design-system";\nconst el = <MyBtn />;',
		'should rename import specifier but keep alias',
	);

	defineInlineTest(
		transform,
		{},
		'import { DsButton } from "@drivenets/design-system";\nconst el = <DsButton />;',
		'import { DsButton } from "@drivenets/design-system";\nconst el = <DsButton />;',
		'should not touch DsButton (only DsButtonV3)',
	);
});
