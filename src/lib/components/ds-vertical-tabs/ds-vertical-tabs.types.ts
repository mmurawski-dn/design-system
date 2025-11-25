import { CSSProperties } from 'react';

export interface VerticalTabItem {
	/**
	 * Unique identifier for the tab item
	 */
	id: string;
	/**
	 * Display label for the tab item
	 */
	label: string;
	/**
	 * Optional count badge to display
	 */
	count?: number;
	/**
	 * Whether this item is disabled
	 */
	disabled?: boolean;
}

export interface DsVerticalTabsProps {
	/**
	 * Array of tab items
	 */
	items: VerticalTabItem[];
	/**
	 * Currently selected item
	 */
	selectedItem?: VerticalTabItem;
	/**
	 * Callback when an item is selected
	 */
	onSelect?: (item: VerticalTabItem) => void;
	/**
	 * Additional CSS class names
	 */
	className?: string;
	/**
	 * Optional inline styles to apply to the component
	 */
	style?: CSSProperties;
}
