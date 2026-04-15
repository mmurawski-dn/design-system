import { RuleTester } from 'eslint';
import plugin from '../index';

const ruleTester = new RuleTester({
	languageOptions: {
		parserOptions: {
			ecmaFeatures: {
				jsx: true,
			},
		},
	},
});

ruleTester.run(
	'no-deprecated-ds-button-legacy-design',
	plugin.rules['no-deprecated-ds-button-legacy-design'],
	{
		valid: ['<DsButton design="v1.2">Click me</DsButton>'],

		invalid: [
			{
				code: '<DsButton>Click me</DsButton>',
				errors: [{ message: `Using the 'legacy' design for DsButton is deprecated. Use 'v1.2' instead.` }],
			},

			{
				code: '<DsButton design="legacy">Click me</DsButton>',
				errors: [{ message: `Using the 'legacy' design for DsButton is deprecated. Use 'v1.2' instead.` }],
			},
		],
	},
);

ruleTester.run('no-deprecated-ds-chip', plugin.rules['no-deprecated-ds-chip'], {
	valid: ['<DsTag />', '<DsTagFilter />'],

	invalid: [
		{
			code: '<DsChip />',
			errors: [{ message: `DsChip is deprecated. Use DsTag instead.` }],
		},
	],
});

ruleTester.run('no-deprecated-ds-chip-group', plugin.rules['no-deprecated-ds-chip-group'], {
	valid: ['<DsTag />', '<DsTagFilter />'],

	invalid: [
		{
			code: '<DsChipGroup />',
			errors: [{ message: `DsChipGroup is deprecated. Use DsTagFilter instead.` }],
		},
	],
});

ruleTester.run('no-deprecated-ds-date-input', plugin.rules['no-deprecated-ds-date-input'], {
	valid: ['<DsDatePicker />', '<DsDateRangePicker />'],

	invalid: [
		{
			code: '<DsDateInput />',
			errors: [{ message: `DsDateInput is deprecated. Use DsDatePicker or DsDateRangePicker instead.` }],
		},
	],
});
