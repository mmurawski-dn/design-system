import { defineInlineTest } from 'jscodeshift/src/testUtils';
import transform from '../ds-button-v12-migration';

function withImport(source: string): string {
	return `import { DsButton } from "@drivenets/design-system";\n${source}`;
}

describe('DsButton v1.2 migration', () => {
	defineInlineTest(
		transform,
		{},
		withImport('const el = <DsButton design="v1.2" buttonType="tertiary" />;'),
		withImport('const el = <DsButton variant="tertiary" />;'),
		'should map buttonType="tertiary" to variant="tertiary"',
	);

	defineInlineTest(
		transform,
		{},
		withImport('const el = <DsButton design="v1.2" buttonType="secondary" />;'),
		withImport('const el = <DsButton variant="secondary" />;'),
		'should map buttonType="secondary" to variant="secondary"',
	);

	defineInlineTest(
		transform,
		{},
		withImport('const el = <DsButton design="v1.2" buttonType="primary" />;'),
		withImport('const el = <DsButton />;'),
		'should remove buttonType="primary" (default)',
	);

	defineInlineTest(
		transform,
		{},
		withImport('const el = <DsButton design="v1.2" buttonType="secondary-light" />;'),
		withImport(
			'// TODO(codemod): "secondary-light" mapped to "secondary" — verify visual parity\nconst el = <DsButton variant="secondary" />;',
		),
		'should map buttonType="secondary-light" to variant="secondary" with TODO',
	);

	defineInlineTest(
		transform,
		{},
		withImport('const el = <DsButton design="v1.2" variant="filled" />;'),
		withImport('const el = <DsButton />;'),
		'should remove variant="filled" (default)',
	);

	defineInlineTest(
		transform,
		{},
		withImport('const el = <DsButton design="v1.2" buttonType="secondary" variant="ghost" />;'),
		withImport('const el = <DsButton variant="tertiary" />;'),
		'should map variant="ghost" to variant="tertiary", overriding buttonType',
	);

	defineInlineTest(
		transform,
		{},
		withImport('const el = <DsButton design="v1.2" buttonType="secondary" variant="danger" />;'),
		withImport('const el = <DsButton color="negative" variant="secondary" />;'),
		'should map variant="danger" to color="negative", keeping buttonType variant',
	);

	defineInlineTest(
		transform,
		{},
		withImport('const el = <DsButton design="v1.2" buttonType="primary" variant="dark" />;'),
		withImport('const el = <DsButton onDark />;'),
		'should map variant="dark" to onDark prop',
	);

	defineInlineTest(
		transform,
		{},
		withImport('const el = <DsButton design="v1.2" contentClassName="bar" buttonType="tertiary" />;'),
		withImport(
			'// TODO(codemod): "contentClassName" removed — no v3 equivalent, use className or slotProps\nconst el = <DsButton variant="tertiary" />;',
		),
		'should remove contentClassName with TODO',
	);

	defineInlineTest(
		transform,
		{},
		withImport('const el = <DsButton schema="primary" />;'),
		withImport('const el = <DsButton schema="primary" />;'),
		'should NOT touch elements without design="v1.2"',
	);
});
