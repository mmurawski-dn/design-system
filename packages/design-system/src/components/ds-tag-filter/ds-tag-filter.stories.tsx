import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import DsTagFilter from './ds-tag-filter';
import type { TagFilterItem } from './ds-tag-filter.types';
import styles from './ds-tag-filter.stories.module.scss';

const meta: Meta<typeof DsTagFilter> = {
	title: 'Design System/Tag Filter',
	component: DsTagFilter,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'A component for displaying active filters as tags with overflow handling. Shows visible tags in up to 2 rows, with an expand button to show hidden items in a dialog.',
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		items: {
			control: 'object',
			description: 'Array of tag items to display',
		},
		label: {
			control: 'text',
			description: 'Label text to display before the tags',
		},
		onClearAll: {
			action: 'clear-all',
			description: 'Callback when "Clear all filters" is clicked',
		},
		onItemDelete: {
			action: 'delete-item',
			description: 'Callback when item is deleted',
		},
		onItemSelect: {
			action: 'select-item',
			description: 'Callback when item is selected',
		},
	},
};

export default meta;
type Story = StoryObj<typeof DsTagFilter>;

const sampleFilters: TagFilterItem[] = [
	{ id: '1', label: 'Status: Active' },
	{ id: '2', label: 'Running: From 100 to 10,000' },
	{ id: '3', label: 'Completed from 20,000 to 100,000' },
	{ id: '4', label: 'Executor: Category 1, Layer 1 transporter' },
	{ id: '5', label: 'Executor: Category 2, Layer 11 transporter' },
	{ id: '6', label: 'Executor: Category 2, Layer 12 transporter' },
	{ id: '7', label: 'Executor: Category 2, Layer 13 transporter' },
	{ id: '8', label: 'Version: 000.0001-3' },
	{ id: '9', label: 'Version: 000.0001-4' },
	{ id: '10', label: 'Version: 000.0001-5' },
	{ id: '11', label: 'Version: 000.0001-6' },
	{ id: '12', label: 'Last editor: Maren Levin' },
	{ id: '13', label: 'Last editor: Emery Franci' },
];

/**
 * Default story demonstrating the TagFilter component with interactive controls.
 * Try adding, removing, and selecting filters to see the component in action.
 */
export const Default: Story = {
	render: function Render() {
		const [filters, setFilters] = useState<TagFilterItem[]>(sampleFilters);

		const handleClearAll = () => {
			setFilters([]);
		};

		const handleAddFilter = () => {
			const newId = `new-${String(Date.now())}`;
			setFilters((prev) => [
				...prev,
				{
					id: newId,
					label: `New Filter ${String(prev.length + 1)}`,
				},
			]);
		};

		const handleFilterDelete = (filter: TagFilterItem) => {
			setFilters((prev) => prev.filter((f) => f.id !== filter.id));
		};

		const handleFilterSelect = (filter: TagFilterItem) => {
			setFilters((prev) => prev.map((f) => (f.id === filter.id ? { ...f, selected: !f.selected } : f)));
		};

		return (
			<div className={styles.container}>
				<DsTagFilter
					items={filters}
					onClearAll={handleClearAll}
					onItemDelete={handleFilterDelete}
					onItemSelect={handleFilterSelect}
				/>
				<div className={styles.controlsContainer}>
					<button type="button" onClick={handleAddFilter} className={styles.addButton}>
						Add Filter
					</button>
					<p className={styles.infoText}>Total filters: {filters.length}</p>
					<p className={styles.infoText}>
						Selected filters: [
						{filters
							.filter((filter) => filter.selected)
							.map((filter) => `"${filter.label}"`)
							.join(', ')}
						]
					</p>
				</div>
			</div>
		);
	},
};

/**
 * Story showing fewer filters that fit within the visible area without overflow.
 */
