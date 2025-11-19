# Table Filters - Usage Guide

This guide explains how to use the Filter Adapter Pattern to create plug-and-play filters for tables.

## Architecture Overview

The filter system consists of:

1. **Filter Adapters**: Encapsulate all filter behavior (state, rendering, chips, filtering logic)
2. **`useTableFilters` Hook**: Orchestrates multiple filters, manages state, generates chips and nav items
3. **Filter Renderer**: Bridges adapter output to actual UI components
4. **Filter Configuration**: Central place to define all filters for a table

## Quick Start

### 1. Use Generic Filters (Checkbox, Dual-Range)

For common filtering scenarios, use the built-in adapter factories:

```typescript
// workflow-filters.config.tsx
import {
  createCheckboxFilterAdapter,
  createDualRangeFilterAdapter,
} from '../../filters';

// Checkbox filter for status
export const statusFilterAdapter = createCheckboxFilterAdapter({
  id: 'status',
  label: 'Status',
  items: [
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
  ],
  chipLabelTemplate: (item) => `Status: ${item.label}`,
  cellRenderer: (value) => <StatusBadge status={value} />,
});

// Dual-range filter for running/completed
export const runningCompletedFilterAdapter = createDualRangeFilterAdapter({
  id: 'runningCompleted',
  label: 'Running/Completed',
  fields: {
    running: 'Running',
    completed: 'Completed',
  },
});

export const workflowFilters = [
  statusFilterAdapter,
  runningCompletedFilterAdapter,
];
```

### 2. Use in Your Story/Component

```typescript
import { useTableFilters } from '../filters/hooks/use-table-filters';
import { workflowFilters } from './workflow-filters.config';

function MyTable() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    columnFilters,
    filterChips,
    filterNavItems,
    enhancedColumns,
    handlers,
    renderFilterContent,
  } = useTableFilters(workflowFilters, baseColumns);

  return (
    <>
      <DsChipGroup
        items={filterChips}
        onClearAll={() => handlers.clearAll()}
        onFilterDelete={handlers.deleteChip}
      />
      <DsTable columns={enhancedColumns} columnFilters={columnFilters} />
      <TableFilterModal
        filterNavItems={filterNavItems}
        onApply={handlers.applyFilters}
        onClearAll={handlers.clearAll}
      >
        {(selectedFilter) => renderFilterContent(selectedFilter)}
      </TableFilterModal>
    </>
  );
}
```

## Creating Custom Filters

For complex, app-specific filters (like "Last Edited" with editor + timestamp), use
`createCustomFilterAdapter`:

