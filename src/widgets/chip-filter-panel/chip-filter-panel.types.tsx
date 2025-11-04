// AI Generated file
import { CSSProperties } from 'react';

export interface FilterChipItem {
	/**
	 * Unique identifier for the filter chip
	 */
	id: string;
	/**
	 * The label text to display in the chip
	 */
	label: string;
	/**
	 * Whether the filter chip is selected/checked
	 */
	selected?: boolean;
}

export interface ChipFilterPanelProps {
	/**
	 * Array of filter chip items to display
	 */
	filters: FilterChipItem[];
	/**
	 * Callback when "Clear all filters" is clicked
	 */
	onClearAll?: () => void;
	/**
	 * Callback when the chip is deleted/unchecked
	 */
	onFilterDelete?: (filter: FilterChipItem) => void;
	/**
	 * Callback when the chip is selected
	 */
	onFilterSelect?: (filter: FilterChipItem) => void;
	/**
	 * Additional CSS class names
	 */
	className?: string;
	/**
	 * Additional styles to apply to the component
	 */
	style?: CSSProperties;
}