export const FewFilters: Story = {
	render: function Render() {
		const [filters, setFilters] = useState<TagFilterItem[]>([
			{ id: '1', label: 'Status: Active' },
			{ id: '2', label: 'Version: 1.0.0' },
			{ id: '3', label: 'Author: John Doe' },
		]);

		const handleClearAll = () => {
			setFilters([]);
		};

		const handleFilterDelete = (filter: TagFilterItem) => {
			setFilters((prev) => prev.filter((f) => f.id !== filter.id));
		};

		const handleFilterSelect = (filter: TagFilterItem) => {
			setFilters((prev) => prev.map((f) => (f.id === filter.id ? { ...f, selected: !f.selected } : f)));
		};

		return (
			<DsTagFilter
				items={filters}
				onClearAll={handleClearAll}
				onItemDelete={handleFilterDelete}
				onItemSelect={handleFilterSelect}
			/>
		);
	},
};

/**
 * Story showing a single filter tag.
 */
export const SingleFilter: Story = {
	render: function Render() {
		const [filters, setFilters] = useState<TagFilterItem[]>([{ id: '1', label: 'Status: Active' }]);

		const handleClearAll = () => {
			setFilters([]);
		};

		const handleFilterDelete = (filter: TagFilterItem) => {
			setFilters((prev) => prev.filter((f) => f.id !== filter.id));
		};

		return <DsTagFilter items={filters} onClearAll={handleClearAll} onItemDelete={handleFilterDelete} />;
	},
};

/**
 * Story showing TagFilter with a custom label.
 */
export const CustomLabel: Story = {
	render: function Render() {
		const [filters, setFilters] = useState<TagFilterItem[]>(sampleFilters.slice(0, 5));

		const handleClearAll = () => {
			setFilters([]);
		};

		const handleFilterDelete = (filter: TagFilterItem) => {
			setFilters((prev) => prev.filter((f) => f.id !== filter.id));
		};

		return (
			<DsTagFilter
				items={filters}
				label="Active filters:"
				onClearAll={handleClearAll}
				onItemDelete={handleFilterDelete}
			/>
		);
	},
};

/**
 * Story showing TagFilter without the "Clear all" button.
 */
export const WithoutClearAll: Story = {
	render: function Render() {
		const [filters, setFilters] = useState<TagFilterItem[]>(sampleFilters.slice(0, 5));

		const handleFilterDelete = (filter: TagFilterItem) => {
			setFilters((prev) => prev.filter((f) => f.id !== filter.id));
		};

		return <DsTagFilter items={filters} onItemDelete={handleFilterDelete} />;
	},
};

/**
 * Story showing TagFilter without delete functionality (read-only tags).
 */
export const ReadOnly: Story = {
	render: function Render() {
		const filters: TagFilterItem[] = sampleFilters.slice(0, 5);

		return <DsTagFilter items={filters} label="Applied filters:" />;
	},
};

/**
 * Story showing TagFilter without a label.
 */
export const WithoutLabel: Story = {
	render: function Render() {
		const [filters, setFilters] = useState<TagFilterItem[]>(sampleFilters.slice(0, 5));

		const handleClearAll = () => {
			setFilters([]);
		};

		const handleFilterDelete = (filter: TagFilterItem) => {
			setFilters((prev) => prev.filter((f) => f.id !== filter.id));
		};

		return (
			<DsTagFilter items={filters} label="" onClearAll={handleClearAll} onItemDelete={handleFilterDelete} />
		);
	},
};

/**
 * Story showing TagFilter with pre-selected items.
 */
export const WithPreSelectedItems: Story = {
	render: function Render() {
		const [filters, setFilters] = useState<TagFilterItem[]>([
			{ id: '1', label: 'Status: Active', selected: true },
			{ id: '2', label: 'Running: From 100 to 10,000', selected: false },
			{ id: '3', label: 'Completed from 20,000 to 100,000', selected: true },
			{ id: '4', label: 'Executor: Category 1', selected: false },
			{ id: '5', label: 'Version: 1.0.0', selected: true },
		]);

		const handleClearAll = () => {
			setFilters([]);
		};

		const handleFilterDelete = (filter: TagFilterItem) => {
			setFilters((prev) => prev.filter((f) => f.id !== filter.id));
		};

		const handleFilterSelect = (filter: TagFilterItem) => {
			setFilters((prev) => prev.map((f) => (f.id === filter.id ? { ...f, selected: !f.selected } : f)));
		};

		return (
			<DsTagFilter
				items={filters}
				onClearAll={handleClearAll}
				onItemDelete={handleFilterDelete}
				onItemSelect={handleFilterSelect}
			/>
		);
	},
};
