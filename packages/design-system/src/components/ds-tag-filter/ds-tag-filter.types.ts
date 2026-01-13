import type { CSSProperties, ReactNode } from 'react';

export interface TagFilterItem {
	/**
	 * Unique identifier for the tag
	 */
	id: string;
	/**
	 * The label text to display in the tag
	 */
	label: string;
	/**
	 * Additional metadata to store with the tag
	 */
	metadata?: Record<string, unknown>;
	/**
	 * Whether the tag is selected/checked
	 */
	selected?: boolean;
}

export interface DsTagFilterProps {
	/**
	 * Array of tag items to display
	 */
	items: TagFilterItem[];

	/**
	 * Represents locale-specific options
	 */
	locale?: {
		label?: ReactNode;
		clearButton?: ReactNode;
	};
	/**
	 * Callback when "Clear all" is clicked
	 */
	onClearAll?: () => void;
	/**
	 * Callback when a tag is deleted/removed
	 */
	onItemDelete?: (item: TagFilterItem) => void;
	/**
	 * Callback when a tag is selected
	 */
	onItemSelect?: (item: TagFilterItem) => void;
	/**
	 * Callback when the Expand button is clicked
	 */
	onExpand?: (expanded?: boolean) => void;
	/**
	 * Additional CSS class names
	 */
	className?: string;
	/**
	 * Additional styles to apply to the component
	 */
	style?: CSSProperties;
}
