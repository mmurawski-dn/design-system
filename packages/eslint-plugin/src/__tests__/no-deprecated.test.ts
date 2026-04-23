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

// Example test for the futur reference

// ruleTester.run('no-deprecated-ds-date-input', plugin.rules['no-deprecated-ds-date-input'], {
// 	valid: ['<DsDatePicker />', '<DsDateRangePicker />'],

// 	invalid: [
// 		{
// 			code: '<DsDateInput />',
// 			errors: [
// 				{
// 					message: `DsDateInput is deprecated. Use DsDatePicker or DsDateRangePicker instead.`,
// 					line: 1,
// 					endLine: 1,
// 					column: 2,
// 					endColumn: 13,
// 				},
// 			],
// 		},
// 	],
// });
