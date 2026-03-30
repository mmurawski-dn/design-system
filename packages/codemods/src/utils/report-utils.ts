import chalk from 'chalk';

export function logPropMigrationError(
	filePath: string,
	componentName: string,
	deprecatedPropName: string,
	newPropName: string,
): void {
	const message =
		`\n${chalk.red(' ERROR ')} ${chalk.bold.bgYellow.black(` ${componentName} `)} ${chalk.bold(filePath)}:` +
		`\n\tComponent uses both ${chalk.italic.red(`"${deprecatedPropName}" (deprecated)`)} and ${chalk.italic.green(`"${newPropName}"`)}.\n`;

	console.error(message);
}
