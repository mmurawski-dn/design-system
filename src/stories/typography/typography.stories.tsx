import type { Meta, StoryObj } from '@storybook/react';
import classNames from 'classnames';
import styles from './typography.stories.module.scss';

const meta: Meta = {
	title: 'Design System/Typography',
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleText = 'Almost before we knew it, we had left the ground.';

export const Default: Story = {
	render: function Render() {
		const typographyClasses = [
			{
				name: 'Heading 1',
				className: 'heading1',
				description: '32px, Semi-bold, -0.01em letter spacing',
			},
			{
				name: 'Heading 2',
				className: 'heading2',
				description: '24px, Semi-bold, -0.01em letter spacing',
			},
			{
				name: 'Heading 3',
				className: 'heading3',
				description: '20px, Semi-bold, -0.01em letter spacing',
			},
			{
				name: 'Heading 4',
				className: 'heading4',
				description: '18px, Semi-bold, -0.01em letter spacing',
			},
			{
				name: 'Body MD Regular',
				className: 'body-md-reg',
				description: '16px, Regular, -0.01em letter spacing',
			},
			{
				name: 'Body MD Semi-bold',
				className: 'body-md-semi-bold',
				description: '16px, Semi-bold, -0.01em letter spacing',
			},
			{
				name: 'Body MD Bold',
				className: 'body-md-bold',
				description: '16px, Bold, -0.01em letter spacing',
			},
			{
				name: 'Body MD Link',
				className: 'body-md-link',
				description: '16px, Regular, -0.01em letter spacing, with underline',
			},
			{
				name: 'Body SM Regular',
				className: 'body-sm-reg',
				description: '14px, Regular, -0.01em letter spacing',
			},
			{
				name: 'Body SM Semi-bold',
				className: 'body-sm-semi-bold',
				description: '14px, Semi-bold, -0.01em letter spacing',
			},
			{
				name: 'Body SM Bold',
				className: 'body-sm-bold',
				description: '14px, Bold, -0.01em letter spacing',
			},
			{
				name: 'Body SM Link',
				className: 'body-sm-link',
				description: '14px, Regular, -0.01em letter spacing, with underline',
			},
			{
				name: 'Body XS Regular',
				className: 'body-xs-reg',
				description: '12px, Regular',
			},
			{
				name: 'Body XS Semi-bold',
				className: 'body-xs-semi-bold',
				description: '12px, Semi-bold',
			},
			{
				name: 'Body XS Bold',
				className: 'body-xs-bold',
				description: '12px, Bold',
			},
			{
				name: 'Body XS Link',
				className: 'body-xs-link',
				description: '12px, Regular, with underline',
			},
			{
				name: 'Code SM Regular',
				className: 'code-sm-reg',
				description: '14px, Regular, -0.01em letter spacing, Fira Mono',
			},
			{
				name: 'Code SM Semi-bold',
				className: 'code-sm-semi-bold',
				description: '14px, Semi-bold, -0.01em letter spacing, Fira Mono',
			},
			{
				name: 'Code XS Regular',
				className: 'code-xs-reg',
				description: '12px, Regular, -0.01em letter spacing, Fira Mono',
			},
			{
				name: 'Code XS Semi-bold',
				className: 'code-xs-semi-bold',
				description: '12px, Semi-bold, -0.01em letter spacing, Fira Mono',
			},
		];

		return (
			<div className={styles.typographyContainer}>
				<h1 className={styles.pageTitle}>Typography Design System v1.2</h1>
				<p className={styles.pageDescription}>
					This showcase displays all typography classes defined in the Design System v1.2.
				</p>

				<div className={styles.typographyGrid}>
					{typographyClasses.map((typographyClass) => (
						<div key={typographyClass.className} className={styles.typographyItem}>
							<div className={styles.typographyInfo}>
								<h3 className={styles.typographyName}>{typographyClass.name}</h3>
								<p className={styles.typographyDescription}>{typographyClass.description}</p>
								<code className={styles.typographyClass}>.{typographyClass.className}</code>
							</div>
							<div className={styles.typographyPreview}>
								<p className={classNames(styles[typographyClass.className])}>{sampleText}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	},
};

export const Comparison: Story = {
	render: function Render() {
		const headingClasses = ['heading1', 'heading2', 'heading3', 'heading4'];
		const bodyClasses = ['body-md-reg', 'body-sm-reg', 'body-xs-reg'];
		const codeClasses = ['code-sm-reg', 'code-xs-reg'];

		return (
			<div className={styles.typographyContainer}>
				<h1 className={styles.pageTitle}>Typography Comparison</h1>

				<section className={styles.comparisonSection}>
					<h2 className={styles.sectionTitle}>Headings</h2>
					{headingClasses.map((className) => (
						<div key={className} className={styles.comparisonItem}>
							<span className={styles.comparisonLabel}>{className}:</span>
							<span className={classNames(styles[className])}>{sampleText}</span>
						</div>
					))}
				</section>

				<section className={styles.comparisonSection}>
					<h2 className={styles.sectionTitle}>Body Text</h2>
					{bodyClasses.map((className) => (
						<div key={className} className={styles.comparisonItem}>
							<span className={styles.comparisonLabel}>{className}:</span>
							<span className={classNames(styles[className])}>{sampleText}</span>
						</div>
					))}
				</section>

				<section className={styles.comparisonSection}>
					<h2 className={styles.sectionTitle}>Code Text</h2>
					{codeClasses.map((className) => (
						<div key={className} className={styles.comparisonItem}>
							<span className={styles.comparisonLabel}>{className}:</span>
							<span className={classNames(styles[className])}>{sampleText}</span>
						</div>
					))}
				</section>
			</div>
		);
	},
};
