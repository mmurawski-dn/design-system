import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DsVerticalTabs from './ds-vertical-tabs';
import { DsTypography } from '../ds-typography';
import styles from './ds-vertical-tabs.stories.module.scss';

// Example tab item structure
interface TabItem {
	id: string;
	label: string;
	count?: number;
	disabled?: boolean;
}

const meta: Meta<typeof DsVerticalTabs> = {
	title: 'Design System/Vertical Tabs',
	component: DsVerticalTabs,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
DsVerticalTabs is a compound component for creating flexible vertical tab navigation, providing full accessibility support.

## Usage Pattern

\`\`\`tsx
<DsVerticalTabs value={selected} onValueChange={handleChange}>
  <DsVerticalTabs.List>
    <DsVerticalTabs.Tab value="tab1">
      <DsTypography variant="body-sm-md">Tab 1</DsTypography>
      {/* Optional: badges, icons, etc. */}
    </DsVerticalTabs.Tab>
    <DsVerticalTabs.Tab value="tab2">Tab 2</DsVerticalTabs.Tab>
  </DsVerticalTabs.List>
  <DsVerticalTabs.Content value="tab1">Content 1</DsVerticalTabs.Content>
  <DsVerticalTabs.Content value="tab2">Content 2</DsVerticalTabs.Content>
</DsVerticalTabs>
\`\`\`
				`,
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		value: {
			control: 'text',
			description: 'Currently selected tab value (controlled)',
		},
		onValueChange: {
			action: 'valueChange',
			description: 'Callback when tab selection changes',
		},
		className: {
			control: 'text',
			description: 'Additional CSS class names',
		},
	},
};

export default meta;
type Story = StoryObj<typeof DsVerticalTabs>;

const sampleItems: TabItem[] = [
	{ id: 'status', label: 'Status', count: 2 },
	{ id: 'running', label: 'Running/Completed' },
	{ id: 'category', label: 'Category' },
	{ id: 'version', label: 'Version' },
	{ id: 'lastEdited', label: 'Last edited', count: 5 },
	{ id: 'lastRun', label: 'Last run' },
	{ id: 'nextRun', label: 'Next run' },
];

const sampleItemsWithDisabled: TabItem[] = [
	{ id: 'status', label: 'Status', count: 2, disabled: true },
	{ id: 'running', label: 'Running/Completed' },
	{ id: 'category', label: 'Category' },
	{ id: 'version', label: 'Version' },
	{ id: 'lastEdited', label: 'Last edited', count: 5 },
];

// Helper component for consistent tab rendering with count badge
const FilterTabContent = ({ item }: { item: TabItem }) => (
	<>
		<DsTypography variant="body-sm-md" className={styles.tabItemLabel}>
			{item.label}
		</DsTypography>
		{!!item.count && (
			<div className={styles.tabItemCount}>
				<span className={styles.tabItemDot} />
				<DsTypography variant="body-sm-reg" className={styles.tabItemCountText}>
					{item.count}
				</DsTypography>
			</div>
		)}
	</>
);

export const Default: Story = {
	render: () => (
		<div className={styles.storyContainer}>
			<DsVerticalTabs value="status">
				<DsVerticalTabs.List>
					{sampleItems.map((item) => (
						<DsVerticalTabs.Tab key={item.id} value={item.id} disabled={item.disabled}>
							<FilterTabContent item={item} />
						</DsVerticalTabs.Tab>
					))}
				</DsVerticalTabs.List>
			</DsVerticalTabs>
		</div>
	),
};

export const WithoutSelection: Story = {
	render: () => (
		<div className={styles.storyContainer}>
			<DsVerticalTabs>
				<DsVerticalTabs.List>
					{sampleItems.map((item) => (
						<DsVerticalTabs.Tab key={item.id} value={item.id} disabled={item.disabled}>
							<FilterTabContent item={item} />
						</DsVerticalTabs.Tab>
					))}
				</DsVerticalTabs.List>
			</DsVerticalTabs>
		</div>
	),
};

