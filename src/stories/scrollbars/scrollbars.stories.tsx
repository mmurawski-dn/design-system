import type { Meta, StoryObj } from '@storybook/react';
import styles from './scrollbars.stories.module.scss';

const meta: Meta = {
	title: 'Design System/Scrollbars',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: `
Global scrollbar styles that can be applied to any element with overflow content.

## Usage
- \`scrollbar-default\`: default scrollbar width/height
- \`scrollbar-small\`: thin scrollbar width/height

Apply these classes to any element that has overflow content.
				`,
			},
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to generate content
const generateContent = (count: number, direction: 'vertical' | 'horizontal') => {
	const items = Array.from({ length: count }, (_, i) => (
		<div key={i} className={direction === 'horizontal' ? styles.contentItemHorizontal : styles.contentItem}>
			<h3>Item {i + 1}</h3>
			<p>Content for item {i + 1}</p>
		</div>
	));

	return <div className={direction === 'horizontal' ? styles.contentContainer : undefined}>{items}</div>;
};

export const DefaultScrollbar: Story = {
	render: () => (
		<div className={styles.container}>
			{/* Vertical scrollbar */}
			<div className={styles.section}>
				<h3>Vertical Scrollbar (Default)</h3>
				<div className={`scrollbar-default ${styles.scrollableContainer}`}>
					{generateContent(20, 'vertical')}
				</div>
			</div>

			{/* Horizontal scrollbar */}
			<div className={styles.sectionWide}>
				<h3>Horizontal Scrollbar (Default)</h3>
				<div className={`scrollbar-default ${styles.scrollableContainer}`}>
					{generateContent(15, 'horizontal')}
				</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: 'Default scrollbars for both vertical and horizontal overflow.',
			},
		},
	},
};

export const SmallScrollbar: Story = {
	render: () => (
		<div className={styles.container}>
			{/* Vertical scrollbar */}
			<div className={styles.section}>
				<h3>Vertical Scrollbar (Small)</h3>
				<div className={`scrollbar-small ${styles.scrollableContainer}`}>
					{generateContent(20, 'vertical')}
				</div>
			</div>

			{/* Horizontal scrollbar */}
			<div className={styles.sectionWide}>
				<h3>Horizontal Scrollbar (Small)</h3>
				<div className={`scrollbar-small ${styles.scrollableContainer}`}>
					{generateContent(15, 'horizontal')}
				</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: 'Small (thin) scrollbars for both vertical and horizontal overflow.',
			},
		},
	},
};

export const CombinedExample: Story = {
	render: () => (
		<div className={styles.sectionExtraWide}>
			<h3>Combined Example - Both X and Y Overflow</h3>
			<div className={`scrollbar-default ${styles.scrollableContainerTall}`}>
				<div className={styles.wideContent}>
					<h2>Wide Content</h2>
					<p>This container has both vertical and horizontal overflow, showing both scrollbars.</p>
					{generateContent(25, 'horizontal')}
					{generateContent(25, 'horizontal')}
					{generateContent(25, 'horizontal')}
				</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: 'Example showing both vertical and horizontal scrollbars on the same container.',
			},
		},
	},
};
