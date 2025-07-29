import React from 'react';
import { Row } from '@tanstack/react-table';
import { VirtualItem } from '@tanstack/react-virtual';
import { RowAction, SecondaryRowAction } from '@design-system/ui';

/**
 * Props for the table row component
 */
export interface TableRowProps<TData, TValue> {
	/**
	 * The row data from the table
	 */
	row: Row<TData>;

	/**
	 * Virtual row data for virtualized tables
	 */
	virtualRow?: VirtualItem;

	/**
	 * Whether the row is expandable
	 */
	expandable: boolean;

	/**
	 * Optional function to determine if an individual row should be expandable
	 */
	isRowExpandable?: (row: TData) => boolean;

	/**
	 * Record of expanded row states
	 */
	expandedRows: Record<string, boolean>;

	/**
	 * Whether the row is selectable
	 */
	selectable: boolean;

	/**
	 * Whether the row is reorderable
	 */
	reorderable?: boolean;

	/**
	 * Optional function to handle row click
	 */
	onRowClick?: (data: TData) => void;

	/**
	 * Optional function to handle row double click
	 */
	onRowDoubleClick?: (data: TData) => void;

	/**
	 * Optional function to render the expanded row content
	 */
	renderExpandedRow?: (data: TData) => React.ReactNode;

	/**
	 * Whether the table is virtualized
	 */
	virtualized: boolean;

	/**
	 * Whether the table cells have borders
	 */
	bordered: boolean;

	/**
	 * Whether the row should highlight on hover
	 */
	highlightOnHover: boolean;

	/**
	 * Function to toggle the expanded state of a row
	 */
	toggleRowExpanded: (rowId: string) => void;

	/**
	 * Primary actions to be shown on each row (on hover)
	 */
	primaryRowActions?: RowAction<TData>[];

	/**
	 * Secondary actions to be shown in a dropdown on each row (on hover)
	 */
	secondaryRowActions?: SecondaryRowAction<TData>[];
}