export const WithDisabledItems: Story = {
	render: () => (
		<div className={styles.storyContainer}>
			<DsVerticalTabs value="running">
				<DsVerticalTabs.List>
					{sampleItemsWithDisabled.map((item) => (
						<DsVerticalTabs.Tab key={item.id} value={item.id} disabled={item.disabled}>
							<FilterTabContent item={item} />
						</DsVerticalTabs.Tab>
					))}
				</DsVerticalTabs.List>
			</DsVerticalTabs>
		</div>
	),
};

export const Interactive: Story = {
	render: function Render() {
		const [selectedId, setSelectedId] = useState<string>('status');

		const handleValueChange = (details: { value: string | null }) => {
			if (details.value) setSelectedId(details.value);
		};

		const selectedItem = sampleItems.find((item) => item.id === selectedId);

		return (
			<div className={styles.storyContainer}>
				<DsVerticalTabs value={selectedId} onValueChange={handleValueChange}>
					<DsVerticalTabs.List>
						{sampleItems.map((item) => (
							<DsVerticalTabs.Tab key={item.id} value={item.id} disabled={item.disabled}>
								<FilterTabContent item={item} />
							</DsVerticalTabs.Tab>
						))}
					</DsVerticalTabs.List>
				</DsVerticalTabs>
				<div className={styles.interactiveFooter}>
					<p className={styles.interactiveText}>
						Selected: <strong>{selectedItem?.label}</strong>
					</p>
				</div>
			</div>
		);
	},
};

export const LongLabels: Story = {
	render: () => {
		const items: TabItem[] = [
			{ id: '1', label: 'Very Long Navigation Item Label That Might Overflow', count: 99 },
			{ id: '2', label: 'Another Really Long Label For Testing Purposes' },
			{ id: '3', label: 'Short', count: 1 },
		];
		return (
			<div className={styles.storyContainerShort}>
				<DsVerticalTabs value="1">
					<DsVerticalTabs.List>
						{items.map((item) => (
							<DsVerticalTabs.Tab key={item.id} value={item.id} disabled={item.disabled}>
								<FilterTabContent item={item} />
							</DsVerticalTabs.Tab>
						))}
					</DsVerticalTabs.List>
				</DsVerticalTabs>
			</div>
		);
	},
};

export const HighCounts: Story = {
	render: () => {
		const items: TabItem[] = [
			{ id: 'status', label: 'Status', count: 999 },
			{ id: 'category', label: 'Category', count: 1000 },
			{ id: 'version', label: 'Version', count: 12345 },
		];
		return (
			<div className={styles.storyContainerShort}>
				<DsVerticalTabs value="status">
					<DsVerticalTabs.List>
						{items.map((item) => (
							<DsVerticalTabs.Tab key={item.id} value={item.id} disabled={item.disabled}>
								<FilterTabContent item={item} />
							</DsVerticalTabs.Tab>
						))}
					</DsVerticalTabs.List>
				</DsVerticalTabs>
			</div>
		);
	},
};

export const Scrollable: Story = {
	render: () => {
		const items: TabItem[] = [
			{ id: '1', label: 'Item 1', count: 1 },
			{ id: '2', label: 'Item 2', count: 2 },
			{ id: '3', label: 'Item 3', count: 3 },
			{ id: '4', label: 'Item 4', count: 4 },
			{ id: '5', label: 'Item 5', count: 5 },
			{ id: '6', label: 'Item 6', count: 6 },
			{ id: '7', label: 'Item 7', count: 7 },
			{ id: '8', label: 'Item 8', count: 8 },
			{ id: '9', label: 'Item 9', count: 9 },
			{ id: '10', label: 'Item 10', count: 10 },
		];
		return (
			<div className={styles.storyContainerMedium}>
				<DsVerticalTabs value="5">
					<DsVerticalTabs.List>
						{items.map((item) => (
							<DsVerticalTabs.Tab key={item.id} value={item.id} disabled={item.disabled}>
								<FilterTabContent item={item} />
							</DsVerticalTabs.Tab>
						))}
					</DsVerticalTabs.List>
				</DsVerticalTabs>
			</div>
		);
	},
};
