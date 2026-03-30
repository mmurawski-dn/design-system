#!/usr/bin/env node
import { join, basename, extname } from 'path';
import { spawn, spawnSync } from 'child_process';
import { createInterface } from 'readline';
import * as fs from 'fs';
import * as globby from 'globby';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const mapMigrationType: Record<string, string> = {
	v1: 'v1',
};

const migrations = Object.keys(mapMigrationType);

const TRANSFORMS_RUN_LAST = ['type-imports-migration'];

const argv = yargs(hideBin(process.argv))
	.option('migration', {
		alias: 'm',
		type: 'string',
		description: 'Migration type to run (e.g., v1)',
		choices: migrations,
		demandOption: true,
	})
	.option('target', {
		alias: 't',
		type: 'string',
		description: 'Target directory to apply transformations',
		default: process.cwd(),
	})
	.option('extensions', {
		alias: 'x',
		type: 'array',
		description: 'File extensions to include',
		choices: ['jsx', 'tsx', 'js', 'ts'],
		default: ['jsx', 'tsx'],
	})
	.option('verbose', {
		alias: 'v',
		type: 'boolean',
		description: 'Enable verbose mode',
		default: false,
	})
	.option('yes', {
		alias: 'y',
		type: 'boolean',
		description: 'Skip confirmation prompts',
		default: false,
	})
	.help()
	.parseSync();

function isGitClean(): boolean {
	try {
		const status = spawnSync('git', ['status', '--porcelain'], { encoding: 'utf-8' }).stdout.trim();
		return status === '';
	} catch {
		return true;
	}
}

function printReport(successCount: number, failureCount: number, duration: string): void {
	if (failureCount) {
		console.log(
			`${chalk.dim('\nTransformations ')}${chalk.bold.red(`${String(failureCount)} failed`)} | ${chalk.bold.green(`${String(successCount)} succeeded`)}`,
		);
	} else {
		console.log(`${chalk.dim('\nTransformations ')}${chalk.bold.green(`${String(successCount)} succeeded`)}`);
	}
	console.log(`${chalk.dim('      Duration ')}${duration}\n`);
}

async function runSingleTransformation(
	transformPath: string,
	targetDir: string,
	extensions: string[],
	verbose: boolean,
): Promise<boolean> {
	return new Promise((resolve) => {
		const child = spawn(
			'node',
			[
				require.resolve('jscodeshift/bin/jscodeshift'),
				`--extensions=${extensions.join(',')}`,
				'--ignore-pattern=node_modules',
				'--ignore-pattern=**/*.d.ts',
				`--verbose=${String(verbose ? 2 : 0)}`,
				'--no-babel',
				'-t',
				transformPath,
				targetDir,
			],
			{
				stdio: verbose ? 'inherit' : ['inherit', 'pipe', 'pipe'],
				shell: true,
				env: { ...process.env, FORCE_COLOR: '1' },
			},
		);

		let hasError = false;

		child.stderr?.on('data', (data: Buffer) => {
			const output = data.toString();
			if (output.includes('ERROR')) {
				hasError = true;
			}
			if (verbose) {
				process.stderr.write(output);
			}
		});

		child.stdout?.on('data', (data: Buffer) => {
			const output = data.toString();
			if (output.includes('ERROR')) {
				hasError = true;
			}
		});

		child.on('exit', (code) => resolve(code === 0 && !hasError));
	});
}

async function main() {
	const migration = argv.migration;
	const targetDir = argv.target;
	const extensions = argv.extensions;
	const verbose = argv.verbose;

	const migrationDir = mapMigrationType[migration];
	if (!migrationDir) {
		console.error(chalk.red(`Unknown migration: ${migration}`));
		process.exit(1);
	}

	const transformsDir = join(__dirname, '..', 'transformations', 'core', migrationDir);

	if (!fs.existsSync(transformsDir)) {
		console.error(chalk.red(`Transformations directory not found: ${transformsDir}`));
		process.exit(1);
	}

	if (!isGitClean()) {
		console.warn(
			chalk.yellow('Warning: Your Git working directory is not clean. Recommended to run with a clean tree.'),
		);
		if (!argv.yes) {
			const rl = createInterface({ input: process.stdin, output: process.stdout });
			const answer = await new Promise<string>((res) => rl.question('Proceed anyway? (y/N) ', res));
			rl.close();
			if (answer.toLowerCase() !== 'y') {
				console.log('Aborted.');
				process.exit(1);
			}
		}
	}

	const allFiles: string[] = globby.sync(`${transformsDir}/*.js`, {
		ignore: ['node_modules/**', '**/*.d.ts'],
	});

	if (!allFiles.length) {
		console.error(chalk.red('No transformation files found. Check the migration name.'));
		process.exit(1);
	}

	const lastFiles = TRANSFORMS_RUN_LAST.map((name) => join(transformsDir, `${name}.js`));
	const orderedFiles = [
		...allFiles.filter((f) => !lastFiles.includes(f)),
		...lastFiles.filter((f) => allFiles.includes(f)),
	];

	console.log(chalk.green(`\nRunning "${migration}" migration on: ${targetDir}`));
	console.log(chalk.dim(`  ${String(orderedFiles.length)} transforms found\n`));

	let successCount = 0;
	let failureCount = 0;
	const startTime = Date.now();

	for (const transformPath of orderedFiles) {
		const label = basename(transformPath, extname(transformPath));
		process.stdout.write(chalk.dim(`  Running ${label}... `));

		const success = await runSingleTransformation(transformPath, targetDir, extensions, verbose);
		if (success) {
			successCount++;
			console.log(chalk.green('done'));
		} else {
			failureCount++;
			console.log(chalk.red('failed'));
		}
	}

	const duration = ((Date.now() - startTime) / 1000).toFixed(2) + 's';
	printReport(successCount, failureCount, duration);

	if (failureCount) {
		process.exit(1);
	}
}

void main();