```typescript
// custom-last-edited-filter.tsx
import { createCustomFilterAdapter } from '../../filters';

interface LastEditedFilter {
  editors: string[];
  dateRange: {
    from?: Date;
    to?: Date;
  };
}

export const lastEditedFilterAdapter = createCustomFilterAdapter<Workflow, LastEditedFilter>({
  id: 'lastEdited',
  label: 'Last Edited',

  initialValue: {
    editors: [],
    dateRange: {},
  },

  filterFn: (row, columnId, filterValue) => {
    const { editor, timestamp } = row.getValue(columnId) as { editor: string; timestamp: Date };

    // Check editor
    if (filterValue.editors.length > 0 && !filterValue.editors.includes(editor)) {
      return false;
    }

    // Check date range
    const { from, to } = filterValue.dateRange;
    if (from && timestamp < from) return false;
    if (to && timestamp > to) return false;

    return true;
  },

  toChips: (value) => {
    const chips = [];

    if (value.editors.length > 0) {
      chips.push({
        id: 'lastEdited_editors',
        label: `Editors: ${value.editors.join(', ')}`,
        metadata: { key: 'lastEdited', subKey: 'editors' },
      });
    }

    if (value.dateRange.from || value.dateRange.to) {
      chips.push({
        id: 'lastEdited_dates',
        label: `Date: ${formatDateRange(value.dateRange)}`,
        metadata: { key: 'lastEdited', subKey: 'dates' },
      });
    }

    return chips;
  },

  fromChip: (chip, currentValue) => {
    if (chip.metadata?.subKey === 'editors') {
      return { ...currentValue, editors: [] };
    }
    if (chip.metadata?.subKey === 'dates') {
      return { ...currentValue, dateRange: {} };
    }
    return currentValue;
  },

  getActiveCount: (value) => {
    let count = 0;
    if (value.editors.length > 0) count++;
    if (value.dateRange.from || value.dateRange.to) count++;
    return count;
  },

  hasActiveFilters: (value) => {
    return value.editors.length > 0 || value.dateRange.from !== undefined || value.dateRange.to !== undefined;
  },

  renderFilter: (value, onChange) => {
    return (
      <div>
        <EditorMultiSelect
          selectedEditors={value.editors}
          onChange={(editors) => onChange({ ...value, editors })}
        />
        <DateRangePicker
          from={value.dateRange.from}
          to={value.dateRange.to}
          onChange={(dateRange) => onChange({ ...value, dateRange })}
        />
      </div>
    );
  },

  cellRenderer: (value) => {
    const { editor, timestamp } = value as { editor: string; timestamp: Date };
    return (
      <div>
        <div>{editor}</div>
        <div>{formatDate(timestamp)}</div>
      </div>
    );
  },
});
```

Then add it to your filters array:

```typescript
export const workflowFilters = [
  statusFilterAdapter,
  runningCompletedFilterAdapter,
  lastEditedFilterAdapter, // ← Your custom filter
];
```

That's it! No need to touch the story/component code. The hook handles everything.

## Adding Filter Renderer Support

If you create a new generic filter type, add it to `FilterRenderer.tsx`:

```typescript
export const FilterRenderer = ({ filterConfig }: { filterConfig: any }) => {
  if (!filterConfig) return null;

  const { type } = filterConfig;

  switch (type) {
    case 'checkbox':
      return <CheckboxFilter {...filterConfig} />;

    case 'dual-range':
      return <DualRangeFilterUI {...filterConfig} />;

    case 'your-new-type': // ← Add your type here
      return <YourNewFilterComponent {...filterConfig} />;

    default:
      // Custom filters render as-is
      return filterConfig;
  }
};
```

## Benefits

✅ **Plug-and-Play**: Add a new filter by adding one object to the array  
✅ **Centralized**: All filter logic in one place  
✅ **Type-Safe**: Full TypeScript support  
✅ **Reusable**: Generic adapters work across different tables  
✅ **Extensible**: Easy to add custom, complex filters  
✅ **Maintainable**: No scattered state management or repetitive boilerplate

## API Reference

### `FilterAdapter<TData, TFilterValue>`

Core interface all adapters implement:

- `id`: Unique identifier (matches column accessorKey)
- `label`: Display label for filter navigation
- `initialValue`: Default filter state
- `columnFilterFn`: TanStack Table filter function
- `cellRenderer`: Optional custom cell renderer
- `toChips`: Convert filter value to display chips
- `fromChip`: Remove chip effect from value
- `getActiveCount`: Calculate count for nav badge
- `hasActiveFilters`: Check if filter is active
- `reset`: Reset to initial state
- `renderFilter`: Render the filter UI

### `useTableFilters(adapters, baseColumns)`

Returns:

- `filterState`: Current filter values
- `columnFilters`: TanStack Table column filters
- `filterChips`: Display chips
- `filterNavItems`: Nav items with counts
- `enhancedColumns`: Columns with filter functions
- `handlers`: `{ updateFilter, applyFilters, clearAll, deleteChip }`
- `renderFilterContent`: Render function for modal

### Factory Functions

- `createCheckboxFilterAdapter<TData, TValue>(config)`
- `createDualRangeFilterAdapter<TData>(config)`
- `createCustomFilterAdapter<TData, TFilterValue>(config)`
