import { defineInlineTest } from 'jscodeshift/src/testUtils';
import transform from '../ds-button-legacy-migration';

function withImport(source: string): string {
	return `import { DsButton } from "@drivenets/design-system";\n${source}`;
}

describe('DsButton legacy migration', () => {
	defineInlineTest(
		transform,
		{},
		withImport('const el = <DsButton schema="primary" />;'),
		withImport('const el = <DsButton />;'),
		'should remove schema="primary" (default variant)',
	);

	defineInlineTest(
		transform,
		{},
		withImport('const el = <DsButton schema="secondary" />;'),
		withImport('const el = <DsButton variant="secondary" />;'),
		'should map schema="secondary" to variant="secondary"',
	);

	defineInlineTest(
		transform,
		{},
		withImport('const el = <DsButton schema="error" />;'),
		withImport('const el = <DsButton color="negative" />;'),
		'should map schema="error" to color="negative"',
	);

	defineInlineTest(
		transform,
		{},
		withImport('const el = <DsButton variant="filled" />;'),
		withImport('const el = <DsButton />;'),
		'should remove variant="filled" (default)',
	);

	defineInlineTest(
		transform,
		{},
		withImport('const el = <DsButton variant="ghost" />;'),
		withImport('const el = <DsButton variant="tertiary" />;'),
		'should map variant="ghost" to variant="tertiary"',
	);

	defineInlineTest(
		transform,
		{},
		withImport('const el = <DsButton variant="borderless" />;'),
		withImport(
			'// TODO(codemod): "borderless" mapped to "tertiary" — verify visual parity\nconst el = <DsButton variant="tertiary" />;',
		),
		'should map variant="borderless" to variant="tertiary" with TODO',
	);

	defineInlineTest(
		transform,
		{},
		withImport('const el = <DsButton variant="round" />;'),
		withImport(
			'// TODO(codemod): "round" variant has no v3 equivalent — manual fix needed\nconst el = <DsButton />;',
		),
		'should remove variant="round" with TODO comment',
	);

	defineInlineTest(
		transform,
		{},
		withImport('const el = <DsButton contentClassName="foo" />;'),
		withImport(
			'// TODO(codemod): "contentClassName" removed — no v3 equivalent, use className or slotProps\nconst el = <DsButton />;',
		),
		'should remove contentClassName with TODO',
	);

	defineInlineTest(
		transform,
		{},
		withImport('const el = <DsButton design="legacy" schema="secondary" />;'),
		withImport('const el = <DsButton variant="secondary" />;'),
		'should handle design="legacy" and map schema',
	);

	defineInlineTest(
		transform,
		{},
		withImport('const el = <DsButton design="v1.2" buttonType="tertiary" />;'),
		withImport('const el = <DsButton design="v1.2" buttonType="tertiary" />;'),
		'should NOT touch design="v1.2" elements',
	);

	defineInlineTest(
		transform,
		{},
		'import { SomeOther } from "other-lib";\nconst el = <DsButton />;',
		'import { SomeOther } from "other-lib";\nconst el = <DsButton />;',
		'should not touch files without DS import',
	);
});
