import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DsVerticalTabs from './ds-vertical-tabs';
import { VerticalTabItem } from './ds-vertical-tabs.types';

const meta: Meta<typeof DsVerticalTabs> = {
	title: 'Design System/Vertical Tabs',
	component: DsVerticalTabs,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		items: {
			control: 'object',
			description: 'Array of tab items',
		},
		selectedItem: {
			control: 'object',
			description: 'Currently selected item',
		},
		onSelect: {
			action: 'selected',
			description: 'Callback when an item is selected',
		},
		className: {
			control: 'text',
			description: 'Additional CSS class names',
		},
	},
};

export default meta;
type Story = StoryObj<typeof DsVerticalTabs>;

const sampleItems: VerticalTabItem[] = [
	{ id: 'status', label: 'Status', count: 2 },
	{ id: 'running', label: 'Running/Completed' },
	{ id: 'category', label: 'Category' },
	{ id: 'version', label: 'Version' },
	{ id: 'lastEdited', label: 'Last edited', count: 5 },
	{ id: 'lastRun', label: 'Last run' },
	{ id: 'nextRun', label: 'Next run' },
];

const sampleItemsWithDisabled: VerticalTabItem[] = [
	{ id: 'status', label: 'Status', count: 2, disabled: true },
	{ id: 'running', label: 'Running/Completed' },
	{ id: 'category', label: 'Category' },
	{ id: 'version', label: 'Version' },
	{ id: 'lastEdited', label: 'Last edited', count: 5 },
];

export const Default: Story = {
	args: {
		items: sampleItems,
		selectedItem: sampleItems[0],
	},
	decorators: [
		(Story) => (
			<div style={{ width: '364px', height: '400px', border: '1px solid #e0e0e0' }}>
				<Story />
			</div>
		),
	],
};

export const WithoutSelection: Story = {
	args: {
		items: sampleItems,
	},
	decorators: [
		(Story) => (
			<div style={{ width: '364px', height: '400px', border: '1px solid #e0e0e0' }}>
				<Story />
			</div>
		),
	],
};

export const WithDisabledItems: Story = {
	args: {
		items: sampleItemsWithDisabled,
		selectedItem: sampleItemsWithDisabled[1],
	},
	decorators: [
		(Story) => (
			<div style={{ width: '364px', height: '400px', border: '1px solid #e0e0e0' }}>
				<Story />
			</div>
		),
	],
};

export const Interactive: Story = {
	render: function Render(args) {
		const [selected, setSelected] = useState<VerticalTabItem>(sampleItems[0]);

		return (
			<div style={{ width: '364px', height: '400px', border: '1px solid #e0e0e0' }}>
				<DsVerticalTabs {...args} items={sampleItems} selectedItem={selected} onSelect={setSelected} />
				<div style={{ padding: '16px', borderTop: '1px solid #e0e0e0', background: '#f5f5f5' }}>
					<p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
						Selected: <strong>{selected.label}</strong>
					</p>
				</div>
			</div>
		);
	},
};

export const LongLabels: Story = {
	args: {
		items: [
			{ id: '1', label: 'Very Long Navigation Item Label That Might Overflow', count: 99 },
			{ id: '2', label: 'Another Really Long Label For Testing Purposes' },
			{ id: '3', label: 'Short', count: 1 },
		],
		selectedItem: { id: '1', label: 'Very Long Navigation Item Label That Might Overflow', count: 99 },
	},
	decorators: [
		(Story) => (
			<div style={{ width: '364px', height: '200px', border: '1px solid #e0e0e0' }}>
				<Story />
			</div>
		),
	],
};

export const HighCounts: Story = {
	args: {
		items: [
			{ id: 'status', label: 'Status', count: 999 },
			{ id: 'category', label: 'Category', count: 1000 },
			{ id: 'version', label: 'Version', count: 12345 },
		],
		selectedItem: { id: 'status', label: 'Status', count: 999 },
	},
	decorators: [
		(Story) => (
			<div style={{ width: '364px', height: '200px', border: '1px solid #e0e0e0' }}>
				<Story />
			</div>
		),
	],
};

export const Scrollable: Story = {
	args: {
		items: [
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
		],
		selectedItem: { id: '5', label: 'Item 5', count: 5 },
	},
	decorators: [
		(Story) => (
			<div style={{ width: '364px', height: '300px', border: '1px solid #e0e0e0' }}>
				<Story />
			</div>
		),
	],
};
